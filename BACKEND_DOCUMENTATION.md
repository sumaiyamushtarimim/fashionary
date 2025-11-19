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
  PackingHold   @map("Packing Hold")
  Canceled
  Hold
  InCourier     @map("In-Courier")
  ReadyToShip   @map("RTS (Ready to Ship)")
  Shipped
  Delivered
  ReturnPending
  Returned
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

enum InventoryMovementType {
  Received
  Sold
  Adjusted
  Returned
  Transfer
}

enum CourierService {
  Pathao
  RedX
  Steadfast
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
  inventoryItems   InventoryItem[]
}

model ProductVariant {
  id        String   @id @default(cuid())
  name      String
  sku       String   @unique
  productId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  product          Product         @relation(fields: [productId], references: [id], onDelete: Cascade)
  inventoryItems   InventoryItem[]
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
  email       String?
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
  courierIntegrations CourierIntegration[]
}

model CourierIntegration {
  id           String         @id @default(cuid())
  businessId   String
  business     Business       @relation(fields: [businessId], references: [id])
  courierName  CourierService
  status       String
  credentials  Json // Stores API keys, tokens, etc.
  deliveryType Int?
  itemType     Int?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  @@unique([businessId, courierName])
}

model StockLocation {
  id   String @id @default(cuid())
  name String @unique
  
  inventoryItems   InventoryItem[]
  transfersFrom    StockTransfer[] @relation("FromLocation")
  transfersTo      StockTransfer[] @relation("ToLocation")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model InventoryItem {
  id             String @id @default(cuid())
  productId      String
  variantId      String?
  locationId     String
  quantity       Int
  lotNumber      String // For FIFO tracking
  receivedDate   DateTime
  
  product        Product       @relation(fields: [productId], references: [id])
  variant        ProductVariant? @relation(fields: [variantId], references: [id])
  location       StockLocation @relation(fields: [locationId], references: [id])
  
  movements      InventoryMovement[]

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  @@unique([productId, variantId, locationId, lotNumber])
}

model InventoryMovement {
  id              String                @id @default(cuid())
  inventoryItemId String
  type            InventoryMovementType
  quantityChange  Int // Positive for additions, negative for subtractions
  balance         Int
  notes           String?
  user            String // Staff name or ID
  reference       String? // e.g., Order ID, PO ID, Transfer ID
  timestamp       DateTime              @default(now())

  inventoryItem   InventoryItem         @relation(fields: [inventoryItemId], references: [id])
  stockTransfer   StockTransfer?        @relation(fields: [reference], references: [id])
}

model StockTransfer {
  id              String    @id @default(cuid())
  fromLocationId  String
  toLocationId    String
  user            String // Staff name or ID
  notes           String?
  transferDate    DateTime  @default(now())
  
  fromLocation    StockLocation @relation("FromLocation", fields: [fromLocationId], references: [id])
  toLocation      StockLocation @relation("ToLocation", fields: [toLocationId], references: [id])
  movements       InventoryMovement[]
}
```

## 2. Building the API Endpoints

Create RESTful API endpoints for each data domain. For example:
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders`
- `GET /api/products`
- `GET /api/customers`
- `POST /api/customers`
- `PUT /api/customers/:id`
- `DELETE /api/customers/:id`

### **Specialized Endpoints for "All-in-One Scan Mode"**

For the "All-in-One Scan Mode" feature, you will need two specific endpoints:

#### **Order Validation**

This endpoint is used to quickly validate a scanned order code.

**Endpoint:** `GET /api/orders/validate-scan?code={barcodeContent}`

**Success Response (200 OK):**
```json
{
  "status": "ok",
  "order": {
    "id": "ORD-2024-001",
    "currentStatus": "RTS (Ready to Ship)"
  }
}
```

**Error Response (e.g., 404 Not Found, 409 Conflict):**
```json
{
  "status": "error",
  "reason": "Order not found / Status mismatch / Already processed"
}
```

#### **Bulk Order Action**

This endpoint applies a single action to multiple orders at once.

**Endpoint:** `POST /api/orders/bulk-action`

**Request Body:**
```json
{
  "action": "MARK_AS_SHIPPED", // or "PRINT_INVOICES", "CANCEL", etc.
  "orderIds": ["ORD-2024-001", "ORD-2024-002", "ORD-2024-003"]
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Successfully applied action to 3 orders.",
  "processed": ["ORD-2024-001", "ORD-2024-002", "ORD-2024-003"],
  "failed": []
}
```

**Partial Success Response (207 Multi-Status):**
```json
{
  "status": "partial_success",
  "message": "Applied action to 1 of 2 orders.",
  "processed": ["ORD-2024-001"],
  "failed": [
    { "orderId": "ORD-2024-002", "reason": "Invalid status for this action" }
  ]
}
```

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

## 5. Stock Management Logic

**All stock management logic must be handled by the backend.** The frontend should only trigger actions (e.g., changing an order status), and the backend will be responsible for adjusting inventory levels accordingly. This ensures data integrity and security.

### When to Decrease Stock:

Stock should be considered "reserved" or "deducted" from the available inventory when an order is confirmed and ready to be processed.

-   **Trigger:** An order's status changes from `New` to `Confirmed`, or from `New` to `RTS (Ready to Ship)`.
-   **Action:** For each product in the order, the backend must decrease the `inventory` count in the `Product` table by the `quantity` specified in the order. This should be an atomic transaction.

### When to Increase (Return) Stock:

Stock should be returned to the inventory in cases of cancellation, returns, or order edits.

-   **Trigger 1: Order Cancellation**
    -   **Condition:** An order with a status of `Confirmed`, `Packing Hold`, or `RTS (Ready to Ship)` is changed to `Canceled`.
    -   **Action:** The backend must add the quantities of all products in that order back to the inventory. Orders that are already `Shipped` should not automatically have their stock returned upon cancellation; this should be handled through the `Returned` status flow.

-   **Trigger 2: Order Return**
    -   **Condition:** A `Shipped` or `Delivered` order's status is changed to `Returned` or `Paid Returned`.
    -   **Action:** The backend should increase the inventory for the returned products. It is recommended to have a Quality Check (QC) process. Stock may be returned to a "sellable" location or a "quarantine/damaged" location based on the condition of the items.

-   **Trigger 3: Editing an Order**
    -   **Condition:** A `Confirmed` order is edited, and the quantity of a product is *decreased*.
    -   **Action:** The backend should calculate the difference between the old and new quantity for the edited product line item. The difference should be added back to the `Product`'s inventory. For example, if quantity changes from 5 to 2, 3 units should be returned to stock.
    -   **Condition:** A product is *removed* from a `Confirmed` order.
    -   **Action:** The entire quantity of the removed product should be added back to the inventory.

It is critical that all these operations are logged in the `InventoryMovement` table to maintain a clear audit trail of every stock change.

## 6. WooCommerce & Courier Integration

The backend must handle the logic for integrating with WooCommerce stores and courier services.

### Courier Integration

-   **Business-Specific Credentials:** The backend must store courier credentials (`apiKey`, `secretKey`, etc.) on a per-business basis, using the `CourierIntegration` model. The `credentials` field is a JSON blob to accommodate different API requirements (e.g., Pathao needs a `storeId`, `clientId`, etc., while others may only need an API key).
-   **Dynamic Credential Selection:** When an order is dispatched to a courier (e.g., Pathao), the backend must:
    1.  Get the `businessId` from the `Order`.
    2.  Find the corresponding `CourierIntegration` entry for that business and the selected courier.
    3.  Use the credentials from that entry to make the API call to the courier. This ensures that orders from "Fashionary Main" use its Pathao keys, and orders from "Urban Threads" use its own keys.

### WooCommerce Integration

The synchronization logic is very specific and must be followed carefully.

-   **Store Credentials:** Securely store WooCommerce store URLs, Consumer Keys, and Consumer Secrets in the database, associated with a user or business.
-   **API Communication:** Create services to communicate with the WooCommerce REST API using the stored credentials. This application does **not** sync product details from WooCommerce. All synchronization is based on matching **SKUs** between this application and the WooCommerce stores.
-   **Stock Management Logic (Status-Based):**
    -   When inventory hits `0`, push `"outofstock"` status to all linked WooCommerce stores for that SKU.
    -   When inventory goes from `0` to positive, push `"instock"` status.
    -   **Periodic Sanity Check (Twice Daily):** At **9 AM and 9 PM (GMT+6)**, fetch `stock_status` from all WooCommerce stores and compare with the ERP. **Only push an update if there's a mismatch.**
-   **Order Management Logic (One-Way Sync):**
    -   Listen for new orders from WooCommerce (via webhook).
    -   Create new orders in the ERP.
    -   **No status updates are pushed back to WooCommerce.** All order management happens within this ERP.

## 7. Handling Existing API Routes

The frontend already contains some server-side logic in the `src/app/api/` directory.

- **`src/app/api/delivery-report/route.ts`**: This acts as a proxy to the external Hoorin API. It is highly recommended to move this logic to your dedicated backend. This will improve security by hiding the external API key and centralize all external communications.
- **`src/services/sms.ts`**: This file contains a mock function to send SMS. You should create a dedicated endpoint on your backend (e.g., `POST /api/sms`) that the frontend can call, which then handles the communication with the MiM SMS service.

By following this guide, you have a clear path to building and integrating a robust backend with this comprehensive frontend application. Good luck!
