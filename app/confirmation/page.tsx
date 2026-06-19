'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface OrderData {
  id: string
  items: OrderItem[]
  total: number
  timestamp: string
  customer: {
    name: string
    email?: string
  }
}

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const totalParam = searchParams.get('total')
  const [order, setOrder] = useState<OrderData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided.')
      return
    }

    try {
      const stored = localStorage.getItem('orders')
      if (!stored) {
        setError('Order not found.')
        return
      }
      const orders: OrderData[] = JSON.parse(stored)
      const found = orders.find((o) => o.id === orderId)
      if (!found) {
        setError('Order not found.')
        return
      }
      setOrder(found)
    } catch {
      setError('Failed to load order details.')
    }
  }, [orderId])

  if (error) {
    return (
      <main className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-rose-600">Order Not Found</h1>
          <p className="text-lg text-gray-400">{error}</p>
          {totalParam && (
            <p className="text-lg text-gray-400">
              Estimated total: ${totalParam}
            </p>
          )}
          <a
            href="/checkout"
            className="inline-block mt-6 px-6 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
          >
            Return to Checkout
          </a>
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600 mx-auto" />
          <p className="text-lg text-gray-400">Loading order details...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-gray-200 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-rose-600">Order Confirmed</h1>
          <p className="text-xl text-gray-400">Thank you for your purchase!</p>
          <p className="text-sm text-gray-500">
            Order ID: <span className="font-mono text-rose-400">{order.id}</span>
          </p>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-3">
          <h2 className="text-xl font-semibold text-rose-400">Customer Details</h2>
          <p>
            <span className="text-gray-400">Name: </span>
            {order.customer.name}
          </p>
          {order.customer.email && (
            <p>
              <span className="text-gray-400">Email: </span>
              {order.customer.email}
            </p>
          )}
          <p>
            <span className="text-gray-400">Order Date: </span>
            {new Date(order.timestamp).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Order Items */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-rose-400">Items Ordered</h2>
          <ul className="divide-y divide-gray-800">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center py-3"
              >
                <div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-sm text-gray-400">
                    Qty: {item.quantity} x ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-white font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-rose-600">
            <p className="text-xl font-bold text-rose-400">Total</p>
            <p className="text-2xl font-bold text-rose-500">
              ${order.total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="text-center">
          <a
            href="/products"
            className="inline-block px-8 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-semibold"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </main>
  )
}