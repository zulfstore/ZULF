import React, { useState } from 'react';
import { getSupabaseConfigStatus } from '../../lib/supabase';
import { Database, AlertTriangle, ChevronRight, X, ShieldAlert, Key } from 'lucide-react';

interface SetupBannerProps {
  onOpenSystemStatus?: () => void;
}

export const SetupBanner: React.FC<SetupBannerProps> = ({ onOpenSystemStatus }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const status = getSupabaseConfigStatus();

  if (isDismissed) return null;

  if (status.configured) {
    return null; // Silent if connected cleanly
  }

  return (
    <div className="bg-zinc-900 text-zinc-100 border-b border-zinc-800 text-xs px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <p className="text-zinc-200">
            <strong className="font-semibold text-white">Supabase Setup Notice:</strong> Running in local zero-latency test sandbox. Live database credentials (<code>VITE_SUPABASE_URL</code> & <code>VITE_SUPABASE_ANON_KEY</code>) are not configured.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onOpenSystemStatus && (
            <button
              onClick={onOpenSystemStatus}
              className="inline-flex items-center gap-1 font-medium text-amber-300 hover:text-amber-200 underline underline-offset-2 transition-colors cursor-pointer"
            >
              <span>View Connection Setup Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setIsDismissed(true)}
            className="text-zinc-400 hover:text-white p-0.5 rounded cursor-pointer"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
