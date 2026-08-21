<div align="center">
  <img src="docs/nexus-logo.svg" alt="NEXUS logo" width="520" />
  <p><strong>Technology, intelligently curated.</strong></p>
</div>

# NEXUS

NEXUS is a premium South African technology marketplace for considered tools across five collections: **Study, Create, Build, Focus, and Travel**. It includes a React storefront, separate Angular companion, Expo Go mobile app, and shared Express/MySQL-compatible backend with authentication, catalogue data, stock-aware orders, and protected operations.

## Project map

| Area | Location | Purpose |
|---|---|---|
| React storefront | `client/` | Editorial web shopping experience |
| Angular companion | `frontend-angular/` | Bootstrap web implementation |
| Expo Go app | `mobile/` | Home, Categories, Cart, Profile, and product detail |
| Backend | `server/` | Express REST API, tRPC, JWT/bcrypt auth, and order logic |
| Database | `drizzle/` | MySQL-compatible schema and migrations |
| Documentation | `docs/`, `ASSIGNMENT_DELIVERABLES.md` | Assignment support material and diagrams |

## Run locally in VS Code

From the repository root:

```bash
npm install
npm run dev
```

Run Angular separately:

```bash
cd frontend-angular
npm install
npm start
```

Run Expo Go on a phone connected to the same Wi-Fi network:

```bash
cd mobile
npm install
npm run start:lan
```

Set `EXPO_PUBLIC_API_URL` to the computer's LAN address, such as `http://192.168.1.20:3000/api`; do not use `localhost` on a physical phone. If LAN scanning is blocked, use `npm run start:tunnel`.

## Access and administration

Users must sign in or register before purchasing. The public storefront does not show an Admin link. Authorized administrators can open the protected `/admin` route directly; Angular and Expo apply the same role check in their private workspace surfaces.

Promote an existing account in MySQL Workbench with:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

Sign in again after changing the role. Stock confirmation writes the selected value to the database, and recent orders are displayed from the persisted `orders` table.

## Database and payments

See [`MYSQL-WORKBENCH.md`](MYSQL-WORKBENCH.md) for connection and migration notes. Checkout currently persists orders with a simulated payment step. Stripe Checkout and webhook processing require project-owned Stripe test keys configured through project settings.

## Verification

Vitest covers authentication, catalogue behavior, stock-aware ordering, and REST authorization. Root, Angular, and mobile packages have independent manifests and lockfiles for separate installation.
