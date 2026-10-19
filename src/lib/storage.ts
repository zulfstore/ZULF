import { Product, StoreSettings, Order, BuilderSection } from '../types';
import { INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS } from '../data/mockData';

const PRODUCTS_KEY = 'zulf_store_products_v1';
const SETTINGS_KEY = 'zulf_store_settings_v1';
const ORDERS_KEY = 'zulf_store_orders_v1';

// Seed initial orders so admin analytics and order management have realistic data right away
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-demo-01',
    order_number: 'ZULF-2610-A91B2',
    customer_name: 'Hamza Tariq',
    customer_phone: '0300 8472910',
    customer_email: 'hamza.t@example.com',
    shipping_address: 'House 42, Street 7, Sector F-8/2',
    shipping_city: 'Islamabad',
    payment_method: 'COD',
    payment_status: 'paid',
    order_status: 'delivered',
    subtotal_pkr: 4850,
    shipping_fee_pkr: 0,
    total_amount_pkr: 4850,
    courier_partner: 'Trax',
    tracking_number: 'TRX-9481920',
    tracking_url: 'https://trax.pk/tracking?cn=TRX-9481920',
    cod_expected_pkr: 4850,
    cod_received_pkr: 4850,
    cod_shortfall_pkr: 0,
    courier_handling_fee_pkr: 180,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    items: [
      {
        id: 'item-01',
        order_id: 'ord-demo-01',
        product_id: 'prod-002',
        product_sku: 'ZLF-CHP-02',
        product_title: 'Handmade Peshawari Chappal — Zalmi Edition Dark Tan',
        selected_variant: 'Size: 42 (9) | Color: Dark Tan',
        unit_price_pkr: 4850,
        quantity: 1,
        line_total_pkr: 4850,
        product_image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80'
      }
    ]
  },
  {
    id: 'ord-demo-02',
    order_number: 'ZULF-2610-K82F1',
    customer_name: 'Ayesha Siddiqui',
    customer_phone: '0321 9928172',
    customer_email: 'ayesha.s@example.com',
    shipping_address: 'Apartment 4B, Creek Vistas, Phase 8, DHA',
    shipping_city: 'Karachi',
    payment_method: 'COD',
    payment_status: 'unpaid',
    order_status: 'dispatched',
    subtotal_pkr: 3450,
    shipping_fee_pkr: 250,
    total_amount_pkr: 3700,
    courier_partner: 'Leopard',
    tracking_number: 'LCS-7291048',
    tracking_url: 'https://leopardscourier.com/tracking?cn=LCS-7291048',
    cod_expected_pkr: 3700,
    cod_received_pkr: 0,
    cod_shortfall_pkr: 0,
    courier_handling_fee_pkr: 220,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    items: [
      {
        id: 'item-02',
        order_id: 'ord-demo-02',
        product_id: 'prod-001',
        product_sku: 'ZLF-KRT-01',
        product_title: 'Raw Linen Kurta — Charcoal Slate',
        selected_variant: 'Size: Medium | Color: Charcoal Slate',
        unit_price_pkr: 3450,
        quantity: 1,
        line_total_pkr: 3450,
        product_image_url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=400&q=80'
      }
    ]
  },
  {
    id: 'ord-demo-03',
    order_number: 'ZULF-2610-M10P9',
    customer_name: 'Usman Malik',
    customer_phone: '0333 5162738',
    shipping_address: 'Plot 118-B, Model Town',
    shipping_city: 'Lahore',
    payment_method: 'COD',
    payment_status: 'unpaid',
    order_status: 'pending_confirmation',
    subtotal_pkr: 4500,
    shipping_fee_pkr: 0,
    total_amount_pkr: 4500,
    cod_expected_pkr: 4500,
    cod_received_pkr: 0,
    cod_shortfall_pkr: 0,
    courier_handling_fee_pkr: 0,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    items: [
      {
        id: 'item-03',
        order_id: 'ord-demo-03',
        product_id: 'prod-003',
        product_sku: 'ZLF-TEE-03',
        product_title: 'Heavyweight 240 GSM Boxy Tee — Stone Washed',
        selected_variant: 'Size: L | Color: Stone Grey',
        unit_price_pkr: 1850,
        quantity: 1,
        line_total_pkr: 1850,
        product_image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'item-04',
        order_id: 'ord-demo-03',
        product_id: 'prod-004',
        product_sku: 'ZLF-WLT-04',
        product_title: 'Full-Grain Hunter Leather Bifold Wallet',
        selected_variant: 'Color: Vintage Brown',
        unit_price_pkr: 2650,
        quantity: 1,
        line_total_pkr: 2650,
        product_image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80'
      }
    ]
  }
];

export const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
};

export const saveStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save products to localStorage', err);
  }
};

export const getStoredSettings = (): StoreSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_STORE_SETTINGS));
      return INITIAL_STORE_SETTINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STORE_SETTINGS;
  }
};

export const saveStoredSettings = (settings: StoreSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage', err);
  }
};

export const getStoredOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
      return INITIAL_DEMO_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_ORDERS;
  }
};

export const saveStoredOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders to localStorage', err);
  }
};

export const resetToDefaults = () => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_STORE_SETTINGS));
  localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
};
