<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useOrderStore } from '@/stores/orderStore'

const router = useRouter()
const cart = useCartStore()
const orderStore = useOrderStore()

const step = ref<'cart' | 'payment' | 'review'>('cart')
const submitting = ref(false)
const error = ref<string | null>(null)

// Payment form
const payment = ref({
  cardNumber: '',
  expiry: '',
  cvv: '',
  nameOnCard: '',
})

const paymentErrors = computed(() => {
  const e: Record<string, string> = {}
  if (!payment.value.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) e.cardNumber = 'Must be 16 digits'
  if (!payment.value.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) e.expiry = 'Use MM/YY format'
  if (!payment.value.cvv.match(/^\d{3,4}$/)) e.cvv = 'Must be 3-4 digits'
  if (!payment.value.nameOnCard.trim()) e.nameOnCard = 'Required'
  return e
})

const canProceedPayment = computed(() => Object.keys(paymentErrors.value).length === 0)

function goToStep(s: 'cart' | 'payment' | 'review') { step.value = s }

async function submitOrder() {
  if (submitting.value) return
  submitting.value = true
  error.value = null
  try {
    const orderData = {
      items: cart.items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      total: cart.total,
    }
    await orderStore.submitOrder(orderData)
    const orderId = orderStore.currentOrder?.id
    cart.clearCart()
    router.push(`/confirmation/${orderId}`)
  } catch (err: any) {
    error.value = err?.message ?? 'Order submission failed'
  } finally {
    submitting.value = false
  }
}

if (cart.isEmpty) {
  router.replace('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-200 p-4">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <button @click="router.push('/')" class="text-gray-400 hover:text-red-400">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-3xl text-red-400" style="font-family: 'My Chemical Romance', serif">Checkout</h1>
      </div>

      <!-- Step indicator -->
      <div class="flex gap-2 mb-8 text-sm">
        <span :class="step === 'cart' ? 'text-red-400' : 'text-gray-600'">1. Cart</span>
        <span class="text-gray-700">&rarr;</span>
        <span :class="step === 'payment' ? 'text-red-400' : 'text-gray-600'">2. Payment</span>
        <span class="text-gray-700">&rarr;</span>
        <span :class="step === 'review' ? 'text-red-400' : 'text-gray-600'">3. Review</span>
      </div>

      <!-- Step: Cart Review -->
      <div v-if="step === 'cart'" class="space-y-4">
        <div v-for="item in cart.items" :key="item.product.id" class="flex justify-between items-center p-4 bg-gray-900 rounded border border-red-900/20">
          <div>
            <p class="text-gray-200">{{ item.product.name }}</p>
            <p class="text-gray-500 text-sm">${{ item.product.price.toFixed(2) }} x {{ item.quantity }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-red-400">${{ (item.product.price * item.quantity).toFixed(2) }}</span>
            <button @click="cart.removeItem(item.product.id)" class="text-gray-600 hover:text-red-500 text-sm">Remove</button>
          </div>
        </div>
        <div class="text-right text-lg">Total: <span class="text-red-400">${{ cart.total.toFixed(2) }}</span></div>
        <button @click="goToStep('payment')" class="w-full py-3 bg-red-800/60 text-red-200 rounded hover:bg-red-700/60 font-bold">Continue to Payment</button>
      </div>

      <!-- Step: Payment -->
      <div v-if="step === 'payment'" class="space-y-4 max-w-md">
        <div>
          <label class="block text-sm text-gray-400 mb-1">Card Number</label>
          <input v-model="payment.cardNumber" maxlength="19" placeholder="1234 5678 9012 3456"
            class="w-full p-3 bg-gray-900 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
          <p v-if="paymentErrors.cardNumber" class="text-red-500 text-xs mt-1">{{ paymentErrors.cardNumber }}</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-400 mb-1">Expiry</label>
            <input v-model="payment.expiry" maxlength="5" placeholder="MM/YY"
              class="w-full p-3 bg-gray-900 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
            <p v-if="paymentErrors.expiry" class="text-red-500 text-xs mt-1">{{ paymentErrors.expiry }}</p>
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1">CVV</label>
            <input v-model="payment.cvv" maxlength="4" placeholder="123"
              class="w-full p-3 bg-gray-900 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
            <p v-if="paymentErrors.cvv" class="text-red-500 text-xs mt-1">{{ paymentErrors.cvv }}</p>
          </div>
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Name on Card</label>
          <input v-model="payment.nameOnCard" placeholder="Gerard Way"
            class="w-full p-3 bg-gray-900 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
          <p v-if="paymentErrors.nameOnCard" class="text-red-500 text-xs mt-1">{{ paymentErrors.nameOnCard }}</p>
        </div>
        <div class="flex gap-3">
          <button @click="goToStep('cart')" class="flex-1 py-3 bg-gray-800 text-gray-300 rounded hover:bg-gray-700">Back</button>
          <button @click="goToStep('review')" :disabled="!canProceedPayment"
            class="flex-1 py-3 bg-red-800/60 text-red-200 rounded hover:bg-red-700/60 font-bold disabled:opacity-40 disabled:cursor-not-allowed">
            Review Order
          </button>
        </div>
      </div>

      <!-- Step: Review -->
      <div v-if="step === 'review'" class="space-y-4">
        <div class="p-4 bg-gray-900 rounded border border-red-900/20">
          <h3 class="text-red-400 mb-3" style="font-family: 'My Chemical Romance', serif">Order Summary</h3>
          <div v-for="item in cart.items" :key="item.product.id" class="flex justify-between text-sm py-1">
            <span>{{ item.product.name }} x{{ item.quantity }}</span>
            <span class="text-gray-400">${{ (item.product.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="border-t border-red-900/20 mt-3 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span class="text-red-400">${{ cart.total.toFixed(2) }}</span>
          </div>
        </div>
        <div class="p-4 bg-gray-900 rounded border border-red-900/20">
          <h3 class="text-red-400 mb-2" style="font-family: 'My Chemical Romance', serif">Payment</h3>
          <p class="text-gray-400 text-sm">Card ending in {{ payment.cardNumber.slice(-4) }}</p>
        </div>
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        <div class="flex gap-3">
          <button @click="goToStep('payment')" class="flex-1 py-3 bg-gray-800 text-gray-300 rounded hover:bg-gray-700">Back</button>
          <button @click="submitOrder" :disabled="submitting"
            class="flex-1 py-3 bg-red-700 text-white rounded hover:bg-red-600 font-bold disabled:opacity-50">
            {{ submitting ? 'Submitting...' : 'Place Order' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
