# Onboarding — ticket-challenger

## Repo & access

- Repo: https://github.com/jlimbu1/ticket-challenger

## Prerequisites

- Node.js 18+
- MongoDB (Atlas in prod)

## Setup

```bash
# server
cd TicketChallengerServer
cp .env.example .env   # fill MONGODB_URI, CLIENT_URL, PORT
npm install
npm start

# client
cd ..
npm install
npm run dev
```

## Environment variables

Server (`TicketChallengerServer/.env`):

- `MONGODB_URI` — Atlas connection string (secret, never commit)
- `CLIENT_URL` — CORS/socket origin, e.g. `https://ticketing.jimmycorp.org`
- `PORT` — default 3000
- `NODE_ENV` — production/development

Client: `VITE_API_URL` / `VITE_SOCKET_URL` left empty in prod (same-origin;
nginx proxies `/api` and `/socket.io`).

## Run & test

```bash
npm run build                              # client build
node --check TicketChallengerServer/server.js   # syntax check (no tests yet)
```

## Environments

| Env | URL | Notes |
| --- | --- | --- |
| prod | https://ticketing.jimmycorp.org | Dokploy/Docker + nginx; DB in Atlas |

## Gotchas

- Per-session secret is returned once at session creation and kept in
  browser localStorage (`tc_session_secrets`); lost on cache clear → new session.
- Old sessions created before the auth change have no `secretHash` and can't be
  started/checked out (view-only).
