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
      category: "accessory",
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
        <div className="animate-spin h-8 w-8 border-2 border-crimson border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-crimson mb-8">Backstage Pass - Admin Dashboard</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gothic-300 mb-4">Product Catalog</h2>
              {products.length === 0 ? (
                <GothicEmptyState
                  title="No Products"
                  message="The catalog is empty. Add your first product to begin."
                />
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-gothic-900/50 border border-gothic-700 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/64x64/1a1a2e/crimson?text=No+Image";
                          }}
                        />
                        <div>
                          <h3 className="font-medium text-white">{product.name}</h3>
                          <p className="text-sm text-gothic-400">${product.price.toFixed(2)}</p>
                          <p className="text-sm text-gothic-500">Stock: {product.stock}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <GothicButton
                          onClick={() => handleEdit(product)}
                          className="px-3 py-1 text-sm"
                        >
                          Edit
                        </GothicButton>
                        <GothicButton
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 text-sm bg-rose/20 hover:bg-rose/40"
                        >
                          Delete
                        </GothicButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gothic-900/50 border border-gothic-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gothic-300 mb-4">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-gothic-400 mb-1">
                    Product Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gothic-800 border border-gothic-600 rounded text-white focus:outline-none focus:border-crimson"
                  />
                  {formErrors.name && (
                    <p className="text-rose text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm text-gothic-400 mb-1">
                    Price
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="text"
                    value={form.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gothic-800 border border-gothic-600 rounded text-white focus:outline-none focus:border-crimson"
                  />
                  {formErrors.price && (
                    <p className="text-rose text-xs mt-1">{formErrors.price}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm text-gothic-400 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    id="stock"
                    name="stock"
                    type="text"
                    value={form.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gothic-800 border border-gothic-600 rounded text-white focus:outline-none focus:border-crimson"
                  />
                  {formErrors.stock && (
                    <p className="text-rose text-xs mt-1">{formErrors.stock}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm text-gothic-400 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-gothic-800 border border-gothic-600 rounded text-white focus:outline-none focus:border-crimson resize-none"
                  />
                  {formErrors.description && (
                    <p className="text-rose text-xs mt-1">{formErrors.description}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm text-gothic-400 mb-1">
                    Image URL
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="text"
                    value={form.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gothic-800 border border-gothic-600 rounded text-white focus:outline-none focus:border-crimson"
                  />
                  {formErrors.image && (
                    <p className="text-rose text-xs mt-1">{formErrors.image}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <GothicButton type="submit" className="flex-1">
                    {editingId ? "Update Product" : "Add Product"}
                  </GothicButton>
                  {editingId && (
                    <GothicButton
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 bg-gothic-700 hover:bg-gothic-600"
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