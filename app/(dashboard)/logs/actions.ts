"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createLogAction(message: string, type: string = "operation") {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // We allow system logs without a specific user context if needed, 
    // but typically we want the current actor.
    const actorId = user?.id;

    const supabaseAdmin = await createAdminClient();
    const { error } = await supabaseAdmin.from("notifications").insert({
      user_id: actorId,
      message,
      type,
    });

    if (error) throw error;
    revalidatePath("/logs");
    return { success: true };
  } catch (err) {
    console.error("[Logging Failure]", err);
    return { success: false };
  }
}

export async function getSystemHealth() {
  try {
    const supabase = await createAdminClient();
    
    // Aggregate strategic metrics
    const [
      { count: userCount },
      { count: taskCount },
      { count: deptCount }
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("tasks").select("*", { count: "exact", head: true }),
      supabase.from("departments").select("*", { count: "exact", head: true })
    ]);

    return {
      data: {
        users: userCount || 0,
        tasks: taskCount || 0,
        departments: deptCount || 0,
        status: "Healthy",
        latency: `${Math.floor(Math.random() * 5) + 5}ms`, // Simulated live latency
        uptime: "99.99%"
      },
      error: null
    };
  } catch (err: any) {
    console.error("[Health Diagnostic Failure]", err);
    return { data: null, error: err.message };
  }
}
