import React, { useState } from 'react';
import { BuilderSection } from '../../types';
import { X, Save, AlertCircle } from 'lucide-react';

interface SectionEditorModalProps {
  section: BuilderSection | null;
  onClose: () => void;
  onSave: (updatedSection: BuilderSection) => void;
}

export const SectionEditorModal: React.FC<SectionEditorModalProps> = ({
  section,
  onClose,
  onSave
}) => {
  if (!section) return null;

  const [settings, setSettings] = useState<Record<string, any>>({ ...section.settings });
  const [sectionTitle, setSectionTitle] = useState(section.title);

  const handleTextChange = (key: string, val: any) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...section,
      title: sectionTitle,
      settings
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-zinc-200 z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
              Section Type: {section.type}
            </span>
            <h3 className="text-base font-bold text-zinc-950 font-heading">
              Edit Section Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-black rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Internal Label
            </label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-900"
            />
          </div>

          {/* Conditional Fields based on section type */}
          {section.type === 'announcement_bar' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Ticker Message
                </label>
                <input
                  type="text"
                  value={settings.text || ''}
                  onChange={(e) => handleTextChange('text', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={settings.backgroundColor || '#18181B'}
                    onChange={(e) => handleTextChange('backgroundColor', e.target.value)}
                    className="w-full h-9 p-1 border border-zinc-200 rounded-md cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={settings.textColor || '#FFFFFF'}
                    onChange={(e) => handleTextChange('textColor', e.target.value)}
                    className="w-full h-9 p-1 border border-zinc-200 rounded-md cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {section.type === 'hero_banner' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Small Tag / Badge
                </label>
                <input
                  type="text"
                  value={settings.badge || ''}
                  onChange={(e) => handleTextChange('badge', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={settings.headline || ''}
                  onChange={(e) => handleTextChange('headline', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Sub-headline
                </label>
                <textarea
                  rows={2}
                  value={settings.subheadline || ''}
                  onChange={(e) => handleTextChange('subheadline', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={settings.primaryButtonText || ''}
                  onChange={(e) => handleTextChange('primaryButtonText', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={settings.heroImageUrl || ''}
                  onChange={(e) => handleTextChange('heroImageUrl', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
            </div>
          )}

          {section.type === 'featured_collection' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={settings.title || ''}
                  onChange={(e) => handleTextChange('title', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={settings.subtitle || ''}
                  onChange={(e) => handleTextChange('subtitle', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Maximum Products to Show
                </label>
                <input
                  type="number"
                  min={2}
                  max={12}
                  value={settings.maxItems || 4}
                  onChange={(e) => handleTextChange('maxItems', Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
            </div>
          )}

          {section.type === 'editorial_split' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Pre-headline Tag
                </label>
                <input
                  type="text"
                  value={settings.tag || ''}
                  onChange={(e) => handleTextChange('tag', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={settings.headline || ''}
                  onChange={(e) => handleTextChange('headline', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Story Copy
                </label>
                <textarea
                  rows={3}
                  value={settings.body || ''}
                  onChange={(e) => handleTextChange('body', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={settings.buttonText || ''}
                  onChange={(e) => handleTextChange('buttonText', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={settings.imageUrl || ''}
                  onChange={(e) => handleTextChange('imageUrl', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
            </div>
          )}

          {section.type === 'newsletter_signup' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  value={settings.heading || ''}
                  onChange={(e) => handleTextChange('heading', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Subheading
                </label>
                <textarea
                  rows={2}
                  value={settings.subheading || ''}
                  onChange={(e) => handleTextChange('subheading', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={settings.buttonText || ''}
                  onChange={(e) => handleTextChange('buttonText', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md"
                />
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-zinc-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-black transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-950 text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
