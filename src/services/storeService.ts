import { Product, StoreSettings, BuilderSection, ThemeTokens } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  getStoredProducts, 
  saveStoredProducts, 
  getStoredSettings, 
  saveStoredSettings 
} from '../lib/storage';

export const storeService = {
  /**
   * Fetch active products for public storefront
   */
  async getActiveProducts(): Promise<Product[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data as Product[];
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local store:', err);
      }
    }
    return getStoredProducts().filter(p => p.is_active);
  },

  /**
   * Fetch all products for admin management
   */
  async getAllProducts(): Promise<Product[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as Product[];
        }
      } catch (err) {
        console.warn('Supabase admin fetch failed:', err);
      }
    }
    return getStoredProducts();
  },

  /**
   * Save or update a product
   */
  async saveProduct(product: Partial<Product> & { title: string; price_pkr: number }): Promise<Product> {
    const isNew = !product.id;
    const now = new Date().toISOString();
    
    const newProduct: Product = {
      id: product.id || `prod-${Date.now().toString(36)}`,
      sku: product.sku || `ZLF-${Math.floor(1000 + Math.random() * 9000)}`,
      title: product.title,
      slug: product.slug || product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: product.category || 'Everyday Essentials',
      description: product.description || '',
      price_pkr: Number(product.price_pkr),
      compare_at_price_pkr: product.compare_at_price_pkr ? Number(product.compare_at_price_pkr) : undefined,
      inventory_quantity: Math.max(0, Number(product.inventory_quantity || 0)),
      is_active: product.is_active !== undefined ? product.is_active : true,
      is_featured: Boolean(product.is_featured),
      images: product.images && product.images.length > 0 ? product.images : [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
      ],
      variants: product.variants || [],
      created_at: product.created_at || now,
      updated_at: now
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .upsert(newProduct)
          .select()
          .single();

        if (!error && data) {
          return data as Product;
        }
      } catch (err) {
        console.warn('Supabase product upsert failed, updating local:', err);
      }
    }

    // Update local storage
    const current = getStoredProducts();
    const index = current.findIndex(p => p.id === newProduct.id);
    let updated: Product[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = newProduct;
    } else {
      updated = [newProduct, ...current];
    }
    saveStoredProducts(updated);
    return newProduct;
  },

  /**
   * Delete or archive a product
   */
  async deleteProduct(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }
    const current = getStoredProducts();
    const updated = current.filter(p => p.id !== id);
    saveStoredProducts(updated);
    return true;
  },

  /**
   * Get store settings
   */
  async getSettings(): Promise<StoreSettings> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .eq('id', 'current_store')
          .single();

        if (!error && data) {
          return data as StoreSettings;
        }
      } catch (err) {
        console.warn('Supabase settings fetch failed:', err);
      }
    }
    return getStoredSettings();
  },

  /**
   * Save store settings
   */
  async saveSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = getStoredSettings();
    const updated: StoreSettings = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('store_settings')
          .upsert(updated);
      } catch (err) {
        console.warn('Supabase settings update failed:', err);
      }
    }

    saveStoredSettings(updated);
    return updated;
  },

  /**
   * Save draft homepage builder sections
   */
  async saveDraftSections(sections: BuilderSection[]): Promise<StoreSettings> {
    return this.saveSettings({ draft_homepage_sections: sections });
  },

  /**
   * Publish draft homepage sections to live storefront
   */
  async publishDraftSections(sections: BuilderSection[]): Promise<StoreSettings> {
    return this.saveSettings({
      homepage_sections: sections,
      draft_homepage_sections: null
    });
  },

  /**
   * Update theme tokens
   */
  async updateThemeTokens(tokens: Partial<ThemeTokens>): Promise<StoreSettings> {
    const current = getStoredSettings();
    const updatedTokens: ThemeTokens = {
      ...current.theme_tokens,
      ...tokens
    };
    return this.saveSettings({ theme_tokens: updatedTokens });
  }
};
