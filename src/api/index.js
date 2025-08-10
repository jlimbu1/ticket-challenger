import axios from "axios";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  async getTickets() {
    return (await apiClient.get("/tickets")).data;
  },
  async getTicketingSession(id) {
    return (await apiClient.get(`/ticketing-sessions/${id}`)).data;
  },
  async getTicketingSessionList(params) {
    return (await apiClient.get(`/ticketing-sessions`, params)).data;
  },
  async postTicketingSession(data) {
    return (await apiClient.post("/ticketing-sessions", data)).data;
  },
  async startTicketingSessionQueue(id) {
    return (await apiClient.patch(`/ticketing-sessions/startQueue/${id}`)).data;
  },
  async checkoutTicketingSession(id, data) {
    return (await apiClient.patch(`/ticketing-sessions/checkout/${id}`, data))
      .data;
  },
};
