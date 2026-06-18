import { defineStore } from "pinia";
import api from "@/api";
export const useApiStore = defineStore("api", {
    state: () => ({
        tickets: [],
        ticketingSession: {},
        ticketingSessionList: [],
        loading: false,
        error: null,
    }),
    actions: {
        async fetchTickets() {
            this.loading = true;
            try {
                const response = await api.getTickets();
                this.tickets = response.data;
                return response.data;
            }
            catch (error) {
                this.error = error;
                console.error("Error fetching tickets:", error);
            }
            finally {
                this.loading = false;
            }
        },
        async fetchTicketingSession(id) {
            this.loading = true;
            try {
                const response = await api.getTicketingSession(id);
                this.ticketingSession = response.data;
                return response.data;
            }
            catch (error) {
                this.error = error;
                console.error("Error fetching ticketing session:", error);
            }
            finally {
                this.loading = false;
            }
        },
        async fetchTicketingSessionList({ status, sortBy, }) {
            this.loading = true;
            try {
                const response = await api.getTicketingSessionList({
                    params: { status, sortBy },
                });
                this.ticketingSessionList = response.data;
                return response.data;
            }
            catch (error) {
                this.error = error;
                console.error("Error fetching ticketing session list:", error);
                throw error; // Consider re-throwing the error to handle it in the calling code
            }
            finally {
                this.loading = false;
            }
        },
        async createTicketingSession(data) {
            try {
                const response = await api.postTicketingSession(data);
                this.ticketingSession = response.data;
                return response.data;
            }
            catch (error) {
                console.error("Error creating ticketing session:", error);
                throw error;
            }
        },
        async startTicketingSessionQueue(id) {
            try {
                const response = await api.startTicketingSessionQueue(id);
                this.ticketingSession = response.data;
                return response.data;
            }
            catch (error) {
                console.error("Error starting queue:", error);
                throw error;
            }
        },
        async checkoutTicketingSession(id, data) {
            try {
                const response = await api.checkoutTicketingSession(id, data);
                this.ticketingSession = response.data;
                return response.data;
            }
            catch (error) {
                console.error("Error starting queue:", error);
                throw error;
            }
        },
    },
});
