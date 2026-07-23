"use client";
import { useState, useEffect, useRef } from 'react';
import { uploadToStorage } from '@/lib/supabase';
import { getHeroEventDataAdmin, saveHeroEventData } from '@/app/admin/data-actions';

interface HeroEventData {
  id?: number;
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

interface Props {
  pageContext: string;
  title: string;
  onClose: () => void;
  onSaved?: () => void;
}

export default function HeroEventModal({ pageContext, title, onClose, onSaved }: Props) {
  const [data, setData] = useState<HeroEventData>({ page_context: pageContext });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [pngPreview, setPngPreview] = useState<string | null>(null);
  const bgFileRef = useRef<HTMLInputElement>(null);
  const pngFileRef = useRef<HTMLInputElement>(null);
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [pngFile, setPngFile] = useState<File | null>(null);

  useEffect(() => {
    async function load() {
      const row = await getHeroEventDataAdmin(pageContext);
      if (row) {
        setData(row);
        setBgPreview(row.background_photo_url || null);
        setPngPreview(row.png_image_url || null);
      }
      setLoading(false);
    }
    load();
  }, [pageContext]);

  const handleBgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBgFile(file);
    setBgPreview(URL.createObjectURL(file));
  };

  const handlePngFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPngFile(file);
    setPngPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    let bgUrl = data.background_photo_url;
    let pngUrl = data.png_image_url;

    if (bgFile) {
      const url = await uploadToStorage(bgFile, 'hero');
      if (url) bgUrl = url;
    }
    if (pngFile) {
      const url = await uploadToStorage(pngFile, 'hero');
      if (url) pngUrl = url;
    }

    const payload: HeroEventData = {
      ...data,
      background_photo_url: bgUrl,
      png_image_url: pngUrl,
    };

    try {
      await saveHeroEventData(payload);
      onSaved?.();
      onClose();
    } catch (err) {
      alert('Error saving: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const set = (field: keyof HeroEventData, value: string) =>
    setData(prev => ({ ...prev, [field]: value }));

  return (
    <ModalWrapper title={title} onClose={onClose}>
      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#666] text-sm">Loading...</div>
      ) : (
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Background Photo */}
          <Section label="BACKGROUND FOTO (1440X900)">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
              <ImageThumb src={bgPreview} ratio="aspect-video" />
              <div className="flex flex-col gap-2">
                <FileButton onClick={() => bgFileRef.current?.click()} />
                <input ref={bgFileRef} type="file" accept="image/jpg,image/jpeg,image/png" className="hidden" onChange={handleBgFile} />
                <p className="text-[#666] text-xs">Format: JPG, PNG. Max 5MB.</p>
                <p className="text-[#666] text-xs">1440x900</p>
              </div>
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="TEKS LOGO" value={data.teks_logo || ''} onChange={v => set('teks_logo', v)} />
            <Field label="TEKS JUDUL" value={data.teks_judul || ''} onChange={v => set('teks_judul', v)} />
          </div>

          {/* PNG Image */}
          <Section label="PNG IMAGE (OPTIONAL)">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
              <ImageThumb src={pngPreview} ratio="aspect-video" />
              <div className="flex flex-col gap-2">
                <FileButton onClick={() => pngFileRef.current?.click()} />
                <input ref={pngFileRef} type="file" accept="image/png,image/jpg,image/jpeg" className="hidden" onChange={handlePngFile} />
                <p className="text-[#666] text-xs">Format: JPG, PNG. Max 5MB.</p>
                <p className="text-[#666] text-xs">Recomended ratio 1:3</p>
              </div>
            </div>
          </Section>

          <Field label="TEKS DETAIL" value={data.teks_detail || ''} onChange={v => set('teks_detail', v)} placeholder="MINGGU 3 MEI 2025 | BALAI MANUNGGAL" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="TEKS BUTTON 1" value={data.button1_text || ''} onChange={v => set('button1_text', v)} placeholder="Buy Ticket" icon="link" />
            <Field label="TEKS BUTTON 2" value={data.button2_text || ''} onChange={v => set('button2_text', v)} placeholder="Check Details" icon="info" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="URL BUTTON 1" value={data.button1_url || ''} onChange={v => set('button1_url', v)} placeholder="https://" icon="link" />
            <Field label="URL BUTTON 2" value={data.button2_url || ''} onChange={v => set('button2_url', v)} placeholder="https://" icon="link" />
          </div>
        </div>
      )}
      <ModalFooter onClose={onClose} onSave={handleSave} saving={saving} disabled={loading} />
    </ModalWrapper>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────

export function ModalWrapper({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-4 sm:py-10 px-3 sm:px-4">
      <div className="relative w-full max-w-3xl bg-[#111] rounded-2xl border border-white/10 flex flex-col">
        <div className="flex items-center justify-between px-4 sm:px-7 py-4 sm:py-5 border-b border-white/10 gap-3">
          <h2 className="text-white font-bold text-sm sm:text-base uppercase tracking-wide leading-tight">{title}</h2>
          <button onClick={onClose} className="text-[#666] hover:text-white transition-colors shrink-0">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-4 sm:px-7 py-5 sm:py-6 flex-1">{children}</div>
      </div>
    </div>
  );
}

export function ModalFooter({ onClose, onSave, saving, disabled }: { onClose: () => void; onSave: () => void; saving: boolean; disabled?: boolean }) {
  return (
    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 sm:pt-8 mt-2 border-t border-white/10">
      <button
        onClick={onSave}
        disabled={saving || disabled}
        className="flex items-center justify-center gap-2 bg-[#DA393C] text-white font-bold px-7 py-3 rounded-lg text-sm hover:bg-[#b52b2d] active:scale-[0.98] disabled:opacity-40 transition-all uppercase tracking-wider"
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {saving ? 'Saving...' : 'Save Change'}
      </button>
      <button
        onClick={onClose}
        className="bg-[#2a2a2a] text-white font-bold px-7 py-3 rounded-lg text-sm hover:bg-[#333] transition-colors uppercase tracking-wider text-center"
      >
        Cancel
      </button>
    </div>
  );
}

export function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[#999] text-xs font-semibold tracking-wider uppercase">{label}</p>
      {children}
    </div>
  );
}

export function Field({
  label, value, onChange, placeholder, icon, type = 'text', multiline
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; icon?: string; type?: string; multiline?: boolean;
}) {
  const iconEl = icon === 'link' ? (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" />
    </svg>
  ) : icon === 'info' ? (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ) : null;

  const cls = "w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-white/25 transition-colors resize-none";

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[#999] text-xs font-semibold tracking-wider uppercase">{label}</label>
      <div className="relative">
        {iconEl && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]">{iconEl}</span>}
        {multiline ? (
          <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className={`${cls} ${iconEl ? 'pl-9' : ''}`} rows={3} />
        ) : (
          <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className={`${cls} ${iconEl ? 'pl-9' : ''}`} />
        )}
      </div>
    </div>
  );
}

export function ImageThumb({ src, ratio = 'aspect-square' }: { src: string | null; ratio?: string }) {
  return (
    <div className={`w-full sm:w-32 shrink-0 ${ratio} rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/10`}>
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover" />
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
  );
}

export function FileButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2 border border-white/20 text-white text-sm px-4 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      Choose File
    </button>
  );
}