import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Product } from '@/types'

export const metadata: Metadata = {
  title: 'Edit Product',
  description: 'Edit an existing product in the catalog',
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
      { cache: 'no-store' }
    )
    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error('Failed to fetch product')
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

function validateUrl(url: string | null): string {
  if (!url) return '/placeholder.svg'
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '/placeholder.svg'
    }
    return url
  } catch {
    return '/placeholder.svg'
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

async function updateProduct(id: string, formData: FormData): Promise<void> {
  'use server'

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = formData.get('price') as string
  const category = formData.get('category') as string
  const imageUrl = formData.get('imageUrl') as string

  const errors: string[] = []

  if (!name || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters')
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description is required and must be at least 10 characters')
  }

  const priceNum = parseFloat(price)
  if (!price || isNaN(priceNum) || priceNum <= 0) {
    errors.push('Price is required and must be a positive number')
  }

  if (!category || category.trim().length === 0) {
    errors.push('Category is required')
  }

  if (imageUrl && imageUrl.trim().length > 0) {
    try {
      const parsed = new URL(imageUrl)
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        errors.push('Image URL must use http or https protocol')
      }
    } catch {
      errors.push('Image URL must be a valid URL')
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }

  const body = {
    name: name.trim(),
    description: description.trim(),
    price: priceNum,
    category: category.trim(),
    imageUrl: imageUrl && imageUrl.trim().length > 0 ? imageUrl.trim() : null,
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )

  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.error || 'Failed to update product')
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            &larr; Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Edit Product</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update the details for {product.name}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form action={updateProduct.bind(null, params.id)}>
            <input type="hidden" name="id" value={params.id} />

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={product.name}
                  required
                  minLength={2}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={product.description}
                  required
                  minLength={10}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price (USD)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  defaultValue={product.price}
                  required
                  min="0.01"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue={product.category}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Books">Books</option>
                  <option value="Sports">Sports</option>
                  <option value="Toys">Toys</option>
                  <option value="Food & Beverages">Food & Beverages</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={product.imageUrl || ''}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {product.imageUrl && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Current image:</p>
                    <img
                      src={validateUrl(product.imageUrl)}
                      alt={product.name}
                      className="h-20 w-20 object-cover rounded border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <Link
                href="/admin/products"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}