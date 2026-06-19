import { defineStore } from 'pinia'
import { api } from '@/api'
import type { EventData } from '@/types'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    events: [] as EventData[],
    currentEvent: null as EventData | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    allEvents: (state) => state.events,
    eventById: (state) => {
      return (id: string) => state.events.find((e) => e.id === id) ?? null
    }
  },

  actions: {
    async fetchEvents() {
      this.loading = true
      this.error = null
      try {
        const response = await api.getEvents()
        this.events = [...response]
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to fetch events'
      } finally {
        this.loading = false
      }
    },

    async createEvent(data: Omit<EventData, 'id'>) {
      this.loading = true
      this.error = null
      try {
        const response = await api.createEvent(data)
        this.events = [...this.events, { ...response }]
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to create event'
      } finally {
        this.loading = false
      }
    },

    async updateEvent(id: string, data: Partial<Omit<EventData, 'id'>>) {
      this.loading = true
      this.error = null
      try {
        const response = await api.updateEvent(id, data)
        this.events = this.events.map((e) => (e.id === id ? { ...e, ...response } : e))
        if (this.currentEvent?.id === id) {
          this.currentEvent = { ...this.currentEvent, ...response }
        }
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to update event'
      } finally {
        this.loading = false
      }
    },

    async deleteEvent(id: string) {
      this.loading = true
      this.error = null
      try {
        await api.deleteEvent(id)
        this.events = this.events.filter((e) => e.id !== id)
        if (this.currentEvent?.id === id) {
          this.currentEvent = null
        }
      } catch (err: any) {
        this.error = err?.message ?? 'Failed to delete event'
      } finally {
        this.loading = false
      }
    },
  }
})