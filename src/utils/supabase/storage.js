import { createClient } from './client';

export async function uploadImage(file) {
  if (!file || file.size === 0) return null;

  const supabase = createClient();
  
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload Error:', error);
    throw new Error('Failed to upload the image.');
  }
  const { data: { publicUrl } } = supabase.storage
    .from('blog-images')
    .getPublicUrl(fileName);

  return publicUrl;
}
