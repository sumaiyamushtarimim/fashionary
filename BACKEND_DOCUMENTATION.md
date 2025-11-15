# Backend Integration Guide for Fashionary

## Introduction

Welcome, backend developer! This document provides a comprehensive guide on how to integrate a backend service with the Fashionary frontend application. The frontend has been built to be robust, type-safe, and decoupled from the data layer, making your integration process as smooth as possible.

The entire application is fully functional using placeholder data served from the `src/services` directory. Your primary task will be to replace the mock data services in this directory with actual API calls to your backend.

## Tech Stack Overview

The frontend is built with the following technologies. Understanding them will help in creating a seamless integration.

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with ShadCN/UI
- **Authentication:** Clerk

## Project Structure Highlights

- **`src/app/`**: Contains all the routes and UI logic. You should not need to make significant changes here.
- **`src/services/`**: **This is your primary integration point.** Each file in this directory corresponds to a data domain (e.g., `orders.ts`, `products.ts`). These files currently export functions that return mock data. You will replace the function bodies with `fetch` calls to your backend API endpoints.
- **`src/types/`**: Contains all TypeScript type definitions (e.g., `Order`, `Product`, `Customer`). **Your API responses must match these types** to ensure the frontend works correctly without modifications.
- **`src/lib/placeholder-data.ts`**: The source of all mock data. You can use this file as a reference for the expected data structure and relationships.
- **`src/app/api/`**: Contains frontend-managed API routes. These are used for tasks that need a server-side environment but are closely tied to the frontend, like proxying external API calls (e.g., the Hoorin delivery report).

---

## 1. Replacing Data Services

Your main task is to work through the files in the `src/services` directory and replace the mock data functions with live API calls.

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getOrders(): Promise<Order[]> {
  try {
    // You will need to handle authentication, likely by passing a JWT from Clerk.
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        // Authorization header might be needed
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

## 2. Adhering to Data Models

Your API endpoints **must** return data that conforms to the types defined in `src/types/index.ts`. Any deviation will cause TypeScript errors and likely break the UI. It is highly recommended to review this file thoroughly before designing your database schemas and API responses.

**Example: The `Order` type**
```typescript
// src/types/index.ts

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // Should be in ISO format, e.g., "2024-05-20"
  status: OrderStatus;
  total: number;
  products: OrderProduct[];
  // ... and other fields
};
```
Your `GET /orders` endpoint should return an array of objects matching this structure.

## 3. Authentication with Clerk

The frontend uses Clerk for user authentication and management. Your backend API should also use Clerk to protect its endpoints.

**How to Protect Your API:**

1.  **Use Clerk's Backend SDK:** Choose the SDK for your backend language (e.g., `@clerk/backend` for Node.js).
2.  **Verify JWTs:** When the frontend makes an API request, it should include the user's JWT (JSON Web Token) in the `Authorization` header. Your backend will use the Clerk SDK to verify this token on every incoming request.
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

## 4. Handling API Routes

The frontend already contains some server-side logic in the `src/app/api/` directory.

- **`src/app/api/delivery-report/route.ts`**: This acts as a proxy to the external Hoorin API. You may choose to move this logic to your dedicated backend for better security and to hide the external API key, or you can leave it as is.
- **`src/services/sms.ts`**: This file contains a mock function to send SMS. You should implement the actual API call to the MiM SMS service here or, preferably, create a dedicated endpoint on your backend that the frontend can call.

By following this guide, you should have a clear path to integrating a robust backend with this comprehensive frontend application. Good luck!
