import { query } from './db';

export async function getHeroEventData(pageContext: string) {
  const { rows } = await query('SELECT * FROM hero_event_data WHERE page_context = $1 LIMIT 1', [pageContext]);
  return rows[0] ?? null;
}

export async function getEventDetailData() {
  const { rows } = await query('SELECT * FROM event_detail_data ORDER BY id ASC LIMIT 1');
  return rows[0] ?? null;
}

export interface MerchandiseItem {
  id?: string;
  foto_url?: string;
  nama_produk?: string;
  kategori?: string;
  harga?: string;
  order_index?: number;
}

export interface PlaylistItem {
  id?: string;
  thumbnail_url?: string;
  nama_playlist?: string;
  category?: string;
  duration?: string;
  deskripsi?: string;
  youtube_playlist_id?: string;
  order_index?: number;
}

export async function getMerchandiseItems(): Promise<MerchandiseItem[]> {
  const { rows } = await query<MerchandiseItem>(
    'SELECT * FROM merchandise_items WHERE is_active = true ORDER BY order_index'
  );
  return rows;
}

export async function getPlaylistItems(): Promise<PlaylistItem[]> {
  const { rows } = await query<PlaylistItem>(
    'SELECT * FROM playlist_items WHERE is_active = true ORDER BY order_index'
  );
  return rows;
}

export async function getPromotionalBannerData() {
  const { rows } = await query('SELECT * FROM promotional_banner_data ORDER BY id LIMIT 1');
  return rows[0] ?? null;
}
