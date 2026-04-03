"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function provisionUserAction(formData: {
  email: string;
  name: string;
  role: string;
  role_level: number;
  department_name: string;
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
    
    if (deptError) throw new Error(`Operational Unit creation failed: ${deptError.message}`);
    dept = newDept;
  }

  // 2. Create Auth User
  const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
    email: formData.email,
    password: Math.random().toString(36).slice(-12) + "!", // Temporary secure password
    email_confirm: true,
    user_metadata: {
      full_name: formData.name,
      role: formData.role,
      role_level: formData.role_level,
      department_id: dept?.id
    }
  });

  if (authError) throw new Error(`Identity creation failed: ${authError.message}`);
  if (!user) throw new Error("Null identity node returned.");

  // 3. Find existing profile by email (if any) and upsert/update
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', formData.email)
    .single();

  const finalProfileId = existingProfile?.id || user.id;

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
    console.warn("Manual profile sync warning:", profileError.message);
  }

  revalidatePath('/users');
  return { success: true, userId: user.id };
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
