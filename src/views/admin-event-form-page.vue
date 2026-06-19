<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/adminStore'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()
const saving = ref(false)
const error = ref<string | null>(null)
const isEdit = ref(false)

const form = ref({
  title: '',
  date: '',
  venue: '',
  price: 0,
  inventory: 0,
  description: '',
})

const formErrors = ref<Record<string, string>>({})

function validate() {
  const e: Record<string, string> = {}
  if (!form.value.title.trim()) e.title = 'Required'
  if (!form.value.date) e.date = 'Required'
  if (!form.value.venue.trim()) e.venue = 'Required'
  if (form.value.price <= 0) e.price = 'Must be positive'
  if (form.value.inventory < 0) e.inventory = 'Cannot be negative'
  formErrors.value = e
  return Object.keys(e).length === 0
}

onMounted(async () => {
  const id = route.params.eventId as string
  if (id) {
    isEdit.value = true
    await adminStore.fetchEvents()
    const existing = adminStore.events.find(e => e.id === id)
    if (existing) {
      form.value = {
        title: existing.title,
        date: existing.date,
        venue: existing.venue,
        price: existing.price,
        inventory: existing.inventory,
        description: existing.description,
      }
    }
  }
})

async function submit() {
  if (!validate()) return
  saving.value = true
  error.value = null
  try {
    const id = route.params.eventId as string
    if (isEdit.value && id) {
      await adminStore.updateEvent(id, form.value)
    } else {
      await adminStore.createEvent(form.value)
    }
    router.push('/admin/events')
  } catch (err: any) {
    error.value = err?.message ?? 'Failed to save event'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-200 p-4">
    <div class="max-w-md mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <button @click="router.push('/admin/events')" class="text-gray-400 hover:text-red-400">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-3xl text-red-400" style="font-family: 'My Chemical Romance', serif">
          {{ isEdit ? 'Edit Event' : 'New Event' }}
        </h1>
      </div>

      <div class="p-6 bg-gray-900 rounded border border-red-900/30 space-y-4">
        <div>
          <label class="block text-sm text-gray-500 mb-1">Title</label>
          <input v-model="form.title" class="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" placeholder="Event title" />
          <p v-if="formErrors.title" class="text-red-400 text-xs mt-1">{{ formErrors.title }}</p>
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">Date</label>
          <input v-model="form.date" type="date" class="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
          <p v-if="formErrors.date" class="text-red-400 text-xs mt-1">{{ formErrors.date }}</p>
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">Venue</label>
          <input v-model="form.venue" class="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" placeholder="Venue name" />
          <p v-if="formErrors.venue" class="text-red-400 text-xs mt-1">{{ formErrors.venue }}</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-500 mb-1">Price ($)</label>
            <input v-model.number="form.price" type="number" step="0.01" min="0" class="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
            <p v-if="formErrors.price" class="text-red-400 text-xs mt-1">{{ formErrors.price }}</p>
          </div>
          <div>
            <label class="block text-sm text-gray-500 mb-1">Inventory</label>
            <input v-model.number="form.inventory" type="number" min="0" class="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none" />
            <p v-if="formErrors.inventory" class="text-red-400 text-xs mt-1">{{ formErrors.inventory }}</p>
          </div>
        </div>
        <div>
          <label class="block text-sm text-gray-500 mb-1">Description</label>
          <textarea v-model="form.description" rows="3" class="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:border-red-500 outline-none resize-none" placeholder="Event description..."></textarea>
        </div>

        <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>

        <button @click="submit" :disabled="saving"
          class="w-full py-3 bg-red-700 text-white rounded hover:bg-red-600 font-bold disabled:opacity-50">
          {{ saving ? 'Saving...' : (isEdit ? 'Update Event' : 'Create Event') }}
        </button>
      </div>
    </div>
  </div>
</template>
