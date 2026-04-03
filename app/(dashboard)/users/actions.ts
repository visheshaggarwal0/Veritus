"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createLogAction } from "../logs/actions";

export async function provisionUserAction(formData: {
  email: string;
  name: string;
  role: string;
  role_level: number;
  department_name: string;
  password?: string;
}) {
  const supabase = await createAdminClient();

  // 1. Ensure Department Exists
  let { data: dept } = await supabase
    .from('departments')
    .select('id')
    .ilike('name', formData.department_name)
    .single();

  if (!dept) {
    const { data: newDept, error: deptError } = await supabase
      .from('departments')
      .insert({ name: formData.department_name })
      .select('id')
      .single();
    
    if (deptError) throw new Error(`Operational Department creation failed: ${deptError.message}`);
    dept = newDept;
  }

  // 2. Create Auth User
  let finalUserId: string;

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: formData.email,
    password: formData.password || Math.random().toString(36).slice(-12) + "!", // Fallback to random if not provided
    email_confirm: true,
    user_metadata: {
      full_name: formData.name,
      role: formData.role,
      role_level: formData.role_level,
      department_id: dept?.id
    }
  });

  if (authError) {
    if (authError.message.toLowerCase().includes("registered") || authError.message.toLowerCase().includes("exists")) {
      // Identity exists in Tactical Core, synchronize profile instead
      const { data: listData } = await supabase.auth.admin.listUsers();
      const existingUser = listData.users.find(u => u.email === formData.email);
      if (!existingUser) throw new Error(`Strategic Identity Mismatch: ${formData.email} registered in auth but untrackable.`);
      finalUserId = existingUser.id;
    } else {
      throw new Error(`Identity creation protocol failed: ${authError.message}`);
    }
  } else {
    if (!authData.user) throw new Error("Null identity node returned during initialization.");
    finalUserId = authData.user.id;
  }

  // 3. Find existing profile by email OR ID
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .or(`email.eq."${formData.email}",id.eq."${finalUserId}"`)
    .maybeSingle();

  const finalProfileId = existingProfile?.id || finalUserId;

  // 4. Trigger profile creation/update
  // (Trigger usually handles this, but we'll be explicit for reliability)
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: finalProfileId,
      email: formData.email,
      name: formData.name,
      role: formData.role,
      role_level: formData.role_level,
      department_id: dept?.id
    });

  if (profileError) {
    throw new Error(`Profile synchronization failed: ${profileError.message}`);
  }

  revalidatePath('/users');
  return { success: true, userId: finalUserId };
}

export async function repairIdentityAction(userId: string, metadata: any) {
  const supabase = await createAdminClient();

  // 1. Check if department exists in metadata or search for 'Executives' as fallback
  const deptName = metadata.department_name || "Executives";
  let { data: dept } = await supabase
    .from('departments')
    .select('id')
    .ilike('name', deptName)
    .single();

  if (!dept) {
    const { data: newDept } = await supabase
      .from('departments')
      .insert({ name: deptName })
      .select('id')
      .single();
    dept = newDept;
  }

  // 2. Fetch User from Auth to get email
  const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(userId);
  if (authError || !user) throw new Error(`Identity repair failed: User not found in tactical identity system.`);

  // 3. Find existing profile by email or ID
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', user.email)
    .single();

  const finalProfileId = existingProfile?.id || userId;

  // 4. Upsert profile
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: finalProfileId,
      email: user.email,
      name: metadata.full_name || metadata.name || "Administrator",
      role: metadata.role || "IT Administrator",
      role_level: metadata.role_level ?? 0,
      department_id: dept?.id
    });

  if (error) throw new Error(`Identity repair failed: ${error.message}`);

  revalidatePath('/users');
  return { success: true };
}
