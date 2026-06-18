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
      setEditingId(null);
    } else {
      const newProduct: Product = {
        id: `product-${Date.now()}`,
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description.trim(),
        image: form.image.trim(),
        category: "accessory",
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setForm(emptyForm);
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
      <div className="min-h-screen bg-black text-white p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 border-b border-gothic-700 pb-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-wider text-crimson">
              Backstage Pass
            </h1>
            <p className="text-gothic-300 mt-2 text-sm uppercase tracking-widest">
              Admin Dashboard &mdash; Manage Your Merchandise
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gothic-200">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="bg-gothic-900/60 border border-gothic-700 rounded-lg p-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full bg-gothic-800 border border-gothic-600 rounded px-3 py-2 text-white placeholder-gothic-500 focus:outline-none focus:border-crimson"
                    placeholder="Enter product name"
                  />
                  {formErrors.name && (
                    <p className="text-rose text-xs mt-1">{formErrors.name}</p>
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
                    className="w-full bg-gothic-800 border border-gothic-600 rounded px-3 py-2 text-white placeholder-gothic-500 focus:outline-none focus:border-crimson"
                    placeholder="0.00"
                  />
                  {formErrors.price && (
                    <p className="text-rose text-xs mt-1">{formErrors.price}</p>
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
                    className="w-full bg-gothic-800 border border-gothic-600 rounded px-3 py-2 text-white placeholder-gothic-500 focus:outline-none focus:border-crimson"
                    placeholder="0"
                  />
                  {formErrors.stock && (
                    <p className="text-rose text-xs mt-1">{formErrors.stock}</p>
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
                    className="w-full bg-gothic-800 border border-gothic-600 rounded px-3 py-2 text-white placeholder-gothic-500 focus:outline-none focus:border-crimson"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formErrors.image && (
                    <p className="text-rose text-xs mt-1">{formErrors.image}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gothic-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full bg-gothic-800 border border-gothic-600 rounded px-3 py-2 text-white placeholder-gothic-500 focus:outline-none focus:border-crimson resize-none"
                  placeholder="Describe the product..."
                />
                {formErrors.description && (
                  <p className="text-rose text-xs mt-1">{formErrors.description}</p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <GothicButton type="submit" variant="primary">
                  {editingId ? "Update Product" : "Add Product"}
                </GothicButton>
                {editingId && (
                  <GothicButton type="button" variant="secondary" onClick={handleCancelEdit}>
                    Cancel
                  </GothicButton>
                )}
              </div>
            </form>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gothic-200">
              Product Catalog ({products.length})
            </h2>
            {products.length === 0 ? (
              <GothicEmptyState
                title="No Products"
                message="The catalog is empty. Add your first product above."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gothic-700 text-left text-gothic-400 text-sm uppercase tracking-wider">
                      <th className="py-3 px-4 font-medium">Name</th>
                      <th className="py-3 px-4 font-medium">Price</th>
                      <th className="py-3 px-4 font-medium">Stock</th>
                      <th className="py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gothic-800 hover:bg-gothic-900/40 transition-colors"
                      >
                        <td className="py-3 px-4 text-gothic-200">{product.name}</td>
                        <td className="py-3 px-4 text-gothic-300">${product.price.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                              product.stock > 0
                                ? "bg-emerald/20 text-emerald"
                                : "bg-rose/20 text-rose"
                            }`}
                          >
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
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
          </section>
        </div>
      </div>
    </DramaticErrorBoundary>
  );
};

export default AdminDashboardPage;