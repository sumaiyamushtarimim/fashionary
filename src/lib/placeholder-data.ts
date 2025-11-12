
import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  image: ImagePlaceholder;
};

export type OrderStatus = 
  | 'New'
  | 'Confirmed'
  | 'Canceled'
  | 'Hold'
  | 'Packing'
  | 'Packing Hold'
  | 'RTS (Ready to Ship)'
  | 'Shipped'
  | 'Delivered'
  | 'Returned'
  | 'Partially Delivered'
  | 'Partially Returned';

export type OrderProduct = {
  productId: string;
  name: string;
  image: ImagePlaceholder;
  quantity: number;
  price: number;
};

export type OrderLog = {
    status: OrderStatus;
    timestamp: string;
    description: string;
    user: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  status: OrderStatus;
  total: number;
  products: OrderProduct[];
  logs: OrderLog[];
  customerNote: string;
  officeNote: string;
  createdBy?: string;
  confirmedBy?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;

  joinDate: string;
};

export type InventoryItem = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  location: string;
  lotNumber: string;
  receivedDate: string;
};

export type PurchaseOrderStatus = 'Draft' | 'Fabric Ordered' | 'Printing' | 'Cutting' | 'Received' | 'Cancelled';

export type PurchaseOrderLog = {
    status: PurchaseOrderStatus;
    timestamp: string;
    description: string;
    user: string;
};

export type CheckStatus = 'Pending' | 'Passed' | 'Bounced' | 'Cancelled';

export type Payment = {
    cash: number;
    check: number;
    checkDate: string;
    checkStatus?: CheckStatus;
};

export type PurchaseOrder = {
    id: string;
    supplier: string;
    date: string;
    status: PurchaseOrderStatus;
    total: number;
    items: number;
    logs: PurchaseOrderLog[];
    fabricPayment?: Payment;
    printingPayment?: Payment;
    printingVendor?: string;
    cuttingPayment?: Payment;
    cuttingVendor?: string;
};

export type StaffIncome = {
    date: string;
    orderId: string;
    action: 'Created' | 'Confirmed';
    amount: number;
};

export type StaffPayment = {
    date: string;
    amount: number;
    notes: string;
};


export type StaffMember = {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Manager' | 'Sales' | 'Warehouse';
    lastLogin: string;
    paymentType: 'Salary' | 'Commission' | 'Both';
    salaryDetails?: {
        amount: number;
        frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
    };
    commissionDetails?: {
        onOrderCreate: number; // Amount per order created
        onOrderConfirm: number; // Amount per order confirmed
    };
    performance: {
        ordersCreated: number;
        ordersConfirmed: number;
        statusBreakdown: Record<OrderStatus, number>;
    };
    financials: {
        totalEarned: number;
        totalPaid: number;
        dueAmount: number;
    };
    paymentHistory: StaffPayment[];
    incomeHistory: StaffIncome[];
};

export type Supplier = {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
};

export type Vendor = {
    id: string;
    name: string;
    type: 'Printing' | 'Cutting';
    contactPerson: string;
    email: string;
    phone: string;
    rate: string;
};

export const products: Product[] = [
  { id: 'PROD001', name: 'Organic Cotton T-Shirt', description: 'Soft, breathable, and eco-friendly.', price: 25.00, inventory: 150, image: PlaceHolderImages[0] },
  { id: 'PROD002', name: 'Slim Fit Denim Jeans', description: 'Classic five-pocket styling.', price: 79.99, inventory: 80, image: PlaceHolderImages[1] },
  { id: 'PROD003', name: 'Cashmere V-Neck Sweater', description: 'Luxuriously soft and warm.', price: 120.50, inventory: 45, image: PlaceHolderImages[2] },
  { id: 'PROD004', name: 'Leather Biker Jacket', description: 'Timeless style with a modern edge.', price: 350.00, inventory: 20, image: PlaceHolderImages[3] },
  { id: 'PROD005', name: 'Linen Blend Blazer', description: 'Lightweight and perfect for summer.', price: 95.00, inventory: 60, image: PlaceHolderImages[4] },
];

export const orders: Order[] = [
  { 
    id: 'ORD-2024-001', 
    customerName: 'Alice Johnson', 
    customerEmail: 'alice@example.com', 
    customerPhone: '+8801712345678',
    date: '2024-05-20', 
    status: 'Delivered', 
    total: 104.99, 
    products: [
        { productId: 'PROD002', name: 'Slim Fit Denim Jeans', image: products[1].image, quantity: 1, price: products[1].price },
        { productId: 'PROD001', name: 'Organic Cotton T-Shirt', image: products[0].image, quantity: 1, price: products[0].price }
    ],
    logs: [
        { status: 'Delivered', timestamp: '2024-05-23T14:30:00Z', description: 'Package delivered to customer.', user: 'System' },
        { status: 'Shipped', timestamp: '2024-05-21T10:00:00Z', description: 'Package has been shipped.', user: 'Jane Doe' },
        { status: 'Packing', timestamp: '2024-05-20T16:00:00Z', description: 'Items are being packed.', user: 'John Smith' },
        { status: 'Confirmed', timestamp: '2024-05-20T11:00:00Z', description: 'Order has been confirmed.', user: 'Jane Doe' },
        { status: 'New', timestamp: '2024-05-20T09:05:00Z', description: 'Order was placed.', user: 'Alice Johnson' },
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    customerNote: 'Please deliver after 5 PM. Ring the bell twice.',
    officeNote: 'Customer called to confirm the delivery time. Seems important.',
    createdBy: 'Emily White',
    confirmedBy: 'Jane Doe'
  },
  { 
    id: 'ORD-2024-002', 
    customerName: 'Bob Williams', 
    customerEmail: 'bob@example.com', 
    customerPhone: '+8801812345679',
    date: '2024-05-21', 
    status: 'Packing', 
    total: 25.00, 
    products: [
        { productId: 'PROD001', name: 'Organic Cotton T-Shirt', image: products[0].image, quantity: 1, price: products[0].price }
    ],
    logs: [
        { status: 'Packing', timestamp: '2024-05-22T11:00:00Z', description: 'Items are being packed.', user: 'John Smith' },
        { status: 'Confirmed', timestamp: '2024-05-21T18:00:00Z', description: 'Order has been confirmed.', user: 'System' },
        { status: 'New', timestamp: '2024-05-21T14:20:00Z', description: 'Order was placed.', user: 'Bob Williams' },
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    customerNote: '',
    officeNote: 'Standard packing. No special instructions.',
    createdBy: 'Emily White',
    confirmedBy: 'Emily White'
  },
  { 
    id: 'ORD-2024-003', 
    customerName: 'Charlie Brown', 
    customerEmail: 'charlie@example.com', 
    customerPhone: '+8801912345680',
    date: '2024-05-22', 
    status: 'New', 
    total: 215.49, 
    products: [
        { productId: 'PROD003', name: 'Cashmere V-Neck Sweater', image: products[2].image, quantity: 1, price: products[2].price },
        { productId: 'PROD002', name: 'Slim Fit Denim Jeans', image: products[1].image, quantity: 1, price: products[1].price }
    ],
    logs: [
        { status: 'New', timestamp: '2024-05-22T08:00:00Z', description: 'Order was placed.', user: 'Charlie Brown' },
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    customerNote: 'Gift wrap this order, please. It is for a birthday.',
    officeNote: '',
    createdBy: 'Emily White'
  },
  { 
    id: 'ORD-2024-004', 
    customerName: 'Diana Prince', 
    customerEmail: 'diana@example.com', 
    customerPhone: '+8801612345681',
    date: '2024-05-22', 
    status: 'Shipped', 
    total: 350.00, 
    products: [
        { productId: 'PROD004', name: 'Leather Biker Jacket', image: products[3].image, quantity: 1, price: products[3].price }
    ],
    logs: [
        { status: 'Shipped', timestamp: '2024-05-24T09:00:00Z', description: 'Package has been shipped.', user: 'Jane Doe' },
        { status: 'Packing', timestamp: '2024-05-23T12:00:00Z', description: 'Items are being packed.', user: 'John Smith' },
        { status: 'Confirmed', timestamp: '2024-05-22T16:30:00Z', description: 'Order has been confirmed.', user: 'Jane Doe' },
        { status: 'New', timestamp: '2024-05-22T13:45:00Z', description: 'Order was placed.', user: 'Diana Prince' },
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    customerNote: '',
    officeNote: '',
    createdBy: 'Emily White',
    confirmedBy: 'Jane Doe'
  },
  { 
    id: 'ORD-2024-005', 
    customerName: 'Ethan Hunt', 
    customerEmail: 'ethan@example.com', 
    customerPhone: '+8801512345682',
    date: '2024-05-23', 
    status: 'Confirmed', 
    total: 120.50, 
    products: [
        { productId: 'PROD003', name: 'Cashmere V-Neck Sweater', image: products[2].image, quantity: 1, price: products[2].price }
    ],
    logs: [
        { status: 'Confirmed', timestamp: '2024-05-23T11:00:00Z', description: 'Order has been confirmed.', user: 'System' },
        { status: 'New', timestamp: '2024-05-23T10:10:00Z', description: 'Order was placed.', user: 'Ethan Hunt' },
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    customerNote: 'Is it possible to get faster delivery?',
    officeNote: 'Follow up with customer about expedited shipping options.',
    createdBy: 'Emily White',
    confirmedBy: 'Jane Doe'
  },
];

export const customers: Customer[] = [
    { id: 'CUST001', name: 'Alice Johnson', email: 'alice@example.com', phone: '+8801712345678', totalOrders: 5, totalSpent: 750.25, joinDate: '2023-01-15' },
    { id: 'CUST002', name: 'Bob Williams', email: 'bob@example.com', phone: '+8801812345679', totalOrders: 2, totalSpent: 125.00, joinDate: '2023-03-22' },
    { id: 'CUST003', name: 'Charlie Brown', email: 'charlie@example.com', phone: '+8801912345680', totalOrders: 8, totalSpent: 1200.50, joinDate: '2022-11-30' },
    { id: 'CUST004', name: 'Diana Prince', email: 'diana@example.com', phone: '+8801612345681', totalOrders: 3, totalSpent: 450.00, joinDate: '2023-08-10' },
    { id: 'CUST005', name: 'Ethan Hunt', email: 'ethan@example.com', phone: '+8801512345682', totalOrders: 1, totalSpent: 95.00, joinDate: '2024-02-28' },
];

export const inventory: InventoryItem[] = [
    { id: 'INV001', productId: 'PROD001', productName: 'Organic Cotton T-Shirt', sku: 'OCT-W-S', quantity: 50, location: 'A-1-1', lotNumber: 'LOT2024A', receivedDate: '2024-04-10'},
    { id: 'INV002', productId: 'PROD001', productName: 'Organic Cotton T-Shirt', sku: 'OCT-W-M', quantity: 5, location: 'A-1-2', lotNumber: 'LOT2024A', receivedDate: '2024-04-10'},
    { id: 'INV003', productId: 'PROD002', productName: 'Slim Fit Denim Jeans', sku: 'SFDJ-32', quantity: 30, location: 'B-2-5', lotNumber: 'LOT2024B', receivedDate: '2024-04-15'},
    { id: 'INV004', productId: 'PROD003', productName: 'Cashmere V-Neck Sweater', sku: 'CVNS-B-L', quantity: 15, location: 'C-3-1', lotNumber: 'LOT2024C', receivedDate: '2024-04-20'},
    { id: 'INV005', productId: 'PROD004', productName: 'Leather Biker Jacket', sku: 'LBJ-BLK-M', quantity: 8, location: 'D-1-1', lotNumber: 'LOT2024D', receivedDate: '2024-05-01'},
    { id: 'INV006', productId: 'PROD005', productName: 'Linen Blend Blazer', sku: 'LBB-N-40R', quantity: 22, location: 'E-2-3', lotNumber: 'LOT2024E', receivedDate: '2024-05-05'},
];

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];


export const purchaseOrders: PurchaseOrder[] = [
    { 
        id: 'PO-2024-001', 
        supplier: 'Global Textiles Inc.', 
        date: '2024-06-05', 
        status: 'Received', 
        total: 5000.00, 
        items: 200,
        logs: [
            { status: 'Received', timestamp: '2024-06-10T14:00:00Z', description: 'Goods received and stock updated.', user: 'Michael Brown' },
            { status: 'Cutting', timestamp: '2024-06-08T11:00:00Z', description: 'Sent to Cutting Vendor.', user: 'Jane Doe' },
            { status: 'Printing', timestamp: '2024-06-06T09:00:00Z', description: 'Sent to Printing Vendor.', user: 'Jane Doe' },
            { status: 'Fabric Ordered', timestamp: '2024-06-05T17:00:00Z', description: 'Fabric order placed with supplier.', user: 'John Smith' },
        ],
        fabricPayment: { cash: 2000, check: 3000, checkDate: formatDate(new Date()), checkStatus: 'Passed' }
    },
    { 
        id: 'PO-2024-002', 
        supplier: 'Denim Dreams Co.', 
        date: '2024-06-02', 
        status: 'Cutting', 
        total: 12000.00, 
        items: 150,
        logs: [
            { status: 'Cutting', timestamp: '2024-06-08T11:00:00Z', description: 'Sent to Cutting Vendor.', user: 'Jane Doe' },
            { status: 'Printing', timestamp: '2024-06-06T09:00:00Z', description: 'Sent to Printing Vendor.', user: 'Jane Doe' },
            { status: 'Fabric Ordered', timestamp: '2024-06-05T17:00:00Z', description: 'Fabric order placed with supplier.', user: 'John Smith' },
        ],
        printingVendor: 'Precision Prints',
        printingPayment: { cash: 500, check: 1000, checkDate: formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)), checkStatus: 'Pending' }
    },
    { 
        id: 'PO-2024-003', 
        supplier: 'Luxury Fibers Ltd.', 
        date: '2024-06-01', 
        status: 'Printing', 
        total: 8500.00, 
        items: 100,
        logs: [
            { status: 'Printing', timestamp: '2024-06-06T09:00:00Z', description: 'Sent to Printing Vendor.', user: 'Jane Doe' },
            { status: 'Fabric Ordered', timestamp: '2024-06-05T17:00:00Z', description: 'Fabric order placed with supplier.', user: 'John Smith' },
        ],
        cuttingVendor: 'Sharp Cuts',
        cuttingPayment: { cash: 0, check: 800, checkDate: formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)), checkStatus: 'Pending' }
    },
    { 
        id: 'PO-2024-004', 
        supplier: 'Leather Masters', 
        date: '2024-05-28', 
        status: 'Fabric Ordered', 
        total: 25000.00, 
        items: 50,
        logs: [
            { status: 'Fabric Ordered', timestamp: '2024-06-05T17:00:00Z', description: 'Fabric order placed with supplier.', user: 'John Smith' },
        ],
        fabricPayment: { cash: 25000, check: 0, checkDate: '', checkStatus: 'Pending' }
    },
    { 
        id: 'PO-2024-005', 
        supplier: 'Global Textiles Inc.', 
        date: '2024-05-25', 
        status: 'Draft', 
        total: 7500.00, 
        items: 300,
        logs: [
            { status: 'Draft', timestamp: '2024-05-25T10:00:00Z', description: 'Purchase order created as draft.', user: 'John Smith' },
        ],
        printingVendor: 'Ink & Thread',
        printingPayment: { cash: 0, check: 2500, checkDate: formatDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)), checkStatus: 'Bounced' }
    },
    { 
        id: 'PO-2024-006', 
        supplier: 'Denim Dreams Co.', 
        date: '2024-05-10', 
        status: 'Cancelled', 
        total: 9200.00, 
        items: 120,
        logs: [
             { status: 'Cancelled', timestamp: '2024-05-11T12:00:00Z', description: 'Order cancelled by management.', user: 'Jane Doe' },
        ],
        cuttingVendor: 'CutRight Solutions',
        cuttingPayment: { cash: 0, check: 1200, checkDate: formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)), checkStatus: 'Cancelled' }
    },
];

export const staff: StaffMember[] = [
    { 
        id: 'STAFF001', 
        name: 'Jane Doe', 
        email: 'jane.doe@fashionary.com', 
        role: 'Admin', 
        lastLogin: '2024-05-23T10:00:00Z',
        paymentType: 'Salary',
        salaryDetails: { amount: 50000, frequency: 'Monthly' },
        performance: { ordersCreated: 0, ordersConfirmed: 3, statusBreakdown: { 'New': 0, 'Confirmed': 3, 'Canceled': 0, 'Hold': 0, 'Packing': 0, 'Packing Hold': 0, 'RTS (Ready to Ship)': 0, 'Shipped': 2, 'Delivered': 1, 'Returned': 0, 'Partially Delivered': 0, 'Partially Returned': 0 } },
        financials: { totalEarned: 50000, totalPaid: 50000, dueAmount: 0 },
        paymentHistory: [
            { date: '2024-05-01', amount: 50000, notes: 'May Salary' }
        ],
        incomeHistory: []
    },
    { 
        id: 'STAFF002', 
        name: 'John Smith', 
        email: 'john.smith@fashionary.com', 
        role: 'Manager', 
        lastLogin: '2024-05-23T09:30:00Z',
        paymentType: 'Salary',
        salaryDetails: { amount: 60000, frequency: 'Monthly' },
        performance: { ordersCreated: 0, ordersConfirmed: 0, statusBreakdown: { 'New': 0, 'Confirmed': 0, 'Canceled': 0, 'Hold': 0, 'Packing': 0, 'Packing Hold': 0, 'RTS (Ready to Ship)': 0, 'Shipped': 0, 'Delivered': 0, 'Returned': 0, 'Partially Delivered': 0, 'Partially Returned': 0 } },
        financials: { totalEarned: 60000, totalPaid: 55000, dueAmount: 5000 },
        paymentHistory: [
            { date: '2024-05-01', amount: 55000, notes: 'May Salary (Partial)' }
        ],
        incomeHistory: []
    },
    { 
        id: 'STAFF003', 
        name: 'Emily White', 
        email: 'emily.white@fashionary.com', 
        role: 'Sales', 
        lastLogin: '2024-05-22T15:45:00Z',
        paymentType: 'Both',
        salaryDetails: { amount: 20000, frequency: 'Monthly' },
        commissionDetails: { onOrderCreate: 50, onOrderConfirm: 100 },
        performance: { ordersCreated: 5, ordersConfirmed: 1, statusBreakdown: { 'New': 1, 'Confirmed': 1, 'Canceled': 0, 'Hold': 0, 'Packing': 1, 'Packing Hold': 0, 'RTS (Ready to Ship)': 0, 'Shipped': 1, 'Delivered': 1, 'Returned': 0, 'Partially Delivered': 0, 'Partially Returned': 0 } },
        financials: { totalEarned: 20350, totalPaid: 20200, dueAmount: 150 },
        paymentHistory: [
             { date: '2024-05-01', amount: 20000, notes: 'May Salary' },
             { date: '2024-05-15', amount: 200, notes: 'Commission Payout' }
        ],
        incomeHistory: [
            { date: '2024-05-20', orderId: 'ORD-2024-001', action: 'Created', amount: 50 },
            { date: '2024-05-20', orderId: 'ORD-2024-001', action: 'Confirmed', amount: 100 },
            { date: '2024-05-21', orderId: 'ORD-2024-002', action: 'Created', amount: 50 },
            { date: '2024-05-22', orderId: 'ORD-2024-003', action: 'Created', amount: 50 },
            { date: '2024-05-22', orderId: 'ORD-2024-004', action: 'Created', amount: 50 },
            { date: '2024-05-23', orderId: 'ORD-2024-005', action: 'Created', amount: 50 },
        ]
    },
    { 
        id: 'STAFF004', 
        name: 'Michael Brown', 
        email: 'michael.brown@fashionary.com', 
        role: 'Warehouse', 
        lastLogin: '2024-05-23T08:15:00Z',
        paymentType: 'Salary',
        salaryDetails: { amount: 35000, frequency: 'Monthly' },
        performance: { ordersCreated: 0, ordersConfirmed: 0, statusBreakdown: { 'New': 0, 'Confirmed': 0, 'Canceled': 0, 'Hold': 0, 'Packing': 0, 'Packing Hold': 0, 'RTS (Ready to Ship)': 0, 'Shipped': 0, 'Delivered': 0, 'Returned': 0, 'Partially Delivered': 0, 'Partially Returned': 0 } },
        financials: { totalEarned: 35000, totalPaid: 35000, dueAmount: 0 },
        paymentHistory: [
             { date: '2024-05-01', amount: 35000, notes: 'May Salary' }
        ],
        incomeHistory: []
    },
];


export const suppliers: Supplier[] = [
    { id: 'SUP001', name: 'Global Textiles Inc.', contactPerson: 'Sarah Chen', email: 'sarah.chen@globaltextiles.com', phone: '+8801711223344', address: '123 Fabric Row, Textile City, 12345' },
    { id: 'SUP002', name: 'Denim Dreams Co.', contactPerson: 'Mike Rivera', email: 'mike.r@denimdreams.com', phone: '+8801822334455', address: '456 Jean Ave, Indigo Town, 23456' },
    { id: 'SUP003', name: 'Luxury Fibers Ltd.', contactPerson: 'Helen Troy', email: 'helen.t@luxuryfibers.com', phone: '+8801933445566', address: '789 Silk Blvd, Cashmere Ville, 34567' },
    { id: 'SUP004', name: 'Leather Masters', contactPerson: 'Leo Adler', email: 'leo.a@leathermasters.com', phone: '+8801644556677', address: '101 Hide St, Tanner Creek, 45678' },
];

export const vendors: Vendor[] = [
    { id: 'VEN001', name: 'Precision Prints', type: 'Printing', contactPerson: 'Anna Garcia', email: 'anna.g@precisionprints.com', phone: '+8801555666777', rate: '$0.50 / print' },
    { id: 'VEN002', name: 'Sharp Cuts', type: 'Cutting', contactPerson: 'David Lee', email: 'david.l@sharpcuts.com', phone: '+8801766777888', rate: '$0.20 / piece' },
    { id: 'VEN003', name: 'Ink & Thread', type: 'Printing', contactPerson: 'Maria Rodriguez', email: 'maria.r@inkthread.com', phone: '+8801877888999', rate: '$0.45 / print' },
    { id: 'VEN004', name: 'CutRight Solutions', type: 'Cutting', contactPerson: 'Tom Wilson', email: 'tom.w@cutright.com', phone: '+8801988999000', rate: '$0.18 / piece' },
];


export const revenueData = [
  { month: 'February', revenue: 3000, profit: 1398 },
  { month: 'March', revenue: 2000, profit: 9800 },
  { month: 'April', revenue: 2780, profit: 3908 },
  { month: 'May', revenue: 1890, profit: 4800 },
  { month: 'June', revenue: 2390, profit: 3800 },
];

export const ordersByStatusData = [
    { status: 'New', value: 2, fill: 'var(--color-new)' },
    { status: 'Processing', value: 1, fill: 'var(--color-processing)' },
    { status: 'Completed', value: 2, fill: 'var(--color-completed)' },
];

    
