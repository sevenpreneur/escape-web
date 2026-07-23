import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadToStorage(file: File, folder: string): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from('escape')
    .upload(filename, file, { upsert: true, contentType: file.type });

  if (error) {
    console.error('Storage upload error:', error.message);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('escape')
    .getPublicUrl(data.path);

  return publicUrl;
}