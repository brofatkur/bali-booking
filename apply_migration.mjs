import fs from 'fs';

const API_BASE_URL = 'https://q4o0g4sk44ss4gwsc4wocgwc.43.134.7.185.sslip.io';
const API_KEY = 'ik_29edbd427de7028c46f0d60cc44e9dee669a4be4a8e4162bd7e3449ac996ad69';

async function run() {
  const sql = fs.readFileSync('migration_new_instance.sql', 'utf8');
  console.log('Applying database migration to new InsForge instance...');

  const res = await fetch(`${API_BASE_URL}/api/database/advance/rawsql`, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: sql,
      params: [],
    }),
  });

  const json = await res.json();
  console.log('Result:', JSON.stringify(json, null, 2));

  // Verify tables
  const verifyRes = await fetch(`${API_BASE_URL}/api/database/advance/rawsql`, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: "SELECT title, location_area, base_price_idr, selling_price_idr FROM bali_products;",
      params: [],
    }),
  });
  const verifyJson = await verifyRes.json();
  console.log('Seeded Products:', JSON.stringify(verifyJson, null, 2));
}

run().catch(console.error);
