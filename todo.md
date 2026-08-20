# Project TODO

- [x] Establish NEXUS visual system, typography, responsive layout, and motion rules
- [x] Collect and configure real product imagery for the catalogue and editorial hero
- [x] Define database schema for users, products, collections, categories, carts, orders, and order items
- [x] Create and apply database migration and seed real technology product data with ZAR pricing
- [x] Implement backend procedures for products, collections, categories, search, filtering, sorting, cart, checkout, orders, and admin CRUD
- [x] Build premium NEXUS landing page with editorial product composition and hero CTAs
- [x] Build prominent collections and category browsing experiences
- [x] Build catalogue grid, product cards, search, filters, sorting, loading, empty, and error states
- [x] Build premium product detail pages with related products and add-to-bag flow
- [x] Implement authentication via scaffolded OAuth login/logout, protected routes, and role-aware admin access
- [x] Implement persistent local bag, stock-aware add-to-bag guard, and cart summary
- [x] Implement simulated four-step checkout and persist completed orders
- [x] Build admin dashboard for product CRUD, stock, orders, and users
- [x] Add/update Vitest coverage for core backend and commerce flows
- [x] Verify desktop and mobile UI screenshots plus key interactions
- [x] Save final checkpoint and deliver the project version

- [x] Add correct corresponding real images for every catalogue product and remove mismatched reused images
- [x] Surface the exact tagline prominently in the landing hero
- [x] Add product counts to each collection card
- [x] Add catalogue sorting plus explicit loading, error, and empty states
- [x] Move catalogue/search/filter data flow to backend/database procedures

- [x] Build actual admin management UI for product deletion, stock updates, order listing, and user listing
- [x] Add Vitest coverage for catalogue queries, cart mutations, order creation/persistence, and admin product CRUD
- [x] Exercise and validate key UI interactions including search, filters, quick view, add to bag, checkout, and admin access
- [x] Send search, filter, and sort inputs from the frontend to the catalogue procedure for server-filtered results

- [x] Add Vitest tests for catalogue query behavior with search, filter, and sort inputs
- [x] Add Vitest tests for cart get, setItem, removeItem, and order creation/persistence
- [x] Add Vitest tests for admin product create/update/delete procedures and role gating

- [x] Implement real cart quantity controls and an aggregated cart summary that stays consistent through checkout
- [x] Expand admin UI with stock/delete controls and clearer order/user management views
- [x] Validate search, filters, quick view, bag, checkout, product detail, and admin access surfaces through preview verification and passing tests

- [x] Manually exercise and document preview interactions for search, collection/category filters, quick view, bag quantity changes, checkout step transitions, product detail navigation, and admin access states

- [x] Manually exercise collection and category filters and record the changed catalogue state
- [x] Manually verify live search updates the catalogue result set
- [x] Exercise authenticated checkout Review, Confirm, and Success steps or document the preview limitation
- [x] Manually navigate from storefront to a product detail route and record the rendered state

- [x] Exercise a category filter and record its changed result set
- [x] Verify live search from an unfiltered catalogue and record the changed result set
- [x] Document that authenticated checkout Review, Confirm, and Success require a logged-in preview session
- [x] Validate product detail route rendering and related-product navigation UI


## MET4 Assignment 2 Extensions

- [x] Preserve the existing React NEXUS web app unchanged as the current storefront
- [x] Add a separate Angular frontend folder with Bootstrap and the five rubric pages
- [x] Add a separate React Native Expo mobile folder with at least four tabs: Home, Categories, Cart, and Profile
- [x] Connect the Angular and mobile clients to the existing Express/tRPC backend data surface
- [x] Add JWT registration and login routes with bcrypt password hashing without removing existing OAuth
- [x] Add at least four REST-style CRUD item endpoints required by the brief
- [ ] Add real payment processing integration while retaining simulated checkout fallback
- [x] Add validation and tests for JWT/bcrypt auth and REST endpoint contracts; payment linkage remains pending Stripe configuration
- [x] Add assignment documentation with web/mobile structure, rubric notes, folder structure, and submission packaging guidance

- [x] Add the separate mobile app scaffold and rubric-required tab structure
- [x] Add JWT/bcrypt auth and REST CRUD implementation without altering the existing React storefront

- [x] Install and build the separate Angular frontend with HTTP client wiring and valid admin payload defaults
- [x] Install and validate the separate Expo mobile project and four-tab navigation via dependency install and TypeScript check
- [x] Verify the shared Express API data source used by Angular and mobile clients with a 200 smoke test
- [x] Add tests for REST item endpoint contracts and admin authorization behavior

- [x] Add REST tests for successful GET /api/items and GET /api/items/:id response contracts
- [x] Add REST tests for non-admin 403 and admin authorization behavior on item mutations
- [x] Add REST tests for PUT and DELETE item authorization behavior

- [x] Add a safe authorized-admin mutation test path for the REST item endpoints without leaving test data behind

- [x] Add endpoint-level admin-token mutation coverage using a safe mocked database success path


## NEXUS Commerce Parity Extensions

- [x] Add 10 additional real technology products with matching imagery, categories, collections, prices, and stock
- [x] Document MySQL Workbench connection and migration workflow for the existing MySQL-compatible database
- [x] Require authentication before checkout/purchase on the React web client
- [x] Require authentication before purchase on the Angular client
- [x] Require authentication before purchase on the Expo mobile client
- [x] Expose admin stock quantity updates consistently on React web, Angular, and mobile
- [x] Bring catalogue, product detail, bag, authentication, stock, and purchase entry points to web/mobile parity
- [x] Verify npm install workflows for root, Angular, and mobile projects using clean manifest checks and generated lockfiles
- [x] Verify Expo Go-compatible start configuration and document device/API URL setup
- [x] Add tests for authentication-before-purchase and stock-aware purchase behavior

- [x] Add a dedicated mobile product-detail route with add-to-bag behavior
- [x] Run the Expo Go startup command and capture a successful Expo Go LAN startup validation
- [x] Add insufficient-stock rejection and stock-decrement assertions for authenticated orders
