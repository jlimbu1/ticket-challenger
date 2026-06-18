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

  const resetForm = () => {
    setForm(emptyForm);
    setFormErrors({});
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newProduct: Product = {
      id: editingId || `prod-${Date.now()}`,
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim(),
      image: form.image.trim(),
    };

    if (editingId) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? newProduct : p)));
    } else {
      setProducts((prev) => [...prev, newProduct]);
    }
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description,
      image: product.image,
    });
    setFormErrors({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-400 font-mono text-sm">Loading backstage pass...</p>
        </div>
      </div>
    );
  }

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-black text-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-400 font-mono mb-2">
              BACKSTAGE PASS
            </h1>
            <p className="text-gray-500 font-mono text-sm">
              Admin Dashboard - Product Management
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                  <h2 className="text-lg font-mono text-purple-300">
                    PRODUCT CATALOG
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {products.length} product{products.length !== 1 ? 's' : ''} in inventory
                  </p>
                </div>

                {products.length === 0 ? (
                  <GothicEmptyState
                    title="No Products Found"
                    description="The stage is empty. Add your first product to get started."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-800 text-gray-500 font-mono text-xs uppercase">
                          <th className="text-left p-3">Product</th>
                          <th className="text-left p-3">Price</th>
                          <th className="text-left p-3">Stock</th>
                          <th className="text-right p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr
                            key={product.id}
                            className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                          >
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/1a1a2e/9b59b6?text=?';
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-200">{product.name}</p>
                                  <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                    {product.description}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-purple-400 font-mono">
                              ${product.price.toFixed(2)}
                            </td>
                            <td className="p-3">
                              <span
                                className={`font-mono text-xs ${
                                  product.stock > 10
                                    ? 'text-green-400'
                                    : product.stock > 0
                                    ? 'text-yellow-400'
                                    : 'text-red-400'
                                }`}
                              >
                                {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-2">
                                <GothicButton
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleEdit(product)}
                                >
                                  Edit
                                </GothicButton>
                                <GothicButton
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDelete(product.id)}
                                >
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
              </div>
            </div>

            <div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h2 className="text-lg font-mono text-purple-300 mb-4">
                  {editingId ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-800 border ${
                        formErrors.name ? 'border-red-500' : 'border-gray-700'
                      } rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500 transition-colors`}
                      placeholder="Enter product name"
                    />
                    {formErrors.name && (
                      <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={form.price}
                        onChange={handleInputChange}
                        className={`w-full bg-gray-800 border ${
                          formErrors.price ? 'border-red-500' : 'border-gray-700'
                        } rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500 transition-colors`}
                        placeholder="0.00"
                      />
                      {formErrors.price && (
                        <p className="text-red-400 text-xs mt-1">{formErrors.price}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1">
                        Stock
                      </label>
                      <input
                        type="text"
                        name="stock"
                        value={form.stock}
                        onChange={handleInputChange}
                        className={`w-full bg-gray-800 border ${
                          formErrors.stock ? 'border-red-500' : 'border-gray-700'
                        } rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500 transition-colors`}
                        placeholder="0"
                      />
                      {formErrors.stock && (
                        <p className="text-red-400 text-xs mt-1">{formErrors.stock}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full bg-gray-800 border ${
                        formErrors.description ? 'border-red-500' : 'border-gray-700'
                      } rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500 transition-colors resize-none`}
                      placeholder="Describe the product..."
                    />
                    {formErrors.description && (
                      <p className="text-red-400 text-xs mt-1">{formErrors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={form.image}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-800 border ${
                        formErrors.image ? 'border-red-500' : 'border-gray-700'
                      } rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500 transition-colors`}
                      placeholder="https://example.com/image.jpg"
                    />
                    {formErrors.image && (
                      <p className="text-red-400 text-xs mt-1">{formErrors.image}</p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <GothicButton type="submit" variant="primary" className="flex-1">
                      {editingId ? 'Update Product' : 'Add Product'}
                    </GothicButton>
                    {editingId && (
                      <GothicButton
                        type="button"
                        variant="secondary"
                        onClick={resetForm}
                      >
                        Cancel
                      </GothicButton>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DramaticErrorBoundary>
  );
};

export default AdminDashboardPage;