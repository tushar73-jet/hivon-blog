import { createClient } from './client';

export async function uploadImage(file) {
  if (!file || file.size === 0) return null;

  // 🛡 Server-side Validation (Fix Gap #5)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (file.size > MAX_SIZE) throw new Error('File is too large (max 5MB)');
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.');

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
