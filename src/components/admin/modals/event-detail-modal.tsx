"use client";
import { useState, useEffect, useRef } from 'react';
import { uploadToStorage } from '@/lib/supabase';
import { ModalWrapper, ModalFooter, Field, ImageThumb, FileButton } from './hero-event-modal';
import { getEventDetailDataAdmin, saveEventDetailData } from '@/app/admin/data-actions';

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

interface Props {
  onClose: () => void;
  onSaved?: () => void;
}

export default function EventDetailModal({ onClose, onSaved }: Props) {
  const [data, setData] = useState<EventDetailData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);

  useEffect(() => {
    async function load() {
      const row = await getEventDetailDataAdmin();
      if (row) {
        setData(row);
        setPosterPreview(row.poster_event_url || null);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    let posterUrl = data.poster_event_url;

    if (posterFile) {
      const url = await uploadToStorage(posterFile, 'events');
      if (url) posterUrl = url;
    }

    const payload = { ...data, poster_event_url: posterUrl };

    try {
      await saveEventDetailData(payload);
      onSaved?.();
      onClose();
    } catch (err) {
      alert('Error saving: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const set = (field: keyof EventDetailData, value: string) =>
    setData(prev => ({ ...prev, [field]: value }));

  return (
    <ModalWrapper title="Event Detail Section - Link to other page" onClose={onClose}>
      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#666] text-sm">Loading...</div>
      ) : (
        <div className="flex flex-col gap-6 md:gap-7">
          {/* Poster */}
          <div className="flex flex-col gap-3">
            <p className="text-[#999] text-xs font-semibold tracking-wider uppercase">POSTER EVENT</p>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
              <div className="w-full sm:w-40 aspect-square rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/10 shrink-0">
                {posterPreview ? (
                  <img src={posterPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#333]">
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <FileButton onClick={() => fileRef.current?.click()} />
                <input ref={fileRef} type="file" accept="image/jpg,image/jpeg,image/png" className="hidden" onChange={handleFile} />
                <p className="text-[#666] text-xs">Format: JPG, PNG. Max 5MB.</p>
                <p className="text-[#666] text-xs">Recomended ratio 1:1</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-[#999] text-xs font-semibold tracking-wider uppercase">JUDUL EVENT</label>
            <textarea
              value={data.judul_event || ''}
              onChange={e => set('judul_event', e.target.value)}
              placeholder={"ESCAPE GOES TO:\nMAKASSAR"}
              rows={2}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-white/25 resize-none"
            />
          </div>

          <Field label="DESKRIPSI" value={data.deskripsi || ''} onChange={v => set('deskripsi', v)} multiline placeholder="Deskripsi event..." />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="LOKASI" value={data.lokasi || ''} onChange={v => set('lokasi', v)} icon="link" placeholder="Balai Manunggal (Balai M Yusuf)" />
            <Field label="TANGGAL" value={data.tanggal || ''} onChange={v => set('tanggal', v)} placeholder="Sunday, 3 Mei 2025" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="WAKTU" value={data.waktu || ''} onChange={v => set('waktu', v)} placeholder="13:00-17:00 WITA" />
            <Field label="KAPASITAS" value={data.kapasitas || ''} onChange={v => set('kapasitas', v)} placeholder="1000+" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="TEKS BUTTON" value={data.teks_button || ''} onChange={v => set('teks_button', v)} icon="link" placeholder="Buy Ticket" />
            <Field label="URL BUTTON" value={data.url_button || ''} onChange={v => set('url_button', v)} icon="link" placeholder="https://" />
          </div>
        </div>
      )}
      <ModalFooter onClose={onClose} onSave={handleSave} saving={saving} disabled={loading} />
    </ModalWrapper>
  );
}