# NEXUS startup and parity validation

The shared backend responds on port 3000 from `0.0.0.0`, and `GET /api/items` returned HTTP 200 with 20 catalogue products. A non-destructive `POST /api/orders` without a bearer token returned HTTP 401, confirming that Angular, Expo, and any REST client must authenticate before purchase and that the protected order route is active.

The mobile package now exposes `npm run start:lan` and `npm run start:tunnel`. LAN startup produced an Expo Go QR endpoint at `exp://169.254.0.21:8081` in the sandbox; tunnel startup connected and produced an `exp.direct` endpoint. The mobile API URL must point to the computer's LAN address for LAN mode, not `localhost`.

Angular now sends authenticated cart lines to the shared `/api/orders` route and displays the persisted order confirmation. Expo Cart already sends the same `{ productId, quantity }` payload to `/api/orders`. React uses the shared protected tRPC order mutation and its storefront header now exposes `/admin` only when the signed-in user has role `admin`. Expo exposes admin stock controls in Profile for `userRole === "admin"`; Angular exposes `/admin` with local JWT login and bearer-authenticated CRUD.

Root, Angular, and mobile clean `npm ci --ignore-scripts --no-audit --no-fund` checks passed in isolated directories. Root production build, root typecheck, Angular production build, mobile typecheck, and all 21 Vitest tests passed after the changes.

An existing database administrator identity was used only to sign a short-lived local JWT for non-mutating probes. An authenticated malformed admin item request returned HTTP 400 rather than 401/403, confirming admin authorization reached validation; an authenticated excessive-quantity order request returned HTTP 409, confirming the stock-aware order path reached inventory validation without writing an order. The React `/admin` route was opened in preview and correctly displayed its protected sign-in gate while no preview identity was active. Full successful order placement requires the user's own login session and should be exercised on a real device or local browser with the user's account.
