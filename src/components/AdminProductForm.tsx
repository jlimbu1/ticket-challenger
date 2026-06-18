import { useState, useCallback } from 'react'
import { Product } from '@/types'

interface AdminProductFormProps {
  product?: Product | null
  onSubmit: (data: ProductFormData) => Promise<void>
  onCancel: () => void
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
}

interface FormErrors {
  name?: string
  description?: string
  price?: string
  category?: string
  imageUrl?: string
}

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Books',
  'Sports',
  'Toys',
  'Food & Beverages',
  'Other',
]

function validateUrl(url: string): string | null {
  if (!url || url.trim().length === 0) return null
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return 'Image URL must use http or https protocol'
    }
    return null
  } catch {
    return 'Image URL must be a valid URL'
  }
}

function validateForm(data: ProductFormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name is required and must be at least 2 characters'
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description is required and must be at least 10 characters'
  }

  if (!data.price || isNaN(data.price) || data.price <= 0) {
    errors.price = 'Price is required and must be a positive number'
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.category = 'Category is required'
  }

  const urlError = validateUrl(data.imageUrl)
  if (urlError) {
    errors.imageUrl = urlError
  }

  return errors
}

export default function AdminProductForm({ product, onSubmit, onCancel }: AdminProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    imageUrl: product?.imageUrl || '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = useCallback(
    (field: keyof ProductFormData, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[field]
          return next
        })
      }
    },
    [errors]
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSubmitError(null)

      const validationErrors = validateForm(formData)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      setIsSubmitting(true)
      try {
        await onSubmit(formData)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to save product'
        setSubmitError(message)
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, onSubmit]
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {submitError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{submitError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.name ? 'border-red-300' : ''
          }`}
          placeholder="Enter product name"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.description ? 'border-red-300' : ''
          }`}
          placeholder="Enter product description (at least 10 characters)"
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price ($)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          step="0.01"
          min="0.01"
          value={formData.price || ''}
          onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.price ? 'border-red-300' : ''
          }`}
          placeholder="0.00"
        />
        {errors.price && (
          <p className="mt-2 text-sm text-red-600">{errors.price}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.category ? 'border-red-300' : ''
          }`}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-2 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.imageUrl ? 'border-red-300' : ''
          }`}
          placeholder="https://example.com/image.jpg"
        />
        {errors.imageUrl && (
          <p className="mt-2 text-sm text-red-600">{errors.imageUrl}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  )
}