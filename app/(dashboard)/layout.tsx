import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";
import { User, Role } from "@/lib/types";

import { DashboardHeader } from "@/components/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  // BYPASS: Provide mock data for unauthenticated layout preview
  const user = authUser || { id: 'preview-id', email: 'guest@veritus.in' };

  // Fetch the profile for the current user to get role/role_level
  const { data: fetchedProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = fetchedProfile || {
    id: user.id,
    name: 'Guest Administrator',
    role: Role.IT_ADMIN,
    department_id: 'preview-dept',
    role_level: 0
  };


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
