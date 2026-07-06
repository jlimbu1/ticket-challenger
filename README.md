# Ticket Challenger

Gothic-themed ticket storefront with real-time queue management, shopping cart, order processing, and admin panel.

Built with **Vue 3 + Vite** (client) and **Express + Socket.io + MongoDB** (server).

## Features

- **Event browsing** — Browse events with product/ticket listings
- **Real-time queue** — Join event queues with live position updates via WebSocket
- **Ticketing system** — Select tickets, get time-limited sessions
- **Shopping cart** — Pinia store with localStorage persistence and cart badge
- **Checkout & confirmation** — Form validation, order summary, confirmation page
- **Order history** — View past orders with detail pages
- **User profile** — Manage user info
- **Highscores** — Leaderboard rankings
- **Admin panel** — CRUD for events, ticket products
- **Gothic theme** — Custom fonts (My Chemical Romance, WastedPunk), dark palette

## Project Structure

```
TicketChallenger/
├── TicketChallengerClient/   # Vue 3 + Vite frontend
│   └── src/
│       ├── api/              # API client (Axios)
│       ├── assets/           # Fonts, icons, styles
│       ├── components/       # Reusable Vue components
│       ├── composables/      # useSocket composable
│       ├── data/             # Static product data
│       ├── router/           # Vue Router routes
│       ├── stores/           # Pinia stores (cart, order, user, admin, api)
│       ├── types/            # TypeScript interfaces
│       ├── utils/            # Helpers and socket client
│       └── views/            # Page components
└── TicketChallengerServer/   # Express + MongoDB backend
    ├── models/               # Mongoose models (Ticket, TicketingSession)
    ├── routes/               # Express route handlers
    └── helpers/              # Queue update logic
```

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Event listing |
| `/queue/:id` | Queue | Join event queue with real-time position |
| `/ticketing/:id` | Ticketing | Select tickets within session |
| `/summary/:id` | Summary | Session summary after ticketing |
| `/checkout` | Checkout | Cart checkout with form validation |
| `/confirmation/:orderId` | Confirmation | Order confirmation |
| `/orders` | Order History | List of past orders |
| `/orders/:orderId` | Order Detail | Single order view |
| `/profile` | Profile | User profile management |
| `/highscore` | Highscores | Leaderboard |
| `/info` | Info | Event information |
| `/expired/:id` | Expired Session | Session timeout page |
| `/admin/events` | Admin Events | Manage events |
| `/admin/events/new` | Admin Event Create | Create new event |
| `/admin/events/:eventId/edit` | Admin Event Edit | Edit event |
| `/admin/products` | Admin Products | Manage ticket products |

## Tech Stack

**Client**
- Vue 3 (Composition API, `<script setup>`)
- Vite 7
- Pinia 3 (state management)
- Vue Router 4
- Tailwind CSS 4
- Socket.io Client
- Axios

**Server**
- Express 5
- MongoDB + Mongoose 8
- Socket.io 4
- dotenv

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance

### Client Setup

```bash
cd TicketChallengerClient
cp .env.example .env   # configure VITE_API_URL and VITE_SOCKET_URL
npm install
npm run dev             # starts at http://localhost:5173
```

### Server Setup

```bash
cd TicketChallengerServer
cp .env.example .env    # configure MONGODB_URI, CLIENT_URL, PORT
npm install
npm start               # starts at http://localhost:3000
```

### Production Build

```bash
cd TicketChallengerClient
npm run build            # outputs to dist/
```

Serve `dist/` via any static server or deploy alongside the backend.

## Environment Variables

**Client** (`.env`)
```
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=wss://localhost:3000
```

**Server** (`.env`)
```
MONGODB_URI=mongodb://localhost:27017/ticketchallenger
CLIENT_URL=http://localhost:5173
PORT=3000
```

## Docker (for Dokploy / local testing)

```bash
# Build and run locally
docker compose up --build

# Access at http://localhost (Traefik routes /api + /socket.io to backend)
```

## Deployment

### Option A: GCP Free Tier + Dokploy (recommended for multi-project)

Dokploy is a self-hosted Vercel/Heroku alternative. Deploy any number of projects on the same VM.

**Architecture:**
```
Browser → Cloudflare (SSL) → GCP e2-micro
                                │
                          Dokploy (Traefik)
                           ┌────────┴────────┐
                    Frontend (Nginx)    Backend (Express)
                    Serves dist/        Port 3000
                                              │
                                        MongoDB Atlas
```

**Setup:**

1. Create a GCP e2-micro VM (Ubuntu 24.04, allow HTTP/HTTPS traffic)
2. SSH in and run:
   ```bash
   curl -sSL https://dokploy.com/install.sh | sudo bash
   ```
3. Open `http://<VM_IP>:3000` and create your Dokploy account
4. Create a Project → Create Service → Compose
   - Source: Git → `https://github.com/jlimbu1/ticket-challenger.git`
   - Compose path: `./docker-compose.yml`
   - Deploy
5. Set Cloudflare DNS A record: `ticketing` → VM IP (proxy ON)
6. Cloudflare SSL/TLS → Flexible

Or use the automated setup script:
```bash
./deploy/setup-gcp-dokploy.sh
```

**Adding more projects:** Create a new Project in Dokploy, point to any Git repo with a `docker-compose.yml`. Add a Cloudflare DNS A record for the domain pointing to the same VM IP. Traefik routes by domain automatically.

### Option B: GCP / Oracle Cloud + Nginx + PM2

See `deploy/setup-gcp.sh` or `deploy/setup.sh` for traditional Nginx + PM2 deployment.
