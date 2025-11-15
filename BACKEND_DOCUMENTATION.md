# Backend Integration Guide for Fashionary

## Introduction

Welcome, backend developer! This document provides a comprehensive guide on how to build and integrate a backend service with the Fashionary frontend application. The frontend is fully functional using placeholder data, and your primary task is to build a robust backend and replace the mock data services with live API calls.

The frontend is built to be robust, type-safe, and decoupled from the data layer, which will make your integration process smooth.

## Recommended Tech Stack

For a seamless integration, we recommend the following stack for the backend:

- **Runtime:** Node.js
- **Framework:** Express.js, NestJS, or even Next.js API Routes for a monolithic setup.
- **Database:** PostgreSQL or MySQL.
- **ORM:** **Prisma**. It is highly recommended for its type-safety, which will work perfectly with the TypeScript types already defined in this project.

---

## 1. Database and ORM Setup (with Prisma)

Your first step should be to set up the database and model the schemas.

1.  **Review Data Models:** Before starting, thoroughly review the TypeScript types defined in **`src/types/index.ts`**. These types (e.g., `Order`, `Product`, `Customer`) should be the "single source of truth" for your database schema.
2.  **Schema Definition with Prisma:** Use the types in `src/types/index.ts` to create your `schema.prisma` file. This will ensure that your database models and API responses are perfectly aligned with what the frontend expects.

**Example `schema.prisma` (partial):**
```prisma
// schema.prisma

model Product {
  id          String @id @default(cuid())
  name        String
  description String
  price       Float
  inventory   Int
  // ... other fields corresponding to the Product type
}

model Order {
  id              String   @id @default(cuid())
  customerName    String
  customerEmail   String
  customerPhone   String
  date            DateTime
  // ... other fields
}
```

## 2. Building the API Endpoints

Create RESTful API endpoints for each data domain. For example:
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders`
- `GET /api/products`
- `GET /api/customers`

## 3. Replacing Frontend Data Services

Your main integration task is to replace the mock data functions in the `src/services` directory with live API calls to your newly created backend.

**Example: Integrating `getOrders()` in `src/services/orders.ts`**

**Current Code (Mock Data):**
```typescript
// src/services/orders.ts

import { orders, allStatuses } from '@/lib/placeholder-data';
import { Order, OrderStatus } from '@/types';

export async function getOrders(): Promise<Order[]> {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const sortedOrders = orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return Promise.resolve(sortedOrders);
}
```

**Your New Code (Live API Call):**
```typescript
// src/services/orders.ts

import { Order, OrderStatus } from '@/types';

// It's a good practice to have the base URL in an environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getOrders(): Promise<Order[]> {
  try {
    // You will need to handle authentication, likely by passing a JWT from Clerk.
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        // Authorization header will be needed for protected routes
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    const data: Order[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return []; // Return an empty array on error to prevent UI crashes.
  }
}
```
You will follow this pattern for all functions in the `src/services` directory, such as `getProducts`, `getCustomerById`, `getStaff`, etc.

## 4. Authentication with Clerk

The frontend uses Clerk for user authentication. Your backend API **must** also use Clerk to protect its endpoints.

**How to Protect Your API:**

1.  **Use Clerk's Backend SDK:** Choose the SDK for your backend language (e.g., `@clerk/backend` for Node.js).
2.  **Verify JWTs:** When the frontend makes an API request, it must include the user's JWT in the `Authorization` header. Your backend will use the Clerk SDK to verify this token on every incoming request.
3.  **Get User Information:** Once verified, you can access the user's ID (`userId`) and other session information. This is crucial for authorization (e.g., checking if a user has the 'Admin' role to perform certain actions).

**Example (Conceptual Node.js/Express Middleware):**
```javascript
import { Clerk } from '@clerk/backend';

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

async function protectApi(req, res, next) {
  try {
    const sessionId = req.headers.authorization?.split(' ')[1];
    if (!sessionId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const session = await clerk.sessions.verifySession(sessionId);
    req.auth = { userId: session.userId }; // Attach user ID to the request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid session' });
  }
}

// Apply this middleware to your protected routes
app.use('/api', protectApi);
```

## 5. Handling Existing API Routes

The frontend already contains some server-side logic in the `src/app/api/` directory.

- **`src/app/api/delivery-report/route.ts`**: This acts as a proxy to the external Hoorin API. It is highly recommended to move this logic to your dedicated backend. This will improve security by hiding the external API key and centralize all external communications.
- **`src/services/sms.ts`**: This file contains a mock function to send SMS. You should create a dedicated endpoint on your backend (e.g., `POST /api/sms`) that the frontend can call, which then handles the communication with the MiM SMS service.

By following this guide, you have a clear path to building and integrating a robust backend with this comprehensive frontend application. Good luck!
