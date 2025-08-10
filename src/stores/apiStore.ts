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
    error: null as string,
  }),
  actions: {
    async fetchTickets(): Promise<ITicket[]> {
      this.loading = true;
      try {
        const response = await api.getTickets();
        this.tickets = response.data;
        return response.data;
      } catch (error) {
        this.error = error;
        console.error("Error fetching tickets:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchTicketingSession(id: string): Promise<ITicketingSession> {
      this.loading = true;
      try {
        const response = await api.getTicketingSession(id);
        this.ticketingSession = response.data;
        return response.data;
      } catch (error) {
        this.error = error;
        console.error("Error fetching ticketing session:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchTicketingSessionList({
      status,
      sortBy,
    }: {
      status: TicketingSessionStatus;
      sortBy: string;
    }): Promise<ITicketingSession[]> {
      this.loading = true;
      try {
        const response = await api.getTicketingSessionList({
          params: { status, sortBy },
        });
        this.ticketingSessionList = response.data;
        return response.data;
      } catch (error) {
        this.error = error;
        console.error("Error fetching ticketing session list:", error);
        throw error; // Consider re-throwing the error to handle it in the calling code
      } finally {
        this.loading = false;
      }
    },
    async createTicketingSession(data: {
      username: string;
    }): Promise<ITicketingSession> {
      try {
        const response = await api.postTicketingSession(data);
        this.ticketingSession = response.data;
        return response.data;
      } catch (error) {
        console.error("Error creating ticketing session:", error);
        throw error;
      }
    },
    async startTicketingSessionQueue(id: string): Promise<{
      initialPosition: number;
      message: string;
      success: boolean;
    }> {
      try {
        const response = await api.startTicketingSessionQueue(id);
        this.ticketingSession = response.data;
        return response.data;
      } catch (error) {
        console.error("Error starting queue:", error);
        throw error;
      }
    },
    async checkoutTicketingSession(
      id: string,
      data: ITicketCartInfo[]
    ): Promise<{
      success: boolean;
      data: ITicketingSession;
      errors: { ticketId: string; error: string };
      message: string;
    }> {
      try {
        const response = await api.checkoutTicketingSession(id, data);
        this.ticketingSession = response.data;
        return response.data;
      } catch (error) {
        console.error("Error starting queue:", error);
        throw error;
      }
    },
  },
});
