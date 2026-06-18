import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Product } from '@/types'

export const metadata: Metadata = {
  title: 'New Product',
  description: 'Add a new product to the catalog',
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

async function createProduct(formData: FormData): Promise<void> {
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

  if (errors.length > 0) {
    throw new Error(errors.join('; '))
  }

  const body = {
    name: name.trim(),
    description: description.trim(),
    price: priceNum,
    category: category.trim(),
    imageUrl: imageUrl || null,
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.message || 'Failed to create product')
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="text-sm text-indigo-600 hover:text-indigo-500 mb-4 inline-block"
          >
            &larr; Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">New Product</h1>
          <p className="mt-2 text-sm text-gray-600">
            Add a new product to your catalog
          </p>
        </div>

        <form action={createProduct} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              minLength={2}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              minLength={10}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter product description (at least 10 characters)"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              min="0.01"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
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
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              Image URL (optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
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
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}