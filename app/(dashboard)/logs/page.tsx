import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogsPageClient from "./LogsPageClient";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role_level")
    .eq("email", authUser.email)
    .single();

  const isITAdmin = profile?.role_level === 0 || authUser.user_metadata?.role_level === 0;

  if (!isITAdmin) {
    redirect("/dashboard");
  }

  return <LogsPageClient />;
}
