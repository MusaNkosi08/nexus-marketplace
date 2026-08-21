# NEXUS backend deliverable

The MET4 brief names this deliverable `backend/`. NEXUS is built on the managed full-stack template, whose executable Express/tRPC source remains in `server/` so the deployment runtime, OAuth plumbing, tests, and path aliases continue to work.

The backend implementation is therefore organized as follows. `server/restApi.ts` is a compatibility re-export used by the managed runtime and existing test imports; the executable REST implementation is now in `backend/src/restApi.ts`.

| Assignment folder | Managed source | Responsibility |
|---|---|---|
| `backend/` | `backend/src/restApi.ts` | Express REST contracts for items, auth, orders, and admin stock |
| `backend/` | `server/routers.ts` | tRPC catalogue, cart, order, and admin procedures |
| `backend/` | `server/db.ts` | Drizzle/MySQL database helpers |
| `backend/` | `server/_core/` | Express startup, OAuth, context, and deployment plumbing |
| `backend/` | `drizzle/` | MySQL-compatible schema and migrations |

Run the backend through the root command:

```bash
npm run dev
```

Do not duplicate or move the managed `server/` implementation without also updating the deployment entrypoint and framework aliases.
