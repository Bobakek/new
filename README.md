# Babylon.js MMO MVP

Minimal browser-based 3D MMORPG prototype (RuneScape‑style) built with  
Babylon.js, an ECS architecture, and an authoritative Go backend.

## Stack

- **Frontend**: TypeScript, Vite, Babylon.js, simple ECS, ESLint.
- **Backend**: Go (`net/http`, `gorilla/websocket`).
- **Networking**: JSON over WebSocket. Authoritative server at 20 ticks/s.

## Directory Tree

```
client/ - frontend
  src/
    ecs/        - entity, components & systems
    game/       - scene, world logic, input handling
    net/        - WebSocket wrapper & message schema
    ui/         - HUD widgets
server/ - backend
```

## Protocol (JSON)

| Message | Direction | Fields                            |
|---------|-----------|-----------------------------------|
| `Join`  | C → S     | `name`                            |
| `Input` | C → S     | `input` `{forward,backward,left,right}` |
| `Chat`  | C ↔ S     | `text` (`C→S`), plus `id` (`S→C`) |
| `State` | S → C     | `you` (player id), `players` array of `{id,name,x,y,z}` |

## Running Locally

```bash
# 1. Backend
cd server
go run ./server        # uses PORT env var (default 8080)

# 2. Frontend
cd client
npm install
npm run dev            # Vite dev server
```

Environment variables:

- `PORT` – backend HTTP/WS port (default `8080`)
- `VITE_WS_URL` – client WebSocket URL (default `ws://localhost:8080/ws`)

Visit `http://localhost:5173` after both services start.

## Extending the ECS

1. **Component**: add file in `src/ecs/components/`.
2. **System**: add file in `src/ecs/systems/` operating over matching components.
3. Register system in `World` and update loops accordingly.

Example: to add a `Health` component, create `health.ts`, a `HealthSystem`, then attach the component to entities needing hit points.

## Future Iterations (Priority)

1. Inventory & equipment system.
2. NPCs with basic AI & pathfinding.
3. PvE combat loop and experience/leveling.
4. Quest framework & scripting.
5. Persistent storage (DB) and user accounts.
6. WebGPU support & improved asset pipeline.

```
