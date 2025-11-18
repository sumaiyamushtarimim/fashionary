

import { PlaceHolderImages } from './placeholder-images';
import type { Order, Product, Customer, Category, ExpenseCategory, Business, PurchaseOrder, StaffMember, Supplier, Vendor, Expense, InventoryItem, InventoryMovement, WooCommerceIntegration, OrderStatus, CourierService, Permission, StaffRole, StockLocation, CourierIntegration } from '@/types';


export const businesses: Business[] = [
    { id: 'BIZ001', name: 'Fashionary Main' },
    { id: 'BIZ002', name: 'Urban Threads' },
    { id: 'BIZ003', name: 'Kids Fashion Co.' },
];

export const stockLocations: StockLocation[] = [
    { id: 'LOC001', name: 'Godown' },
    { id: 'LOC002', name: 'Showroom 1' },
    { id: 'LOC003', name: 'Showroom 2' },
];

export const wooCommerceIntegrations: WooCommerceIntegration[] = [
    {
        id: 'woo-1',
        storeName: 'My Main Store',
        storeUrl: 'https://mainstore.com',
        consumerKey: 'ck_xxxxxxxxxxxxxx_1234',
        consumerSecret: 'cs_xxxxxxxxxxxxxx_5678',
        status: 'Active',
        businessId: 'BIZ001',
        businessName: 'Fashionary Main',
    },
    {
        id: 'woo-2',
        storeName: 'Fashionary Wholesale',
        storeUrl: 'https://wholesale.fashionary.com',
        consumerKey: 'ck_xxxxxxxxxxxxxx_abcd',
        consumerSecret: 'cs_xxxxxxxxxxxxxx_efgh',
        status: 'Inactive',
        businessId: 'BIZ002',
        businessName: 'Urban Threads',
    }
];

export const courierIntegrations: CourierIntegration[] = [
    {
        id: 'ci-1',
        businessId: 'BIZ001',
        businessName: 'Fashionary Main',
        courierName: 'Pathao',
        status: 'Active',
        credentials: {
            clientId: 'pathao_client_id_main',
            clientSecret: 'pathao_client_secret_main',
            username: 'main@fashionary.com',
            storeId: '12345'
        },
        deliveryType: 48,
        itemType: 2,
    },
    {
        id: 'ci-2',
        businessId: 'BIZ002',
        businessName: 'Urban Threads',
        courierName: 'RedX',
        status: 'Active',
        credentials: {
            accessToken: 'redx_access_token_urban'
        }
    },
     {
        id: 'ci-3',
        businessId: 'BIZ001',
        businessName: 'Fashionary Main',
        courierName: 'Steadfast',
        status: 'Inactive',
        credentials: {
            apiKey: 'steadfast_api_key_main',
            secretKey: 'steadfast_secret_key_main'
        }
    }
];

export const expenseCategories: ExpenseCategory[] = [
    { id: 'exp-cat-1', name: 'Office Rent' },
    { id: 'exp-cat-2', name: 'Utilities (Electricity, Water)' },
    { id: 'exp-cat-3', name: 'Marketing & Advertising' },
    { id: 'exp-cat-4', name: 'Salaries & Wages' },
    { id: 'exp-cat-5', name: 'Office Supplies' },
    { id: 'exp-cat-6', name: 'Transportation' },
    { id: 'exp-cat-7', name: 'Miscellaneous' },
];

export const expenses: Expense[] = [
    { id: 'EXP001', date: '2024-05-20', category: 'Marketing & Advertising', amount: 5000, notes: 'Facebook boost for Eid campaign', isAdExpense: true, businessId: 'BIZ001', business: 'Fashionary Main', platform: 'Facebook' },
    { id: 'EXP002', date: '2024-05-18', category: 'Office Supplies', amount: 1500, notes: 'A4 paper, pens, and folders', isAdExpense: false },
    { id: 'EXP003', date: '2024-05-15', category: 'Salaries & Wages', amount: 150000, notes: 'May 2024 Staff Salaries', isAdExpense: false },
    { id: 'EXP004', date: '2024-05-10', category: 'Utilities (Electricity, Water)', amount: 8500, notes: 'Monthly electricity bill', isAdExpense: false },
    { id: 'EXP005', date: '2024-05-05', category: 'Transportation', amount: 2000, notes: 'Delivery charges for May (first week)', isAdExpense: false },
];


export const categories: Category[] = [
    { id: 'cat-1', name: 'Three-Piece' },
    { id: 'cat-1-1', name: 'Cotton', parentId: 'cat-1' },
    { id: 'cat-1-2', name: 'Linen', parentId: 'cat-1' },
    { id: 'cat-2', name: 'Apparel' },
    { id: 'cat-2-1', name: 'Tops', parentId: 'cat-2' },
    { id: 'cat-2-2', name: 'Bottoms', parentId: 'cat-2' },
    { id: 'cat-3', name: 'Accessories' },
];

export const products: Product[] = [
  { 
    id: 'PROD001', 
    name: 'Organic Cotton T-Shirt', 
    description: 'Soft, breathable, and eco-friendly.', 
    price: 25.00, 
    inventory: 150, 
    image: PlaceHolderImages[0], 
    categoryId: 'cat-2-1',
    variants: [
        { id: 'VAR001', name: 'Small, White', sku: 'OCT-W-S' },
        { id: 'VAR002', name: 'Medium, White', sku: 'OCT-W-M' },
        { id: 'VAR003', name: 'Large, White', sku: 'OCT-W-L' },
        { id: 'VAR004', name: 'Small, Black', sku: 'OCT-B-S' },
    ]
  },
  { 
    id: 'PROD002', 
    name: 'Slim Fit Denim Jeans', 
    description: 'Classic five-pocket styling.', 
    price: 79.99, 
    inventory: 80, 
    image: PlaceHolderImages[1], 
    categoryId: 'cat-2-2',
    variants: [
        { id: 'VAR005', name: '30x30', sku: 'SFDJ-3030' },
        { id: 'VAR006', name: '32x30', sku: 'SFDJ-3230' },
        { id: 'VAR007', name: '34x32', sku: 'SFDJ-3432' },
    ]
  },
  { 
    id: 'PROD003', 
    name: 'Cotton Three-Piece', 
    description: 'Luxuriously soft and warm.', 
    price: 120.50, 
    inventory: 45, 
    image: PlaceHolderImages[2], 
    categoryId: 'cat-1-1', 
    ornaFabric: 2.5, 
    jamaFabric: 3, 
    selowarFabric: 2,
    variants: [
        { id: 'VAR008', name: 'Unstitched', sku: 'CTP-UNS' },
        { id: 'VAR009', name: 'Semi-Stitched', sku: 'CTP-STS' },
    ]
  },
  { 
    id: 'PROD004', 
    name: 'Leather Biker Jacket', 
    description: 'Timeless style with a modern edge.', 
    price: 350.00, 
    inventory: 20, _page.tsx`, `src/services/delivery-score.ts`, `src/services/sms.ts`, `src/app/dashboard/products/page.tsx`, `src/app/dashboard/purchases/new/page.tsx`, `src/app/dashboard/settings/page.tsx`, `src/app/dashboard/settings/courier/page.tsx`, `src/app/track-order/page.tsx`, `src/app/dashboard/orders/[id]/edit/page.tsx`, `src/app/dashboard/products/new/page.tsx`, `src/app/dashboard/orders/scan/page.tsx`, `src/app/dashboard/layout.tsx`, `src/app/dashboard/settings/integrations/page.tsx`, `src/app/dashboard/staff/[id]/page.tsx`, `src/components/ui/sidebar.tsx`, `src/app/dashboard/orders/[id]/page.tsx`, `src/app/dashboard/orders/page.tsx`, `src/app/dashboard/orders/new/page.tsx`, `src/app/dashboard/orders/incomplete/page.tsx`, `src/app/dashboard/orders/print/sticker-template.tsx`, `src/app/dashboard/orders/print/sticker/[id]/page.tsx`, `src/app/dashboard/orders/client-page.tsx`, `src/app/dashboard/orders/print/invoice/[id]/page.tsx`, `src/app/dashboard/orders/print/invoice-template.tsx`, `src/app/dashboard/orders/print/bulk/page.tsx`
*   Modified `src/types/index.ts` to add `Carrybee` to `CourierService` and define `CarrybeeCredentials`.
*   Modified `src/lib/placeholder-data.ts` to include `Carrybee` in the `courierServices` array.
*   Modified `src/app/dashboard/settings/courier/page.tsx` to dynamically render fields for Carrybee.
*   Modified `BACKEND_DOCUMENTATION.md` and `src/BACKEND_DOCUMENTATION.md` to update the Prisma schema and documentation for the new courier service.

The user will now see "Carrybee" as an option when adding a new courier integration, and the correct fields for its credentials will be displayed. This makes the system more extensible for future courier additions.