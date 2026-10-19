import React from 'react';
import { BuilderSection, Product, StoreSettings } from '../../types';
import { ProductCard } from './ProductCard';
import { 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Award, 
  ArrowRight, 
  Mail, 
  Sparkles,
  ShoppingBag,
  Layers
} from 'lucide-react';

interface HomepageSectionRendererProps {
  sections: BuilderSection[];
  products: Product[];
  settings: StoreSettings;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onNavigateCategory: (category: string) => void;
}

export const HomepageSectionRenderer: React.FC<HomepageSectionRendererProps> = ({
  sections,
  products,
  settings,
  onSelectProduct,
  onQuickAdd,
  onNavigateCategory
}) => {
  // Filter only enabled sections that are in whitelist
  const allowedTypes = [
    'hero_banner',
    'value_props',
    'featured_collection',
    'editorial_split',
    'category_tiles',
    'newsletter_signup'
  ];

  const visibleSections = sections.filter(
    s => s.enabled && allowedTypes.includes(s.type)
  );

  return (
    <div className="space-y-16 sm:space-y-24">
      {visibleSections.map((section) => {
        switch (section.type) {
          case 'hero_banner':
            return (
              <HeroSection
                key={section.id}
                settings={section.settings}
                onExplore={() => {
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            );

          case 'value_props':
            return (
              <ValuePropsSection
                key={section.id}
                settings={section.settings}
              />
            );

          case 'featured_collection':
            return (
              <FeaturedCollectionSection
                key={section.id}
                settings={section.settings}
                products={products}
                onSelectProduct={onSelectProduct}
                onQuickAdd={onQuickAdd}
                onViewAll={() => {
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            );

          case 'editorial_split':
            return (
              <EditorialSplitSection
                key={section.id}
                settings={section.settings}
                onAction={() => {
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            );

          case 'category_tiles':
            return (
              <CategoryTilesSection
                key={section.id}
                settings={section.settings}
                onSelectCategory={onNavigateCategory}
              />
            );

          case 'newsletter_signup':
            return (
              <NewsletterSection
                key={section.id}
                settings={section.settings}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

// 1. HERO SECTION
const HeroSection: React.FC<{ settings: any; onExplore: () => void }> = ({ settings, onExplore }) => {
  const badge = settings?.badge || 'AUTUMN ESSENTIALS 2026';
  const headline = settings?.headline || 'Understated Elegance. Crafted for Pakistan.';
  const subheadline = settings?.subheadline || 'Pure natural fabrics, master tailoring, and reliable Cash on Delivery delivered straight to your door across 100+ cities.';
  const primaryButtonText = settings?.primaryButtonText || 'Explore Collection';
  const heroImageUrl = settings?.heroImageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80';
  const alignment = settings?.alignment || 'center';

  return (
    <div className="relative overflow-hidden bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className={`lg:col-span-7 space-y-6 ${alignment === 'center' ? 'text-center lg:text-left' : 'text-left'}`}>
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-[11px] font-bold tracking-wider uppercase border border-zinc-200">
                <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
                <span>{badge}</span>
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 font-heading leading-[1.08]">
              {headline}
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 max-w-xl leading-relaxed">
              {subheadline}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExplore}
                className="px-6 py-3.5 bg-zinc-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>{primaryButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cash on Delivery Active</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/80 shadow-lg relative group">
              <img
                src={heroImageUrl}
                alt="ZULF STORE showcase"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="text-[11px] font-mono tracking-widest uppercase opacity-80">Authentic Design</p>
                  <p className="text-sm font-bold">Raw Linen & Handcrafted Leathers</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// 2. VALUE PROPS SECTION
const ValuePropsSection: React.FC<{ settings: any }> = ({ settings }) => {
  const items = settings?.items || [
    { icon: 'ShieldCheck', title: 'Cash On Delivery', description: 'Pay at your doorstep with exact change upon arrival.' },
    { icon: 'Truck', title: '2-4 Days Dispatch', description: 'Tracked nationwide shipping via Trax, TCS, and Leopards.' },
    { icon: 'RefreshCw', title: '7-Day Easy Exchange', description: 'Hassle-free size and fitting replacements.' },
    { icon: 'Award', title: 'Master Craftsmanship', description: 'Premium fabrics tailored specifically for Pakistan.' }
  ];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Truck': return <Truck className="w-5 h-5 text-zinc-900" />;
      case 'RefreshCw': return <RefreshCw className="w-5 h-5 text-zinc-900" />;
      case 'Award': return <Award className="w-5 h-5 text-zinc-900" />;
      default: return <ShieldCheck className="w-5 h-5 text-zinc-900" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item: any, idx: number) => (
          <div 
            key={idx}
            className="p-5 bg-white border border-zinc-200 rounded-xl flex items-start gap-3.5 hover:border-zinc-300 transition-colors shadow-xs"
          >
            <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200 shrink-0">
              {getIcon(item.icon)}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
                {item.title}
              </h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. FEATURED COLLECTION SECTION
const FeaturedCollectionSection: React.FC<{
  settings: any;
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onQuickAdd: (p: Product) => void;
  onViewAll: () => void;
}> = ({ settings, products, onSelectProduct, onQuickAdd, onViewAll }) => {
  const title = settings?.title || 'Curated Essentials';
  const subtitle = settings?.subtitle || 'Hand-selected staples designed for daily comfort and dignified style.';
  const maxItems = settings?.maxItems || 4;

  const displayProducts = products
    .filter(p => p.is_active)
    .slice(0, maxItems);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">Featured</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-heading mt-0.5">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-zinc-600 mt-1">{subtitle}</p>
          )}
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-black flex items-center gap-1.5 cursor-pointer"
        >
          <span>View All Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onSelect={onSelectProduct}
            onQuickAdd={onQuickAdd}
          />
        ))}
      </div>
    </div>
  );
};

// 4. EDITORIAL SPLIT SECTION
const EditorialSplitSection: React.FC<{ settings: any; onAction: () => void }> = ({ settings, onAction }) => {
  const tag = settings?.tag || 'CRAFT & HERITAGE';
  const headline = settings?.headline || 'Rooted in Local Craft, Made for Everyday Living';
  const body = settings?.body || 'At ZULF STORE, we bypass generic fast-fashion trends. Every seam, cut, and fabric is engineered to withstand Pakistani heat and humidity without sacrificing structure or dignity.';
  const buttonText = settings?.buttonText || 'Explore Modern Classics';
  const imageUrl = settings?.imageUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-2 items-center">
        <div className="p-8 sm:p-12 lg:p-16 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">
            {tag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 font-heading leading-tight">
            {headline}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            {body}
          </p>
          <button
            onClick={onAction}
            className="px-5 py-3 bg-zinc-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-full min-h-[320px] lg:min-h-[420px] bg-zinc-100 overflow-hidden">
          <img
            src={imageUrl}
            alt="ZULF Craft"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
};

// 5. CATEGORY TILES SECTION
const CategoryTilesSection: React.FC<{ settings: any; onSelectCategory: (cat: string) => void }> = ({
  onSelectCategory
}) => {
  const categories = [
    { name: 'Apparel & Kurtas', desc: 'Raw Linen & Breathable Cotton', img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80' },
    { name: 'Peshawari & Footwear', desc: 'Handcrafted KP Leather Soles', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80' },
    { name: 'Leather & Wallets', desc: 'Full-Grain RFID Protection', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">Categories</span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-heading mt-0.5">
          Shop by Essential Line
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div
            key={c.name}
            onClick={() => {
              onSelectCategory(c.name);
              const el = document.getElementById('products');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 cursor-pointer shadow-xs"
          >
            <img
              src={c.img}
              alt={c.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <h3 className="text-lg font-bold font-heading">{c.name}</h3>
              <p className="text-xs text-zinc-300 mt-0.5">{c.desc}</p>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white mt-3 group-hover:translate-x-1 transition-transform">
                <span>Browse Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. NEWSLETTER SIGNUP SECTION
const NewsletterSection: React.FC<{ settings: any }> = ({ settings }) => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const heading = settings?.heading || 'Join the ZULF Inner Circle';
  const subheading = settings?.subheading || 'Subscribe to receive private preview access, seasonal drops, and Rs. 500 off your first COD order.';
  const buttonText = settings?.buttonText || 'Claim Voucher';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-zinc-950 text-white rounded-2xl p-8 sm:p-12 text-center border border-zinc-800 shadow-xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
          Exclusive Perks
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
          {heading}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          {subheading}
        </p>

        {subscribed ? (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-200 rounded-lg max-w-md mx-auto text-xs">
            <p className="font-bold text-sm">Welcome to ZULF STORE!</p>
            <p className="mt-1">Use voucher code <strong>ZULF500</strong> during your checkout for Rs. 500 off.</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="px-4 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white flex-1"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shrink-0"
            >
              {buttonText}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
