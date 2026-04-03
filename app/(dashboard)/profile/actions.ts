"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { User as UserType, Role } from "@/lib/types";
import { createLogAction } from "../logs/actions";
import { revalidatePath } from "next/cache";

export async function getProfileBySession() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Access Denied: Operational session not active." };
    }

    const supabaseAdmin = await createAdminClient();
    const { data: profile, error: dbError } = await supabaseAdmin
      .from("profiles")
      .select("*, department:departments(name)")
      .eq("id", user.id)
      .single();

    if (dbError && dbError.code !== "PGRST116") {
      console.error("[Strategic Fetch Failure]", dbError);
    }

    // Map department name from nested table join
    const deptName = (profile as any)?.department?.name || user.user_metadata.department_name || "Central Operations";

    // Reconstruct identity node with high-fidelity data
    const mergedProfile: UserType = {
      id: user.id,
      email: user.email!,
      name: profile?.name || user.user_metadata.full_name || "Administrator",
      role: (profile?.role || user.user_metadata.role || Role.IT_ADMIN) as Role,
      role_level: Number(profile?.role_level ?? user.user_metadata.role_level ?? 0),
      department_id: profile?.department_id || user.user_metadata.department_id,
      department_name: deptName,
      // Randomly assigned premium avatar for high-clearance nodes
      avatar_url: profile?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=VeritusAdmin&backgroundColor=f8f9fa`,
    };

    return { data: mergedProfile, error: null };
  } catch (err: any) {
    console.error("[Node Error]", err);
    return { data: null, error: err.message || "Failed to reconstruct identity node." };
  }
}

export async function updateAvatarAction(avatarUrl: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) throw new Error("Unauthorized");

    const supabaseAdmin = await createAdminClient();
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id);

    if (error) throw error;

    await createLogAction("Strategic identity signature updated (Avatar)", "operation");
    revalidatePath("/profile");
    
    return { success: true };
  } catch (err: any) {
    console.error("[Avatar Update Failure]", err);
    return { success: false, error: err.message };
  }
}

export async function updatePasswordAction(password: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) throw error;

    await createLogAction("Operational Access Key rotated (Security)", "security");
    
    return { success: true };
  } catch (err: any) {
    console.error("[Password Update Failure]", err);
    return { success: false, error: err.message };
  }
}
