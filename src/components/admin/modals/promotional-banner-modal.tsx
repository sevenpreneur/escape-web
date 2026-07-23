"use client";
import { useState, useEffect, useRef } from 'react';
import { uploadToStorage } from '@/lib/supabase';
import { ModalWrapper, ModalFooter, Field, FileButton } from './hero-event-modal';
import { getPromotionalBannerDataAdmin, savePromotionalBannerData } from '@/app/admin/data-actions';

interface BannerData {
  id?: number;
  foto_url?: string;
  headline?: string;
  deskripsi?: string;
  teks_button?: string;
  url_button?: string;
}

interface Props {
  onClose: () => void;
  onSaved?: () => void;
}

export default function PromotionalBannerModal({ onClose, onSaved }: Props) {
  const [data, setData] = useState<BannerData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    getPromotionalBannerDataAdmin().then((row) => {
      if (row) { setData(row); setPreview(row.foto_url || null); }
      setLoading(false);
    });
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    setSaving(true);
    let fotoUrl = data.foto_url;
    if (file) {
      const url = await uploadToStorage(file, 'banner');
      if (url) fotoUrl = url;
    }

    const payload = { ...data, foto_url: fotoUrl };
    try {
      await savePromotionalBannerData(payload);
      onSaved?.();
      onClose();
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const set = (field: keyof BannerData, value: string) =>
    setData(prev => ({ ...prev, [field]: value }));

  return (
    <ModalWrapper title="Promotional Banner - Online Page" onClose={onClose}>
      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#666] text-sm">Loading...</div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Foto */}
          <div className="flex flex-col gap-3">
            <p className="text-[#999] text-xs font-semibold tracking-wider uppercase">Foto</p>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
              <div className="w-full sm:w-36 aspect-3/4 rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/10 shrink-0 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="" className="w-full h-full object-cover" />
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
                <p className="text-[#666] text-xs">Format: JPG, PNG. Max 5MB.</p>
                <p className="text-[#666] text-xs">Recomended ratio 3:4</p>
              </div>
            </div>
          </div>

          <Field label="Headline" value={data.headline || ''} onChange={v => set('headline', v)} placeholder="ESCAPE SEKARANG TERSEDIA DI SPOTIFY!" />
          <Field label="DESKRIPSI" value={data.deskripsi || ''} onChange={v => set('deskripsi', v)} multiline placeholder="Deskripsi banner..." />

          <div className="flex flex-col gap-2">
            <label className="text-[#999] text-xs font-semibold tracking-wider uppercase">TEKS BUTTON</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" />
              </svg>
              <input type="text" value={data.teks_button || ''} onChange={e => set('teks_button', e.target.value)}
                placeholder="Dengarkan Sekarang!"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg pl-9 pr-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-white/25" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#999] text-xs font-semibold tracking-wider uppercase">URL BUTTON</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" />
              </svg>
              <input type="text" value={data.url_button || ''} onChange={e => set('url_button', e.target.value)}
                placeholder="https://"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg pl-9 pr-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-white/25" />
            </div>
          </div>
        </div>
      )}
      <ModalFooter onClose={onClose} onSave={handleSave} saving={saving} disabled={loading} />
    </ModalWrapper>
  );
}