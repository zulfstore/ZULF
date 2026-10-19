export type OrderStatus = 
  | 'pending_confirmation'
  | 'confirmed'
  | 'packed'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentMethod = 'COD' | 'PAYFAST_PENDING';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface ProductVariant {
  name: string; // e.g. "Size", "Color"
  options: string[]; // e.g. ["S", "M", "L", "XL"]
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  price_pkr: number;
  compare_at_price_pkr?: number;
  inventory_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  images: string[];
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_sku: string;
  product_title: string;
  selected_variant?: string;
  unit_price_pkr: number;
  quantity: number;
  line_total_pkr: number;
  product_image_url?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code?: string;
  order_notes?: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  subtotal_pkr: number;
  shipping_fee_pkr: number;
  total_amount_pkr: number;
  courier_partner?: string;
  tracking_number?: string;
  tracking_url?: string;
  dispatched_at?: string;
  delivered_at?: string;
  cod_expected_pkr: number;
  cod_received_pkr: number;
  cod_shortfall_pkr: number;
  courier_handling_fee_pkr: number;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface ThemeTokens {
  primary_color: string;
  accent_color: string;
  background_color: string;
  font_family: string;
  button_radius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  announcement_bg: string;
  announcement_text: string;
}

export type SectionType = 
  | 'announcement_bar'
  | 'hero_banner'
  | 'featured_collection'
  | 'value_props'
  | 'editorial_split'
  | 'category_tiles'
  | 'newsletter_signup';

export interface BuilderSection {
  id: string;
  type: SectionType;
  title: string;
  enabled: boolean;
  settings: Record<string, any>;
}

export interface StorePolicies {
  shipping_policy: string;
  return_policy: string;
  cod_policy: string;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  store_tagline: string;
  currency: string;
  support_email: string;
  support_phone: string;
  support_whatsapp: string;
  store_address: string;
  standard_shipping_fee: number;
  free_shipping_threshold: number;
  cod_enabled: boolean;
  cod_max_limit: number;
  theme_tokens: ThemeTokens;
  homepage_sections: BuilderSection[];
  draft_homepage_sections?: BuilderSection[] | null;
  policies: StorePolicies;
  updated_at: string;
}

export interface CheckoutInput {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  shipping_city: string;
  order_notes?: string;
  items: {
    product_id: string;
    quantity: number;
    variant?: string;
  }[];
}

export interface CheckoutResult {
  success: boolean;
  order_id: string;
  order_number: string;
  subtotal_pkr: number;
  shipping_fee_pkr: number;
  total_amount_pkr: number;
  payment_method: string;
  status: OrderStatus;
  error?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  actor_id: string;
  details: Record<string, any>;
  created_at: string;
}
