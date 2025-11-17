

import type { ImagePlaceholder } from '@/lib/placeholder-images';
import type { LucideIcon } from 'lucide-react';

export type ScannedItem = {
    id: string;
    currentStatus: OrderStatus;
    scannedAt: Date;
};

export type Notification = {
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
    time: string;
    read: boolean;
    href: string;
};

export type Category = {
    id: string;
    name: string;
    parentId?: string;
};

export type ExpenseCategory = {
    id: string;
    name: string;
};

export type ProductVariant = {
    id: string;
    name: string; // e.g., "Small, Red"
    sku: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  image: ImagePlaceholder;
  categoryId?: string;
  ornaFabric?: number;
  jamaFabric?: number;
  selowarFabric?: number;
  variants?: ProductVariant[];
};

export type OrderStatus = 
  | 'New'
  | 'Confirmed'
  | 'Packing Hold'
  | 'Canceled'
  | 'Hold'
  | 'In-Courier'
  | 'RTS (Ready to Ship)'
  | 'Shipped'
  | 'Delivered'
  | 'Returned'
  | 'Paid Returned'
  | 'Partial'
  | 'Incomplete'
  | 'Incomplete-Cancelled';

export const allStatuses: OrderStatus[] = [
    'New', 'Confirmed', 'Packing Hold', 'Canceled', 'Hold', 'In-Courier',
    'RTS (Ready to Ship)', 'Shipped', 'Delivered', 'Returned', 
    'Paid Returned', 'Partial', 'Incomplete', 'Incomplete-Cancelled'
];

export type OrderPlatform = 'TikTok' | 'Messenger' | 'Facebook' | 'Instagram' | 'Website';
export type PaymentMethod = 'Cash on Delivery' | 'bKash' | 'Nagad';
export type CourierService = 'Pathao' | 'RedX' | 'Steadfast';

export type Business = {
    id: string;
    name: string;
};

export type OrderProduct = {
  productId: string;
  name: string;
  image: ImagePlaceholder;
  quantity: number;
  price: number;
};

export type OrderLog = {
    title: string;
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
  shipping: number;
  products: OrderProduct[];
  logs: OrderLog[];
  customerNote: string;
  officeNote: string;
  createdBy: string;
  confirmedBy: string;
  businessId: string;
  platform: OrderPlatform;
  shippingAddress: {
    address: string;
    district: string;
    country: string;
  };
  paymentMethod: PaymentMethod;
  paidAmount: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  address: string;
  district: string;
  country: string;
};

export type StockLocation = {
    id: string;
    name: string;
};

export type InventoryMovementType = 'Received' | 'Sold' | 'Adjusted' | 'Returned' | 'Transfer';

export type StockTransfer = {
    id: string;
    fromLocationId: string;
    toLocationId: string;
    notes?: string;
    user: string;
    date: string;
};

export type InventoryMovement = {
    id: string;
    date: string;
    type: InventoryMovementType;
    quantityChange: number; // Positive for additions, negative for subtractions
    balance: number;
    notes: string;
    user: string;
    reference: string; // e.g., Order ID, PO ID, Transfer ID
    fromLocationId?: string;
    toLocationId?: string;
};


export type InventoryItem = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  locationId: string;
  locationName: string;
  lotNumber: string;
  receivedDate: string;
  variants?: ProductVariant[];
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

export type Permission = {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
};

export type StaffRole = 
    | 'Admin' 
    | 'Manager' 
    | 'Packing Assistant' 
    | 'Moderator' 
    | 'Seller' 
    | 'Call Assistant' 
    | 'Call Centre Manager' 
    | 'Courier Manager' 
    | 'Courier Call Assistant'
    | 'Custom';

export type StaffMember = {
    id: string;
    name: string;
    email: string;
    role: StaffRole;
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
    permissions: {
        orders: Permission | boolean;
        packingOrders: Permission | boolean;
        products: Permission | boolean;
        inventory: Permission | boolean;
        customers: Permission | boolean;
        purchases: Permission | boolean;
        expenses: Permission | boolean;
        checkPassing: Permission | boolean;
        partners: Permission | boolean;
        courierReport: Permission | boolean;
        staff: Permission | boolean;
        settings: Permission | boolean;
        analytics: Permission | boolean;
    };
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

export type Expense = {
    id: string;
    date: string;
    category: string;
    amount: number;
    notes?: string;
    isAdExpense: boolean;
    businessId?: string;
    business?: string;
    platform?: OrderPlatform;
};

export type WooCommerceIntegration = {
    id: string;
    storeName: string;
    storeUrl: string;
    consumerKey: string;
    consumerSecret: string;
    status: 'Active' | 'Inactive';
    businessId: string;
    businessName: string;
};

export type CourierIntegration = {
    id: string;
    businessId: string;
    businessName: string;
    courierName: CourierService;
    apiKey: string;
    secretKey?: string;
    status: 'Active' | 'Inactive';
};
