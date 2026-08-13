import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  Star,
  Eye,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { Product, Category } from '../../types';
import { api } from '../../services/api';
import { ImageUploader } from '../../components/ImageUploader';

interface AdminProductsProps {
  products?: Product[];
  categories?: Category[];
  onRefresh?: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products = [],
  categories = [],
  onRefresh = () => {}
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: categories[0]?.id || '',
    brand: '',
    shortDescription: '',
    description: '',
    price: 0,
    discountPrice: 0,
    stock: 10,
    availability: 'Available' as Product['availability'],
    featured: false,
    isNew: true,
    badge: '',
    images: [''] as string[],
    specifications: {} as Record<string, string>,
    sizesStr: '',
    colorsStr: '',
    tagsStr: ''
  });

  // Specs helper state
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');

  const filteredProducts = products.filter(p => {
    const matchCat = categoryFilter === 'all' || p.categoryId === categoryFilter;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `MS-PRD-${Math.floor(100 + Math.random() * 900)}`,
      categoryId: categories[0]?.id || '',
      brand: '',
      shortDescription: '',
      description: '',
      price: 1000,
      discountPrice: 0,
      stock: 20,
      availability: 'Available',
      featured: false,
      isNew: true,
      badge: '',
      images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'],
      specifications: {},
      sizesStr: '',
      colorsStr: '',
      tagsStr: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      categoryId: p.categoryId,
      brand: p.brand || '',
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      price: p.price,
      discountPrice: p.discountPrice || 0,
      stock: p.stock,
      availability: p.availability,
      featured: p.featured,
      isNew: p.isNew,
      badge: p.badge || '',
      images: p.images?.length ? [...p.images] : [''],
      specifications: p.specifications || {},
      sizesStr: p.sizes?.join(', ') || '',
      colorsStr: p.colors?.join(', ') || '',
      tagsStr: p.tags?.join(', ') || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  const handleToggleFeatured = async (p: Product) => {
    try {
      await api.updateProduct(p.id, { featured: !p.featured });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.categoryId) {
      alert('Product Name and Category are required.');
      return;
    }

    try {
      setLoading(true);

      const cleanedImages = formData.images.filter(img => img.trim() !== '');

      const payload = {
        name: formData.name,
        sku: formData.sku,
        categoryId: formData.categoryId,
        brand: formData.brand,
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock),
        availability: formData.availability,
        featured: formData.featured,
        isNew: formData.isNew,
        badge: formData.badge,
        images: cleanedImages.length ? cleanedImages : ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'],
        specifications: formData.specifications,
        sizes: formData.sizesStr ? formData.sizesStr.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: formData.colorsStr ? formData.colorsStr.split(',').map(c => c.trim()).filter(Boolean) : [],
        tags: formData.tagsStr ? formData.tagsStr.split(',').map(t => t.trim()).filter(Boolean) : []
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
      } else {
        await api.createProduct(payload);
      }

      setLoading(false);
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setLoading(false);
      alert(err.message || 'Failed to save product.');
    }
  };

  // Specs helper
  const addSpec = () => {
    if (!specKey.trim()) return;
    setFormData(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [specKey.trim()]: specVal.trim() }
    }));
    setSpecKey('');
    setSpecVal('');
  };

  const removeSpec = (key: string) => {
    setFormData(prev => {
      const copy = { ...prev.specifications };
      delete copy[key];
      return { ...prev, specifications: copy };
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700 border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Product</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price (ETB)</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Availability</th>
                <th className="p-3.5">Featured</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&auto=format&fit=crop&q=80'}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                      />
                      <div>
                        <span className="font-bold text-stone-900 block truncate max-w-[200px]">{p.name}</span>
                        {p.brand && <span className="text-[10px] text-stone-400">{p.brand}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono font-semibold text-stone-600">{p.sku}</td>
                  <td className="p-3.5 font-medium text-emerald-800">{p.categoryName}</td>
                  <td className="p-3.5 font-bold text-stone-900">
                    {p.discountPrice ? (
                      <div>
                        <span>ETB {p.discountPrice.toLocaleString()}</span>
                        <span className="block text-[10px] text-stone-400 line-through">ETB {p.price.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span>ETB {p.price.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="p-3.5 font-bold">{p.stock}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.availability === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {p.availability}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        p.featured ? 'bg-amber-100 text-amber-700' : 'text-stone-300 hover:text-stone-500'
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-100">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h2 className="text-lg font-black text-stone-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              {/* Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">SKU / Product Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono font-medium"
                  />
                </div>
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Mercy Glow / Mercy Build"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Price, Discount Price, Stock, Availability */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price (ETB) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Price</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discountPrice}
                    onChange={e => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Availability</label>
                  <select
                    value={formData.availability}
                    onChange={e => setFormData({ ...formData, availability: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  >
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Pre-order">Pre-order</option>
                  </select>
                </div>
              </div>

              {/* Badges & Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-emerald-700 focus:ring-emerald-600"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={e => setFormData({ ...formData, isNew: e.target.checked })}
                    className="rounded text-emerald-700 focus:ring-emerald-600"
                  />
                  <span>Mark as New</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-700">Badge Label:</span>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              {/* Product Images Uploader */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-stone-800 text-xs uppercase tracking-wider">
                    Product Images ({formData.images.length})
                  </label>
                  <span className="text-[11px] text-stone-500">
                    Upload from your device or enter image URLs
                  </span>
                </div>

                <div className="space-y-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative bg-stone-50/50 p-3 rounded-2xl border border-stone-200/80">
                      <ImageUploader
                        label={idx === 0 ? "Main Cover Image" : `Additional Image #${idx + 1}`}
                        value={img}
                        description={idx === 0 ? "Primary image shown in product listings." : undefined}
                        onChange={(url) => {
                          const newImgs = [...formData.images];
                          newImgs[idx] = url;
                          setFormData({ ...formData, images: newImgs });
                        }}
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newImgs = formData.images.filter((_, i) => i !== idx);
                            setFormData({ ...formData, images: newImgs });
                          }}
                          className="mt-2 text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Remove Image #{idx + 1}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl border border-dashed border-stone-300 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-emerald-700" />
                  <span>+ Add Another Product Image</span>
                </button>
              </div>

              {/* Specifications */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="block font-bold text-stone-700">Technical Specifications</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Key (e.g. Volume)"
                    value={specKey}
                    onChange={e => setSpecKey(e.target.value)}
                    className="w-1/3 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 50ml)"
                    value={specVal}
                    onChange={e => setSpecVal(e.target.value)}
                    className="w-1/3 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={addSpec}
                    className="px-3 py-1.5 bg-stone-200 font-bold rounded-xl hover:bg-stone-300"
                  >
                    Add Spec
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {Object.entries(formData.specifications).map(([k, v]) => (
                    <span key={k} className="bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
                      <strong>{k}:</strong> {v}
                      <button type="button" onClick={() => removeSpec(k)} className="text-rose-600 hover:font-bold">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Sizes, Colors, Tags comma strings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Sizes (comma separated)</label>
                  <input
                    type="text"
                    placeholder="50ml, 100ml"
                    value={formData.sizesStr}
                    onChange={e => setFormData({ ...formData, sizesStr: e.target.value })}
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Colors (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Red, White"
                    value={formData.colorsStr}
                    onChange={e => setFormData({ ...formData, colorsStr: e.target.value })}
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Skincare, Beauty"
                    value={formData.tagsStr}
                    onChange={e => setFormData({ ...formData, tagsStr: e.target.value })}
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-bold hover:bg-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Save Product</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
