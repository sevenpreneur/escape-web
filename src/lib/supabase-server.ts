import { createClient } from '@supabase/supabase-js';

// Server-side client (no browser APIs)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getHeroEventData(pageContext: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('hero_event_data')
    .select('*')
    .eq('page_context', pageContext)
    .single();
  return data;
}

export async function getEventDetailData() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('event_detail_data')
    .select('*')
    .order('id', { ascending: true })
    .limit(1)
    .single();
  return data;
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
  const supabase = createServerClient();
  const { data } = await supabase
    .from('merchandise_items')
    .select('*')
    .eq('is_active', true)
    .order('order_index');
  return data ?? [];
}

export async function getPlaylistItems(): Promise<PlaylistItem[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('playlist_items')
    .select('*')
    .eq('is_active', true)
    .order('order_index');
  return data ?? [];
}

export async function getPromotionalBannerData() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('promotional_banner_data')
    .select('*')
    .order('id')
    .limit(1)
    .single();
  return data;
}