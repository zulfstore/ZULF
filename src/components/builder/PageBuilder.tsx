import React, { useState } from 'react';
import { BuilderSection, StoreSettings, Product } from '../../types';
import { storeService } from '../../services/storeService';
import { SectionEditorModal } from './SectionEditorModal';
import { AddSectionModal } from './AddSectionModal';
import { ThemeSettingsEditor } from './ThemeSettingsEditor';
import { HomepageSectionRenderer } from '../storefront/HomepageSectionRenderer';
import { 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Sliders, 
  Trash2, 
  Plus, 
  Save, 
  Send, 
  Smartphone, 
  Tablet, 
  Monitor, 
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Palette,
  Layers,
  Undo2
} from 'lucide-react';

interface PageBuilderProps {
  settings: StoreSettings;
  products: Product[];
  onSettingsUpdated: (updated: StoreSettings) => void;
  onExitBuilder: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const PageBuilder: React.FC<PageBuilderProps> = ({
  settings,
  products,
  onSettingsUpdated,
  onExitBuilder,
  onSelectProduct,
  onQuickAdd
}) => {
  // Working sections start from draft if exists, else from current published
  const [sections, setSections] = useState<BuilderSection[]>(() => {
    return settings.draft_homepage_sections && settings.draft_homepage_sections.length > 0
      ? settings.draft_homepage_sections
      : settings.homepage_sections;
  });

  const [activeTab, setActiveTab] = useState<'sections' | 'theme'>('sections');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editingSection, setEditingSection] = useState<BuilderSection | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const hasDraftChanges = Boolean(settings.draft_homepage_sections);

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3000);
  };

  // Move section up/down
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setSections(updated);
  };

  // Toggle visibility
  const toggleVisibility = (id: string) => {
    setSections(prev =>
      prev.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  // Remove section
  const removeSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
  };

  // Add new section
  const handleAddSection = (newSec: BuilderSection) => {
    setSections(prev => [...prev, newSec]);
    showNotification(`Added section: ${newSec.title}`);
  };

  // Save updated section from modal
  const handleSaveSection = (updatedSec: BuilderSection) => {
    setSections(prev => prev.map(s => (s.id === updatedSec.id ? updatedSec : s)));
    setEditingSection(null);
  };

  // Save as Draft
  const handleSaveDraft = async () => {
    try {
      const updated = await storeService.saveDraftSections(sections);
      onSettingsUpdated(updated);
      showNotification('Draft layout saved successfully!');
    } catch {
      showNotification('Failed to save draft.');
    }
  };

  // Publish Draft with explicit confirmation
  const handleConfirmPublish = async () => {
    try {
      const updated = await storeService.publishDraftSections(sections);
      onSettingsUpdated(updated);
      setIsPublishConfirmOpen(false);
      showNotification('Published live to storefront!');
    } catch {
      showNotification('Failed to publish layout.');
    }
  };

  // Discard draft
  const handleDiscardDraft = async () => {
    try {
      const updated = await storeService.saveSettings({ draft_homepage_sections: null });
      setSections(updated.homepage_sections);
      onSettingsUpdated(updated);
      showNotification('Reverted to published storefront layout.');
    } catch {
      showNotification('Failed to revert.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      {/* 1. Top Builder Bar */}
      <div className="bg-zinc-950 text-white px-4 py-3 flex items-center justify-between border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitBuilder}
            className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-900 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Store</span>
          </button>

          <div className="h-4 w-px bg-zinc-800" />

          <div>
            <span className="text-xs font-bold font-heading text-white tracking-wide">
              Visual Homepage Builder
            </span>
            <span className="text-[10px] text-zinc-400 block -mt-0.5">
              Live Interactive Draft
            </span>
          </div>
        </div>

        {/* Viewport switcher */}
        <div className="hidden md:flex items-center bg-zinc-900 rounded-lg p-1 border border-zinc-800">
          <button
            onClick={() => setViewportMode('desktop')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              viewportMode === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
            title="Desktop 100%"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewportMode('tablet')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              viewportMode === 'tablet' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewportMode('mobile')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              viewportMode === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Actions: Save Draft & Publish */}
        <div className="flex items-center gap-2">
          {hasDraftChanges && (
            <button
              onClick={handleDiscardDraft}
              className="px-2.5 py-1.5 text-xs text-zinc-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
              title="Discard unpublished draft"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Discard Draft</span>
            </button>
          )}

          <button
            onClick={handleSaveDraft}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded-md text-xs font-semibold flex items-center gap-1.5 border border-zinc-700 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => setIsPublishConfirmOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Live</span>
          </button>
        </div>
      </div>

      {/* Status banner */}
      {statusNotification && (
        <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs px-4 py-2 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* 2. Main Builder Workspace: Left Sidebar + Live Preview Pane */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Controls */}
        <div className="w-80 sm:w-96 bg-white border-r border-zinc-200 flex flex-col shrink-0 shadow-xs z-10">
          {/* Tabs */}
          <div className="flex border-b border-zinc-200 bg-zinc-50 p-1">
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'sections' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-black'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sections ({sections.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'theme' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-black'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme Tokens</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'sections' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Active Layout Sequence
                  </span>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="text-xs font-semibold text-zinc-900 hover:text-black flex items-center gap-1 cursor-pointer bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section</span>
                  </button>
                </div>

                {/* Section List */}
                <div className="space-y-2">
                  {sections.map((sec, index) => (
                    <div
                      key={sec.id}
                      className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                        sec.enabled
                          ? 'bg-white border-zinc-200 shadow-xs'
                          : 'bg-zinc-50 border-zinc-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-mono text-zinc-500 shrink-0">
                          {index + 1}
                        </span>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-zinc-900 truncate">
                            {sec.title}
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-400 block truncate">
                            {sec.type}
                          </span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => moveSection(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-zinc-400 hover:text-black disabled:opacity-20 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveSection(index, 'down')}
                          disabled={index === sections.length - 1}
                          className="p-1 text-zinc-400 hover:text-black disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleVisibility(sec.id)}
                          className={`p-1 transition-colors cursor-pointer ${
                            sec.enabled ? 'text-zinc-600 hover:text-black' : 'text-zinc-400'
                          }`}
                          title={sec.enabled ? 'Hide from storefront' : 'Show on storefront'}
                        >
                          {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setEditingSection(sec)}
                          className="p-1 text-zinc-600 hover:text-black cursor-pointer"
                          title="Configure section settings"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeSection(sec.id)}
                          className="p-1 text-zinc-400 hover:text-rose-600 cursor-pointer"
                          title="Delete section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <ThemeSettingsEditor
                settings={settings}
                onUpdateTokens={(tokens) => {
                  storeService.updateThemeTokens(tokens).then(onSettingsUpdated);
                }}
                onUpdateIdentity={(identity) => {
                  storeService.saveSettings(identity).then(onSettingsUpdated);
                }}
              />
            )}
          </div>
        </div>

        {/* Right Preview Pane */}
        <div className="flex-1 bg-zinc-200/60 p-4 sm:p-6 overflow-y-auto flex items-start justify-center">
          <div
            className={`bg-[#FAFAFA] min-h-[90vh] shadow-xl border border-zinc-300 rounded-lg overflow-y-auto transition-all duration-300 ${
              viewportMode === 'mobile'
                ? 'w-[375px]'
                : viewportMode === 'tablet'
                ? 'w-[768px]'
                : 'w-full max-w-6xl'
            }`}
          >
            {/* Live Sections Render */}
            <HomepageSectionRenderer
              sections={sections}
              products={products}
              settings={settings}
              onSelectProduct={onSelectProduct}
              onQuickAdd={onQuickAdd}
              onNavigateCategory={() => {}}
            />
          </div>
        </div>

      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <SectionEditorModal
          section={editingSection}
          onClose={() => setEditingSection(null)}
          onSave={handleSaveSection}
        />
      )}

      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSection={handleAddSection}
      />

      {/* Confirmation Dialog for Publishing */}
      {isPublishConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center space-y-4 border border-zinc-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-zinc-950 font-heading">
              Confirm Publication to Storefront
            </h3>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Are you sure you want to publish these layout changes? The updated sections and order will immediately be served to all customers visiting ZULF STORE.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsPublishConfirmOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors cursor-pointer"
              >
                Keep as Draft
              </button>
              <button
                onClick={handleConfirmPublish}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md uppercase tracking-wider transition-colors cursor-pointer"
              >
                Yes, Publish Live
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
