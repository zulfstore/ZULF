import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for client-side Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  );
};

export const getSupabaseConfigStatus = () => {
  return {
    configured: isSupabaseConfigured(),
    url: supabaseUrl ? supabaseUrl.replace(/^(https:\/\/[^.]+).*/, '$1.supabase.co') : 'Not Set',
    hasAnonKey: Boolean(supabaseAnonKey),
    missingEnvVars: [
      !supabaseUrl ? 'VITE_SUPABASE_URL' : null,
      !supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY' : null
    ].filter(Boolean) as string[]
  };
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

/**
 * Validates and uploads product image to Supabase Storage bucket 'product-images'
 */
export async function uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      url: null,
      error: 'Supabase is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    };
  }

  // 1. Validate MIME type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return {
      url: null,
      error: `Invalid file type: ${file.type}. Allowed formats: JPG, PNG, WEBP, GIF.`
    };
  }

  // 2. Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      url: null,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 5MB.`
    };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Failed to upload image' };
  }
}
