import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckoutPage from '@/app/checkout/page'

// ── Mocks ────────────────────────────────────────────────────────
const mockClearCart = jest.fn()
const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('@/hooks/useCart', () => ({
  useCart: jest.fn(),
}))

import { useCart } from '@/hooks/useCart'

// ── Helpers ──────────────────────────────────────────────────────
function mockCart(overrides: Partial<ReturnType<typeof useCart>> = {}) {
  const defaultCart = {
    cart: [],
    total: 0,
    clearCart: mockClearCart,
  }
  ;(useCart as jest.Mock).mockReturnValue({ ...defaultCart, ...overrides })
}

function getSampleCart() {
  return [
    { id: 't1', name: 'Black Rose Ticket', price: 25.0, quantity: 2 },
    { id: 't2', name: 'Midnight Pass', price: 40.0, quantity: 1 },
  ]
}

// ── LocalStorage mock ────────────────────────────────────────────
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value }),
    removeItem: jest.fn((key: string) => { delete store[key] }),
    clear: jest.fn(() => { store = {} }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// ── Tests ────────────────────────────────────────────────────────
describe('CheckoutPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.clear()
  })

  // ── Empty cart ────────────────────────────────────────────────
  it('renders empty cart message and disables checkout button when cart is empty', () => {
    mockCart({ cart: [], total: 0 })
    render(<CheckoutPage />)

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /checkout/i })).toBeDisabled()
  })

  it('shows gothic empty state', () => {
    mockCart({ cart: [], total: 0 })
    render(<CheckoutPage />)

    // Look for a gothic-themed element (e.g., a skull or dark styling)
    // The component should include a "Gothic" empty state with a specific class or text
    const emptyContainer = screen.getByTestId('empty-cart')
    expect(emptyContainer).toHaveClass('text-rose-500')
  })

  // ── Cart with items ───────────────────────────────────────────
  it('displays cart items and total', () => {
    const sampleCart = getSampleCart()
    mockCart({ cart: sampleCart, total: 90 })
    render(<CheckoutPage />)

    expect(screen.getByText('Black Rose Ticket')).toBeInTheDocument()
    expect(screen.getByText('Midnight Pass')).toBeInTheDocument()
    expect(screen.getByText('$90.00')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /checkout/i })).not.toBeDisabled()
  })

  // ── Form validation ───────────────────────────────────────────
  describe('form validation', () => {
    beforeEach(() => {
      mockCart({ cart: getSampleCart(), total: 90 })
      render(<CheckoutPage />)
    })

    it('shows error messages for empty required fields on blur', async () => {
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const addressInput = screen.getByLabelText(/address/i)

      // Focus and blur each field without typing
      fireEvent.focus(nameInput)
      fireEvent.blur(nameInput)
      fireEvent.focus(emailInput)
      fireEvent.blur(emailInput)
      fireEvent.focus(addressInput)
      fireEvent.blur(addressInput)

      await waitFor(() => {
        const errors = screen.getAllByRole('alert')
        expect(errors).toHaveLength(3)
        expect(errors[0]).toHaveTextContent(/name is required/i)
        expect(errors[1]).toHaveTextContent(/email is required/i)
        expect(errors[2]).toHaveTextContent(/address is required/i)
      })
    })

    it('displays gothic-themed error messages', async () => {
      const nameInput = screen.getByLabelText(/name/i)
      fireEvent.focus(nameInput)
      fireEvent.blur(nameInput)

      const error = await screen.findByRole('alert')
      // Gothic theme: crimson color, gothic font style
      expect(error).toHaveClass('text-rose-600')
      expect(error).toHaveClass('font-gothic') // if defined in tailwind config
    })

    it('validates email format', async () => {
      const emailInput = screen.getByLabelText(/email/i)
      await userEvent.type(emailInput, 'invalid-email')
      fireEvent.blur(emailInput)

      const error = await screen.findByText(/valid email is required/i)
      expect(error).toBeInTheDocument()
    })

    it('shows errors on submit even if fields are empty', async () => {
      fireEvent.click(screen.getByRole('button', { name: /checkout/i }))

      const errors = await screen.findAllByRole('alert')
      expect(errors.length).toBeGreaterThanOrEqual(3)
    })

    it('clears error when valid input is provided', async () => {
      const nameInput = screen.getByLabelText(/name/i)
      fireEvent.focus(nameInput)
      fireEvent.blur(nameInput)
      await screen.findByText(/name is required/i)

      await userEvent.type(nameInput, 'Elena Darkwood')
      fireEvent.blur(nameInput)

      await waitFor(() => {
        expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument()
      })
    })
  })

  // ── Successful submission ─────────────────────────────────────
  describe('successful order submission', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2025-01-15T12:00:00Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('creates an order, saves to localStorage, clears cart, and redirects', async () => {
      mockCart({ cart: getSampleCart(), total: 90 })
      render(<CheckoutPage />)

      // Fill in all fields
      await userEvent.type(screen.getByLabelText(/name/i), 'Elena Darkwood')
      await userEvent.type(screen.getByLabelText(/email/i), 'elena@dark.com')
      await userEvent.type(screen.getByLabelText(/address/i), '123 Crypt Lane')

      fireEvent.click(screen.getByRole('button', { name: /checkout/i }))

      // Generate order ID (ORD-XXXX)
      // The order ID is random, so we can't predict it, but we can spy on localStorage.setItem
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('orders', expect.any(String))
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1)
      })

      // Check order structure stored
      const storedOrders = JSON.parse(localStorageMock.setItem.mock.calls[0][1])
      expect(Array.isArray(storedOrders)).toBe(true)
      expect(storedOrders).toHaveLength(1)
      const order = storedOrders[0]
      expect(order).toMatchObject({
        id: expect.stringMatching(/^ORD-[A-Z0-9]{4}$/),
        items: getSampleCart(),
        total: 90,
        customer: { name: 'Elena Darkwood', email: 'elena@dark.com' },
        timestamp: '2025-01-15T12:00:00.000Z',
      })

      expect(mockClearCart).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith(
        `/confirmation?orderId=${order.id}&total=90`
      )
    })

    it('does not submit when fields are invalid', async () => {
      mockCart({ cart: getSampleCart(), total: 90 })
      render(<CheckoutPage />)

      // Submit without filling
      fireEvent.click(screen.getByRole('button', { name: /checkout/i }))

      await waitFor(() => {
        expect(localStorageMock.setItem).not.toHaveBeenCalled()
        expect(mockClearCart).not.toHaveBeenCalled()
        expect(mockPush).not.toHaveBeenCalled()
      })
    })

    it('handles multiple orders by appending to existing orders list', async () => {
      // Pre-populate one order
      const existingOrders = [
        { id: 'ORD-0001', items: [], total: 0, timestamp: '2024-01-01', customer: { name: 'Prev', email: '' } },
      ]
      localStorageMock.setItem('orders', JSON.stringify(existingOrders))

      mockCart({ cart: getSampleCart(), total: 90 })
      render(<CheckoutPage />)

      await userEvent.type(screen.getByLabelText(/name/i), 'Elena Darkwood')
      await userEvent.type(screen.getByLabelText(/email/i), 'elena@dark.com')
      await userEvent.type(screen.getByLabelText(/address/i), '123 Crypt Lane')

      fireEvent.click(screen.getByRole('button', { name: /checkout/i }))

      await waitFor(() => {
        const stored = JSON.parse(localStorageMock.setItem.mock.calls[0][1])
        expect(stored).toHaveLength(2) // existing + new
        expect(stored[0].id).toBe('ORD-0001')
        expect(stored[1].id).toMatch(/^ORD-/)
      })
    })
  })
})