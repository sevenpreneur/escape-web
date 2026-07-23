import pg from 'pg';

process.loadEnvFile();

const client = new pg.Client({
  connectionString: process.env.SUPABASE_STORAGE_DB_URL,
  ssl: true,
});

try {
  await client.connect();
  await client.query(`ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;`);
  console.log('Storage RLS disabled — uploads will now work.');
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await client.end();
}
