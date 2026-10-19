import React from 'react';
import { StoreSettings } from '../../types';
import { Truck, ShieldCheck, Mail, Phone, MapPin, RefreshCw, MessageSquare } from 'lucide-react';
import { createWhatsAppLink } from '../../lib/utils';

interface FooterProps {
  settings: StoreSettings;
  onOpenPolicy: (type: 'shipping' | 'return' | 'contact') => void;
  onOpenTracking: () => void;
  onNavigateCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenPolicy,
  onOpenTracking,
  onNavigateCategory
}) => {
  const whatsappUrl = createWhatsAppLink(
    settings.support_whatsapp || '03001234567',
    'Hello ZULF STORE team, I have a query regarding an order.'
  );

  return (
    <footer className="bg-white border-t border-zinc-200 mt-20 text-zinc-600">
      {/* 1. Value Badges Grid */}
      <div className="border-b border-zinc-100 py-10 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg border border-zinc-200 text-zinc-900 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Nationwide Delivery</h4>
                <p className="text-xs text-zinc-500 mt-0.5">2-4 business days across all Pakistani cities</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg border border-zinc-200 text-zinc-900 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Cash on Delivery</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Pay safely at your doorstep with exact change</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg border border-zinc-200 text-zinc-900 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">7-Day Easy Exchange</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Hassle-free size and fitting replacements</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg border border-zinc-200 text-zinc-900 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">WhatsApp Helpline</h4>
                <p className="text-xs text-zinc-500 mt-0.5">Mon - Sat (10 AM - 7 PM PKT)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand & Store Info */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-2xl font-bold tracking-tight text-zinc-900 font-heading block">
              {settings.store_name}
            </span>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              {settings.store_tagline || 'Modern Essentials for Pakistan'}. Focused on authentic local craftsmanship, natural breathable fabrics, and enduring minimalist staples built for daily Pakistani life.
            </p>
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2 text-zinc-600">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>{settings.store_address}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600">
                <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <a href={`mailto:${settings.support_email}`} className="hover:text-black transition-colors">
                  {settings.support_email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-zinc-600">
                <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>{settings.support_phone}</span>
              </div>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Collections</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigateCategory('All Products')} className="hover:text-black transition-colors">
                  All Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateCategory('Apparel & Kurtas')} className="hover:text-black transition-colors">
                  Kurtas & Linen Shirts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateCategory('Peshawari & Footwear')} className="hover:text-black transition-colors">
                  Handmade Peshawari
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateCategory('Everyday Essentials')} className="hover:text-black transition-colors">
                  Everyday Cotton Tees
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateCategory('Leather & Wallets')} className="hover:text-black transition-colors">
                  Leather Wallets & Bags
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Customer Care</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenTracking} className="hover:text-black transition-colors font-medium text-zinc-900">
                  Track COD Order
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('shipping')} className="hover:text-black transition-colors">
                  Shipping & Courier Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('return')} className="hover:text-black transition-colors">
                  Return & Exchange (7 Days)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('contact')} className="hover:text-black transition-colors">
                  Helpline & Complaints
                </button>
              </li>
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 text-emerald-800 font-medium transition-colors">
                  WhatsApp Support Live
                </a>
              </li>
            </ul>
          </div>

          {/* Payment & Logistics Badges */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Pakistan Operations</h5>
            <div className="space-y-2 text-[11px] text-zinc-500">
              <div className="p-2.5 bg-zinc-50 rounded border border-zinc-200">
                <p className="font-semibold text-zinc-800">Primary Payment:</p>
                <p className="text-emerald-700 font-medium">Cash On Delivery (Active)</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Pay at doorstep across Pakistan</p>
              </div>

              <div className="p-2.5 bg-zinc-50 rounded border border-zinc-200">
                <p className="font-semibold text-zinc-800">Courier Network:</p>
                <p className="text-zinc-600">Trax • TCS • Leopards • Call Courier</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Copyright */}
      <div className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {settings.store_name}. All rights reserved.</p>
          <p className="text-[11px] text-zinc-600">
            Engineered for Pakistan • Flat Delivery PKR {settings.standard_shipping_fee} (Free above PKR {settings.free_shipping_threshold.toLocaleString()})
          </p>
        </div>
      </div>
    </footer>
  );
};
