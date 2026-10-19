import React, { useState } from 'react';
import { Product, ProductVariant } from '../../types';
import { storeService } from '../../services/storeService';
import { uploadProductImage, isSupabaseConfigured } from '../../lib/supabase';
import { formatPKR, slugify } from '../../lib/utils';
import { PRODUCT_CATEGORIES } from '../../lib/constants';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  X, 
  Check, 
  AlertCircle,
  Eye,
  EyeOff,
  Star,
  Layers,
  Database
} from 'lucide-react';

interface ProductManagerProps {
  products: Product[];
  onProductsUpdated: (products: Product[]) => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  products,
  onProductsUpdated
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All Products' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleToggleActive = async (product: Product) => {
    try {
      const updated = await storeService.saveProduct({
        ...product,
        is_active: !product.is_active
      });
      const all = await storeService.getAllProducts();
      onProductsUpdated(all);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete/archive this product?')) {
      await storeService.deleteProduct(id);
      const all = await storeService.getAllProducts();
      onProductsUpdated(all);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-950 font-heading">
            Product Catalog Management
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Total {products.length} products • Manage SKU, PKR prices, stock levels & image gallery.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsCreateModalOpen(true);
          }}
          className="px-4 py-2.5 bg-zinc-950 hover:bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-lg border border-zinc-200">
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-zinc-950 cursor-pointer"
          >
            {PRODUCT_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Products Table */}
      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price (PKR)</th>
                <th className="py-3 px-3">Stock Level</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOutOfStock = p.inventory_quantity <= 0;
                  const isLowStock = !isOutOfStock && p.inventory_quantity <= 5;

                  return (
                    <tr key={p.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=80'}
                            alt=""
                            className="w-10 h-12 object-cover rounded bg-zinc-100 border border-zinc-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-zinc-900 line-clamp-1">{p.title}</p>
                            <p className="text-[10px] text-zinc-400">
                              {p.variants?.length ? `${p.variants.length} variant options` : 'Standard product'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono text-zinc-600 font-semibold">{p.sku}</td>

                      <td className="py-3 px-3 text-zinc-700">{p.category}</td>

                      <td className="py-3 px-3">
                        <span className="font-bold text-zinc-950">{formatPKR(p.price_pkr)}</span>
                        {p.compare_at_price_pkr && (
                          <span className="text-[10px] text-zinc-400 line-through block">
                            {formatPKR(p.compare_at_price_pkr)}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          isOutOfStock
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isLowStock
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {p.inventory_quantity} in stock
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                            p.is_active
                              ? 'bg-zinc-900 text-white'
                              : 'bg-zinc-200 text-zinc-600'
                          }`}
                          title="Toggle active status on storefront"
                        >
                          {p.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{p.is_active ? 'Active' : 'Draft'}</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsCreateModalOpen(true);
                            }}
                            className="p-1.5 text-zinc-600 hover:text-black rounded hover:bg-zinc-100 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 rounded hover:bg-zinc-100 transition-colors cursor-pointer"
                            title="Delete / Archive Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Product Create / Edit Modal */}
      {isCreateModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={async (saved) => {
            await storeService.saveProduct(saved);
            const all = await storeService.getAllProducts();
            onProductsUpdated(all);
            setIsCreateModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}

    </div>
  );
};

// PRODUCT FORM MODAL
interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Partial<Product> & { title: string; price_pkr: number }) => Promise<void>;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  onClose,
  onSave
}) => {
  const isEditing = Boolean(product);

  const [title, setTitle] = useState(product?.title || '');
  const [sku, setSku] = useState(product?.sku || `ZLF-${Math.floor(1000 + Math.random() * 9000)}`);
  const [category, setCategory] = useState(product?.category || 'Apparel & Kurtas');
  const [description, setDescription] = useState(product?.description || '');
  const [pricePkr, setPricePkr] = useState(product ? String(product.price_pkr) : '2450');
  const [comparePricePkr, setComparePricePkr] = useState(product?.compare_at_price_pkr ? String(product.compare_at_price_pkr) : '');
  const [inventoryQuantity, setInventoryQuantity] = useState(product ? String(product.inventory_quantity) : '20');
  const [isActive, setIsActive] = useState(product?.is_active !== undefined ? product.is_active : true);
  const [isFeatured, setIsFeatured] = useState(Boolean(product?.is_featured));
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Variants state
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants || [
    { name: 'Size', options: ['Small', 'Medium', 'Large', 'XL'] }
  ]);
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantOptions, setNewVariantOptions] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  // Handle image file upload to Supabase Storage bucket 'product-images'
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    const res = await uploadProductImage(file);
    setIsUploading(false);

    if (res.error) {
      setUploadError(res.error);
    } else if (res.url) {
      setImages(prev => [...prev, res.url!]);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages(prev => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddVariant = () => {
    if (newVariantName.trim() && newVariantOptions.trim()) {
      const optionsArray = newVariantOptions
        .split(',')
        .map(o => o.trim())
        .filter(Boolean);

      setVariants(prev => [
        ...prev,
        { name: newVariantName.trim(), options: optionsArray }
      ]);
      setNewVariantName('');
      setNewVariantOptions('');
    }
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !pricePkr) return;

    setIsSaving(true);
    try {
      await onSave({
        id: product?.id,
        title: title.trim(),
        sku: sku.trim(),
        slug: slugify(title),
        category,
        description: description.trim(),
        price_pkr: Number(pricePkr),
        compare_at_price_pkr: comparePricePkr ? Number(comparePricePkr) : undefined,
        inventory_quantity: Number(inventoryQuantity) || 0,
        is_active: isActive,
        is_featured: isFeatured,
        images: images.length > 0 ? images : [
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
        ],
        variants
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-zinc-200 z-10 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Catalog Management
            </span>
            <h3 className="text-base font-bold text-zinc-950 font-heading">
              {isEditing ? `Edit: ${product?.title}` : 'Add New Product'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-black rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Row 1: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Raw Linen Kurta — Charcoal"
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950 cursor-pointer font-medium"
              >
                {PRODUCT_CATEGORIES.filter(c => c !== 'All Products').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: SKU, Price in PKR, Compare-at Price, Inventory */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                SKU <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Price in PKR <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={pricePkr}
                onChange={(e) => setPricePkr(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Compare-at Price (PKR)
              </label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 3200"
                value={comparePricePkr}
                onChange={(e) => setComparePricePkr(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-800 mb-1">
                Inventory Stock <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={inventoryQuantity}
                onChange={(e) => setInventoryQuantity(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
              />
            </div>
          </div>

          {/* Row 3: Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1">
              Description & Fabric Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the materials, fit, care instructions and Pakistani styling advice..."
              className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-950"
            />
          </div>

          {/* Row 4: Image Gallery & Supabase Storage */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Product Image Gallery
              </label>
              <span className="text-[11px] text-zinc-500">
                Supabase Storage Bucket: <code>product-images</code>
              </span>
            </div>

            {uploadError && (
              <p className="text-xs text-rose-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{uploadError}</span>
              </p>
            )}

            {/* Upload control */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="border-2 border-dashed border-zinc-200 hover:border-zinc-900 rounded-lg p-3 text-center cursor-pointer transition-colors flex flex-col items-center justify-center bg-zinc-50/50">
                <Upload className="w-5 h-5 text-zinc-500 mb-1" />
                <span className="text-xs font-semibold text-zinc-800">
                  {isUploading ? 'Uploading to Storage...' : 'Upload Image (JPG/PNG/WEBP)'}
                </span>
                <span className="text-[10px] text-zinc-400">Max size 5MB</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              <div className="flex flex-col justify-between">
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                  Or add image by URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2.5 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group w-16 h-20 rounded border border-zinc-200 overflow-hidden bg-zinc-100">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/75 hover:bg-rose-600 text-white rounded transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] text-center uppercase tracking-wider py-0.5">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 5: Variants */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Product Variants (Sizes & Colors)
            </label>

            <div className="space-y-2">
              {variants.map((v, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-zinc-50 border border-zinc-200 rounded-md text-xs">
                  <div>
                    <span className="font-bold text-zinc-900">{v.name}:</span>{' '}
                    <span className="text-zinc-600">{v.options.join(', ')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="text-zinc-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add variant input */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="text"
                placeholder="Variant Name (e.g. Size)"
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
                className="w-full sm:w-1/3 px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-md"
              />
              <input
                type="text"
                placeholder="Options comma-separated (e.g. S, M, L, XL)"
                value={newVariantOptions}
                onChange={(e) => setNewVariantOptions(e.target.value)}
                className="w-full sm:flex-1 px-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-md"
              />
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0"
              >
                Add Variant
              </button>
            </div>
          </div>

          {/* Row 6: Toggles */}
          <div className="flex items-center gap-6 pt-3 border-t border-zinc-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-800">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-zinc-950 focus:ring-0"
              />
              <span>Active on Storefront</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-800">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-zinc-950 focus:ring-0"
              />
              <span>Feature on Homepage</span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-zinc-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-black cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-zinc-950 text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving Product...' : 'Save Product'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
