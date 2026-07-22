"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase, uploadToStorage } from '@/lib/supabase';
import { ModalWrapper, ModalFooter, Field, FileButton } from './hero-event-modal';

interface MerchandiseItem {
  id?: string;
  foto_url?: string;
  nama_produk?: string;
  kategori?: string;
  harga?: string;
  order_index?: number;
}

interface Props {
  itemId?: string;
  onClose: () => void;
  onSaved?: () => void;
}

const KATEGORI_OPTIONS = ['T-shirt', 'Hoodie', 'Outer', 'Merchandise', 'Tote Bag', 'Sticker'];

export default function MerchandiseModal({ itemId, onClose, onSaved }: Props) {
  const [data, setData] = useState<MerchandiseItem>({});
  const [loading, setLoading] = useState(!!itemId);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!itemId) return;
    supabase.from('merchandise_items').select('*').eq('id', itemId).single().then(({ data: row }) => {
      if (row) { setData(row); setPreview(row.foto_url || null); }
      setLoading(false);
    });
  }, [itemId]);

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
      const url = await uploadToStorage(file, 'merch');
      if (url) fotoUrl = url;
    }

    const payload = { ...data, foto_url: fotoUrl };
    let error;
    if (itemId) {
      ({ error } = await supabase.from('merchandise_items').update(payload).eq('id', itemId));
    } else {
      ({ error } = await supabase.from('merchandise_items').insert(payload));
    }

    setSaving(false);
    if (!error) { onSaved?.(); onClose(); }
    else alert('Error: ' + error.message);
  };

  const set = (field: keyof MerchandiseItem, value: string | number) =>
    setData(prev => ({ ...prev, [field]: value }));

  return (
    <ModalWrapper title="Escape Official Merchandise Section" onClose={onClose}>
      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#666] text-sm">Loading...</div>
      ) : (
        <div className="flex flex-col gap-6">
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

          <Field label="Nama Produk" value={data.nama_produk || ''} onChange={v => set('nama_produk', v)} placeholder="T-shirt Escape Vol.1" />

          <div className="flex flex-col gap-2">
            <label className="text-[#999] text-xs font-semibold tracking-wider uppercase">Kategori</label>
            <div className="relative">
              <select
                value={data.kategori || ''}
                onChange={e => set('kategori', e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 appearance-none"
              >
                <option value="">Pilih Kategori</option>
                {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          <Field label="Harga" value={data.harga || ''} onChange={v => set('harga', v)} placeholder="Rp 189.000 / Sold Out" />
        </div>
      )}
      <ModalFooter onClose={onClose} onSave={handleSave} saving={saving} disabled={loading} />
    </ModalWrapper>
  );
}