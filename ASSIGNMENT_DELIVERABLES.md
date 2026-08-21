# NEXUS MET4 Assignment 2 Extension

## Preserved Web Application

The existing React NEXUS storefront remains in the project root and has not been replaced. It continues to provide the premium editorial storefront, catalogue, product detail, bag, simulated checkout, database-backed order creation, and existing OAuth/admin experience.

## Separate Angular Web Deliverable

`frontend/` is a separate Angular web project styled with Bootstrap. It contains rubric-aligned routes for Home, Item List, Item Detail, Cart, and Admin Panel. The Angular client consumes the Express REST API at `/api/items` and `/api/items/:id`; the admin screen includes validated add fields, stock updates, and delete actions.

## Separate React Native Mobile Deliverable

`mobile/` is a separate Expo Router project. It contains four bottom tabs required by the brief: Home, Categories, Cart, and Profile. Home and Categories fetch live data from the Express API, Cart provides local quantity and subtotal state, and Profile provides the mobile account entry point. The mobile client uses the NEXUS colour system independently from the web project.

## Backend Extensions

The existing Express server now exposes `POST /api/auth/register`, `POST /api/auth/login`, and `GET /api/auth/me` for local JWT authentication using bcrypt password hashes. Existing OAuth remains available. Rubric-compatible item endpoints are available at `GET /api/items`, `GET /api/items/:id`, `POST /api/items`, `PUT /api/items/:id`, and `DELETE /api/items/:id`; create, update, and delete require an admin bearer token.

## Payments

The current checkout remains simulated and continues to create real local orders. Real Stripe processing is not enabled because the project is not eligible for the regional Stripe sandbox beta and no user-owned Stripe keys are configured. The assignment remains runnable with the simulated checkout fallback; to complete live payment integration, enter Stripe test keys in Settings → Payment and then add the Checkout Session and webhook path without removing the fallback.

## Submission Structure

For the assignment zip, include `mobile/`, `frontend/`, the existing backend and database folders in the project root, and exclude all `node_modules` directories. The root React storefront can be retained as the existing NEXUS web reference, while `frontend/` is the rubric-specific Angular web deliverable.

## Export and Installation

The root project, `frontend/`, and `mobile/` each have their own `package.json`; clean-manifest npm lockfiles were generated for all three. After export, run `npm install` in the project root, then separately run `npm install` inside `frontend/` and `mobile/`. The root web app starts with its existing web script, the Angular companion starts with `npm start`, and the Expo client starts with `npx expo start`.

The mobile project is an Expo Router application intended for **Expo Go**. Its NativeWind root stylesheet is imported from `mobile/app/_layout.tsx`, and `npx expo export --platform web` completed successfully after the configuration correction; this provides an additional browser build check without changing the intended Expo Go workflow. It is not the responsive React web app. On a physical phone, set `EXPO_PUBLIC_API_URL` to the computer's LAN URL, for example `http://192.168.1.20:3000/api`, rather than `localhost`; `localhost` points to the phone itself. Then run `npx expo start` from `mobile/` and scan the QR code with Expo Go. The mobile client includes Home, Categories, Cart, Profile, local JWT account registration/login, mandatory sign-in before purchase, persisted session credentials through SecureStore, and admin stock controls for admin accounts.

## Database Client

MySQL Workbench can inspect the same MySQL-compatible database when configured with the provider-issued host, port, schema, username, password, and SSL settings. The database remains application-managed through `DATABASE_URL` and Drizzle migrations; Workbench is an inspection and SQL-client option, not a replacement for the backend connection.
