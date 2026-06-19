export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  ticketTypes: TicketType[];
}

export interface TicketType {
  type: string;
  price: number;
  capacity: number;
}

export const events: Event[] = [
  {
    id: 'evt-001',
    name: 'Summer Music Festival',
    date: '2026-07-15T18:00:00Z',
    location: 'Central Park, New York',
    ticketTypes: [
      { type: 'General Admission', price: 75.00, capacity: 5000 },
      { type: 'VIP', price: 150.00, capacity: 500 },
      { type: 'Backstage Pass', price: 300.00, capacity: 100 },
    ],
  },
  {
    id: 'evt-002',
    name: 'Tech Conference 2026',
    date: '2026-09-20T09:00:00Z',
    location: 'Convention Center, San Francisco',
    ticketTypes: [
      { type: 'Standard', price: 200.00, capacity: 2000 },
      { type: 'Premium', price: 400.00, capacity: 500 },
      { type: 'Workshop Add-on', price: 100.00, capacity: 300 },
    ],
  },
  {
    id: 'evt-003',
    name: 'Jazz Night Under the Stars',
    date: '2026-08-05T20:00:00Z',
    location: 'Botanical Gardens, Chicago',
    ticketTypes: [
      { type: 'General Admission', price: 45.00, capacity: 800 },
      { type: 'Table Seating', price: 85.00, capacity: 200 },
    ],
  },
  {
    id: 'evt-004',
    name: 'Food & Wine Expo',
    date: '2026-10-10T11:00:00Z',
    location: 'Expo Center, Miami',
    ticketTypes: [
      { type: 'General Admission', price: 60.00, capacity: 3000 },
      { type: 'VIP Tasting', price: 120.00, capacity: 500 },
    ],
  },
  {
    id: 'evt-005',
    name: 'Broadway Night: The Phantom of the Opera',
    date: '2026-11-20T19:30:00Z',
    location: 'Majestic Theatre, New York',
    ticketTypes: [
      { type: 'Balcony', price: 80.00, capacity: 400 },
      { type: 'Orchestra', price: 150.00, capacity: 600 },
      { type: 'Premium Box', price: 250.00, capacity: 100 },
    ],
  },
];