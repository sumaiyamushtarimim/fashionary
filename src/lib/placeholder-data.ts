

import { PlaceHolderImages } from './placeholder-images';
import type { Order, Product, Customer, Category, ExpenseCategory, Business, PurchaseOrder, StaffMember, Supplier, Vendor, Expense, InventoryItem, InventoryMovement, WooCommerceIntegration, OrderStatus, CourierService, Permission, StaffRole, StockLocation, CourierIntegration, Issue, IssueLog, AttendanceRecord, BreakRecord } from '@/types';


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
    },
    {
        id: 'ci-4',
        businessId: 'BIZ001',
        businessName: 'Fashionary Main',
        courierName: 'Carrybee',
        status: 'Active',
        credentials: {
            clientId: 'carrybee_client_id_main',
            clientSecret: 'carrybee_client_secret_main',
            clientContext: 'fashionary'
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
    inventory: 20,
    image: PlaceHolderImages[3], 
    categoryId: 'cat-2'
  },
  { 
    id: 'PROD005', 
    name: 'Linen Blend Blazer', 
    description: 'Lightweight and perfect for summer.', 
    price: 150.00, 
    inventory: 30, 
    image: PlaceHolderImages[4], 
    categoryId: 'cat-2-1' 
  },
];

export const customers: Omit<Customer, 'totalOrders' | 'totalSpent'>[] = [
  { id: 'CUST001', name: 'Alice Johnson', email: 'alice.j@example.com', phone: '01712345678', joinDate: '2023-01-15', address: '123 Maple St', district: 'Dhaka', country: 'Bangladesh' },
  { id: 'CUST002', name: 'Bob Williams', email: 'bob.w@example.com', phone: '01812345679', joinDate: '2023-02-20', address: '456 Oak Ave', district: 'Chittagong', country: 'Bangladesh' },
  { id: 'CUST003', name: 'Charlie Brown', email: 'charlie.b@example.com', phone: '01912345680', joinDate: '2023-03-10', address: '789 Pine Ln', district: 'Sylhet', country: 'Bangladesh' },
  { id: 'CUST004', name: 'Diana Prince', email: 'diana.p@example.com', phone: '01612345681', joinDate: '2023-04-05', address: '101 Wonder Rd', district: 'Dhaka', country: 'Bangladesh' },
  { id: 'CUST005', name: 'Ethan Hunt', email: 'ethan.h@example.com', phone: '01512345682', joinDate: '2023-05-25', address: '202 Mission St', district: 'Khulna', country: 'Bangladesh' },
];

export const allStatuses: OrderStatus[] = [
    'New', 'Confirmed', 'Packing Hold', 'Canceled', 'Hold', 'In-Courier',
    'RTS (Ready to Ship)', 'Shipped', 'Delivered', 'Return Pending', 'Returned',
    'Partial', 'Incomplete', 'Incomplete-Cancelled'
];

export const orders: Order[] = [
    {
        id: 'ORD-2024-001',
        customerName: 'Alice Johnson',
        customerEmail: 'alice.j@example.com',
        customerPhone: '01712345678',
        date: '2024-05-24',
        status: 'Delivered',
        total: 104.99,
        shipping: 5.00,
        products: [
            { productId: 'PROD001', name: 'Organic Cotton T-Shirt', quantity: 1, price: 25.00, image: PlaceHolderImages[0] },
            { productId: 'PROD002', name: 'Slim Fit Denim Jeans', quantity: 1, price: 79.99, image: PlaceHolderImages[1] },
        ],
        logs: [
            { title: 'New', timestamp: '2024-05-24T10:00:00Z', description: 'Order created.', user: 'Alice Johnson' },
            { title: 'Confirmed', timestamp: '2024-05-24T10:05:00Z', description: 'Payment confirmed.', user: 'Admin' },
            { title: 'RTS (Ready to Ship)', timestamp: '2024-05-24T14:00:00Z', description: 'Order packed.', user: 'Packing Team' },
            { title: 'Shipped', timestamp: '2024-05-24T18:00:00Z', description: 'Shipped via Pathao.', user: 'Logistics' },
            { title: 'Delivered', timestamp: '2024-05-25T12:00:00Z', description: 'Delivered to customer.', user: 'Pathao' },
        ],
        customerNote: 'Please deliver after 5 PM.',
        officeNote: 'Customer called to confirm address.',
        createdBy: 'Alice Johnson',
        confirmedBy: 'Admin',
        businessId: 'BIZ001',
        platform: 'Website',
        shippingAddress: { address: '123 Maple St', district: 'Dhaka', country: 'Bangladesh' },
        paymentMethod: 'Cash on Delivery',
        paidAmount: 104.99,
    },
    {
        id: 'ORD-2024-002',
        customerName: 'Bob Williams',
        customerEmail: 'bob.w@example.com',
        customerPhone: '01812345679',
        date: '2024-05-23',
        status: 'Shipped',
        total: 120.50,
        shipping: 5.00,
        products: [
            { productId: 'PROD003', name: 'Cotton Three-Piece', quantity: 1, price: 120.50, image: PlaceHolderImages[2] },
        ],
        logs: [
            { title: 'New', timestamp: '2024-05-23T11:00:00Z', description: 'Order created.', user: 'Bob Williams' },
            { title: 'Confirmed', timestamp: '2024-05-23T11:10:00Z', description: 'Payment confirmed.', user: 'Admin' },
            { title: 'RTS (Ready to Ship)', timestamp: '2024-05-23T15:00:00Z', description: 'Order packed.', user: 'Packing Team' },
            { title: 'Shipped', timestamp: '2024-05-23T19:00:00Z', description: 'Shipped via RedX.', user: 'Logistics' },
        ],
        customerNote: '',
        officeNote: '',
        createdBy: 'Bob Williams',
        confirmedBy: 'Admin',
        businessId: 'BIZ002',
        platform: 'Facebook',
        shippingAddress: { address: '456 Oak Ave', district: 'Chittagong', country: 'Bangladesh' },
        paymentMethod: 'bKash',
        paidAmount: 125.50
    },
    {
        id: 'ORD-2024-003',
        customerName: 'Charlie Brown',
        customerEmail: 'charlie.b@example.com',
        customerPhone: '01912345680',
        date: '2024-05-22',
        status: 'Confirmed',
        total: 350.00,
        shipping: 5.00,
        products: [
            { productId: 'PROD004', name: 'Leather Biker Jacket', quantity: 1, price: 350.00, image: PlaceHolderImages[3] },
        ],
        logs: [
            { title: 'New', timestamp: '2024-05-22T09:30:00Z', description: 'Order created.', user: 'Charlie Brown' },
            { title: 'Confirmed', timestamp: '2024-05-22T09:35:00Z', description: 'Payment confirmed.', user: 'Admin' },
        ],
        customerNote: 'Gift wrap please.',
        officeNote: 'VIP Customer.',
        createdBy: 'Charlie Brown',
        confirmedBy: 'Admin',
        businessId: 'BIZ001',
        platform: 'Instagram',
        shippingAddress: { address: '789 Pine Ln', district: 'Sylhet', country: 'Bangladesh' },
        paymentMethod: 'Nagad',
        paidAmount: 355.00,
    },
    {
        id: 'ORD-2024-004',
        customerName: 'Diana Prince',
        customerEmail: 'diana.p@example.com',
        customerPhone: '01612345681',
        date: '2024-05-21',
        status: 'Canceled',
        total: 25.00,
        shipping: 5.00,
        products: [
            { productId: 'PROD001', name: 'Organic Cotton T-Shirt', quantity: 1, price: 25.00, image: PlaceHolderImages[0] },
        ],
        logs: [
             { title: 'New', timestamp: '2024-05-21T12:00:00Z', description: 'Order created.', user: 'Diana Prince' },
             { title: 'Canceled', timestamp: '2024-05-21T12:30:00Z', description: 'Canceled by customer request.', user: 'Admin' },
        ],
        customerNote: '',
        officeNote: 'Customer wanted a different color.',
        createdBy: 'Diana Prince',
        confirmedBy: '',
        businessId: 'BIZ003',
        platform: 'TikTok',
        shippingAddress: { address: '101 Wonder Rd', district: 'Dhaka', country: 'Bangladesh' },
        paymentMethod: 'Cash on Delivery',
        paidAmount: 0.00,
    },
     {
        id: 'ORD-2024-005',
        customerName: 'Alice Johnson',
        customerEmail: 'alice.j@example.com',
        customerPhone: '01712345678',
        date: '2024-05-26',
        status: 'New',
        total: 150.00,
        shipping: 5.00,
        products: [
            { productId: 'PROD005', name: 'Linen Blend Blazer', quantity: 1, price: 150.00, image: PlaceHolderImages[4] },
        ],
        logs: [
            { title: 'New', timestamp: '2024-05-26T15:00:00Z', description: 'Order created.', user: 'Alice Johnson' },
        ],
        customerNote: 'Urgent delivery requested.',
        officeNote: '',
        createdBy: 'Alice Johnson',
        confirmedBy: '',
        businessId: 'BIZ001',
        platform: 'Website',
        shippingAddress: { address: '123 Maple St', district: 'Dhaka', country: 'Bangladesh' },
        paymentMethod: 'Cash on Delivery',
        paidAmount: 0.00,
    },
     {
        id: 'INC-2024-001',
        customerName: 'Bruce Wayne',
        customerEmail: 'bruce.w@example.com',
        customerPhone: '01711111111',
        date: '2024-05-25',
        status: 'Incomplete',
        total: 350.00,
        shipping: 0.00,
        products: [
            { productId: 'PROD004', name: 'Leather Biker Jacket', quantity: 1, price: 350.00, image: PlaceHolderImages[3] },
        ],
        logs: [],
        customerNote: '',
        officeNote: 'Customer abandoned checkout.',
        createdBy: '',
        confirmedBy: '',
        businessId: '',
        platform: 'Website',
        shippingAddress: { address: '', district: '', country: '' },
        paymentMethod: 'Cash on Delivery',
        paidAmount: 0.00,
    }
];

export const inventory: InventoryItem[] = [
    { id: 'INV001', productId: 'PROD001', productName: 'Organic Cotton T-Shirt', sku: 'OCT-W-S', quantity: 50, locationId: 'LOC001', locationName: 'Godown', lotNumber: 'LOT2401', receivedDate: '2024-01-10' },
    { id: 'INV002', productId: 'PROD001', productName: 'Organic Cotton T-Shirt', sku: 'OCT-W-M', quantity: 50, locationId: 'LOC001', locationName: 'Godown', lotNumber: 'LOT2401', receivedDate: '2024-01-10' },
    { id: 'INV003', productId: 'PROD001', productName: 'Organic Cotton T-Shirt', sku: 'OCT-W-L', quantity: 5, locationId: 'LOC002', locationName: 'Showroom 1', lotNumber: 'LOT2401', receivedDate: '2024-01-10' },
    { id: 'INV004', productId: 'PROD002', productName: 'Slim Fit Denim Jeans', sku: 'SFDJ-3230', quantity: 80, locationId: 'LOC002', locationName: 'Showroom 1', lotNumber: 'LOT2402', receivedDate: '2024-02-15' },
    { id: 'INV005', productId: 'PROD003', productName: 'Cotton Three-Piece', sku: 'CTP-UNS', quantity: 45, locationId: 'LOC003', locationName: 'Showroom 2', lotNumber: 'LOT2403', receivedDate: '2024-03-20' },
    { id: 'INV006', productId: 'PROD004', productName: 'Leather Biker Jacket', sku: 'LBJ-BLK-M', quantity: 9, locationId: 'LOC002', locationName: 'Showroom 1', lotNumber: 'LOT2404', receivedDate: '2024-04-05' },
    { id: 'INV007', productId: 'PROD005', productName: 'Linen Blend Blazer', sku: 'LBB-BEI-M', quantity: 30, locationId: 'LOC001', locationName: 'Godown', lotNumber: 'LOT2405', receivedDate: '2024-05-01' },
];

export const inventoryMovements: Record<string, InventoryMovement[]> = {
    'INV006': [
        { id: 'MOV001', date: '2024-04-05', type: 'Received', quantityChange: 20, balance: 20, notes: 'Initial stock from PO-2024-004', user: 'Admin', reference: 'PO-2024-004' },
        { id: 'MOV002', date: '2024-04-10', type: 'Transfer', quantityChange: -10, balance: 10, notes: 'Transfer to Showroom 1', user: 'Logistics', toLocationId: 'LOC002' },
        { id: 'MOV003', date: '2024-05-22', type: 'Sold', quantityChange: -1, balance: 9, notes: 'Sold via order ORD-2024-003', user: 'System', reference: 'ORD-2024-003' },
    ],
     'INV003': [
        { id: 'MOV004', date: '2024-01-10', type: 'Received', quantityChange: 20, balance: 20, notes: 'Initial stock', user: 'Admin', reference: 'PO-2024-001' },
        { id: 'MOV005', date: '2024-01-15', type: 'Adjusted', quantityChange: -5, balance: 15, notes: 'Damaged goods', user: 'QA Team', reference: 'ADJ-001' },
        { id: 'MOV006', date: '2024-03-01', type: 'Transfer', quantityChange: -10, balance: 5, notes: 'Sent to Showroom 1', user: 'Logistics', toLocationId: 'LOC002' },
    ],
};


export const suppliers: Supplier[] = [
    { id: 'SUP001', name: 'Fabric House Ltd.', contactPerson: 'Mr. Rahim', email: 'rahim@fabric-house.com', phone: '01711223344', address: 'Tejgaon, Dhaka' },
    { id: 'SUP002', name: 'Textile Mania', contactPerson: 'Ms. Salma', email: 'salma@textilemania.com', phone: '01811223355', address: 'Narayanganj' },
];

export const vendors: Vendor[] = [
    { id: 'VEN001', name: 'Dhaka Printers', type: 'Printing', contactPerson: 'Kamal', email: 'kamal@dhakaprinters.com', phone: '01911223366', rate: '15/yard' },
    { id: 'VEN002', name: 'Perfect Cutters', type: 'Cutting', contactPerson: 'Jamal', email: 'jamal@perfectcut.com', phone: '01611223377', rate: '5/pc' },
];

export const purchaseOrders: PurchaseOrder[] = [
    { 
        id: 'PO-2024-001', 
        supplier: 'Fabric House Ltd.', 
        date: '2024-04-15', 
        status: 'Received', 
        total: 150000, 
        items: 100, 
        logs: [
            { status: 'Fabric Ordered', timestamp: '2024-04-15T10:00:00Z', description: 'Order placed with supplier.', user: 'Admin'},
            { status: 'Received', timestamp: '2024-04-25T14:00:00Z', description: 'Fabric received in godown.', user: 'Storekeeper'},
        ],
        fabricPayment: {
            cash: 50000,
            check: 100000,
            checkDate: '2024-05-15',
            checkStatus: 'Passed',
        }
    },
    { 
        id: 'PO-2024-002', 
        supplier: 'Textile Mania', 
        date: '2024-05-01', 
        status: 'Printing', 
        total: 250000, 
        items: 200, 
        logs: [
            { status: 'Fabric Ordered', timestamp: '2024-05-01T11:00:00Z', description: 'Order placed with supplier.', user: 'Admin'},
            { status: 'Printing', timestamp: '2024-05-10T16:00:00Z', description: 'Fabric sent to Dhaka Printers.', user: 'Admin'},
        ],
        fabricPayment: {
            cash: 250000,
            check: 0,
            checkDate: '',
        },
        printingVendor: 'Dhaka Printers',
        printingPayment: {
            cash: 10000,
            check: 20000,
            checkDate: '2024-06-10',
            checkStatus: 'Pending',
        }
    },
    { 
        id: 'PO-2024-003', 
        supplier: 'Fabric House Ltd.', 
        date: '2024-05-20', 
        status: 'Cutting', 
        total: 75000, 
        items: 50, 
        logs: [
            { status: 'Fabric Ordered', timestamp: '2024-05-20T12:00:00Z', description: 'Order placed with supplier.', user: 'Admin'},
            { status: 'Printing', timestamp: '2024-05-25T14:00:00Z', description: 'Printed fabric sent to Dhaka Printers.', user: 'Admin'},
            { status: 'Cutting', timestamp: '2024-05-30T14:00:00Z', description: 'Printed fabric sent to Perfect Cutters.', user: 'Admin'},
        ],
        fabricPayment: {
            cash: 0,
            check: 75000,
            checkDate: '2024-06-20',
            checkStatus: 'Pending'
        },
        printingVendor: 'Dhaka Printers',
        printingPayment: {
            cash: 0,
            check: 15000,
            checkDate: '2024-06-25',
            checkStatus: 'Pending'
        },
        cuttingVendor: 'Perfect Cutters',
        cuttingPayment: {
            cash: 2500,
            check: 0,
            checkDate: '',
        }
    },
];

// --- PERMISSIONS PRESETS ---
const NO_ACCESS: Permission = { create: false, read: false, update: false, delete: false };
const READ_ONLY: Permission = { create: false, read: true, update: false, delete: false };
const CREATE_READ_UPDATE: Permission = { create: true, read: true, update: true, delete: false };
const FULL_ACCESS: Permission = { create: true, read: true, update: true, delete: false };

const PERMISSIONS: Record<StaffRole, StaffMember['permissions']> = {
    Admin: {
        orders: FULL_ACCESS, packingOrders: FULL_ACCESS, products: FULL_ACCESS, inventory: FULL_ACCESS,
        customers: FULL_ACCESS, purchases: FULL_ACCESS, expenses: FULL_ACCESS, checkPassing: FULL_ACCESS,
        partners: FULL_ACCESS, courierReport: FULL_ACCESS, staff: FULL_ACCESS, settings: FULL_ACCESS, analytics: FULL_ACCESS,
        issues: FULL_ACCESS, attendance: FULL_ACCESS,
    },
    Manager: {
        orders: CREATE_READ_UPDATE, packingOrders: READ_ONLY, products: CREATE_READ_UPDATE, inventory: CREATE_READ_UPDATE,
        customers: CREATE_READ_UPDATE, purchases: CREATE_READ_UPDATE, expenses: CREATE_READ_UPDATE, checkPassing: { ...CREATE_READ_UPDATE, create: false },
        partners: CREATE_READ_UPDATE, courierReport: READ_ONLY, staff: { ...CREATE_READ_UPDATE, delete: false }, settings: READ_ONLY, analytics: NO_ACCESS,
        issues: CREATE_READ_UPDATE, attendance: READ_ONLY,
    },
    Moderator: {
        orders: CREATE_READ_UPDATE, packingOrders: NO_ACCESS, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: CREATE_READ_UPDATE, attendance: NO_ACCESS,
    },
    'Packing Assistant': {
        orders: NO_ACCESS, packingOrders: { ...CREATE_READ_UPDATE, create: false, delete: false }, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: NO_ACCESS, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: NO_ACCESS, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: NO_ACCESS, attendance: NO_ACCESS,
    },
    'Seller': {
        orders: CREATE_READ_UPDATE, packingOrders: NO_ACCESS, products: READ_ONLY, inventory: READ_ONLY,
        customers: CREATE_READ_UPDATE, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: { ...CREATE_READ_UPDATE, create: true, read: true, update: true, delete: false }, attendance: NO_ACCESS,
    },
    'Call Assistant': {
        orders: READ_ONLY, packingOrders: NO_ACCESS, products: READ_ONLY, inventory: READ_ONLY,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: { ...CREATE_READ_UPDATE, create: false, read: true, update: true, delete: false }, attendance: NO_ACCESS,
    },
    'Call Centre Manager': {
        orders: READ_ONLY, packingOrders: NO_ACCESS, products: READ_ONLY, inventory: READ_ONLY,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: READ_ONLY, settings: NO_ACCESS, analytics: READ_ONLY,
        issues: CREATE_READ_UPDATE, attendance: READ_ONLY,
    },
    'Courier Manager': {
        orders: { ...CREATE_READ_UPDATE, create: false, delete: false }, packingOrders: READ_ONLY, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: READ_ONLY,
        partners: NO_ACCESS, courierReport: FULL_ACCESS, staff: NO_ACCESS, settings: { ...NO_ACCESS, read: true }, analytics: NO_ACCESS,
        issues: { ...CREATE_READ_UPDATE, create: true, read: true, update: true, delete: false }, attendance: NO_ACCESS,
    },
    'Courier Call Assistant': {
        orders: READ_ONLY, packingOrders: NO_ACCESS, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: { ...CREATE_READ_UPDATE, create: false, read: true, update: true, delete: false }, attendance: NO_ACCESS,
    },
    'Custom': NO_ACCESS,
}
// --- END OF PERMISSIONS PRESETS ---


export const staff: StaffMember[] = [
    {
        id: 'STAFF001',
        name: 'Admin User',
        email: 'admin@fashionary.com',
        role: 'Admin',
        accessibleBusinessIds: ['BIZ001', 'BIZ002', 'BIZ003'],
        lastLogin: '2024-05-27T10:00:00Z',
        paymentType: 'Salary',
        salaryDetails: { amount: 50000, frequency: 'Monthly' },
        performance: { ordersCreated: 50, ordersConfirmed: 45, statusBreakdown: { 'New': 0, 'Confirmed': 0, 'Packing Hold': 0, 'Canceled': 0, 'Hold': 0, 'In-Courier': 0, 'RTS (Ready to Ship)': 0, 'Shipped': 0, 'Delivered': 0, 'Return Pending': 0, 'Returned': 0, 'Partial': 0, 'Incomplete': 0, 'Incomplete-Cancelled': 0 } },
        financials: { totalEarned: 250000, totalPaid: 250000, dueAmount: 0 },
        paymentHistory: [{ date: '2024-05-01', amount: 50000, notes: 'April Salary' }],
        incomeHistory: [],
        permissions: PERMISSIONS.Admin,
    },
    {
        id: 'STAFF002',
        name: 'Saleha Akter',
        email: 'saleha@fashionary.com',
        role: 'Moderator',
        accessibleBusinessIds: ['BIZ001', 'BIZ003'],
        lastLogin: '2024-05-26T14:30:00Z',
        paymentType: 'Commission',
        commissionDetails: { 
            onOrderCreate: 50, 
            onOrderConfirm: 100,
            targetEnabled: true,
            targetPeriod: 'Monthly',
            targetCount: 100,
        },
        performance: { ordersCreated: 120, ordersConfirmed: 110, statusBreakdown: { 'New': 0, 'Confirmed': 0, 'Packing Hold': 0, 'Canceled': 0, 'Hold': 0, 'In-Courier': 0, 'RTS (Ready to Ship)': 0, 'Shipped': 0, 'Delivered': 0, 'Return Pending': 0, 'Returned': 0, 'Partial': 0, 'Incomplete': 0, 'Incomplete-Cancelled': 0 } },
        financials: { totalEarned: 17000, totalPaid: 15000, dueAmount: 2000 },
        paymentHistory: [{ date: '2024-05-15', amount: 15000, notes: 'Commission Payout' }],
        incomeHistory: [
            { date: '2024-05-24', orderId: 'ORD-2024-001', action: 'Created', amount: 50 },
            { date: '2024-05-24', orderId: 'ORD-2024-001', action: 'Confirmed', amount: 100 },
        ],
        permissions: PERMISSIONS.Moderator,
    },
     {
        id: 'STAFF003',
        name: 'Kamrul Hasan',
        email: 'kamrul@fashionary.com',
        role: 'Packing Assistant',
        accessibleBusinessIds: ['BIZ001'],
        lastLogin: '2024-05-27T09:00:00Z',
        paymentType: 'Salary',
        salaryDetails: { amount: 15000, frequency: 'Monthly' },
        commissionDetails: {
            onOrderPacked: 20,
        },
        performance: { ordersCreated: 0, ordersConfirmed: 0, statusBreakdown: { 'New': 0, 'Confirmed': 0, 'Packing Hold': 0, 'Canceled': 0, 'Hold': 0, 'In-Courier': 0, 'RTS (Ready to Ship)': 150, 'Shipped': 0, 'Delivered': 0, 'Return Pending': 0, 'Returned': 0, 'Partial': 0, 'Incomplete': 0, 'Incomplete-Cancelled': 0 } },
        financials: { totalEarned: 75000, totalPaid: 60000, dueAmount: 15000 },
        paymentHistory: [{ date: '2024-05-01', amount: 15000, notes: 'April Salary' }],
        incomeHistory: [],
        permissions: PERMISSIONS['Packing Assistant'],
    },
];

export const issues: Issue[] = [
    {
        id: 'ISSUE-001',
        orderId: 'ORD-2024-001',
        title: 'Wrong size delivered',
        description: 'Customer received a Medium size T-shirt instead of Large.',
        status: 'Resolved',
        priority: 'High',
        createdBy: 'Saleha Akter',
        assignedTo: 'Admin User',
        createdAt: '2024-05-26T10:00:00Z',
        resolvedAt: '2024-05-27T14:00:00Z',
        logs: [
            { id: 'ILOG-001', timestamp: '2024-05-26T10:00:00Z', user: 'Saleha Akter', action: 'Issue Created. Priority set to High.' },
            { id: 'ILOG-002', timestamp: '2024-05-26T10:05:00Z', user: 'Saleha Akter', action: 'Assigned to Admin User.' },
            { id: 'ILOG-003', timestamp: '2024-05-27T09:00:00Z', user: 'Admin User', action: 'Status changed to In Progress. Contacted customer for replacement.' },
            { id: 'ILOG-004', timestamp: '2024-05-27T14:00:00Z', user: 'Admin User', action: 'Status changed to Resolved. Replacement product has been dispatched.' },
        ],
    },
    {
        id: 'ISSUE-002',
        orderId: 'ORD-2024-002',
        title: 'Delivery delay',
        description: 'Customer is complaining about the delivery taking too long.',
        status: 'In Progress',
        priority: 'Medium',
        createdBy: 'Saleha Akter',
        assignedTo: 'Admin User',
        createdAt: '2024-05-28T11:00:00Z',
        logs: [
            { id: 'ILOG-005', timestamp: '2024-05-28T11:00:00Z', user: 'Saleha Akter', action: 'Issue Created.' },
            { id: 'ILOG-006', timestamp: '2024-05-28T11:02:00Z', user: 'Saleha Akter', action: 'Status changed to In Progress. Assigned to Admin User.' },
        ],
    }
];

export const bdDistricts: string[] = ["Bagerhat", "Bandarban", "Barguna", "Barisal", "Bhola", "Bogra", "Brahmanbaria", "Chandpur", "Chapai Nawabganj", "Chittagong", "Chuadanga", "Comilla", "Cox's Bazar", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jessore", "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachhari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"];
export const courierServices: CourierService[] = ['Pathao', 'RedX', 'Steadfast', 'Carrybee'];
export const paymentMethods: PaymentMethod[] = ['Cash on Delivery', 'bKash', 'Nagad'];
export const orderPlatforms: OrderPlatform[] = ['TikTok', 'Messenger', 'Facebook', 'Instagram', 'Website'];

    
