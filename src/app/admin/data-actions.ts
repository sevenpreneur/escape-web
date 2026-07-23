"use server";
import { query } from '@/lib/db';

// ── Hero event ──────────────────────────────────────────────────────────────

interface HeroEventData {
  page_context: string;
  background_photo_url?: string;
  teks_logo?: string;
  teks_judul?: string;
  png_image_url?: string;
  teks_detail?: string;
  button1_text?: string;
  button1_url?: string;
  button2_text?: string;
  button2_url?: string;
}

export async function getHeroEventDataAdmin(pageContext: string) {
  const { rows } = await query('SELECT * FROM hero_event_data WHERE page_context = $1 LIMIT 1', [pageContext]);
  return rows[0] ?? null;
}

export async function saveHeroEventData(data: HeroEventData) {
  const {
    page_context, background_photo_url, teks_logo, teks_judul, png_image_url,
    teks_detail, button1_text, button1_url, button2_text, button2_url,
  } = data;

  await query(
    `INSERT INTO hero_event_data
       (page_context, background_photo_url, teks_logo, teks_judul, png_image_url, teks_detail, button1_text, button1_url, button2_text, button2_url, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, now())
     ON CONFLICT (page_context) DO UPDATE SET
       background_photo_url = EXCLUDED.background_photo_url,
       teks_logo = EXCLUDED.teks_logo,
       teks_judul = EXCLUDED.teks_judul,
       png_image_url = EXCLUDED.png_image_url,
       teks_detail = EXCLUDED.teks_detail,
       button1_text = EXCLUDED.button1_text,
       button1_url = EXCLUDED.button1_url,
       button2_text = EXCLUDED.button2_text,
       button2_url = EXCLUDED.button2_url,
       updated_at = now()`,
    [page_context, background_photo_url, teks_logo, teks_judul, png_image_url, teks_detail, button1_text, button1_url, button2_text, button2_url]
  );

  return { success: true };
}

// ── Event detail ────────────────────────────────────────────────────────────

interface EventDetailData {
  id?: number;
  poster_event_url?: string;
  judul_event?: string;
  deskripsi?: string;
  lokasi?: string;
  tanggal?: string;
  waktu?: string;
  kapasitas?: string;
  teks_button?: string;
  url_button?: string;
}

export async function getEventDetailDataAdmin() {
  const { rows } = await query('SELECT * FROM event_detail_data ORDER BY id ASC LIMIT 1');
  return rows[0] ?? null;
}

export async function saveEventDetailData(data: EventDetailData) {
  const { id, poster_event_url, judul_event, deskripsi, lokasi, tanggal, waktu, kapasitas, teks_button, url_button } = data;

  if (id) {
    await query(
      `UPDATE event_detail_data SET
         poster_event_url = $2, judul_event = $3, deskripsi = $4, lokasi = $5,
         tanggal = $6, waktu = $7, kapasitas = $8, teks_button = $9, url_button = $10, updated_at = now()
       WHERE id = $1`,
      [id, poster_event_url, judul_event, deskripsi, lokasi, tanggal, waktu, kapasitas, teks_button, url_button]
    );
  } else {
    await query(
      `INSERT INTO event_detail_data
         (poster_event_url, judul_event, deskripsi, lokasi, tanggal, waktu, kapasitas, teks_button, url_button)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [poster_event_url, judul_event, deskripsi, lokasi, tanggal, waktu, kapasitas, teks_button, url_button]
    );
  }

  return { success: true };
}

// ── Merchandise ─────────────────────────────────────────────────────────────

interface MerchandiseItem {
  id?: string;
  foto_url?: string;
  nama_produk?: string;
  kategori?: string;
  harga?: string;
  order_index?: number;
}

export async function getMerchandiseItemsAdmin() {
  const { rows } = await query('SELECT * FROM merchandise_items ORDER BY order_index');
  return rows;
}

export async function getMerchandiseItemAdmin(id: string) {
  const { rows } = await query('SELECT * FROM merchandise_items WHERE id = $1 LIMIT 1', [id]);
  return rows[0] ?? null;
}

export async function saveMerchandiseItem(id: string | undefined, data: MerchandiseItem) {
  const { foto_url, nama_produk, kategori, harga, order_index } = data;

  if (id) {
    await query(
      `UPDATE merchandise_items SET
         foto_url = $2, nama_produk = $3, kategori = $4, harga = $5, order_index = $6, updated_at = now()
       WHERE id = $1`,
      [id, foto_url, nama_produk, kategori, harga, order_index ?? 0]
    );
  } else {
    await query(
      `INSERT INTO merchandise_items (foto_url, nama_produk, kategori, harga, order_index)
       VALUES ($1,$2,$3,$4,$5)`,
      [foto_url, nama_produk, kategori, harga, order_index ?? 0]
    );
  }

  return { success: true };
}

export async function deleteMerchandiseItem(id: string) {
  await query('DELETE FROM merchandise_items WHERE id = $1', [id]);
  return { success: true };
}

// ── Playlist ────────────────────────────────────────────────────────────────

interface PlaylistItem {
  id?: string;
  nama_playlist?: string;
  youtube_playlist_id?: string;
  category?: string;
  duration?: string;
  deskripsi?: string;
  thumbnail_url?: string;
  order_index?: number;
}

export async function getPlaylistItemsAdmin() {
  const { rows } = await query('SELECT * FROM playlist_items ORDER BY order_index');
  return rows;
}

export async function getPlaylistItemAdmin(id: string) {
  const { rows } = await query('SELECT * FROM playlist_items WHERE id = $1 LIMIT 1', [id]);
  return rows[0] ?? null;
}

export async function savePlaylistItem(id: string | undefined, data: PlaylistItem) {
  const { nama_playlist, youtube_playlist_id, category, duration, deskripsi, thumbnail_url, order_index } = data;

  if (id) {
    await query(
      `UPDATE playlist_items SET
         nama_playlist = $2, youtube_playlist_id = $3, category = $4, duration = $5,
         deskripsi = $6, thumbnail_url = $7, order_index = $8, updated_at = now()
       WHERE id = $1`,
      [id, nama_playlist, youtube_playlist_id, category, duration, deskripsi, thumbnail_url, order_index ?? 0]
    );
  } else {
    await query(
      `INSERT INTO playlist_items (nama_playlist, youtube_playlist_id, category, duration, deskripsi, thumbnail_url, order_index)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [nama_playlist, youtube_playlist_id, category, duration, deskripsi, thumbnail_url, order_index ?? 0]
    );
  }

  return { success: true };
}

export async function deletePlaylistItem(id: string) {
  await query('DELETE FROM playlist_items WHERE id = $1', [id]);
  return { success: true };
}

// ── Promotional banner ──────────────────────────────────────────────────────

interface BannerData {
  id?: number;
  foto_url?: string;
  headline?: string;
  deskripsi?: string;
  teks_button?: string;
  url_button?: string;
}

export async function getPromotionalBannerDataAdmin() {
  const { rows } = await query('SELECT * FROM promotional_banner_data ORDER BY id LIMIT 1');
  return rows[0] ?? null;
}

export async function savePromotionalBannerData(data: BannerData) {
  const { id, foto_url, headline, deskripsi, teks_button, url_button } = data;

  if (id) {
    await query(
      `UPDATE promotional_banner_data SET
         foto_url = $2, headline = $3, deskripsi = $4, teks_button = $5, url_button = $6, updated_at = now()
       WHERE id = $1`,
      [id, foto_url, headline, deskripsi, teks_button, url_button]
    );
  } else {
    await query(
      `INSERT INTO promotional_banner_data (foto_url, headline, deskripsi, teks_button, url_button)
       VALUES ($1,$2,$3,$4,$5)`,
      [foto_url, headline, deskripsi, teks_button, url_button]
    );
  }

  return { success: true };
}
