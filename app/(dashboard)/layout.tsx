import React from "react";
import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";
import { User, Role } from "@/lib/types";
import { DashboardHeader } from "@/components/DashboardHeader";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const adminSupabase = await createAdminClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const user = authUser;

  const { data: fetchedProfile, error: profileError } = await adminSupabase
    .from("profiles")
    .select("*")
    .eq("email", user.email)
    .single();

  if (profileError && profileError.code !== 'PGRST116') {
    console.error(`[Infrastructure] Profile fetch error for ${user.email}:`, profileError.message);
  }

  if (fetchedProfile) {
    (fetchedProfile as any).role_level = Number(fetchedProfile.role_level);
  }

  // Pure data-driven profile resolution
  const profile = fetchedProfile || {
    id: user.id,
    name: authUser?.user_metadata?.full_name || 'Guest User',
    role: (authUser?.user_metadata?.role as Role) || Role.GUEST,
    department_id: 'Unassigned',
    role_level: Number(authUser?.user_metadata?.role_level ?? 5)
  };

  // Log for immediate verification in terminal
  console.log(`[Identity Check] ID: ${user.id} | Level: ${profile.role_level} (${typeof profile.role_level}) | DB: ${!!fetchedProfile}`);

  return (
    <div className="flex bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white overflow-hidden min-h-screen">
      <Sidebar user={profile as User} />

      <main className="flex-1 flex flex-col bg-zinc-50/40 overflow-hidden relative">
        <DashboardHeader currentUser={profile as User} />
        <div className="flex-1 p-12 overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </main>
    </div>
  );
}
