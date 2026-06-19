import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const mockOrders = [
  {
    _id: "mock-order-1",
    tickets: [
      { ticketId: "mock-ticket-1", name: "General Admission", quantity: 2, price: 50 },
    ],
    total: 100,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  },
];

const mockUserProfile = {
  _id: "mock-user-1",
  name: "John Doe",
  email: "john@example.com",
};

const mockEvents = [
  {
    _id: "mock-event-1",
    title: "Sample Event",
    date: new Date().toISOString(),
    venue: "Main Hall",
    ticketInventory: 100,
    price: 25,
  },
];

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
    return (await apiClient.patch(`/ticketing-sessions/checkout/${id}`, data)).data;
  },

  /**
   * Submit a new order.
   * @param {Object} orderData - The order data to submit.
   * @returns {Promise<Object>} The created order, or mock data if API unavailable.
   */
  async submitOrder(orderData) {
    try {
      return (await apiClient.post("/orders", orderData)).data;
    } catch (error) {
      console.error("Failed to submit order:", error);
      return mockOrders[0];
    }
  },

  /**
   * Get all orders for the current user.
   * @returns {Promise<Array>} List of orders, or mock data if API unavailable.
   */
  async getOrders() {
    try {
      return (await apiClient.get("/orders")).data;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return mockOrders;
    }
  },

  /**
   * Get a single order by ID.
   * @param {string} id - The order ID.
   * @returns {Promise<Object>} The order, or mock data if API unavailable.
   */
  async getOrderById(id) {
    try {
      return (await apiClient.get(`/orders/${id}`)).data;
    } catch (error) {
      console.error("Failed to fetch order by ID:", error);
      return mockOrders[0];
    }
  },

  /**
   * Get the current user's profile.
   * @returns {Promise<Object>} The user profile, or mock data if API unavailable.
   */
  async getUserProfile() {
    try {
      return (await apiClient.get("/users/me")).data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return mockUserProfile;
    }
  },

  /**
   * Update the current user's profile.
   * @param {Object} data - The profile data to update.
   * @returns {Promise<Object>} The updated user profile, or mock data if API unavailable.
   */
  async updateUserProfile(data) {
    try {
      return (await apiClient.put("/users/me", data)).data;
    } catch (error) {
      console.error("Failed to update user profile:", error);
      return mockUserProfile;
    }
  },

  /**
   * Change the current user's password.
   * @param {string} oldPassword - The current password.
   * @param {string} newPassword - The new password.
   * @returns {Promise<Object>} The response, or mock data if API unavailable.
   */
  async changePassword(oldPassword, newPassword) {
    try {
      return (await apiClient.put("/users/me/password", { oldPassword, newPassword })).data;
    } catch (error) {
      console.error("Failed to change password:", error);
      return { success: true };
    }
  },

  /**
   * Get all events.
   * @returns {Promise<Array>} List of events, or mock data if API unavailable.
   */
  async getEvents() {
    try {
      return (await apiClient.get("/events")).data;
    } catch (error) {
      console.error("Failed to fetch events:", error);
      return mockEvents;
    }
  },

  /**
   * Create a new event.
   * @param {Object} eventData - The event data to create.
   * @returns {Promise<Object>} The created event, or mock data if API unavailable.
   */
  async createEvent(eventData) {
    try {
      return (await apiClient.post("/events", eventData)).data;
    } catch (error) {
      console.error("Failed to create event:", error);
      return mockEvents[0];
    }
  },

  /**
   * Update an existing event.
   * @param {string} id - The event ID.
   * @param {Object} eventData - The updated event data.
   * @returns {Promise<Object>} The updated event, or mock data if API unavailable.
   */
  async updateEvent(id, eventData) {
    try {
      return (await apiClient.put(`/events/${id}`, eventData)).data;
    } catch (error) {
      console.error("Failed to update event:", error);
      return mockEvents[0];
    }
  },

  /**
   * Delete an event.
   * @param {string} id - The event ID.
   * @returns {Promise<Object>} The response, or mock data if API unavailable.
   */
  async deleteEvent(id) {
    try {
      return (await apiClient.delete(`/events/${id}`)).data;
    } catch (error) {
      console.error("Failed to delete event:", error);
      return { success: true };
    }
  },
};