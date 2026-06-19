import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { api } from '@/api'

vi.mock('@/api', () => ({
  api: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    changePassword: vi.fn()
  }
}))

const mockProfile = {
  id: 'usr-1',
  name: 'Jane Doe',
  email: 'jane@example.com',
  avatar: 'https://example.com/avatar.png',
  orderCount: 3
}

const mockUpdatedProfile = {
  id: 'usr-1',
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  avatar: 'https://example.com/avatar.png',
  orderCount: 3
}

describe('userStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('state', () => {
    it('initializes with default state', () => {
      const store = useUserStore()
      expect(store.profile).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('getters', () => {
    it('currentProfile returns profile', () => {
      const store = useUserStore()
      store.profile = { ...mockProfile }
      expect(store.currentProfile).toEqual(mockProfile)
    })

    it('currentProfile returns null when no profile', () => {
      const store = useUserStore()
      expect(store.currentProfile).toBeNull()
    })
  })

  describe('actions', () => {
    describe('fetchProfile', () => {
      it('sets profile on success', async () => {
        vi.mocked(api.getProfile).mockResolvedValue(mockProfile)
        const store = useUserStore()
        expect(store.loading).toBe(false)

        const promise = store.fetchProfile()
        expect(store.loading).toBe(true)

        await promise

        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
        expect(store.profile).toEqual(mockProfile)
      })

      it('sets error on API failure', async () => {
        const errorMessage = 'Network error'
        vi.mocked(api.getProfile).mockRejectedValue(new Error(errorMessage))
        const store = useUserStore()

        await store.fetchProfile()

        expect(store.loading).toBe(false)
        expect(store.error).toBe(errorMessage)
        expect(store.profile).toBeNull()
      })

      it('handles generic error if message is missing', async () => {
        vi.mocked(api.getProfile).mockRejectedValue(null)
        const store = useUserStore()

        await store.fetchProfile()

        expect(store.loading).toBe(false)
        expect(store.error).toBe('Failed to fetch profile')
        expect(store.profile).toBeNull()
      })
    })

    describe('updateProfile', () => {
      it('updates profile on success', async () => {
        const updateData = { name: 'Jane Smith', email: 'jane.smith@example.com' }
        vi.mocked(api.updateProfile).mockResolvedValue(mockUpdatedProfile)
        const store = useUserStore()
        store.profile = { ...mockProfile }
        expect(store.loading).toBe(false)

        const promise = store.updateProfile(updateData)
        expect(store.loading).toBe(true)

        await promise

        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
        expect(store.profile).toEqual({
          ...mockProfile,
          ...mockUpdatedProfile
        })
      })

      it('sets error on API failure', async () => {
        const updateData = { name: 'Jane Smith' }
        const errorMessage = 'Update failed'
        vi.mocked(api.updateProfile).mockRejectedValue(new Error(errorMessage))
        const store = useUserStore()

        await store.updateProfile(updateData)

        expect(store.loading).toBe(false)
        expect(store.error).toBe(errorMessage)
      })

      it('does not update profile if response is null', async () => {
        const updateData = { name: 'Jane Smith' }
        vi.mocked(api.updateProfile).mockResolvedValue(null)
        const store = useUserStore()
        store.profile = { ...mockProfile }

        await store.updateProfile(updateData)

        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
        expect(store.profile).toEqual(mockProfile)
      })
    })

    describe('changePassword', () => {
      it('resets loading and error on success', async () => {
        vi.mocked(api.changePassword).mockResolvedValue(undefined)
        const store = useUserStore()
        expect(store.loading).toBe(false)

        const promise = store.changePassword('oldPass', 'newPass')
        expect(store.loading).toBe(true)

        await promise

        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('sets error on API failure', async () => {
        const errorMessage = 'Password change failed'
        vi.mocked(api.changePassword).mockRejectedValue(new Error(errorMessage))
        const store = useUserStore()

        await store.changePassword('oldPass', 'newPass')

        expect(store.loading).toBe(false)
        expect(store.error).toBe(errorMessage)
      })

      it('handles generic error if message is missing', async () => {
        vi.mocked(api.changePassword).mockRejectedValue(null)
        const store = useUserStore()

        await store.changePassword('oldPass', 'newPass')

        expect(store.loading).toBe(false)
        expect(store.error).toBe('Failed to change password')
      })
    })
  })
})