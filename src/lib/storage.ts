import { supabase } from '@/lib/supabase';

/**
 * Upload an image to the portfolio-images bucket under the user's own folder.
 * Returns the public URL on success, or null on failure.
 */
export async function uploadImage(file: File, userId: string, kind = 'misc'): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'png';
  const path = `${userId}/${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('portfolio-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  if (error) {
    // eslint-disable-next-line no-console
    console.error('upload error', error);
    return null;
  }
  const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path);
  return data.publicUrl;
}
