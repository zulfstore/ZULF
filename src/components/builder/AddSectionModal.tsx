import React from 'react';
import { BuilderSection, SectionType } from '../../types';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Grid, 
  FileText, 
  LayoutGrid, 
  Mail, 
  Megaphone,
  Plus
} from 'lucide-react';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (section: BuilderSection) => void;
}

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onAddSection
}) => {
  if (!isOpen) return null;

  const templates: {
    type: SectionType;
    title: string;
    description: string;
    icon: React.ReactNode;
    defaultSettings: Record<string, any>;
  }[] = [
    {
      type: 'hero_banner',
      title: 'Hero Banner Showcase',
      description: 'High-impact full-width editorial visual with headline, CTA and image.',
      icon: <Sparkles className="w-5 h-5 text-zinc-900" />,
      defaultSettings: {
        badge: 'NEW SEASON 2026',
        headline: 'Minimal Craft. Made for Pakistan.',
        subheadline: 'Natural linens and handcrafted leather staples delivered nationwide.',
        primaryButtonText: 'Shop Essentials',
        heroImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
        alignment: 'center'
      }
    },
    {
      type: 'value_props',
      title: 'Trust Badges & Guarantees',
      description: 'Highlights Cash on Delivery, 2-4 days courier transit, and 7-day exchanges.',
      icon: <ShieldCheck className="w-5 h-5 text-zinc-900" />,
      defaultSettings: {
        items: [
          { icon: 'ShieldCheck', title: 'Cash On Delivery', description: 'Pay at your doorstep with exact change.' },
          { icon: 'Truck', title: '2-4 Days Dispatch', description: 'Tracked nationwide shipping via Trax/TCS.' },
          { icon: 'RefreshCw', title: '7-Day Easy Exchange', description: 'Hassle-free size and fitting replacements.' },
          { icon: 'Award', title: 'Master Craftsmanship', description: 'Tested against Pakistan heat & frequent washes.' }
        ]
      }
    },
    {
      type: 'featured_collection',
      title: 'Featured Collection Grid',
      description: 'Showcases curated products directly from your active catalog.',
      icon: <Grid className="w-5 h-5 text-zinc-900" />,
      defaultSettings: {
        title: 'Curated Essentials',
        subtitle: 'Hand-selected staples designed for daily comfort.',
        maxItems: 4
      }
    },
    {
      type: 'editorial_split',
      title: 'Storytelling Split Banner',
      description: 'Editorial brand storytelling side-by-side with an artisanal image.',
      icon: <FileText className="w-5 h-5 text-zinc-900" />,
      defaultSettings: {
        tag: 'ARTISANAL INTEGRITY',
        headline: 'Built to Outlast Seasonal Fads',
        body: 'Every cut and stitch is tailored from breathable long-staple cotton and natural vegetable-tanned hides.',
        buttonText: 'Read Our Story',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80'
      }
    },
    {
      type: 'category_tiles',
      title: 'Category Visual Grid',
      description: 'Visual category entry points for Kurtas, Footwear, and Leather.',
      icon: <LayoutGrid className="w-5 h-5 text-zinc-900" />,
      defaultSettings: {}
    },
    {
      type: 'newsletter_signup',
      title: 'Newsletter & Voucher Box',
      description: 'Collect customer emails in exchange for a Rs. 500 COD voucher.',
      icon: <Mail className="w-5 h-5 text-zinc-900" />,
      defaultSettings: {
        heading: 'Join the ZULF Inner Circle',
        subheading: 'Get Rs. 500 off your first COD order and early access to drops.',
        buttonText: 'Claim Voucher'
      }
    },
    {
      type: 'announcement_bar',
      title: 'Top Announcement Bar',
      description: 'Sticky header banner for delivery announcements & free shipping.',
      icon: <Megaphone className="w-5 h-5 text-zinc-900" />,
      defaultSettings: {
        text: 'FREE NATIONWIDE DELIVERY ON ORDERS OVER RS. 3,500 • CASH ON DELIVERY AVAILABLE',
        backgroundColor: '#18181B',
        textColor: '#FFFFFF'
      }
    }
  ];

  const handleSelectTemplate = (item: typeof templates[0]) => {
    const newSection: BuilderSection = {
      id: `sec-${Date.now().toString(36)}`,
      type: item.type,
      title: item.title,
      enabled: true,
      settings: item.defaultSettings
    };
    onAddSection(newSection);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-zinc-200 z-10 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Homepage Layout
            </span>
            <h3 className="text-base font-bold text-zinc-950 font-heading">
              Add a Whitelisted Section
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-black rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section List */}
        <div className="p-4 sm:p-5 overflow-y-auto divide-y divide-zinc-100 space-y-2">
          {templates.map((tpl) => (
            <div
              key={tpl.type}
              onClick={() => handleSelectTemplate(tpl)}
              className="p-3.5 rounded-lg border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition-all flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-zinc-100 rounded-lg group-hover:bg-white group-hover:shadow-xs transition-all shrink-0">
                  {tpl.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 group-hover:text-black">
                    {tpl.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {tpl.description}
                  </p>
                </div>
              </div>

              <span className="p-1.5 text-zinc-400 group-hover:text-zinc-950 transition-colors">
                <Plus className="w-4 h-4" />
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-50 border-t border-zinc-200 text-center">
          <p className="text-[11px] text-zinc-500">
            Layout changes are staged in draft until you confirm publication.
          </p>
        </div>

      </div>
    </div>
  );
};
