import React, { useState } from 'react';
import { supabase, isSupabaseConfigured, getSupabaseConfigStatus } from '../../lib/supabase';
import { Shield, Key, Lock, AlertCircle, ArrowRight, CheckCircle2, Database } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onSuccess: (email: string) => void;
  onCancel: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onSuccess,
  onCancel
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState('admin@zulfstore.com');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabaseStatus = getSupabaseConfigStatus();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (error) {
          setErrorMessage(error.message);
          setIsSubmitting(false);
          return;
        }

        if (data.user) {
          onSuccess(data.user.email || email);
          setIsSubmitting(false);
          return;
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Supabase authentication failed');
        setIsSubmitting(false);
        return;
      }
    }

    // Local sandbox authentication fallback
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(email);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0" onClick={onCancel} />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-zinc-200 z-10 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-full bg-zinc-950 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-zinc-950 font-heading">
            ZULF STORE Merchant Portal
          </h3>
          <p className="text-xs text-zinc-500">
            Secure admin authentication for catalog, orders & settings.
          </p>
        </div>

        {/* Database Status Callout */}
        {!supabaseStatus.configured ? (
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-800 font-semibold">
              <Database className="w-3.5 h-3.5 text-zinc-600" />
              <span>Sandbox Auth Mode</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Live Supabase credentials are not set in environment variables. You can sign in immediately with any credentials to preview and test the complete management suite.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Supabase Auth Connected ({supabaseStatus.url})</span>
          </div>
        )}

        {/* Error notice */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
              placeholder="admin@zulfstore.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Password
            </label>
            <input
              type="password"
              required={supabaseStatus.configured}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
              placeholder={supabaseStatus.configured ? 'Enter your Supabase password' : 'Enter any password for demo'}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-zinc-950 text-white rounded-md font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Session...</span>
              </>
            ) : (
              <>
                <span>Access Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-zinc-100 flex justify-center">
          <button
            onClick={onCancel}
            className="text-xs text-zinc-500 hover:text-black transition-colors cursor-pointer"
          >
            Return to Storefront
          </button>
        </div>

      </div>
    </div>
  );
};
