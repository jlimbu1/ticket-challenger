# ticket-challenger — agent rules

Project-specific rules. Override the customer rules in `../AGENTS.md`
and the global rules in `~/agent/AGENTS.md`.

## Project facts

- Stack: Vue 3 + Vite (client), Express 5 + Socket.IO 4 + MongoDB/Mongoose 8 (server), nginx
- Repo: https://github.com/jlimbu1/ticket-challenger
- Deploy: https://ticketing.jimmycorp.org (Hetzner CX23 + Dokploy + Docker/nginx; configs in `deploy/`; Dokploy UI https://dokploy.jimmycorp.org)
- Environments: prod only — see `../docs/overview.md`

## Build, test, run

Client (repo root):

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

Server (`TicketChallengerServer/`):

```bash
npm install
npm start        # http://localhost:3000 — needs MONGODB_URI
```

No test suite yet; `node --check <file>` for syntax.

## Conventions

- ESM (`"type": "module"`) throughout the server.
- Vue 3 `<script setup>` + Pinia + Vue Router; keep `@/` alias imports.
- Secrets only via gitignored `.env` files. Never commit real credentials.

## Boundaries

- Production DB: MongoDB Atlas — credentials live in `TicketChallengerServer/.env`.
- Prod deploys and DB access: ask Jimmy first.

## Security notes

- API protected by per-session bearer tokens (hashed — see `middleware/auth.js`).
- Rate-limited; nginx denies dotfiles and sensitive files.

## Contacts

- Owner: Jimmy (JimmyCorp)
