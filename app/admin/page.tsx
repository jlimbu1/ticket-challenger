"use client";

import React, { useState, useEffect } from "react";
import { products as initialProducts } from "@/src/data/products";
import type { Product } from "@/src/types";
import GothicButton from "@/components/GothicButton";
import GothicEmptyState from "@/components/GothicEmptyState";
import DramaticErrorBoundary from "@/components/DramaticErrorBoundary";

interface ProductForm {
  name: string;
  price: string;
  stock: string;
  description: string;
  image: string;
}

const emptyForm: ProductForm = {
  name: "",
  price: "",
  stock: "",
  description: "",
  image: "",
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
    if (!form.name.trim()) errors.name = "Product name is required";
    if (!form.price.trim() || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      errors.price = "Valid price is required";
    }
    if (!form.stock.trim() || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      errors.stock = "Valid stock quantity is required";
    }
    if (!form.description.trim()) errors.description = "Description is required";
    if (!form.image.trim()) errors.image = "Image URL is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof ProductForm]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name as keyof ProductForm];
        return updated;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newProduct: Product = {
      id: editingId || `product-${Date.now()}`,
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim(),
      image: form.image.trim(),
      category: "vinyl",
    };

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? newProduct : p))
      );
    } else {
      setProducts((prev) => [...prev, newProduct]);
    }

    setForm(emptyForm);
    setEditingId(null);
    setFormErrors({});
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

  const handleDelete = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (editingId === productId) {
      setEditingId(null);
      setForm(emptyForm);
      setFormErrors({});
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-crimson border-t-transparent rounded-full" role="status">
          <span className="sr-only">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-crimson mb-8 tracking-wider uppercase">
            Backstage Pass: Admin Dashboard
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-gothic-200 mb-4 border-b border-gothic-700 pb-2">
                Product Catalog
              </h2>

              {products.length === 0 ? (
                <GothicEmptyState
                  title="No Products"
                  message="The stage is empty. Add your first product to get started."
                />
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-gothic-900/50 border border-gothic-700 rounded-lg hover:border-crimson/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gothic-800 rounded overflow-hidden flex-shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "";
                                (e.target as HTMLImageElement).classList.add("hidden");
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gothic-500">
                              <span className="text-2xl">&#9835;</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">{product.name}</h3>
                          <p className="text-sm text-gothic-400">
                            ${product.price.toFixed(2)} &middot; Stock: {product.stock}
                          </p>
                          <p className="text-xs text-gothic-500 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <GothicButton
                          onClick={() => handleEdit(product)}
                          className="px-3 py-1 text-sm"
                          variant="secondary"
                        >
                          Edit
                        </GothicButton>
                        <GothicButton
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 text-sm"
                          variant="danger"
                        >
                          Delete
                        </GothicButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <h2 className="text-2xl font-semibold text-gothic-200 mb-4 border-b border-gothic-700 pb-2">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 bg-gothic-900/30 border border-gothic-700 rounded-lg p-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gothic-300 mb-1">
                    Product Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gothic-800 border rounded text-white focus:outline-none focus:ring-2 focus:ring-crimson ${
                      formErrors.name ? "border-red-500" : "border-gothic-600"
                    }`}
                    placeholder="Enter product name"
                  />
                  {formErrors.name && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gothic-300 mb-1">
                    Price ($)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="text"
                    value={form.price}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gothic-800 border rounded text-white focus:outline-none focus:ring-2 focus:ring-crimson ${
                      formErrors.price ? "border-red-500" : "border-gothic-600"
                    }`}
                    placeholder="0.00"
                  />
                  {formErrors.price && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.price}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gothic-300 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    id="stock"
                    name="stock"
                    type="text"
                    value={form.stock}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gothic-800 border rounded text-white focus:outline-none focus:ring-2 focus:ring-crimson ${
                      formErrors.stock ? "border-red-500" : "border-gothic-600"
                    }`}
                    placeholder="0"
                  />
                  {formErrors.stock && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.stock}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gothic-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 bg-gothic-800 border rounded text-white focus:outline-none focus:ring-2 focus:ring-crimson ${
                      formErrors.description ? "border-red-500" : "border-gothic-600"
                    }`}
                    placeholder="Describe the product..."
                  />
                  {formErrors.description && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.description}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gothic-300 mb-1">
                    Image URL
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="text"
                    value={form.image}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 bg-gothic-800 border rounded text-white focus:outline-none focus:ring-2 focus:ring-crimson ${
                      formErrors.image ? "border-red-500" : "border-gothic-600"
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formErrors.image && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.image}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <GothicButton type="submit" className="flex-1">
                    {editingId ? "Update Product" : "Add Product"}
                  </GothicButton>
                  {editingId && (
                    <GothicButton
                      type="button"
                      onClick={handleCancelEdit}
                      variant="secondary"
                      className="flex-1"
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
    </DramaticErrorBoundary>
  );
};

export default AdminDashboardPage;