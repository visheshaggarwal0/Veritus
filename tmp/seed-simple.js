const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL="(.+)"/)[1];
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY="(.+)"/)[1];

const depts = [
  "Digital Infrastructure",
  "Legal & IP",
  "Digital Engagement & Design",
  "Global Alliance & Advocacy",
  "Executives",
  "R&D",
  "Business Research & Analysis"
];

async function run() {
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
}

run().catch(console.error);
