# Architecture — ticket-challenger

## Context

Gothic-themed ticket storefront with a real-time queue, simulated ticket
selling, checkout and a leaderboard. Public site, no user accounts.

## Stack & modules

- **Client** — Vue 3 + Vite, Pinia, Vue Router, Socket.IO client (`src/`)
- **Server** — Express 5 + Socket.IO 4 + Mongoose 8 (`TicketChallengerServer/`)
- **Proxy** — nginx (`deploy/nginx-*.conf`) routes `/api` and `/socket.io` to the backend

## Data model (MongoDB)

- `Ticket`: name, price, capacity
- `TicketingSession`: username, secretHash, tickets (ticketId, remaining,
  sold, bought, popularity), queuePosition, status, timestamps; virtual `_score`

## API surface

- `GET /api/tickets`, `GET /api/tickets/:id`
- `POST /api/ticketing-sessions` — returns session + one-time bearer secret
- `PATCH /api/ticketing-sessions/startQueue/:id` — auth required
- `PATCH /api/ticketing-sessions/checkout/:id` — auth + `inProgress` required
- `GET /api/ticketing-sessions`, `GET /api/ticketing-sessions/:id`
- Socket: `subscribeToSession {sessionId, secret}`

## Decisions

See `docs/decisions/`.
