import React, { useState } from 'react';
import { StoreSettings } from '../../types';
import { ShoppingBag, Search, Menu, X, Shield, Layout, Truck, Phone } from 'lucide-react';

interface HeaderProps {
  settings: StoreSettings;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenTracking: () => void;
  onOpenPolicy: (type: 'shipping' | 'return' | 'contact') => void;
  onNavigateCategory: (category: string) => void;
  onGoToAdmin: () => void;
  onGoToBuilder: () => void;
  activeView: 'storefront' | 'admin' | 'builder';
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenTracking,
  onOpenPolicy,
  onNavigateCategory,
  onGoToAdmin,
  onGoToBuilder,
  activeView
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Find announcement section from homepage sections
  const announcementSection = settings.homepage_sections?.find(
    s => s.type === 'announcement_bar' && s.enabled
  );

  const announcementText = announcementSection?.settings?.text || 
    'FREE NATIONWIDE DELIVERY ON ORDERS OVER RS. 3,500 • CASH ON DELIVERY AVAILABLE';
  const announcementBg = announcementSection?.settings?.backgroundColor || '#18181B';
  const announcementColor = announcementSection?.settings?.textColor || '#FFFFFF';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200/80 transition-all">
      {/* 1. Announcement Bar */}
      {announcementSection?.enabled !== false && (
        <div 
          style={{ backgroundColor: announcementBg, color: announcementColor }}
          className="text-[11px] font-medium tracking-wider text-center py-2 px-4 transition-colors"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{announcementText}</span>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-zinc-700 hover:text-black focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigateCategory('All Products'); }}
              className="group flex flex-col cursor-pointer"
            >
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 font-heading">
                {settings.store_name}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium -mt-0.5 hidden sm:block">
                {settings.store_tagline || 'Modern Essentials Pakistan'}
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-wider uppercase text-zinc-600">
              <button 
                onClick={() => onNavigateCategory('All Products')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Catalog
              </button>
              <button 
                onClick={() => onNavigateCategory('Apparel & Kurtas')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Kurtas & Shirts
              </button>
              <button 
                onClick={() => onNavigateCategory('Peshawari & Footwear')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Peshawari
              </button>
              <button 
                onClick={() => onNavigateCategory('Leather & Wallets')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Leather
              </button>
              <button 
                onClick={() => onOpenTracking()}
                className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track Order</span>
              </button>
            </nav>
          </div>

          {/* Right Action Icons & Modes */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
              title="Search store"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-zinc-800 hover:text-black hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-zinc-900 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="h-4 w-px bg-zinc-200 hidden sm:block"></div>

            {/* Mode Switches: Visual Builder & Admin Portal */}
            <div className="hidden md:flex items-center space-x-1.5">
              <button
                onClick={onGoToBuilder}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-all cursor-pointer ${
                  activeView === 'builder'
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'
                }`}
                title="Open Visual Homepage Builder"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Page Builder</span>
              </button>

              <button
                onClick={onGoToAdmin}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-all cursor-pointer ${
                  activeView === 'admin'
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'
                }`}
                title="Open Admin Orders & Products"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Suite</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <div className="space-y-1">
            <button
              onClick={() => { onNavigateCategory('All Products'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-sm font-medium text-zinc-900 border-b border-zinc-100"
            >
              All Products
            </button>
            <button
              onClick={() => { onNavigateCategory('Apparel & Kurtas'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-sm font-medium text-zinc-900 border-b border-zinc-100"
            >
              Kurtas & Apparel
            </button>
            <button
              onClick={() => { onNavigateCategory('Peshawari & Footwear'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-sm font-medium text-zinc-900 border-b border-zinc-100"
            >
              Peshawari Chappals
            </button>
            <button
              onClick={() => { onNavigateCategory('Leather & Wallets'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-sm font-medium text-zinc-900 border-b border-zinc-100"
            >
              Leather Goods
            </button>
            <button
              onClick={() => { onOpenTracking(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 w-full text-left py-2 text-sm font-medium text-zinc-900 border-b border-zinc-100"
            >
              <Truck className="w-4 h-4 text-zinc-500" />
              <span>Track Pakistani COD Order</span>
            </button>
          </div>

          <div className="pt-2 border-t border-zinc-200 flex flex-col gap-2">
            <button
              onClick={() => { onGoToBuilder(); setMobileMenuOpen(false); }}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-800 bg-zinc-100 rounded-md"
            >
              <Layout className="w-4 h-4" />
              <span>Open Visual Page Builder</span>
            </button>
            <button
              onClick={() => { onGoToAdmin(); setMobileMenuOpen(false); }}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-zinc-900 rounded-md"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Orders & Catalog</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
