<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/adminStore'

const router = useRouter()
const adminStore = useAdminStore()
const loading = ref(true)
const showDeleteConfirm = ref<string | null>(null)
const deleting = ref(false)

onMounted(async () => {
  await adminStore.fetchEvents()
  loading.value = false
})

async function confirmDelete(id: string) {
  deleting.value = true
  try {
    await adminStore.deleteEvent(id)
    showDeleteConfirm.value = null
  } catch { /* error shown in store */ }
  finally { deleting.value = false }
}

function formatDate(iso: string) { return new Date(iso).toLocaleDateString() }
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
          <h1 class="text-3xl text-red-400" style="font-family: 'My Chemical Romance', serif">Manage Events</h1>
        </div>
        <button @click="router.push('/admin/events/new')" class="py-2 px-4 bg-red-800/60 text-red-200 rounded hover:bg-red-700/60 text-sm font-bold">+ New Event</button>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-red-900 border-t-red-400" />
      </div>

      <div v-else-if="adminStore.events.length === 0" class="text-center py-20">
        <p class="text-gray-500 text-lg">No events yet. Create one to get started.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-red-900/30 text-left text-gray-500">
              <th class="p-3">Title</th>
              <th class="p-3">Date</th>
              <th class="p-3">Venue</th>
              <th class="p-3">Price</th>
              <th class="p-3">Inventory</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in adminStore.events" :key="event.id" class="border-b border-gray-800 hover:bg-gray-900/50">
              <td class="p-3 text-gray-200">{{ event.title }}</td>
              <td class="p-3 text-gray-400">{{ formatDate(event.date) }}</td>
              <td class="p-3 text-gray-400">{{ event.venue }}</td>
              <td class="p-3 text-red-400">${{ event.price.toFixed(2) }}</td>
              <td class="p-3 text-gray-400">{{ event.inventory }}</td>
              <td class="p-3">
                <div class="flex gap-2">
                  <button @click="router.push(`/admin/events/${event.id}/edit`)"
                    class="text-blue-400 hover:text-blue-300 text-xs">Edit</button>
                  <button v-if="showDeleteConfirm !== event.id" @click="showDeleteConfirm = event.id"
                    class="text-red-400 hover:text-red-300 text-xs">Delete</button>
                  <template v-else>
                    <button @click="confirmDelete(event.id)" :disabled="deleting"
                      class="text-red-500 hover:text-red-400 text-xs font-bold">Confirm</button>
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
