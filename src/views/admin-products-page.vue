<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const STORAGE_KEY = 'ticket-challenger-products'

interface Product {
  id: string
  name: string
  price: number
  description: string
  stock: number
  image: string
}

const defaultProducts: Product[] = [
  { id: 'p1', name: 'Emo Night Ticket', price: 29.99, image: '', description: 'General admission', stock: 500 },
  { id: 'p2', name: 'MCR T-Shirt', price: 24.99, image: '', description: 'Black Parade edition', stock: 200 },
  { id: 'p3', name: 'Vinyl Record', price: 34.99, image: '', description: 'Limited edition pressing', stock: 100 },
]

const products = ref<Product[]>([])
const editingId = ref<string | null>(null)
const showDeleteConfirm = ref<string | null>(null)
const showAddForm = ref(false)

const form = ref({ name: '', price: 0, description: '', stock: 0, image: '' })
const formErrors = ref<Record<string, string>>({})

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    products.value = raw ? JSON.parse(raw) : [...defaultProducts]
  } catch {
    products.value = [...defaultProducts]
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products.value))
}

function startEdit(product: Product) {
  editingId.value = product.id
  form.value = { name: product.name, price: product.price, description: product.description, stock: product.stock, image: product.image }
  formErrors.value = {}
}

function cancelEdit() {
  editingId.value = null
  showAddForm.value = false
  formErrors.value = {}
}

function validate(): boolean {
  const e: Record<string, string> = {}
  if (!form.value.name.trim()) e.name = 'Required'
  if (form.value.price <= 0) e.price = 'Must be positive'
  if (form.value.stock < 0) e.stock = 'Cannot be negative'
  formErrors.value = e
  return Object.keys(e).length === 0
}

function saveEdit() {
  if (!validate()) return
  const idx = products.value.findIndex(p => p.id === editingId.value)
  if (idx !== -1) {
    products.value[idx] = { ...products.value[idx], ...form.value }
    saveProducts()
  }
  cancelEdit()
}

function addProduct() {
  if (!validate()) return
  const newProduct: Product = {
    id: `p${Date.now()}`,
    name: form.value.name,
    price: form.value.price,
    description: form.value.description,
    stock: form.value.stock,
    image: form.value.image,
  }
  products.value.push(newProduct)
  saveProducts()
  cancelEdit()
}

function deleteProduct(id: string) {
  products.value = products.value.filter(p => p.id !== id)
  saveProducts()
  showDeleteConfirm.value = null
}

function startAdd() {
  showAddForm.value = true
  editingId.value = null
  form.value = { name: '', price: 0, description: '', stock: 0, image: '' }
}

onMounted(loadProducts)
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-200 p-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <button @click="router.push('/')" class="text-gray-400 hover:text-red-400">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-3xl text-red-400" style="font-family: 'My Chemical Romance', serif">Manage Products</h1>
        </div>
        <button v-if="!showAddForm && !editingId" @click="startAdd" class="py-2 px-4 bg-red-800/60 text-red-200 rounded hover:bg-red-700/60 text-sm font-bold">+ New Product</button>
      </div>

      <!-- Add/Edit Form -->
      <div v-if="showAddForm || editingId" class="p-6 bg-gray-900 rounded border border-red-900/30 mb-6 space-y-3">
        <h2 class="text-red-400 mb-2" style="font-family: 'My Chemical Romance', serif">
          {{ editingId ? 'Edit Product' : 'New Product' }}
        </h2>
        <div>
          <input v-model="form.name" placeholder="Product name" class="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
          <p v-if="formErrors.name" class="text-red-400 text-xs mt-1">{{ formErrors.name }}</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <input v-model.number="form.price" type="number" step="0.01" placeholder="Price" class="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
            <p v-if="formErrors.price" class="text-red-400 text-xs mt-1">{{ formErrors.price }}</p>
          </div>
          <div>
            <input v-model.number="form.stock" type="number" placeholder="Stock" class="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
            <p v-if="formErrors.stock" class="text-red-400 text-xs mt-1">{{ formErrors.stock }}</p>
          </div>
        </div>
        <div>
          <input v-model="form.description" placeholder="Description" class="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
        </div>
        <div class="flex gap-3">
          <button @click="cancelEdit" class="flex-1 py-2 bg-gray-700 rounded hover:bg-gray-600">Cancel</button>
          <button v-if="editingId" @click="saveEdit" class="flex-1 py-2 bg-red-800/60 text-red-200 rounded hover:bg-red-700/60">Save Changes</button>
          <button v-else @click="addProduct" class="flex-1 py-2 bg-red-700 text-white rounded hover:bg-red-600 font-bold">Add Product</button>
        </div>
      </div>

      <!-- Product Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-red-900/30 text-left text-gray-500">
              <th class="p-3">Name</th>
              <th class="p-3">Price</th>
              <th class="p-3">Stock</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id" class="border-b border-gray-800 hover:bg-gray-900/50">
              <td class="p-3 text-gray-200">{{ product.name }}</td>
              <td class="p-3 text-red-400">${{ product.price.toFixed(2) }}</td>
              <td class="p-3 text-gray-400">{{ product.stock }}</td>
              <td class="p-3">
                <div class="flex gap-2">
                  <button @click="startEdit(product)" class="text-blue-400 hover:text-blue-300 text-xs">Edit</button>
                  <button v-if="showDeleteConfirm !== product.id" @click="showDeleteConfirm = product.id" class="text-red-400 hover:text-red-300 text-xs">Delete</button>
                  <template v-else>
                    <button @click="deleteProduct(product.id)" class="text-red-500 hover:text-red-400 text-xs font-bold">Confirm</button>
                    <button @click="showDeleteConfirm = null" class="text-gray-400 text-xs">Cancel</button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
