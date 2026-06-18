import React, { useState, useEffect } from 'react';
import { products as initialProducts, Product } from '@/src/data/products';
import GothicButton from '@/components/GothicButton';
import GothicEmptyState from '@/components/GothicEmptyState';
import DramaticErrorBoundary from '@/components/DramaticErrorBoundary';

interface ProductForm {
  name: string;
  price: string;
  stock: string;
  description: string;
  image: string;
}

const emptyForm: ProductForm = {
  name: '',
  price: '',
  stock: '',
  description: '',
  image: '',
};

const AdminDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<ProductForm>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(initialProducts);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = (): boolean => {
    const errors: Partial<ProductForm> = {};
    if (!form.name.trim()) errors.name = 'Product name is required';
    if (!form.price.trim() || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      errors.price = 'Valid price is required';
    }
    if (!form.stock.trim() || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      errors.stock = 'Valid stock count is required';
    }
    if (!form.description.trim()) errors.description = 'Description is required';
    if (!form.image.trim()) errors.image = 'Image URL is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof ProductForm]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddProduct = () => {
    if (!validateForm()) return;
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim(),
      image: form.image.trim(),
    };
    setProducts((prev) => [...prev, newProduct]);
    setForm(emptyForm);
  };

  const handleEditProduct = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description,
      image: product.image,
    });
  };

  const handleUpdateProduct = () => {
    if (!editingId || !validateForm()) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingId
          ? {
              ...p,
              name: form.name.trim(),
              price: Number(form.price),
              stock: Number(form.stock),
              description: form.description.trim(),
              image: form.image.trim(),
            }
          : p
      )
    );
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDeleteProduct = (productId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this product? This action cannot be undone.');
    if (!confirmed) return;
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading backstage pass...</p>
        </div>
      </div>
    );
  }

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-black text-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-purple-400 mb-2">Backstage Pass</h1>
            <p className="text-gray-400">Admin Dashboard — Manage Your Merch</p>
          </header>

          <section className="mb-12 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-2xl font-semibold text-purple-300 mb-4">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-400 mb-1">Product Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-800 border ${formErrors.name ? 'border-red-500' : 'border-gray-700'} rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500`}
                  placeholder="Enter product name"
                />
                {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="price" className="block text-sm text-gray-400 mb-1">Price</label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={form.price}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-800 border ${formErrors.price ? 'border-red-500' : 'border-gray-700'} rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500`}
                  placeholder="0.00"
                />
                {formErrors.price && <p className="text-red-400 text-xs mt-1">{formErrors.price}</p>}
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm text-gray-400 mb-1">Stock Count</label>
                <input
                  id="stock"
                  name="stock"
                  type="text"
                  value={form.stock}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-800 border ${formErrors.stock ? 'border-red-500' : 'border-gray-700'} rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500`}
                  placeholder="0"
                />
                {formErrors.stock && <p className="text-red-400 text-xs mt-1">{formErrors.stock}</p>}
              </div>
              <div>
                <label htmlFor="image" className="block text-sm text-gray-400 mb-1">Image URL</label>
                <input
                  id="image"
                  name="image"
                  type="text"
                  value={form.image}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-800 border ${formErrors.image ? 'border-red-500' : 'border-gray-700'} rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500`}
                  placeholder="https://example.com/image.jpg"
                />
                {formErrors.image && <p className="text-red-400 text-xs mt-1">{formErrors.image}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full bg-gray-800 border ${formErrors.description ? 'border-red-500' : 'border-gray-700'} rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500`}
                  placeholder="Describe the product..."
                />
                {formErrors.description && <p className="text-red-400 text-xs mt-1">{formErrors.description}</p>}
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              {editingId ? (
                <>
                  <GothicButton onClick={handleUpdateProduct}>Update Product</GothicButton>
                  <GothicButton onClick={handleCancelEdit} className="bg-gray-700 hover:bg-gray-600">Cancel</GothicButton>
                </>
              ) : (
                <GothicButton onClick={handleAddProduct}>Add Product</GothicButton>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-300 mb-4">Product Catalog</h2>
            {products.length === 0 ? (
              <GothicEmptyState message="No products in the catalog yet. Add your first product above." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 text-sm uppercase">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                        <td className="py-3 px-4 text-white">{product.name}</td>
                        <td className="py-3 px-4 text-purple-400">${product.price.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={product.stock <= 5 ? 'text-red-400' : 'text-green-400'}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <GothicButton onClick={() => handleEditProduct(product)} className="text-sm px-3 py-1">
                              Edit
                            </GothicButton>
                            <GothicButton onClick={() => handleDeleteProduct(product.id)} className="text-sm px-3 py-1 bg-red-800 hover:bg-red-700">
                              Delete
                            </GothicButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </DramaticErrorBoundary>
  );
};

export default AdminDashboardPage;