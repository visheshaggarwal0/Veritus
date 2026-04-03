const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}="([^"]+)"`));
  return match ? match[1] : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials");
  process.exit(1);
}

const departments = [
  "Digital Infrastructure",
  "Legal & IP",
  "Digital Engagement & Design",
  "Global Alliance & Advocacy",
  "Executives",
  "R&D",
  "Business Research & Analysis"
];

const seed = async () => {
  for (const name of departments) {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/departments`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({ name })
      });
      if (response.ok) {
        console.log(`Ensured: ${name}`);
      } else {
        const err = await response.text();
        console.error(`Failed ${name}: ${err}`);
      }
    } catch (e) {
      console.error(e);
    }
  }
};

seed();
