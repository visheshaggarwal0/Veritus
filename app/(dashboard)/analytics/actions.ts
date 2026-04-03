"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { TaskStatus, Priority } from "@/lib/types";

export async function getAnalyticsData() {
  try {
    const supabase = await createAdminClient();

    // 1. Fetch all tasks for roll-up
    const { data: tasks, error: taskError } = await supabase
      .from("tasks")
      .select("status, priority, deadline, created_at, assigned_to");

    if (taskError) throw taskError;

    // 2. Fetch department metadata
    const { data: departments } = await supabase
      .from("departments")
      .select("id, name");

    // 3. Process Status Distribution
    const statusChart = [
      { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#d4d4d8' },
      { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: '#18181b' },
      { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#71717a' },
      { name: 'Reviewed', value: tasks.filter(t => t.status === 'reviewed').length, color: '#09090b' },
    ];

    // 4. Process Priority Loading
    const priorityChart = [
      { name: 'Low', value: tasks.filter(t => t.priority === 'low').length },
      { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length },
      { name: 'High', value: tasks.filter(t => t.priority === 'high').length },
    ];

    // 5. Calculate Overdue Directives
    const now = new Date();
    const overdueCount = tasks.filter(t => t.status !== 'reviewed' && t.deadline && new Date(t.deadline) < now).length;

    // 6. Productivity Rating (Completed / Total)
    const completedCount = tasks.filter(t => t.status === 'completed' || t.status === 'reviewed').length;
    const productivity = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    return {
      statusChart,
      priorityChart,
      overdueCount,
      productivity,
      totalCount: tasks.length,
      error: null
    };
  } catch (err: any) {
    console.error("[Analytics Failure]", err);
    return { error: err.message };
  }
}
