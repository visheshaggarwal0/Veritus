import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";
import { User } from "@/lib/types";
import { DashboardHeader } from "@/components/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the profile for the current user to get role/role_level
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // If no profile exists, sign out and redirect to login
    await supabase.auth.signOut();
    redirect("/login");
  }

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
