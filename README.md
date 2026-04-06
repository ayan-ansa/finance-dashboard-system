# Finance Dashboard Backend

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Roles and Permissions](#roles-and-permissions)
- [API Reference](#api-reference)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Assumptions](#assumptions)
- [Tradeoffs](#tradeoffs)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT (stored in httpOnly cookies) |
| Password Hashing | bcryptjs |
| Validation | Zod |
| Sanitization | DOMPurify + jsdom |

---

## Project Structure

```
finance-dashboard/
├── src/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── FinancialRecord.js     # Financial record schema
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   └── roleGuard.js           # Role based access control
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── recordController.js
│   │   └── dashboardController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── recordRoutes.js
│   │   └── dashboardRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── recordService.js
│   │   └── dashboardService.js
│   ├── validators/
│   │   ├── authSchema.js          # Register + login validators
│   │ 
│   │   ├── recordSchema.js        # Record validators
│   │  
│   └── utils/
│       ├── apiResponse.js         # Consistent response format
│       ├── errorHandler.js        # Global error handler
│       ├── sanitize.js            # DOMPurify sanitization
│       └── validateInputs.js      # Zod validation helper
├── .env
├── .env.example
├── package.json
└── server.js
```

---

## Setup and Installation

### Prerequisites
- Node.js v18 or above
- MongoDB running locally or a MongoDB Atlas connection string

### Steps

**1. Clone the repository**
```bash
git clone <repository-url>
cd finance-dashboard
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env
```
Fill in the values in `.env` (see [Environment Variables](#environment-variables) below).

**4. Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

**5. First admin user**

An admin user is automatically seeded when the server starts for the first time, using the credentials from your `.env` file.

Default admin credentials (change these in `.env`):
```
Email:    admin@finance.com
Password: Admin@12345
```

The server will be running at `http://localhost:5000`

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance-dashboard
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
ADMIN_EMAIL=admin@finance.com
ADMIN_PASSWORD=Admin@12345
```

---

## Roles and Permissions

The system supports three roles with different access levels:

| Action | viewer | analyst | admin |
|--------|--------|---------|-------|
| View records | ✅ | ✅ | ✅ |
| View dashboard summary | ✅ | ✅ | ✅ |
| View recent activity | ✅ | ✅ | ✅ |
| Access category summary | ❌ | ✅ | ✅ |
| Access monthly trends | ❌ | ✅ | ✅ |
| Access weekly trends | ❌ | ✅ | ✅ |
| Create records | ❌ | ❌ | ✅ |
| Update records | ❌ | ❌ | ✅ |
| Delete records | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

**Default role on registration:** `viewer`

Role assignment is done exclusively by an admin via `PUT /api/v1/users/:id`.

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login and receive cookie |
| POST | `/auth/logout` | Public | Clear auth cookie |

**Register** `POST /api/v1/auth/register`
```json
// Request body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123"
}

// Response 201
{
  "success": true,
  "message": "User registered successfully!",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "viewer",
      "isActive": true,
      "createdAt": "..."
    }
  }
}
```

**Login** `POST /api/v1/auth/login`
```json
// Request body
{
  "email": "john@example.com",
  "password": "Password@123"
}

// Response 200
// JWT token is set in httpOnly cookie automatically
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "viewer"
    }
  }
}
```

---

### Users (Admin only)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users` | Admin | Get all users with pagination |
| GET | `/users/:id` | Admin | Get user by ID |
| PUT | `/users/:id` | Admin | Update user role or status |
| PUT | `/users/profile` | All roles | Update own name or password |
| DELETE | `/users/:id` | Admin | Delete a user |

**Get all users** `GET /api/v1/users`

Supports query params: `?role=analyst&isActive=true&page=1&limit=10`

**Update user (Admin)** `PUT /api/v1/users/:id`
```json
// Request body — role and/or isActive
{
  "role": "analyst",
  "isActive": true
}
```

**Update own profile** `PUT /api/v1/users/profile`
```json
// Request body — name and/or password
{
  "name": "John Updated",
  "password": "NewPassword@123"
}
```

---

### Financial Records

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/records` | All roles | Get all records with filters |
| GET | `/records/:id` | All roles | Get record by ID |
| POST | `/records` | Admin | Create a new record |
| PUT | `/records/:id` | Admin | Update a record |
| DELETE | `/records/:id` | Admin | Soft delete a record |

**Get all records** `GET /api/v1/records`

Supports query params:
```
?type=income
?category=food
?startDate=2026-01-01T00:00:00.000Z
?endDate=2026-03-31T00:00:00.000Z
?page=1&limit=10
?sortBy=date&order=desc
```

**Create record** `POST /api/v1/records`
```json
// Request body
{
  "amount": 50000,
  "type": "income",
  "category": "salary",
  "date": "2026-03-01T00:00:00.000Z",
  "description": "March salary"
}

// Response 201
{
  "success": true,
  "message": "Record created successfully",
  "data": {
    "_id": "...",
    "amount": 50000,
    "type": "income",
    "category": "salary",
    "date": "2026-03-01T00:00:00.000Z",
    "description": "March salary",
    "createdBy": "...",
    "isDeleted": false,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Valid categories:**
`salary`, `investment`, `freelance`, `food`, `rent`, `transport`, `healthcare`, `education`, `entertainment`, `utilities`, `other`

---

### Dashboard

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/dashboard/summary` | All roles | Total income, expenses, net balance |
| GET | `/dashboard/recent` | All roles | Recent transactions |
| GET | `/dashboard/category-summary` | Analyst, Admin | Totals grouped by category |
| GET | `/dashboard/trends/monthly` | Analyst, Admin | Monthly income vs expenses |
| GET | `/dashboard/trends/weekly` | Analyst, Admin | Weekly trends |

**Summary** `GET /api/v1/dashboard/summary`
```json
// Response 200
{
  "success": true,
  "message": "Summary fetched successfully",
  "data": {
    "totalIncome": 150000,
    "totalExpenses": 80000,
    "netBalance": 70000
  }
}
```

**Monthly trends** `GET /api/v1/dashboard/trends/monthly?year=2026`
```json
// Response 200
{
  "success": true,
  "message": "Monthly trends fetched successfully",
  "data": {
    "year": 2026,
    "trends": [
      { "month": "January", "income": 50000, "expenses": 20000 },
      { "month": "February", "income": 50000, "expenses": 30000 }
    ]
  }
}
```

**Recent activity** `GET /api/v1/dashboard/recent?limit=10`

**Category summary** `GET /api/v1/dashboard/category-summary`

**Weekly trends** `GET /api/v1/dashboard/trends/weekly?startDate=2026-03-01T00:00:00.000Z`

---

## Validation

All incoming request data is processed in two steps before reaching business logic:

**Step 1 — Sanitize** using DOMPurify to strip any XSS payloads from string fields.

**Step 2 — Validate** using Zod schemas which enforce types, formats, enums, and custom rules.

Key validation rules:
- `amount` must be a positive number
- `type` must be `income` or `expense`
- `category` must be one of the predefined values
- `date` must be a valid ISO datetime and cannot be in the future
- `password` must be at least 8 characters and contain uppercase, lowercase, and a number
- `email` must be a valid email format

---

## Error Handling

All errors follow a consistent response format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

HTTP status codes used:

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation failed |
| 401 | Unauthorized — not logged in or invalid token |
| 403 | Forbidden — logged in but insufficient role |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Assumptions

- **Role on registration is always `viewer`** — roles can only be assigned by an admin after registration. This prevents privilege escalation.
- **First admin is seeded automatically** on server startup using credentials from `.env`. This avoids the chicken-and-egg problem of needing an admin to create an admin.
- **Financial records use soft delete** — deleted records are marked with `isDeleted: true` and a `deletedAt` timestamp instead of being permanently removed. This is safer for financial data and allows potential recovery.
- **JWT is stored in httpOnly cookies** instead of localStorage to protect against XSS attacks. A Bearer token fallback is also supported for API clients like Postman.
- **Categories are predefined** — a fixed set of categories is enforced to keep data clean and consistent for aggregation queries. Free text categories would make dashboard summaries unreliable.
- **Dates must not be in the future** — financial records represent transactions that have already happened.
- **Admin cannot modify their own role or deactivate themselves** — this prevents accidental lockout of the system.

---

## Tradeoffs

| Decision | Chosen Approach | Alternative | Reason |
|----------|----------------|-------------|--------|
| Auth storage | httpOnly cookie | localStorage | Cookies protect against XSS; localStorage is vulnerable |
| Validation | Zod + DOMPurify | express-validator | Zod provides type safety and cleaner schema definitions; DOMPurify adds dedicated XSS protection |
| Delete strategy | Soft delete | Hard delete | Financial records should never be permanently lost; soft delete allows auditing |
| Categories | Predefined enum | Free text | Enums keep dashboard aggregations accurate and data consistent |
| First admin | Seed script | Manual DB insert | Seed script is reproducible, documented, and part of the setup process |
| API versioning | `/api/v1/` prefix | No versioning | Allows future breaking changes without affecting existing clients |
| Role model | String enum on User | Separate roles collection | Three fixed roles don't need a separate collection; enum is simpler and sufficient |
| Password update | Via `/users/profile` only | Via `/users/:id` | Separating profile updates from admin updates keeps concerns clean and secure |
