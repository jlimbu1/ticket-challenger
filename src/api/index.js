import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export default {
    async getTickets() {
        return (await apiClient.get('/tickets')).data;
    },
    async getTicketingSession(id) {
        return (await apiClient.get(`/ticketing-sessions/${id}`)).data;
    },
    async getTicketingSessionList(params) {
        return (await apiClient.get(`/ticketing-sessions`, params)).data;
    },
    async postTicketingSession(data) {
        return (await apiClient.post('/ticketing-sessions', data)).data;
    },
    async startTicketingSessionQueue(id, secret) {
        return (
            await apiClient.patch(
                `/ticketing-sessions/startQueue/${id}`,
                {},
                {
                    headers: secret ? { Authorization: `Bearer ${secret}` } : {},
                },
            )
        ).data;
    },
    async checkoutTicketingSession(id, data, secret) {
        return (
            await apiClient.patch(`/ticketing-sessions/checkout/${id}`, data, {
                headers: secret ? { Authorization: `Bearer ${secret}` } : {},
            })
        ).data;
    },
};
