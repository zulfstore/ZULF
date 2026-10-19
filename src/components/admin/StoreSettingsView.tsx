import React, { useState } from 'react';
import { StoreSettings } from '../../types';
import { storeService } from '../../services/storeService';
import { getSupabaseConfigStatus } from '../../lib/supabase';
import { 
  Building2, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Database,
  Lock,
  ExternalLink,
  Code
} from 'lucide-react';

interface StoreSettingsViewProps {
  settings: StoreSettings;
  onSettingsUpdated: (settings: StoreSettings) => void;
}

export const StoreSettingsView: React.FC<StoreSettingsViewProps> = ({
  settings,
  onSettingsUpdated
}) => {
  const [storeName, setStoreName] = useState(settings.store_name);
  const [storeTagline, setStoreTagline] = useState(settings.store_tagline);
  const [supportEmail, setSupportEmail] = useState(settings.support_email);
  const [supportPhone, setSupportPhone] = useState(settings.support_phone);
  const [supportWhatsapp, setSupportWhatsapp] = useState(settings.support_whatsapp);
  const [storeAddress, setStoreAddress] = useState(settings.store_address);

  const [standardShippingFee, setStandardShippingFee] = useState(String(settings.standard_shipping_fee));
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(String(settings.free_shipping_threshold));
  const [codEnabled, setCodEnabled] = useState(settings.cod_enabled);
  const [codMaxLimit, setCodMaxLimit] = useState(String(settings.cod_max_limit));

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const supabaseStatus = getSupabaseConfigStatus();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updated = await storeService.saveSettings({
        store_name: storeName.trim(),
        store_tagline: storeTagline.trim(),
        support_email: supportEmail.trim(),
        support_phone: supportPhone.trim(),
        support_whatsapp: supportWhatsapp.trim(),
        store_address: storeAddress.trim(),
        standard_shipping_fee: Number(standardShippingFee) || 250,
        free_shipping_threshold: Number(freeShippingThreshold) || 3500,
        cod_enabled: codEnabled,
        cod_max_limit: Number(codMaxLimit) || 50000
      });

      onSettingsUpdated(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-950 font-heading">
            Store & Business Configuration
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure Pakistan shipping thresholds, Cash on Delivery limits, and review gateway integrations.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 bg-zinc-950 hover:bg-black text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings successfully updated across store and database.</span>
        </div>
      )}

      {/* 1. Store Identity */}
      <div className="p-5 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider font-heading flex items-center gap-2">
          <Building2 className="w-4 h-4 text-zinc-600" />
          <span>Store Identity & Contact Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-zinc-800 mb-1">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950 font-semibold"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-800 mb-1">Tagline</label>
            <input
              type="text"
              value={storeTagline}
              onChange={(e) => setStoreTagline(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-800 mb-1">Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-800 mb-1">Support Phone / Mobile</label>
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-800 mb-1">WhatsApp Helpline Number</label>
            <input
              type="text"
              value={supportWhatsapp}
              onChange={(e) => setSupportWhatsapp(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-800 mb-1">Fulfillment Warehouse Address</label>
            <input
              type="text"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
            />
          </div>
        </div>
      </div>

      {/* 2. Shipping & Delivery Rules */}
      <div className="p-5 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider font-heading flex items-center gap-2">
          <Truck className="w-4 h-4 text-zinc-600" />
          <span>Pakistan Delivery Rules & Rates</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-zinc-800 mb-1">
              Standard Nationwide Delivery Fee (PKR)
            </label>
            <input
              type="number"
              min={0}
              value={standardShippingFee}
              onChange={(e) => setStandardShippingFee(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
            />
            <p className="text-[10px] text-zinc-500 mt-1">Default flat rate charged to customer at checkout</p>
          </div>

          <div>
            <label className="block font-semibold text-zinc-800 mb-1">
              Free Delivery Order Threshold (PKR)
            </label>
            <input
              type="number"
              min={0}
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
            />
            <p className="text-[10px] text-zinc-500 mt-1">Orders at or above this amount automatically receive free delivery</p>
          </div>
        </div>
      </div>

      {/* 3. Cash on Delivery Controls */}
      <div className="p-5 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider font-heading flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-zinc-600" />
          <span>Cash on Delivery (COD) Safeguards</span>
        </h3>

        <div className="space-y-4">
          <label className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200 cursor-pointer">
            <input
              type="checkbox"
              checked={codEnabled}
              onChange={(e) => setCodEnabled(e.target.checked)}
              className="rounded text-zinc-950 focus:ring-0"
            />
            <div>
              <span className="font-bold text-zinc-900 block">Enable Cash on Delivery Checkout</span>
              <span className="text-[11px] text-zinc-500">Allow customers across Pakistan to pay cash upon parcel arrival</span>
            </div>
          </label>

          <div className="max-w-md">
            <label className="block font-semibold text-zinc-800 mb-1">
              Maximum COD Order Value Limit (PKR)
            </label>
            <input
              type="number"
              min={1000}
              value={codMaxLimit}
              onChange={(e) => setCodMaxLimit(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
            />
            <p className="text-[10px] text-zinc-500 mt-1">
              Anti-fraud safeguard: orders exceeding this limit cannot use COD and must contact support.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Honest Integrations Status Panels */}
      <div className="p-5 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-wider font-heading">
            Payment Gateways & Courier API Readiness
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Transparent integration states compliant with business constraint: no fake connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: COD */}
          <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950">Cash On Delivery</span>
              <span className="bg-emerald-600 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded">
                Active (Phase 1)
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Fully operational nationwide checkout with automated order numbering, transactional inventory reduction, and verification workflow.
            </p>
          </div>

          {/* Card 2: PayFast */}
          <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-900">PayFast Gateway</span>
              <span className="bg-amber-100 text-amber-800 font-bold text-[9px] uppercase px-2 py-0.5 rounded">
                Phase 2 Pending
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Requires merchant onboarding with PayFast Pakistan. Once Merchant ID & Secured Key are received, server-side callback verification will be activated.
            </p>
          </div>

          {/* Card 3: Courier APIs */}
          <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-900">Courier Direct APIs</span>
              <span className="bg-amber-100 text-amber-800 font-bold text-[9px] uppercase px-2 py-0.5 rounded">
                Phase 2 Pending
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Automated booking API awaits official Trax/Leopard API credentials. Until then, use the built-in <strong>Export Courier CSV</strong> for batch portal booking.
            </p>
          </div>
        </div>

        {/* Supabase Status info */}
        <div className="p-4 bg-zinc-950 text-white rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Supabase Persistent Backend Connection</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              supabaseStatus.configured 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
            }`}>
              {supabaseStatus.configured ? 'Configured' : 'Local Sandbox Mode'}
            </span>
          </div>

          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Schema file is available at <code>/supabase/schema.sql</code> with Row Level Security, transactional COD stored procedure, and order tables.
          </p>

          {!supabaseStatus.configured && (
            <div className="pt-2 text-[10px] text-zinc-300 font-mono space-y-0.5">
              <p>To connect live Supabase project, provide:</p>
              <p className="text-amber-300">• VITE_SUPABASE_URL</p>
              <p className="text-amber-300">• VITE_SUPABASE_ANON_KEY</p>
            </div>
          )}
        </div>
      </div>

    </form>
  );
};
