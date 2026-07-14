# 🛒 Wanderlust — Server

**RESTful API for a Travel & Destination Booking Platform**, built with **Node.js**, **Express**, and **TypeScript**, using **MongoDB** as the data store and **JWT/JWKS-based authentication** to secure protected routes.

<br>

## 📖 Overview

This is the backend service powering the Wanderlust travel and destination booking platform. Built with Express and TypeScript, it provides a clean, RESTful API layer that sits between the frontend client and a MongoDB database, handling everything from destination management to booking creation and cancellation.

The API is designed around two core resources — destinations and bookings — with public read access for browsing (so anyone can explore destinations without logging in) and token-verified write access for anything that creates, modifies, or deletes data. Authentication is handled through JWT verification against a remote JWKS endpoint, meaning the server never issues or stores tokens itself — it simply trusts and verifies tokens issued by the connected client's auth system (BetterAuth), keeping the auth logic decoupled from the API layer.

On top of the core CRUD functionality, the server also includes a dedicated admin layer: routes that aggregate platform-wide data — total destinations listed, total bookings made, and total revenue generated — using MongoDB's aggregation pipeline to compute figures like revenue directly at the database level rather than in application code. This keeps the admin dashboard fast and the business logic centralized in one place.

Overall, the project reflects a typical production-style backend structure: environment-based configuration, a single MongoDB connection reused across all routes, consistent error handling for unauthorized/forbidden access, and a route structure that's easy to extend as the platform grows.

<br>

## 🧰 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (native driver, Stable API v1)
- **Authentication:** JWT verification via remote JWKS (`jose-cjs`), integrated with a BetterAuth-issued token flow
- **Middleware:** CORS, JSON body parsing
- **Environment Config:** dotenv

<br>

## 🔐 Authentication

Protected routes are guarded by a custom `verifyToken` middleware:

- Extracts the Bearer token from the `Authorization` header
- Verifies it against a remote JWKS endpoint (`${CLIENT_URL}/api/auth/jwks`) using `jose-cjs`
- Returns `401 Unauthorized` for a missing token and `403 Forbidden` for an invalid/expired one
- On success, the decoded payload is attached to the request lifecycle before passing control to `next()`

<br>

## 📡 API Endpoints

### Destinations

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/destination` | ✅ | Create a new destination |
| `GET` | `/destination` | ❌ | Get all destinations |
| `GET` | `/featured` | ❌ | Get top 10 featured destinations |
| `GET` | `/destination/:id` | ✅ | Get a single destination by ID |
| `PATCH` | `/destination/:id` | ✅ | Update a destination |
| `DELETE` | `/destination/:id` | ✅ | Delete a destination |

### Bookings

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/bookings` | ✅ | Create a new booking |
| `GET` | `/bookings/:userId` | ✅ | Get all bookings for a specific user |
| `DELETE` | `/bookings/:id` | ✅ | Cancel/delete a booking |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/admin/bookings` | ✅ | Get all bookings across the platform |
| `GET` | `/admin/stats` | ✅ | Get aggregated stats — total destinations, total bookings, and total revenue |

<br>

## 📊 Admin Stats Aggregation

The `/admin/stats` route runs parallel queries for destination and booking counts, then uses a MongoDB aggregation pipeline to sum booking prices (cast from string to double) and return the platform's total revenue in a single response.

<br>

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following:

```
PORT=your_port_number
MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name
CLIENT_URL=your_frontend_client_url
```

<br>

## 🚀 Getting Started

```bash
# install dependencies
npm install

# run in development
npm run dev

# build for production
npm run build

# start production server
npm start
```

Once running, the server will log:

```
server is running on port http://localhost:<PORT>
```

<br>

## 📄 License

This project is open source and available for learning and reference purposes.