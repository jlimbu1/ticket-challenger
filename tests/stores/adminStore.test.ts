import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAdminStore } from '@/stores/adminStore'
import { api } from '@/api'

vi.mock('@/api', () => ({
  api: {
    getEvents: vi.fn(),
    createEvent: vi.fn(),
    updateEvent: vi.fn(),
    deleteEvent: vi.fn()
  }
}))

const mockEvents = [
  {
    id: 'evt-1',
    title: 'Emo Night',
    date: '2026-07-15T20:00:00Z',
    venue: 'The Underground',
    price: 25,
    inventory: 200,
    description: 'A night of emo classics'
  },
  {
    id: 'evt-2',
    title: 'Goth Fest',
    date: '2026-08-01T18:00:00Z',
    venue: 'Dark Cathedral',
    price: 40,
    inventory: 500,
    description: 'Annual goth gathering'
  }
]

const mockSingleEvent = {
  id: 'evt-1',
  title: 'Emo Night',
  date: '2026-07-15T20:00:00Z',
  venue: 'The Underground',
  price: 25,
  inventory: 200,
  description: 'A night of emo classics'
}

const mockNewEventData = {
  title: 'New Event',
  date: '2026-09-01T19:00:00Z',
  venue: 'The Warehouse',
  price: 30,
  inventory: 300,
  description: 'Brand new event'
}

const mockCreatedEvent = {
  id: 'evt-3',
  ...mockNewEventData
}

const mockUpdatedEvent = {
  id: 'evt-1',
  title: 'Emo Night Updated',
  date: '2026-07-15T20:00:00Z',
  venue: 'The Underground',
  price: 30,
  inventory: 150,
  description: 'Updated description'
}

describe('adminStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('state', () => {
    it('initializes with default state', () => {
      const store = useAdminStore()
      expect(store.events).toEqual([])
      expect(store.currentEvent).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('getters', () => {
    it('allEvents returns events array', () => {
      const store = useAdminStore()
      store.events = [...mockEvents]
      expect(store.allEvents).toEqual(mockEvents)
    })

    it('eventById returns event by id', () => {
      const store = useAdminStore()
      store.events = [...mockEvents]
      expect(store.eventById('evt-1')).toEqual(mockSingleEvent)
    })

    it('eventById returns null for non-existent id', () => {
      const store = useAdminStore()
      store.events = [...mockEvents]
      expect(store.eventById('nonexistent')).toBeNull()
    })

    it('eventById returns null when events is empty', () => {
      const store = useAdminStore()
      expect(store.eventById('evt-1')).toBeNull()
    })
  })

  describe('actions', () => {
    describe('fetchEvents', () => {
      it('sets events on success', async () => {
        vi.mocked(api.getEvents).mockResolvedValue(mockEvents)
        const store = useAdminStore()
        await store.fetchEvents()
        expect(store.events).toEqual(mockEvents)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('sets error on failure', async () => {
        const errorMessage = 'Network Error'
        vi.mocked(api.getEvents).mockRejectedValue(new Error(errorMessage))
        const store = useAdminStore()
        await store.fetchEvents()
        expect(store.events).toEqual([])
        expect(store.error).toBe(errorMessage)
        expect(store.loading).toBe(false)
      })

      it('sets loading to true during fetch', async () => {
        vi.mocked(api.getEvents).mockResolvedValue(mockEvents)
        const store = useAdminStore()
        const fetchPromise = store.fetchEvents()
        expect(store.loading).toBe(true)
        await fetchPromise
        expect(store.loading).toBe(false)
      })
    })

    describe('createEvent', () => {
      it('adds created event to events array on success', async () => {
        vi.mocked(api.createEvent).mockResolvedValue(mockCreatedEvent)
        const store = useAdminStore()
        await store.createEvent(mockNewEventData)
        expect(store.events).toHaveLength(1)
        expect(store.events[0]).toEqual(mockCreatedEvent)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('appends to existing events', async () => {
        vi.mocked(api.createEvent).mockResolvedValue(mockCreatedEvent)
        const store = useAdminStore()
        store.events = [...mockEvents]
        await store.createEvent(mockNewEventData)
        expect(store.events).toHaveLength(3)
        expect(store.events[2]).toEqual(mockCreatedEvent)
      })

      it('sets error on failure', async () => {
        const errorMessage = 'Failed to create event'
        vi.mocked(api.createEvent).mockRejectedValue(new Error(errorMessage))
        const store = useAdminStore()
        await store.createEvent(mockNewEventData)
        expect(store.events).toEqual([])
        expect(store.error).toBe(errorMessage)
        expect(store.loading).toBe(false)
      })

      it('sets loading to true during creation', async () => {
        vi.mocked(api.createEvent).mockResolvedValue(mockCreatedEvent)
        const store = useAdminStore()
        const createPromise = store.createEvent(mockNewEventData)
        expect(store.loading).toBe(true)
        await createPromise
        expect(store.loading).toBe(false)
      })
    })

    describe('updateEvent', () => {
      it('updates event in list on success', async () => {
        vi.mocked(api.updateEvent).mockResolvedValue(mockUpdatedEvent)
        const store = useAdminStore()
        store.events = [...mockEvents]
        await store.updateEvent('evt-1', { title: 'Emo Night Updated', price: 30, inventory: 150, description: 'Updated description' })
        expect(store.events).toHaveLength(2)
        const updatedEvent = store.events.find(e => e.id === 'evt-1')
        expect(updatedEvent).toEqual(mockUpdatedEvent)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('does nothing if event id not found', async () => {
        vi.mocked(api.updateEvent).mockResolvedValue(mockUpdatedEvent)
        const store = useAdminStore()
        store.events = [...mockEvents]
        await store.updateEvent('nonexistent', { title: 'Updated' })
        expect(store.events).toEqual(mockEvents)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('sets error on failure', async () => {
        const errorMessage = 'Failed to update event'
        vi.mocked(api.updateEvent).mockRejectedValue(new Error(errorMessage))
        const store = useAdminStore()
        store.events = [...mockEvents]
        await store.updateEvent('evt-1', { title: 'Updated' })
        expect(store.events).toEqual(mockEvents)
        expect(store.error).toBe(errorMessage)
        expect(store.loading).toBe(false)
      })

      it('sets loading to true during update', async () => {
        vi.mocked(api.updateEvent).mockResolvedValue(mockUpdatedEvent)
        const store = useAdminStore()
        store.events = [...mockEvents]
        const updatePromise = store.updateEvent('evt-1', { title: 'Updated' })
        expect(store.loading).toBe(true)
        await updatePromise
        expect(store.loading).toBe(false)
      })
    })

    describe('deleteEvent', () => {
      it('removes event from list on success', async () => {
        vi.mocked(api.deleteEvent).mockResolvedValue(undefined)
        const store = useAdminStore()
        store.events = [...mockEvents]
        await store.deleteEvent('evt-1')
        expect(store.events).toHaveLength(1)
        expect(store.events[0].id).toBe('evt-2')
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('does nothing if event id not found', async () => {
        vi.mocked(api.deleteEvent).mockResolvedValue(undefined)
        const store = useAdminStore()
        store.events = [...mockEvents]
        await store.deleteEvent('nonexistent')
        expect(store.events).toEqual(mockEvents)
        expect(store.loading).toBe(false)
      })

      it('clears currentEvent if deleting the current event', async () => {
        vi.mocked(api.deleteEvent).mockResolvedValue(undefined)
        const store = useAdminStore()
        store.events = [...mockEvents]
        store.currentEvent = mockSingleEvent
        await store.deleteEvent('evt-1')
        expect(store.events).toHaveLength(1)
        expect(store.currentEvent).toBeNull()
      })

      it('sets error on failure', async () => {
        const errorMessage = 'Failed to delete event'
        vi.mocked(api.deleteEvent).mockRejectedValue(new Error(errorMessage))
        const store = useAdminStore()
        store.events = [...mockEvents]
        await store.deleteEvent('evt-1')
        expect(store.events).toEqual(mockEvents)
        expect(store.error).toBe(errorMessage)
        expect(store.loading).toBe(false)
      })

      it('sets loading to true during deletion', async () => {
        vi.mocked(api.deleteEvent).mockResolvedValue(undefined)
        const store = useAdminStore()
        store.events = [...mockEvents]
        const deletePromise = store.deleteEvent('evt-1')
        expect(store.loading).toBe(true)
        await deletePromise
        expect(store.loading).toBe(false)
      })
    })
  })
})