import fs from 'node:fs';

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL="(.+)"/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY="(.+)"/);

if (!urlMatch || !keyMatch) {
  console.error("Missing credentials in .env");
  process.exit(1);
}

const url = urlMatch[1];
const key = keyMatch[1];

const depts = [
  "Digital Infrastructure",
  "Legal & IP",
  "Digital Engagement & Design",
  "Global Alliance & Advocacy",
  "Executives",
  "R&D",
  "Business Research & Analysis"
];

const run = async () => {
  console.log("Seeding to:", url);
  for (const name of depts) {
    const res = await fetch(`${url}/rest/v1/departments`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({ name })
    });
    console.log(name, res.status);
  }
};

await run();
