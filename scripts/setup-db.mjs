import pg from 'pg';

process.loadEnvFile();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const SQL = `
CREATE TABLE IF NOT EXISTS hero_event_data (
  id serial PRIMARY KEY, page_context text UNIQUE NOT NULL,
  background_photo_url text, teks_logo text, teks_judul text,
  png_image_url text, teks_detail text, button1_text text,
  button1_url text, button2_text text, button2_url text,
  updated_at timestamptz DEFAULT now()
);
INSERT INTO hero_event_data (page_context) VALUES ('dashboard'),('offline'),('online') ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS event_detail_data (
  id serial PRIMARY KEY, poster_event_url text, judul_event text,
  deskripsi text, lokasi text, tanggal text, waktu text,
  kapasitas text, teks_button text, url_button text, updated_at timestamptz DEFAULT now()
);
INSERT INTO event_detail_data (judul_event,lokasi,tanggal,waktu,kapasitas,teks_button)
SELECT 'ESCAPE GOES TO: MAKASSAR','Balai Manunggal','Sunday, 3 Mei 2025','13:00-17:00 WITA','1000+','Buy Ticket'
WHERE NOT EXISTS (SELECT 1 FROM event_detail_data LIMIT 1);

CREATE TABLE IF NOT EXISTS merchandise_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), foto_url text,
  nama_produk text, kategori text, harga text,
  order_index integer DEFAULT 0, is_active boolean DEFAULT true, updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS playlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), nama_playlist text,
  youtube_playlist_id text, category text, duration text, deskripsi text,
  thumbnail_url text, order_index integer DEFAULT 0, is_active boolean DEFAULT true, updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS promotional_banner_data (
  id serial PRIMARY KEY, foto_url text, headline text,
  deskripsi text, teks_button text, url_button text, updated_at timestamptz DEFAULT now()
);
INSERT INTO promotional_banner_data (headline,teks_button)
SELECT 'ESCAPE SEKARANG TERSEDIA DI SPOTIFY!','Dengarkan Sekarang!'
WHERE NOT EXISTS (SELECT 1 FROM promotional_banner_data LIMIT 1);

ALTER TABLE hero_event_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_detail_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE merchandise_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE promotional_banner_data DISABLE ROW LEVEL SECURITY;
`;

try {
  await client.connect();
  console.log('Connected!');
  await client.query(SQL);
  console.log('All tables created successfully!');
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await client.end();
}
// This won't run — just append the bucket creation via pg below

// Create bucket via direct SQL insert into storage schema
const bucketSQL = `
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('escape-assets', 'escape-assets', true, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES 
  ('allow_public_read', 'escape-assets', 'SELECT', 'true'),
  ('allow_all_insert', 'escape-assets', 'INSERT', 'true'),
  ('allow_all_update', 'escape-assets', 'UPDATE', 'true'),
  ('allow_all_delete', 'escape-assets', 'DELETE', 'true')
ON CONFLICT DO NOTHING;
`;
