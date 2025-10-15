# Activity Booking API (Next.js + MongoDB)

## Overview
This is a backend-only API project built using **Next.js API routes** and **MongoDB** (via Mongoose).  
It enables **user registration, authentication (JWT)**, **activity management**, and **booking with validation**.

---

## Features
- 🔐 User registration and login (JWT authentication)
- 🧑‍💼 Admin and user roles
- 🗓️ CRUD operations for activities
- 📅 Activity booking with capacity and double-booking prevention
- 📊 RESTful endpoints with proper HTTP status codes

---

## Setup Instructions

### 1️⃣ Prerequisites
- Node.js v16+
- MongoDB (local or MongoDB Atlas)

### 2️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/activity-booking-api.git
cd activity-booking-api
```

### 3️⃣ Install dependencies
```bash
npm install
```

### 4️⃣ Create an `.env` file
Copy `.env.example` to `.env` and fill the values:
```
MONGO_URI=mongodb://localhost:27017/activity-booking
JWT_SECRET=replace_this_with_a_long_secret
JWT_EXPIRES_IN=7d
PORT=3000
```

### 5️⃣ Seed database (optional)
This creates an admin user and sample activities.
```bash
npm run seed
```

### 6️⃣ Run in development mode
```bash
npm run dev
```

API will be available at `http://localhost:3000/api`.

---

## API Usage Examples

### 🔹 Register a user
```bash
curl -X POST http://localhost:3000/api/auth/register   -H "Content-Type: application/json"   -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'
```

### 🔹 Login
```bash
curl -X POST http://localhost:3000/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"alice@example.com","password":"secret"}'
```
Response:
```json
{
  "token": "your_jwt_token",
  "user": { "id": "...", "name": "Alice", "email": "alice@example.com", "isAdmin": false }
}
```

Use the token in subsequent requests as a header:
```
Authorization: Bearer <token>
```

---

### 🔹 List activities
```bash
curl http://localhost:3000/api/activities
```

### 🔹 Create activity (authenticated)
```bash
curl -X POST http://localhost:3000/api/activities   -H "Content-Type: application/json"   -H "Authorization: Bearer <token>"   -d '{"title":"Hackathon","description":"Tech event","date":"2025-11-01T10:00:00Z","capacity":100}'
```

### 🔹 Book an activity
```bash
curl -X POST http://localhost:3000/api/bookings   -H "Content-Type: application/json"   -H "Authorization: Bearer <token>"   -d '{"activityId":"<activity_id>"}'
```

### 🔹 View my bookings
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/bookings/me
```

---

## 📫 API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|-----------|--------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/activities` | List all activities | ❌ |
| GET | `/api/activities/:id` | Get activity details | ❌ |
| POST | `/api/activities` | Create activity | ✅ |
| PUT | `/api/activities/:id` | Update activity (admin) | 🔑 |
| DELETE | `/api/activities/:id` | Delete activity (admin) | 🔑 |
| POST | `/api/bookings` | Book an activity | ✅ |
| GET | `/api/bookings/me` | View user bookings | ✅ |

---

## 🧑‍💻 Postman Usage

You can test easily using Postman:
1. Import endpoints manually or generate from `/api/api-docs`.
2. Add a header `Authorization: Bearer <token>` for protected routes.
3. Use JSON request body in raw mode.

---

## 🧾 Notes
- Uses JWT in `Authorization` header.
- Passwords are hashed using bcrypt.
- Admin: `admin@example.com` / `adminpassword` (after seeding).
- Prevents double-booking and ensures capacity is not exceeded.
