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
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

    const productData: Product = {
      id: editingId || `product-${Date.now()}`,
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim(),
      image: form.image.trim() || "https://placehold.co/300x300/1a1a2e/ff6b6b?text=No+Image",
      category: "accessory",
    };

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? productData : p))
      );
    } else {
      setProducts((prev) => [...prev, productData]);
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
    setDeleteConfirmId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-crimson border-t-transparent" />
          <p className="text-gothic-400 text-sm">Loading backstage pass...</p>
        </div>
      </div>
    );
  }

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-black text-white p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 border-b border-gothic-700 pb-4">
            <h1 className="text-3xl font-bold tracking-wider text-crimson">
              Backstage Pass
            </h1>
            <p className="mt-2 text-gothic-400 text-sm">
              Manage your merchandise inventory
            </p>
          </div>

          <div className="mb-8 rounded-lg border border-gothic-700 bg-gothic-900/50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-crimson">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm text-gothic-300 mb-1">
                    Product Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleInputChange}
                    className={`w-full rounded border bg-gothic-800 px-3 py-2 text-white placeholder-gothic-500 focus:border-crimson focus:outline-none ${
                      formErrors.name ? "border-red-500" : "border-gothic-700"
                    }`}
                    placeholder="Enter product name"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm text-gothic-300 mb-1">
                    Price
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="text"
                    value={form.price}
                    onChange={handleInputChange}
                    className={`w-full rounded border bg-gothic-800 px-3 py-2 text-white placeholder-gothic-500 focus:border-crimson focus:outline-none ${
                      formErrors.price ? "border-red-500" : "border-gothic-700"
                    }`}
                    placeholder="0.00"
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.price}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="stock" className="block text-sm text-gothic-300 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    id="stock"
                    name="stock"
                    type="text"
                    value={form.stock}
                    onChange={handleInputChange}
                    className={`w-full rounded border bg-gothic-800 px-3 py-2 text-white placeholder-gothic-500 focus:border-crimson focus:outline-none ${
                      formErrors.stock ? "border-red-500" : "border-gothic-700"
                    }`}
                    placeholder="0"
                  />
                  {formErrors.stock && (
                    <p className="mt-1 text-xs text-red-400">{formErrors.stock}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="image" className="block text-sm text-gothic-300 mb-1">
                    Image URL (optional)
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="text"
                    value={form.image}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gothic-700 bg-gothic-800 px-3 py-2 text-white placeholder-gothic-500 focus:border-crimson focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm text-gothic-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full rounded border bg-gothic-800 px-3 py-2 text-white placeholder-gothic-500 focus:border-crimson focus:outline-none ${
                    formErrors.description ? "border-red-500" : "border-gothic-700"
                  }`}
                  placeholder="Describe the product..."
                />
                {formErrors.description && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.description}</p>
                )}
              </div>
              <div className="flex gap-3">
                <GothicButton type="submit">
                  {editingId ? "Update Product" : "Add Product"}
                </GothicButton>
                {editingId && (
                  <GothicButton type="button" onClick={handleCancelEdit}>
                    Cancel
                  </GothicButton>
                )}
              </div>
            </form>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-crimson">
              Product Inventory ({products.length})
            </h2>
            {products.length === 0 ? (
              <GothicEmptyState
                title="No Products"
                message="The inventory is empty. Add your first product above."
              />
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border border-gothic-700 bg-gothic-900/30 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://placehold.co/300x300/1a1a2e/ff6b6b?text=No+Image";
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-white">{product.name}</h3>
                        <p className="text-sm text-gothic-400">
                          ${product.price.toFixed(2)} &middot; Stock: {product.stock}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <GothicButton
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1 text-sm"
                      >
                        Edit
                      </GothicButton>
                      {deleteConfirmId === product.id ? (
                        <div className="flex items-center gap-2">
                          <GothicButton
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1 text-sm bg-red-800 hover:bg-red-700"
                          >
                            Confirm
                          </GothicButton>
                          <GothicButton
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-3 py-1 text-sm"
                          >
                            Cancel
                          </GothicButton>
                        </div>
                      ) : (
                        <GothicButton
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="px-3 py-1 text-sm bg-gothic-800 hover:bg-red-900"
                        >
                          Delete
                        </GothicButton>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DramaticErrorBoundary>
  );
};

export default AdminDashboardPage;