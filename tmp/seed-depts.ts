import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const departments = [
  "Digital Infrastructure",
  "Legal & IP",
  "Digital Engagement & Design",
  "Global Alliance & Advocacy",
  "Executives",
  "R&D",
  "Business Research & Analysis"
];

async function seed() {
  console.log("Seeding departments...");
  for (const name of departments) {
    const { data, error } = await supabase
      .from("departments")
      .upsert({ name }, { onConflict: "name" })
      .select();

    if (error) {
      console.error(`Error adding ${name}:`, error.message);
    } else {
      console.log(`Ensured department exists: ${name}`);
    }
  }
}

seed();
