import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'
import type { EventData } from '@/types'

export const useAdminStore = defineStore('admin', () => {
  const events = ref<EventData[]>([])
  const currentEvent = ref<EventData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const allEvents = computed(() => events.value)
  const eventById = computed(() => (id: string) =>
    events.value.find(e => e.id === id) ?? null
  )

  async function fetchEvents(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await api.getEvents()
      events.value = Array.isArray(data) ? [...data] : []
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to fetch events'
    } finally {
      loading.value = false
    }
  }

  async function createEvent(data: Omit<EventData, 'id'>): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const created = await api.createEvent(data)
      events.value = [...events.value, { ...created }]
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to create event'
    } finally {
      loading.value = false
    }
  }

  async function updateEvent(id: string, data: Partial<Omit<EventData, 'id'>>): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const updated = await api.updateEvent(id, data)
      events.value = events.value.map(e =>
        e.id === id ? { ...e, ...updated } : e
      )
      if (currentEvent.value?.id === id) {
        currentEvent.value = { ...currentEvent.value, ...updated }
      }
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to update event'
    } finally {
      loading.value = false
    }
  }

  async function deleteEvent(id: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await api.deleteEvent(id)
      events.value = events.value.filter(e => e.id !== id)
      if (currentEvent.value?.id === id) {
        currentEvent.value = null
      }
    } catch (err: any) {
      error.value = err?.message ?? 'Failed to delete event'
    } finally {
      loading.value = false
    }
  }

  return {
    events, currentEvent, loading, error,
    allEvents, eventById,
    fetchEvents, createEvent, updateEvent, deleteEvent,
  }
})
