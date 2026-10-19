import React from 'react';
import { StoreSettings, ThemeTokens } from '../../types';
import { Palette, Type, Square, Sliders, Check } from 'lucide-react';

interface ThemeSettingsEditorProps {
  settings: StoreSettings;
  onUpdateTokens: (tokens: Partial<ThemeTokens>) => void;
  onUpdateIdentity: (identity: { store_name: string; store_tagline: string }) => void;
}

export const ThemeSettingsEditor: React.FC<ThemeSettingsEditorProps> = ({
  settings,
  onUpdateTokens,
  onUpdateIdentity
}) => {
  const tokens = settings.theme_tokens;

  const colorPresets = [
    { name: 'Charcoal Minimal', hex: '#18181B' },
    { name: 'Deep Pine', hex: '#064E3B' },
    { name: 'Classic Navy', hex: '#0F172A' },
    { name: 'Raw Espresso', hex: '#3E2723' },
    { name: 'Ochre Sand', hex: '#78350F' }
  ];

  const radiusOptions: { label: string; value: 'none' | 'sm' | 'md' | 'lg' | 'full' }[] = [
    { label: 'Sharp (0px)', value: 'none' },
    { label: 'Subtle (4px)', value: 'sm' },
    { label: 'Balanced (8px)', value: 'md' },
    { label: 'Rounded (12px)', value: 'lg' },
    { label: 'Full Pill', value: 'full' }
  ];

  return (
    <div className="space-y-6 text-xs text-zinc-700">
      {/* 1. Store Identity */}
      <div className="p-4 bg-white rounded-lg border border-zinc-200 space-y-3">
        <h4 className="font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
          <Type className="w-3.5 h-3.5 text-zinc-600" />
          <span>Store Brand Identity</span>
        </h4>

        <div>
          <label className="block font-semibold text-zinc-800 mb-1">
            Store Name
          </label>
          <input
            type="text"
            value={settings.store_name}
            onChange={(e) => onUpdateIdentity({ store_name: e.target.value, store_tagline: settings.store_tagline })}
            className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
          />
        </div>

        <div>
          <label className="block font-semibold text-zinc-800 mb-1">
            Tagline
          </label>
          <input
            type="text"
            value={settings.store_tagline}
            onChange={(e) => onUpdateIdentity({ store_name: settings.store_name, store_tagline: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
          />
        </div>
      </div>

      {/* 2. Brand Colors */}
      <div className="p-4 bg-white rounded-lg border border-zinc-200 space-y-3">
        <h4 className="font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
          <Palette className="w-3.5 h-3.5 text-zinc-600" />
          <span>Color Scheme (Minimalist White Baseline)</span>
        </h4>

        <div>
          <label className="block font-semibold text-zinc-800 mb-2">
            Primary Accent Color
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {colorPresets.map((c) => {
              const isSelected = tokens.primary_color === c.hex;
              return (
                <button
                  key={c.hex}
                  onClick={() => onUpdateTokens({ primary_color: c.hex })}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[11px] transition-all cursor-pointer ${
                    isSelected ? 'border-zinc-950 bg-zinc-50 font-bold' : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                  <span>{c.name}</span>
                  {isSelected && <Check className="w-3 h-3 ml-0.5 text-zinc-950" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-500">Custom Hex:</span>
            <input
              type="color"
              value={tokens.primary_color}
              onChange={(e) => onUpdateTokens({ primary_color: e.target.value })}
              className="w-8 h-8 rounded border border-zinc-200 p-0.5 cursor-pointer"
            />
            <span className="font-mono text-zinc-800">{tokens.primary_color}</span>
          </div>
        </div>
      </div>

      {/* 3. Button Border Radius */}
      <div className="p-4 bg-white rounded-lg border border-zinc-200 space-y-3">
        <h4 className="font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
          <Square className="w-3.5 h-3.5 text-zinc-600" />
          <span>Interactive Controls & Corner Radius</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {radiusOptions.map((opt) => {
            const isSelected = tokens.button_radius === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onUpdateTokens({ button_radius: opt.value })}
                className={`p-2.5 rounded border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-zinc-950 bg-zinc-900 text-white font-semibold'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
