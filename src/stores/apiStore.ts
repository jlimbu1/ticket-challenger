import { defineStore } from "pinia";
import api from "@/api";
import type {
  ITicket,
  ITicketCartInfo,
  ITicketingSession,
  TicketingSessionStatus,
} from "@/interface";

export const useApiStore = defineStore("api", {
  state: () => ({
    tickets: [] as ITicket[],
    ticketingSession: {} as ITicketingSession,
    ticketingSessionList: [] as ITicketingSession[],
    loading: false as boolean,
    error: null as string | null,
  }),
  actions: {
    async fetchTickets(): Promise<ITicket[]> {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.getTickets();
        this.tickets = response.data;
        return response.data;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch tickets";
        this.error = message;
        console.error("Error fetching tickets:", message);
        return [];
      } finally {
        this.loading = false;
      }
    },
    async fetchTicketingSession(id: string): Promise<ITicketingSession | null> {
      if (!id) {
        this.error = "Session ID is required";
        return null;
      }
      this.loading = true;
      this.error = null;
      try {
        const response = await api.getTicketingSession(id);
        this.ticketingSession = response.data;
        return response.data;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch ticketing session";
        this.error = message;
        console.error("Error fetching ticketing session:", message);
        return null;
      } finally {
        this.loading = false;
      }
    },
    async fetchTicketingSessions(): Promise<ITicketingSession[]> {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.getTicketingSessions();
        this.ticketingSessionList = response.data;
        return response.data;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch ticketing sessions";
        this.error = message;
        console.error("Error fetching ticketing sessions:", message);
        return [];
      } finally {
        this.loading = false;
      }
    },
    async createTicketingSession(session: Omit<ITicketingSession, "id">): Promise<ITicketingSession | null> {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.createTicketingSession(session);
        this.ticketingSessionList.push(response.data);
        return response.data;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create ticketing session";
        this.error = message;
        console.error("Error creating ticketing session:", message);
        return null;
      } finally {
        this.loading = false;
      }
    },
    async updateTicketingSession(id: string, session: Partial<ITicketingSession>): Promise<ITicketingSession | null> {
      if (!id) {
        this.error = "Session ID is required";
        return null;
      }
      this.loading = true;
      this.error = null;
      try {
        const response = await api.updateTicketingSession(id, session);
        const index = this.ticketingSessionList.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.ticketingSessionList[index] = response.data;
        }
        if (this.ticketingSession.id === id) {
          this.ticketingSession = response.data;
        }
        return response.data;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update ticketing session";
        this.error = message;
        console.error("Error updating ticketing session:", message);
        return null;
      } finally {
        this.loading = false;
      }
    },
    async deleteTicketingSession(id: string): Promise<boolean> {
      if (!id) {
        this.error = "Session ID is required";
        return false;
      }
      this.loading = true;
      this.error = null;
      try {
        await api.deleteTicketingSession(id);
        this.ticketingSessionList = this.ticketingSessionList.filter((s) => s.id !== id);
        if (this.ticketingSession.id === id) {
          this.ticketingSession = {} as ITicketingSession;
        }
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete ticketing session";
        this.error = message;
        console.error("Error deleting ticketing session:", message);
        return false;
      } finally {
        this.loading = false;
      }
    },
    async addTicketToCart(ticketId: string, quantity: number): Promise<ITicketCartInfo | null> {
      if (!ticketId || quantity < 1) {
        this.error = "Invalid ticket ID or quantity";
        return null;
      }
      this.loading = true;
      this.error = null;
      try {
        const response = await api.addTicketToCart(ticketId, quantity);
        return response.data;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to add ticket to cart";
        this.error = message;
        console.error("Error adding ticket to cart:", message);
        return null;
      } finally {
        this.loading = false;
      }
    },
    async removeTicketFromCart(ticketId: string): Promise<boolean> {
      if (!ticketId) {
        this.error = "Ticket ID is required";
        return false;
      }
      this.loading = true;
      this.error = null;
      try {
        await api.removeTicketFromCart(ticketId);
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to remove ticket from cart";
        this.error = message;
        console.error("Error removing ticket from cart:", message);
        return false;
      } finally {
        this.loading = false;
      }
    },
    async updateCartTicketQuantity(ticketId: string, quantity: number): Promise<boolean> {
      if (!ticketId || quantity < 1) {
        this.error = "Invalid ticket ID or quantity";
        return false;
      }
      this.loading = true;
      this.error = null;
      try {
        await api.updateCartTicketQuantity(ticketId, quantity);
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update cart ticket quantity";
        this.error = message;
        console.error("Error updating cart ticket quantity:", message);
        return false;
      } finally {
        this.loading = false;
      }
    },
    async clearCart(): Promise<boolean> {
      this.loading = true;
      this.error = null;
      try {
        await api.clearCart();
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to clear cart";
        this.error = message;
        console.error("Error clearing cart:", message);
        return false;
      } finally {
        this.loading = false;
      }
    },
    async checkout(): Promise<{ orderId: string } | null> {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.checkout();
        return response.data;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to checkout";
        this.error = message;
        console.error("Error during checkout:", message);
        return null;
      } finally {
        this.loading = false;
      }
    },
    clearError(): void {
      this.error = null;
    },
  },
});