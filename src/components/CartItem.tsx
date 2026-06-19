import { computed } from 'vue'
import { useCartStore } from '../stores/cartStore'

interface CartItemProps {
  eventId: string
  eventName: string
  ticketType: string
  price: number
  quantity: number
  isAnimating: boolean
}

export default function CartItem(props: CartItemProps) {
  const cartStore = useCartStore()

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`
  }

  const handleQuantityChange = (newQuantity: number): void => {
    if (newQuantity < 1) {
      cartStore.removeItem(props.eventId, props.ticketType)
      return
    }
    cartStore.updateQuantity(props.eventId, props.ticketType, newQuantity)
  }

  const handleRemove = (): void => {
    cartStore.removeItem(props.eventId, props.ticketType)
  }

  const itemTotal = computed(() => {
    return props.price * props.quantity
  })

  return (
    <div class="cart-item border-b border-crimson-900/30 py-4 last:border-b-0">
      <div class="flex items-start gap-4">
        <div class="relative flex-shrink-0">
          <div
            class={[
              'w-16 h-16 rounded border border-crimson-800/50 flex items-center justify-center bg-crimson-900/20 text-crimson-300 text-xs font-medium',
              { 'animate-pulse': props.isAnimating }
            ]}
            data-testid="cart-item-icon"
          >
            {props.eventName.charAt(0).toUpperCase()}
          </div>
          {props.isAnimating && (
            <div
              class="absolute inset-0 flex items-center justify-center bg-crimson-900/60 rounded"
              data-testid="cart-item-removing"
            >
              <svg class="w-6 h-6 text-crimson-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-medium text-crimson-100 truncate" data-testid="cart-item-title">
            {props.eventName} - {props.ticketType}
          </h3>
          <p class="text-sm text-crimson-400 mt-1" data-testid="cart-item-price">
            {formatPrice(props.price)} each
          </p>
          <div class="flex items-center gap-2 mt-2">
            <button
              onClick={() => handleQuantityChange(props.quantity - 1)}
              class="flex items-center justify-center w-8 h-8 rounded border border-crimson-800/50 text-crimson-300 hover:bg-crimson-800/30 transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span class="text-sm text-crimron-100 font-medium w-8 text-center" data-testid="cart-item-quantity">
              {props.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(props.quantity + 1)}
              class="flex items-center justify-center w-8 h-8 rounded border border-crimson-800/50 text-crimson-300 hover:bg-crimson-800/30 transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
            <button
              onClick={handleRemove}
              class="ml-auto text-sm text-crimson-400 hover:text-crimson-300 transition-colors"
              data-testid="cart-item-remove"
            >
              Remove
            </button>
          </div>
        </div>
        <div class="flex-shrink-0 text-right">
          <p class="text-sm font-semibold text-crimon-100" data-testid="cart-item-total">
            {formatPrice(itemTotal.value)}
          </p>
        </div>
      </div>
    </div>
  )
}