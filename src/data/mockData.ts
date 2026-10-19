import { Product, StoreSettings, BuilderSection } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    sku: 'ZLF-KRT-01',
    title: 'Raw Linen Kurta — Charcoal Slate',
    slug: 'raw-linen-kurta-charcoal-slate',
    category: 'Apparel & Kurtas',
    description: 'Crafted from 100% natural breathable raw linen with a relaxed band collar, mother-of-pearl buttons, and dual deep pockets. Designed specifically for Pakistan’s climate, balancing breathable comfort and crisp poise.',
    price_pkr: 3450,
    compare_at_price_pkr: 4200,
    inventory_quantity: 24,
    is_active: true,
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=900&q=80'
    ],
    variants: [
      { name: 'Size', options: ['Small', 'Medium', 'Large', 'X-Large'] },
      { name: 'Color', options: ['Charcoal Slate', 'Off-White', 'Muted Olive'] }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-002',
    sku: 'ZLF-CHP-02',
    title: 'Handmade Peshawari Chappal — Zalmi Edition Dark Tan',
    slug: 'handmade-peshawari-chappal-zalmi-edition-dark-tan',
    category: 'Peshawari & Footwear',
    description: 'Artisanal double-stitched leather upper with tyre-sole grip handcrafted in Khyber Pakhtunkhwa. Features ergonomic memory foam insole lining for all-day comfort during festive occasions or Friday prayers.',
    price_pkr: 4850,
    compare_at_price_pkr: 5900,
    inventory_quantity: 16,
    is_active: true,
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80'
    ],
    variants: [
      { name: 'Size', options: ['40 (7)', '41 (8)', '42 (9)', '43 (10)', '44 (11)'] },
      { name: 'Color', options: ['Dark Tan', 'Mustard Brown', 'Jet Black'] }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-003',
    sku: 'ZLF-TEE-03',
    title: 'Heavyweight 240 GSM Boxy Tee — Stone Washed',
    slug: 'heavyweight-240-gsm-boxy-tee-stone-washed',
    category: 'Everyday Essentials',
    description: '100% combed Pakistani ring-spun cotton. Dense 240 GSM construction with ribbed crewneck collar that never sags after washing. Drop-shoulder relaxed silhouette for contemporary minimal streetwear.',
    price_pkr: 1850,
    compare_at_price_pkr: 2400,
    inventory_quantity: 42,
    is_active: true,
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80'
    ],
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', options: ['Stone Grey', 'Chalk White', 'Deep Black'] }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-004',
    sku: 'ZLF-WLT-04',
    title: 'Full-Grain Hunter Leather Bifold Wallet',
    slug: 'full-grain-hunter-leather-bifold-wallet',
    category: 'Leather & Wallets',
    description: 'Vegetable-tanned full grain cowhide sourced from Sialkot tanneries. RFID-blocking interior shields debit cards and CNIC cards. Develops a rich organic patina with daily use.',
    price_pkr: 2650,
    compare_at_price_pkr: 3500,
    inventory_quantity: 30,
    is_active: true,
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Vintage Brown', 'Tobacco Tan', 'Obsidian Black'] }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-005',
    sku: 'ZLF-SHT-05',
    title: 'Egyptian Oxford Casual Shirt — Optical White',
    slug: 'egyptian-oxford-casual-shirt-optical-white',
    category: 'Apparel & Kurtas',
    description: 'Pre-washed button-down collar Oxford shirt woven with 80s 2-ply long staple cotton. Breathable, durable, and naturally wrinkle-resistant for both smart casual office days and weekend dinners.',
    price_pkr: 3950,
    compare_at_price_pkr: 4800,
    inventory_quantity: 18,
    is_active: true,
    is_featured: false,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80'
    ],
    variants: [
      { name: 'Size', options: ['15 (S)', '15.5 (M)', '16 (L)', '16.5 (XL)'] }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'prod-006',
    sku: 'ZLF-BAG-06',
    title: 'Waxed Canvas & Leather Weekender Duffle',
    slug: 'waxed-canvas-and-leather-weekender-duffle',
    category: 'Leather & Wallets',
    description: 'Water-resistant 18oz army duck canvas paired with 100% thick top-grain leather straps. Sized to fit airline carry-on standards or inter-city road trips across the Motorway.',
    price_pkr: 7950,
    compare_at_price_pkr: 9800,
    inventory_quantity: 9,
    is_active: true,
    is_featured: false,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Army Green / Tan Leather', 'Charcoal / Black Leather'] }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const INITIAL_BUILDER_SECTIONS: BuilderSection[] = [
  {
    id: 'sec-announcement',
    type: 'announcement_bar',
    title: 'Announcement Header Bar',
    enabled: true,
    settings: {
      text: 'FREE NATIONWIDE DELIVERY ON ORDERS OVER RS. 3,500 • CASH ON DELIVERY AVAILABLE',
      linkUrl: '#products',
      backgroundColor: '#18181B',
      textColor: '#FFFFFF'
    }
  },
  {
    id: 'sec-hero',
    type: 'hero_banner',
    title: 'Main Hero Showcase',
    enabled: true,
    settings: {
      badge: 'ZULF STORE — AUTUMN ESSENTIALS 2026',
      headline: 'Understated Elegance. Crafted for Pakistan.',
      subheadline: 'Pure natural fabrics, master tailoring, and reliable Cash on Delivery delivered straight to your door across 100+ cities.',
      primaryButtonText: 'Explore Collection',
      primaryButtonLink: '#products',
      secondaryButtonText: 'About ZULF',
      secondaryButtonLink: '#about',
      heroImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80',
      alignment: 'center'
    }
  },
  {
    id: 'sec-value-props',
    type: 'value_props',
    title: 'Trust Badges & Guarantees',
    enabled: true,
    settings: {
      items: [
        {
          icon: 'ShieldCheck',
          title: 'Cash On Delivery',
          description: 'Inspect upon courier arrival and pay cash at your doorstep.'
        },
        {
          icon: 'Truck',
          title: '2-4 Days Dispatch',
          description: 'Swift tracked delivery via Trax, TCS, and Leopards Express.'
        },
        {
          icon: 'RefreshCw',
          title: '7-Day Easy Exchange',
          description: 'Simple size swap with zero hassle or questioning.'
        },
        {
          icon: 'Award',
          title: 'Master Craftsmanship',
          description: 'Tested against Pakistan heat & frequent washes.'
        }
      ]
    }
  },
  {
    id: 'sec-featured',
    type: 'featured_collection',
    title: 'Featured Collection Grid',
    enabled: true,
    settings: {
      title: 'Curated Essentials',
      subtitle: 'Hand-selected staples designed for daily comfort and dignified style.',
      categoryFilter: 'All Products',
      maxItems: 6
    }
  },
  {
    id: 'sec-editorial',
    type: 'editorial_split',
    title: 'Storytelling Split Banner',
    enabled: true,
    settings: {
      tag: 'CRAFT & HERITAGE',
      headline: 'Rooted in Local Craft, Made for Everyday Living',
      body: 'At ZULF STORE, we bypass generic fast-fashion trends. Every seam, cut, and fabric is engineered to withstand Pakistani heat and humidity without sacrificing structure or dignity. From raw linen kurtas to vegetable-tanned leather essentials, our pieces are built to last.',
      buttonText: 'View Our Story',
      buttonLink: '#about',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80'
    }
  },
  {
    id: 'sec-newsletter',
    type: 'newsletter_signup',
    title: 'Newsletter Subscription',
    enabled: true,
    settings: {
      heading: 'Join the ZULF Inner Circle',
      subheading: 'Subscribe to receive private preview access, seasonal drops, and Rs. 500 off your first COD order.',
      buttonText: 'Subscribe & Get Voucher'
    }
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  id: 'current_store',
  store_name: 'ZULF STORE',
  store_tagline: 'Modern Essentials for Pakistan',
  currency: 'PKR',
  support_email: 'zulfstore4@gmail.com',
  support_phone: '0300 1234567',
  support_whatsapp: '0300 1234567',
  store_address: 'Main Boulevard, Gulberg III, Lahore, Pakistan',
  standard_shipping_fee: 250,
  free_shipping_threshold: 3500,
  cod_enabled: true,
  cod_max_limit: 50000,
  theme_tokens: {
    primary_color: '#18181B',
    accent_color: '#27272A',
    background_color: '#FAFAFA',
    font_family: 'Plus Jakarta Sans',
    button_radius: 'md',
    announcement_bg: '#18181B',
    announcement_text: '#FFFFFF'
  },
  homepage_sections: INITIAL_BUILDER_SECTIONS,
  draft_homepage_sections: null,
  policies: {
    shipping_policy: 'Standard nationwide delivery across Pakistan takes 2-4 business days. Flat delivery charge PKR 250, free on orders above PKR 3,500 via Trax, TCS, and Leopards.',
    return_policy: '7-day hassle-free replacement in Pakistan. Return items must be in unworn condition with original tags intact.',
    cod_policy: 'Cash on Delivery is available across all major cities and towns. Please ensure exact change is available when the courier rider arrives.'
  },
  updated_at: new Date().toISOString()
};
