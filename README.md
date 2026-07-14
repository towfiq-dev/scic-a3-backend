# 🛒 Wanderlust — Server

**RESTful API for a Travel & Destination Booking Platform**, built with **Node.js**, **Express**, and **TypeScript**, using **MongoDB** as the data store and **JWT/JWKS-based authentication** to secure protected routes.

<br>

## 📖 Overview

This is the backend service powering the Wanderlust travel platform. It exposes a clean set of REST endpoints for managing travel destinations and user bookings, with token-verified access control on every sensitive route and an admin layer for platform-wide statistics.

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