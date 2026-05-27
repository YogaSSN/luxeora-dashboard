import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Product } from '../../types';
import { Loader2, Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Product deleted successfully');
      fetchProducts();
    }
  };

  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct({ ...product });
    } else {
      setEditingProduct({
        id: `luxe-${Date.now()}`,
        name: '',
        price: 0,
        category: 'gold',
        image: '',
        metal: '',
        stone: '',
        weight: '',
        hallmark: '',
        purity: '',
        description: '',
        longDescription: '',
        isTrending: false,
        isFeatured: false,
        specifications: {}
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const { error } = await supabase.from('products').upsert({
        ...editingProduct,
      });

      if (error) throw error;
      toast.success('Product saved successfully');
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-[#D4AF37]">Products Management</h2>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded font-medium hover:bg-[#BF953F] transition-colors"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      ) : (
        <div className="bg-[#161B22] border border-white/5 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#111] text-gray-400 font-mono text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover border border-white/10" />
                    </td>
                    <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                    <td className="px-6 py-4">${product.price?.toLocaleString()}</td>
                    <td className="px-6 py-4 capitalize">{product.category}</td>
                    <td className="px-6 py-4 flex items-center justify-end gap-3">
                      <button onClick={() => openModal(product)} className="text-gray-400 hover:text-blue-400 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#161B22] border border-[#D4AF37]/30 w-full max-w-2xl rounded-xl shadow-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-xl font-serif text-[#D4AF37]">{editingProduct.id?.startsWith('luxe-') ? 'Edit' : 'Add'} Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Product ID</label>
                  <input required value={editingProduct.id || ''} onChange={e => setEditingProduct({...editingProduct, id: e.target.value})} className="w-full bg-[#0B0B0B] border border-gray-800 rounded px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Name</label>
                  <input required value={editingProduct.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-[#0B0B0B] border border-gray-800 rounded px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Price ($)</label>
                  <input required type="number" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full bg-[#0B0B0B] border border-gray-800 rounded px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Category</label>
                  <select value={editingProduct.category || ''} onChange={e => setEditingProduct({...editingProduct, category: e.target.value as any})} className="w-full bg-[#0B0B0B] border border-gray-800 rounded px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none">
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="diamond">Diamond</option>
                    <option value="precious-stones">Precious Stones</option>
                    <option value="bridal">Bridal</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Image URL</label>
                  <input required value={editingProduct.image || ''} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full bg-[#0B0B0B] border border-gray-800 rounded px-3 py-2 text-sm focus:border-[#D4AF37] focus:outline-none" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="bg-[#D4AF37] text-black px-6 py-2 rounded text-sm font-medium hover:bg-[#BF953F] transition-colors">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
