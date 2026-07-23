"use client";
import { useState, useEffect, useRef } from 'react';
import { uploadToStorage } from '@/lib/supabase';
import { ModalWrapper, ModalFooter, Field, FileButton } from './hero-event-modal';
import { getPlaylistItemAdmin, savePlaylistItem } from '@/app/admin/data-actions';

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

interface Props {
  itemId?: string;
  onClose: () => void;
  onSaved?: () => void;
}

export default function PlaylistModal({ itemId, onClose, onSaved }: Props) {
  const [data, setData] = useState<PlaylistItem>({});
  const [loading, setLoading] = useState(!!itemId);
  const [saving, setSaving] = useState(false);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);

  useEffect(() => {
    if (!itemId) return;
    getPlaylistItemAdmin(itemId).then((row) => {
      if (row) { setData(row); setThumbPreview(row.thumbnail_url || null); }
      setLoading(false);
    });
  }, [itemId]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setThumbFile(f);
    setThumbPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    setSaving(true);
    let thumbUrl = data.thumbnail_url;
    if (thumbFile) {
      const url = await uploadToStorage(thumbFile, 'playlist');
      if (url) thumbUrl = url;
    }

    const payload = { ...data, thumbnail_url: thumbUrl };
    try {
      await savePlaylistItem(itemId, payload);
      onSaved?.();
      onClose();
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const set = (field: keyof PlaylistItem, value: string | number) =>
    setData(prev => ({ ...prev, [field]: value }));

  return (
    <ModalWrapper title="Escape Playlist - Online Page" onClose={onClose}>
      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#666] text-sm">Loading...</div>
      ) : (
        <div className="flex flex-col gap-6">

          {/* Row 1: Nama & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[#999] text-xs font-semibold tracking-wider uppercase">NAMA PLAYLIST / EPISODE</label>
              <input type="text" value={data.nama_playlist || ''} onChange={e => set('nama_playlist', e.target.value)}
                placeholder="Escape Season 2 (2026)"
                className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-white/25" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#999] text-xs font-semibold tracking-wider uppercase">LINK URL (Spotify/YT) ATAU PLAYLIST ID</label>
              <input type="text" value={data.youtube_playlist_id || ''} onChange={e => set('youtube_playlist_id', e.target.value)}
                placeholder="https://spotify.com/... ATAU PLabc123xyz"
                className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-white/25" />
            </div>
          </div>

          {/* Row 2: Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[#999] text-xs font-semibold tracking-wider uppercase">CATEGORY</label>
              <input type="text" value={data.category || ''} onChange={e => set('category', e.target.value)}
                placeholder="Online Podcast, Youtube Video, dll"
                className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-white/25" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#999] text-xs font-semibold tracking-wider uppercase">DURATION</label>
              <input type="text" value={data.duration || ''} onChange={e => set('duration', e.target.value)}
                placeholder="300+ min, 1.5 Hours, dll"
                className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-white/25" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#999] text-xs font-semibold tracking-wider uppercase">DESKRIPSI</label>
            <textarea value={data.deskripsi || ''} onChange={e => set('deskripsi', e.target.value)}
              placeholder="Deskripsi playlist..."
              rows={3}
              className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-white/25 resize-none" />
          </div>

          {/* Thumbnail */}
          <div className="flex flex-col gap-3">
            <p className="text-[#999] text-xs font-semibold tracking-wider uppercase">PILIH THUMBNAIL</p>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
              <div className="w-full sm:w-36 aspect-square rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/10 shrink-0 flex items-center justify-center">
                {thumbPreview ? (
                  <img src={thumbPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <svg width="28" height="28" fill="none" stroke="#333" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <FileButton onClick={() => fileRef.current?.click()} />
                <input ref={fileRef} type="file" accept="image/jpg,image/jpeg,image/png" className="hidden" onChange={handleFile} />
                <p className="text-[#666] text-xs">Recommended size: 1280x720px. Support formats: .jpg, .png. Maximum file size: 2MB.</p>
              </div>
            </div>
          </div>

          {/* Order */}
          <div className="flex flex-col gap-2">
            <label className="text-[#999] text-xs font-semibold tracking-wider uppercase">URUTAN (Order Index)</label>
            <input type="number" min="0" value={data.order_index ?? 0}
              onChange={e => set('order_index', parseInt(e.target.value) || 0)}
              className="w-32 bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25" />
          </div>
        </div>
      )}
      <ModalFooter onClose={onClose} onSave={handleSave} saving={saving} disabled={loading} />
    </ModalWrapper>
  );
}