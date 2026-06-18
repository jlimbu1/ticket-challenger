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
      errors.stock = "Valid stock count is required";
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

    if (editingId) {
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
    } else {
      const newProduct: Product = {
        id: `product-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description.trim(),
        image: form.image.trim(),
        category: "vinyl",
      };
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
      setForm(emptyForm);
      setEditingId(null);
      setFormErrors({});
    }
  };

  const handleCancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormErrors({});
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-crimson border-t-transparent" role="status">
          <span className="sr-only">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-black p-6 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-8 text-center text-4xl font-bold tracking-wider text-crimson">
            Backstage Pass: Admin Dashboard
          </h1>

          <div className="mb-8 rounded-lg border border-gothic-700 bg-gothic-900/50 p-6 shadow-gothic">
            <h2 className="mb-4 text-2xl font-semibold text-crimson">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="name" className="mb-1 block text-sm text-gothic-300">
                  Product Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full rounded border border-gothic-600 bg-gothic-800 px-3 py-2 text-white placeholder-gothic-500 focus:border-crimson focus:outline-none"
                  placeholder="Enter product name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-rose">{formErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="mb-1 block text-sm text-gothic-300">
                    Price
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="text"
                    value={form.price}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gothic-600 bg-gothic-800 px-3 py-2 text-white placeholder-gothic-500 focus:border-crimson focus:outline-none"
                    placeholder="0.00"
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-rose">{formErrors.price}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="stock" className="mb-1 block text-sm text-gothic-300">
                    Stock
                  </label>
                  <input
                    id="stock"
                    name="stock"
                    type="text"
                    value={form.stock}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gothic-600 bg-gothic-800 px-3 py-2 text-white placeholder-gothic-500 focus:border-crimson focus:outline-none"
                    placeholder="0"
                  />
                  {formErrors.stock && (
                    <p className="mt-1 text-sm text-rose">{formErrors.stock}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="mb-1 block text-sm text-gothic-300">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded border border-gothic-600 bg-gothic-800 px-3 py-2 text-white placeholder-gothic-500 focus:border-crimson focus:outline-none"
                  placeholder="Enter product description"
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-rose">{formErrors.description}</p>
                )}
              </div>

              <div>
                <label htmlFor="image" className="mb-1 block text-sm text-gothic-300">
                  Image URL
                </label>
                <input
                  id="image"
                  name="image"
                  type="text"
                  value={form.image}
                  onChange={handleInputChange}
                  className="w-full rounded border border-gothic-600 bg-gothic-800 px-3 py-2 text-white placeholder-gothic-500 focus:border-crimson focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
                {formErrors.image && (
                  <p className="mt-1 text-sm text-rose">{formErrors.image}</p>
                )}
              </div>

              <div className="flex gap-3">
                <GothicButton type="submit" className="flex-1">
                  {editingId ? "Update Product" : "Add Product"}
                </GothicButton>
                {editingId && (
                  <GothicButton type="button" onClick={handleCancelEdit} className="flex-1">
                    Cancel
                  </GothicButton>
                )}
              </div>
            </form>
          </div>

          <div className="rounded-lg border border-gothic-700 bg-gothic-900/50 p-6 shadow-gothic">
            <h2 className="mb-4 text-2xl font-semibold text-crimson">
              Product Catalog ({products.length})
            </h2>

            {products.length === 0 ? (
              <GothicEmptyState
                title="No Products"
                message="The catalog is empty. Add your first product above."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gothic-700 text-sm uppercase tracking-wider text-gothic-400">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gothic-800 hover:bg-gothic-800/50">
                        <td className="px-4 py-3 font-medium">{product.name}</td>
                        <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              product.stock > 0
                                ? "text-emerald-400"
                                : "text-rose"
                            }
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <GothicButton
                              onClick={() => handleEdit(product)}
                              className="px-3 py-1 text-sm"
                            >
                              Edit
                            </GothicButton>
                            <GothicButton
                              onClick={() => handleDelete(product.id)}
                              className="px-3 py-1 text-sm"
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
      </div>
    </DramaticErrorBoundary>
  );
};

export default AdminDashboardPage;