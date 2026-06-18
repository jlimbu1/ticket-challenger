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
      image: form.image.trim() || "",
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
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-crimson border-t-transparent" />
          <p className="text-crimson text-lg">Loading the backstage...</p>
        </div>
      </div>
    );
  }

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-crimson mb-2">Backstage Pass</h1>
            <p className="text-gray-400">Manage your product lineup</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-crimson mb-4">
                Current Lineup ({products.length})
              </h2>
              {products.length === 0 ? (
                <GothicEmptyState
                  title="No Products"
                  message="The stage is empty. Add your first product to start the show."
                />
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-gothic-900 border border-gothic-700 rounded-lg p-4 flex items-center gap-4"
                    >
                      <div className="w-16 h-16 bg-gothic-800 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl text-crimson/60">&#9835;</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">
                          {product.description}
                        </p>
                        <div className="flex gap-4 mt-1 text-sm">
                          <span className="text-crimson">
                            ${product.price.toFixed(2)}
                          </span>
                          <span
                            className={
                              product.stock > 0 ? "text-green-400" : "text-red-400"
                            }
                          >
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Sold Out"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <GothicButton
                          onClick={() => handleEdit(product)}
                          className="px-3 py-1 text-sm"
                        >
                          Edit
                        </GothicButton>
                        <GothicButton
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 text-sm bg-red-900 hover:bg-red-800 border-red-700"
                        >
                          Delete
                        </GothicButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-crimson mb-4">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <form
                onSubmit={handleSubmit}
                className="bg-gothic-900 border border-gothic-700 rounded-lg p-6 space-y-4"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className={`w-full bg-gothic-800 border ${
                      formErrors.name ? "border-red-500" : "border-gothic-600"
                    } rounded px-3 py-2 text-white focus:outline-none focus:border-crimson`}
                  />
                  {formErrors.name && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Price
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    className={`w-full bg-gothic-800 border ${
                      formErrors.price ? "border-red-500" : "border-gothic-600"
                    } rounded px-3 py-2 text-white focus:outline-none focus:border-crimson`}
                  />
                  {formErrors.price && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.price}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Stock Quantity
                  </label>
                  <input
                    type="text"
                    id="stock"
                    name="stock"
                    value={form.stock}
                    onChange={handleInputChange}
                    className={`w-full bg-gothic-800 border ${
                      formErrors.stock ? "border-red-500" : "border-gothic-600"
                    } rounded px-3 py-2 text-white focus:outline-none focus:border-crimson`}
                  />
                  {formErrors.stock && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.stock}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full bg-gothic-800 border ${
                      formErrors.description ? "border-red-500" : "border-gothic-600"
                    } rounded px-3 py-2 text-white focus:outline-none focus:border-crimson`}
                  />
                  {formErrors.description && (
                    <p className="text-red-400 text-xs mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Image URL (optional)
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={form.image}
                    onChange={handleInputChange}
                    className="w-full bg-gothic-800 border border-gothic-600 rounded px-3 py-2 text-white focus:outline-none focus:border-crimson"
                  />
                </div>

                <div className="flex gap-2">
                  <GothicButton type="submit" className="flex-1">
                    {editingId ? "Update Product" : "Add Product"}
                  </GothicButton>
                  {editingId && (
                    <GothicButton
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 bg-gray-700 hover:bg-gray-600 border-gray-600"
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