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

### Example `schema.prisma`

Below is a comprehensive Prisma schema to get you started. It is based on the data structures in `src/types/index.ts`.

```prisma
// schema.prisma

datasource db {
  provider = "postgresql" // or "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ENUMS //

enum OrderStatus {
  New
  Confirmed
  Canceled
  Hold
  InCourier     @map("In-Courier")
  ReadyToShip   @map("RTS (Ready to Ship)")
  Shipped
  Delivered
  Returned
  PaidReturned  @map("Paid Returned")
  Partial
}

enum PurchaseOrderStatus {
  Draft
  FabricOrdered
  Printing
  Cutting
  Received
  Cancelled
}

enum PaymentMethod {
  CashOnDelivery
  bKash
  Nagad
}

enum OrderPlatform {
  TikTok
  Messenger
  Facebook
  Instagram
  Website
}

enum CheckStatus {
  Pending
  Passed
  Bounced
  Cancelled
}

enum StaffRole {
  Admin
  Manager
  PackingAssistant
  Moderator
  Seller
  CallAssistant
  CallCentreManager
  CourierManager
  CourierCallAssistant
  Custom
}

// MODELS //

model Product {
  id               String           @id @default(cuid())
  name             String
  description      String?
  price            Float
  inventory        Int
  image            Json? // Assuming ImagePlaceholder structure is stored as JSON
  categoryId       String?
  ornaFabric       Float?
  jamaFabric       Float?
  selowarFabric    Float?
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt

  category         Category?        @relation(fields: [categoryId], references: [id])
  variants         ProductVariant[]
  orderItems       OrderProduct[]
  purchaseOrderItems PurchaseOrderItem[]
}

model ProductVariant {
  id        String   @id @default(cuid())
  name      String
  sku       String   @unique
  productId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Category {
  id        String    @id @default(cuid())
  name      String    @unique
  parentId  String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  parent    Category? @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  children  Category[] @relation("CategoryHierarchy")
  products  Product[]
}

model Order {
  id              String         @id @default(cuid())
  customerName    String
  customerEmail   String?
  customerPhone   String
  date            DateTime
  status          OrderStatus
  total           Float
  shipping        Float?
  customerNote    String?
  officeNote      String?
  createdBy       String? // Staff name or ID
  confirmedBy     String? // Staff name or ID
  businessId      String?
  platform        OrderPlatform?
  paymentMethod   PaymentMethod
  paidAmount      Float
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  shippingAddress Json // Store address object as JSON
  products        OrderProduct[]
  logs            OrderLog[]
  customer        Customer?      @relation(fields: [customerPhone], references: [phone])
  business        Business?      @relation(fields: [businessId], references: [id])
}

model OrderProduct {
  id        String   @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Float
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])
}

model OrderLog {
  id          String   @id @default(cuid())
  orderId     String
  title       String
  description String
  user        String
  timestamp   DateTime @default(now())

  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

model Customer {
  id          String   @id @default(cuid())
  name        String
  email       String?  @unique
  phone       String   @unique
  joinDate    DateTime
  address     String
  district    String
  country     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  orders      Order[]
}

model PurchaseOrder {
  id              String              @id @default(cuid())
  supplierId      String
  date            DateTime
  status          PurchaseOrderStatus
  total           Float
  itemsCount      Int                 @map("items")
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt

  supplier        Supplier            @relation(fields: [supplierId], references: [id])
  items           PurchaseOrderItem[]
  logs            PurchaseOrderLog[]
  payments        PurchasePayment[]
}

model PurchaseOrderItem {
  id        String   @id @default(cuid())
  poId      String
  productId String
  quantity  Int
  unitCost  Float
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  purchaseOrder PurchaseOrder @relation(fields: [poId], references: [id], onDelete: Cascade)
  product       Product       @relation(fields: [productId], references: [id])
}

model PurchaseOrderLog {
  id          String   @id @default(cuid())
  poId        String
  status      PurchaseOrderStatus
  description String
  user        String
  timestamp   DateTime @default(now())

  purchaseOrder PurchaseOrder @relation(fields: [poId], references: [id], onDelete: Cascade)
}

// Payment for a specific part of a PO
model PurchasePayment {
  id          String      @id @default(cuid())
  poId        String
  vendorId    String?
  paymentFor  String // e.g., "Fabric", "Printing", "Cutting"
  cash        Float
  check       Float
  checkDate   DateTime?
  checkStatus CheckStatus?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  purchaseOrder PurchaseOrder @relation(fields: [poId], references: [id], onDelete: Cascade)
  vendor        Vendor?         @relation(fields: [vendorId], references: [id])
}

model Supplier {
  id            String          @id @default(cuid())
  name          String          @unique
  contactPerson String
  email         String
  phone         String
  address       String
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  purchaseOrders  PurchaseOrder[]
}

model Vendor {
  id            String   @id @default(cuid())
  name          String   @unique
  type          String // "Printing" or "Cutting"
  contactPerson String
  email         String
  phone         String
  rate          String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  payments      PurchasePayment[]
}

model StaffMember {
  id              String   @id @default(cuid())
  clerkId         String   @unique // From Clerk Auth
  name            String
  email           String   @unique
  role            StaffRole
  lastLogin       DateTime
  paymentType     String // Salary, Commission, Both
  salaryAmount    Float?
  salaryFrequency String? // Daily, Weekly, Monthly
  commissionCreate Float?
  commissionConfirm Float?
  permissions     Json // Store permission object as JSON
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relationships for tracking earnings and payments would be more complex
  // and might involve separate tables for income and payment history.
}

model Expense {
  id        String    @id @default(cuid())
  date      DateTime
  amount    Float
  notes     String?
  isAdExpense Boolean   @default(false)
  platform  OrderPlatform?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  categoryId String
  category  ExpenseCategory @relation(fields: [categoryId], references: [id])
  
  businessId String?
  business  Business? @relation(fields: [businessId], references: [id])
}

model ExpenseCategory {
  id     String   @id @default(cuid())
  name   String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  expenses Expense[]
}

model Business {
  id     String   @id @default(cuid())
  name   String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  orders   Order[]
  expenses Expense[]
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
