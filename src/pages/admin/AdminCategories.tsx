import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services/api';
import { ImageUploader } from '../../components/ImageUploader';

interface AdminCategoriesProps {
  onRefreshCategories: () => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({ onRefreshCategories }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
      status: 'active'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description,
      image: cat.image,
      status: cat.status
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
      } else {
        await api.createCategory(formData);
      }
      setModalOpen(false);
      loadCategories();
      onRefreshCategories();
    } catch (err) {
      console.error('Failed to save category:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.deleteCategory(id);
      loadCategories();
      onRefreshCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-semibold">Loading Categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Product Categories</h2>
          <p className="text-xs text-slate-600">Organize merchandise, materials, and cosmetics collections.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-sm uppercase tracking-wider transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
            <div className="p-4 space-y-3">
              <div className="h-32 bg-slate-100 rounded-sm overflow-hidden relative">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs ${
                  cat.status === 'active' ? 'bg-teal-600 text-white' : 'bg-slate-400 text-white'
                }`}>
                  {cat.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">{cat.name}</h3>
              <p className="text-xs text-slate-600 line-clamp-2">{cat.description}</p>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="p-1.5 text-slate-600 hover:text-teal-700 font-bold text-xs flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 text-rose-600 hover:text-rose-800 font-bold text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-sm"
                />
              </div>
              <ImageUploader
                label="Category Image"
                description="Upload category banner from device or enter URL."
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-sm uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white font-bold rounded-sm uppercase tracking-wider"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
