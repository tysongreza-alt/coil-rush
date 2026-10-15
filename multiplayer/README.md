# Coil Rush multiplayer foundation

This is a **development-only** private-room lobby backend, not live multiplayer gameplay.

## Features
- Six-character room codes (ambiguous characters omitted)
- Create and join private rooms, 2–8 players
- Host migration when a host disconnects
- Ready state and synchronized lobby snapshots
- Payload and message-rate limits
- Health endpoint at /health

## Local run
```bash
npm install
npm start
```

Connect a WebSocket client to ws://localhost:3000. Messages:
```json
{"type":"create","name":"Player 1"}
{"type":"join","code":"ABC234","name":"Player 2"}
{"type":"ready","ready":true}
{"type":"leave"}
```

## Not yet implemented
Authoritative snake movement, collisions, scoring, server tick, reconnects, room expiry, matchmaking, browser UI, deployment and security/load testing. The server explicitly refuses to start a real match until the simulation is built. GitHub Pages cannot host this WebSocket server. A persistent Node hosting service with WSS/TLS will be needed. Room codes are not authentication or access-control security.
