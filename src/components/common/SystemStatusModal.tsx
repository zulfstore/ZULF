import React, { useState } from 'react';
import { getSupabaseConfigStatus } from '../../lib/supabase';
import { 
  X, 
  Database, 
  CreditCard, 
  Truck, 
  Copy, 
  Check, 
  AlertTriangle, 
  ExternalLink,
  Coins,
  ShieldCheck,
  FileCode
} from 'lucide-react';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const supabaseStatus = getSupabaseConfigStatus();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVar(label);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-zinc-200 z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              System Architecture & Readiness
            </span>
            <h3 className="text-base font-bold text-zinc-950 font-heading">
              ZULF STORE Setup & Integrations Status
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-black rounded hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-zinc-600">
          
          {/* Card 1: Budget Constraint */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-950 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span>Budget Constraint Audit: Under PKR 30,000</span>
              </span>
              <span className="bg-emerald-600 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded">
                100% Compliant
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Total upfront expenditure is currently <strong>PKR 0</strong>. Stack utilizes free tier serverless hosting (Vercel), free Supabase tier (Postgres + Auth + 1GB Storage), and zero payment gateway onboarding setup costs via Pakistan Cash on Delivery.
            </p>
          </div>

          {/* Card 2: Supabase Status */}
          <div className="p-4 bg-white border border-zinc-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-950 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-zinc-700" />
                <span>Supabase Database, Auth & Storage</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                supabaseStatus.configured 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {supabaseStatus.configured ? 'Connected' : 'Local Sandbox Engine'}
              </span>
            </div>

            {supabaseStatus.configured ? (
              <p className="text-zinc-600">
                Connected to Supabase endpoint: <code>{supabaseStatus.url}</code>. Products, orders, and authentication are stored in Postgres.
              </p>
            ) : (
              <div className="space-y-2">
                <p>
                  To switch from local sandbox storage to production Supabase Postgres:
                </p>
                <div className="p-3 bg-zinc-900 text-zinc-100 rounded-md font-mono text-[11px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span>VITE_SUPABASE_URL="https://your-project.supabase.co"</span>
                    <button
                      onClick={() => handleCopy('VITE_SUPABASE_URL=""', 'url')}
                      className="text-zinc-400 hover:text-white"
                    >
                      {copiedVar === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."</span>
                    <button
                      onClick={() => handleCopy('VITE_SUPABASE_ANON_KEY=""', 'key')}
                      className="text-zinc-400 hover:text-white"
                    >
                      {copiedVar === 'key' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-zinc-600 pt-1">
                  <FileCode className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>
                    SQL Migration script is ready at <code>/supabase/schema.sql</code>. Paste and run it in your Supabase SQL Editor.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Cash on Delivery vs PayFast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-950 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-zinc-700" />
                  <span>Cash on Delivery</span>
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Phase 1 (Active)
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-500">
                Operational nationwide across 100+ cities with stock reservation, fraud limit, and 03xx phone verification.
              </p>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-950 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-zinc-700" />
                  <span>PayFast Online Cards</span>
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                  Phase 2 (Pending)
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-500">
                Awaiting official merchant onboarding. Requires Merchant ID & Secured Key before activating digital checkout.
              </p>
            </div>
          </div>

          {/* Card 4: Couriers & CSV Booking */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2">
            <span className="font-bold text-zinc-950 block">Courier Integration Strategy:</span>
            <p className="leading-relaxed">
              Until official API keys for Trax Logistics or Leopards are entered, the store provides an <strong>Export Courier CSV</strong> action in the Orders Manager. You can import this CSV directly into Trax/Leopard portals for bulk booking without error or manual typing.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-950 hover:bg-black text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
