# NEXUS MET4 Assignment 2 Extension

## Preserved Web Application

The existing React NEXUS storefront remains in the project root and has not been replaced. It continues to provide the premium editorial storefront, catalogue, product detail, bag, simulated checkout, database-backed order creation, and existing OAuth/admin experience.

## Separate Angular Web Deliverable

`frontend-angular/` is a separate Angular web project styled with Bootstrap. It contains rubric-aligned routes for Home, Item List, Item Detail, Cart, and Admin Panel. The Angular client consumes the Express REST API at `/api/items` and `/api/items/:id`; the admin screen includes validated add fields, stock updates, and delete actions.

## Separate React Native Mobile Deliverable

`mobile/` is a separate Expo Router project. It contains four bottom tabs required by the brief: Home, Categories, Cart, and Profile. Home and Categories fetch live data from the Express API, Cart provides local quantity and subtotal state, and Profile provides the mobile account entry point. The mobile client uses the NEXUS colour system independently from the web project.

## Backend Extensions

The existing Express server now exposes `POST /api/auth/register`, `POST /api/auth/login`, and `GET /api/auth/me` for local JWT authentication using bcrypt password hashes. Existing OAuth remains available. Rubric-compatible item endpoints are available at `GET /api/items`, `GET /api/items/:id`, `POST /api/items`, `PUT /api/items/:id`, and `DELETE /api/items/:id`; create, update, and delete require an admin bearer token.

## Payments

The current checkout remains simulated and continues to create real local orders. Stripe payment processing is prepared as a pending integration because the project is not eligible for the regional Stripe sandbox beta and no Stripe keys are configured. Once test keys are entered in Settings → Payment, the Stripe Checkout Session and webhook integration can be added without changing the existing checkout fallback.

## Submission Structure

For the assignment zip, include `mobile/`, `frontend-angular/`, the existing backend and database folders in the project root, and exclude all `node_modules` directories. The root React storefront can be retained as the existing NEXUS web reference, while `frontend-angular/` is the rubric-specific Angular web deliverable.
