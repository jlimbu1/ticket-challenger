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

// ── Mock data (fallback when API is unavailable) ──

const mockOrders = [
  {
    id: "ord-001",
    items: [{ productId: "p1", title: "Emo Night Ticket", price: 29.99, quantity: 2 }],
    total: 59.98,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  },
];

const mockOrder = {
  id: "ord-001",
  items: [
    { productId: "p1", title: "Emo Night Ticket", price: 29.99, quantity: 2 },
    { productId: "p2", title: "My Chemical Romance T-Shirt", price: 24.99, quantity: 1 },
  ],
  total: 84.97,
  status: "confirmed",
  createdAt: new Date().toISOString(),
};

const mockUser = {
  id: "usr-001",
  name: "Gerard Way",
  email: "gerard@mcr.com",
  avatar: "",
  orderCount: 5,
};

const mockEvents = [
  {
    id: "evt-001",
    title: "When We Were Young Fest",
    date: "2026-10-24",
    venue: "Las Vegas Festival Grounds",
    price: 199.99,
    inventory: 5000,
    description: "The ultimate emo and pop-punk festival.",
  },
  {
    id: "evt-002",
    title: "My Chemical Romance Live",
    date: "2026-11-15",
    venue: "Madison Square Garden",
    price: 149.99,
    inventory: 1200,
    description: "The Black Parade returns.",
  },
];

const mockEvent = {
  id: "evt-new",
  title: "New Event",
  date: "2026-12-01",
  venue: "TBD",
  price: 0,
  inventory: 0,
  description: "",
};

// ── API client ──

export default {
  // ── Tickets (existing) ──

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

  // ── Orders ──

  /**
   * Submit a new order.
   * @param {Object} orderData — shape: { items: [{productId, quantity}], total }
   * @returns {Promise<Object>} the created order with id and status
   */
  async submitOrder(orderData) {
    try {
      const response = await apiClient.post("/orders", orderData);
      return response.data;
    } catch (err) {
      console.error("submitOrder failed:", err.message);
      return { ...mockOrder, id: `ord-${Date.now()}`, status: "pending" };
    }
  },

  /**
   * Fetch all orders for the current user.
   * @returns {Promise<Array>} list of orders
   */
  async getOrders() {
    try {
      const response = await apiClient.get("/orders");
      return response.data;
    } catch (err) {
      console.error("getOrders failed:", err.message);
      return mockOrders;
    }
  },

  /**
   * Fetch a single order by ID.
   * @param {string} id — order ID
   * @returns {Promise<Object>} the order
   */
  async getOrderById(id) {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    } catch (err) {
      console.error(`getOrderById(${id}) failed:`, err.message);
      return { ...mockOrder, id };
    }
  },

  // ── User Profile ──

  /**
   * Fetch the current user's profile.
   * @returns {Promise<Object>} user profile
   */
  async getUserProfile() {
    try {
      const response = await apiClient.get("/users/me");
      return response.data;
    } catch (err) {
      console.error("getUserProfile failed:", err.message);
      return { ...mockUser };
    }
  },

  /**
   * Update the current user's profile.
   * @param {Object} data — { name, email }
   * @returns {Promise<Object>} updated profile
   */
  async updateUserProfile(data) {
    try {
      const response = await apiClient.put("/users/me", data);
      return response.data;
    } catch (err) {
      console.error("updateUserProfile failed:", err.message);
      return { ...mockUser, ...data };
    }
  },

  /**
   * Change the current user's password.
   * @param {string} oldPassword
   * @param {string} newPassword
   * @returns {Promise<Object>} success message
   */
  async changePassword(oldPassword, newPassword) {
    try {
      const response = await apiClient.put("/users/me/password", {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (err) {
      console.error("changePassword failed:", err.message);
      return { success: true, message: "Password changed (mock)" };
    }
  },

  // ── Admin Events ──

  /**
   * Fetch all events (admin view — includes inventory).
   * @returns {Promise<Array>} list of events
   */
  async getEvents() {
    try {
      const response = await apiClient.get("/events");
      return response.data;
    } catch (err) {
      console.error("getEvents failed:", err.message);
      return [...mockEvents];
    }
  },

  /**
   * Create a new event.
   * @param {Object} eventData — { title, date, venue, price, inventory, description }
   * @returns {Promise<Object>} created event
   */
  async createEvent(eventData) {
    try {
      const response = await apiClient.post("/events", eventData);
      return response.data;
    } catch (err) {
      console.error("createEvent failed:", err.message);
      return { ...mockEvent, ...eventData, id: `evt-${Date.now()}` };
    }
  },

  /**
   * Update an existing event.
   * @param {string} id — event ID
   * @param {Object} eventData — fields to update
   * @returns {Promise<Object>} updated event
   */
  async updateEvent(id, eventData) {
    try {
      const response = await apiClient.put(`/events/${id}`, eventData);
      return response.data;
    } catch (err) {
      console.error(`updateEvent(${id}) failed:`, err.message);
      return { ...mockEvent, ...eventData, id };
    }
  },

  /**
   * Delete an event.
   * @param {string} id — event ID
   * @returns {Promise<Object>} deletion confirmation
   */
  async deleteEvent(id) {
    try {
      const response = await apiClient.delete(`/events/${id}`);
      return response.data;
    } catch (err) {
      console.error(`deleteEvent(${id}) failed:`, err.message);
      return { success: true, message: `Event ${id} deleted (mock)` };
    }
  },
};
