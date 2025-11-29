

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
  | 'Return Pending'
  | 'Returned'
  | 'Partial'
  | 'Incomplete'
  | 'Incomplete-Cancelled';

export type OrderPlatform = 'TikTok' | 'Messenger' | 'Facebook' | 'Instagram' | 'Website';
export type PaymentMethod = 'Cash on Delivery' | 'bKash' | 'Nagad';
export type CourierService = 'Pathao' | 'RedX' | 'Steadfast' | 'Carrybee';

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
  customerEmail?: string;
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
  assignedTo?: string;
  assignedToId?: string;
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

export type OrderUpdateInput = Partial<Pick<Order, 'status' | 'assignedTo' | 'assignedToId' | 'officeNote'>>;


export type Customer = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  address: string;
  district: string;
  country: string;
};

export type CustomerCreateInput = Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'joinDate'>;
export type CustomerUpdateInput = Partial<Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'joinDate'>>;


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
    action: 'Created' | 'Confirmed' | 'Packed';
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
    accessibleBusinessIds?: string[];
    lastLogin: string;
    paymentType: 'Salary' | 'Commission' | 'Both';
    salaryDetails?: {
        amount: number;
        frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
    };
    commissionDetails?: {
        onOrderCreate?: number;
        onOrderConfirm?: number;
        onOrderPacked?: number;
        targetEnabled?: boolean;
        targetPeriod?: 'Daily' | 'Weekly' | 'Monthly';
        targetCount?: number;
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
        issues: Permission | boolean;
        attendance: Permission | boolean;
        accounting: Permission | boolean;
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

export type PathaoCredentials = {
    clientId: string;
    clientSecret: string;
    username: string;
    password?: string;
    storeId: string;
};

export type SteadfastCredentials = {
    apiKey: string;
    secretKey: string;
};

export type RedXCredentials = {
    accessToken: string;
};

export type CarrybeeCredentials = {
    clientId: string;
    clientSecret: string;
    clientContext: string;
};

export type CourierIntegration = {
    id: string;
    businessId: string;
    businessName: string;
    courierName: CourierService;
    status: 'Active' | 'Inactive';
    credentials: PathaoCredentials | SteadfastCredentials | RedXCredentials | CarrybeeCredentials;
    deliveryType?: 48 | 12; // For Pathao: 48 for Normal, 12 for On Demand
    itemType?: 1 | 2; // For Pathao: 1 for Document, 2 for Parcel
};

// Issue Management Types
export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type IssuePriority = 'Low' | 'Medium' | 'High';

export type IssueLog = {
    id: string;
    timestamp: string;
    user: string;
    action: string;
};

export type Issue = {
    id: string;
    orderId?: string;
    title: string;
    description: string;
    status: IssueStatus;
    priority: IssuePriority;
    createdBy: string;
    assignedTo?: string;
    createdAt: string;
    resolvedAt?: string;
    logs: IssueLog[];
};

// Attendance Management Types
export type BreakRecord = {
    id: string;
    startTime: string;
    endTime: string | null;
};

export type AttendanceStatus = 'Present' | 'Absent' | 'On Leave';

export type AttendanceRecord = {
    id: string;
    staffId: string;
    staffName: string;
    staffRole: StaffRole;
    staffAvatar: string;
    date: string;
    status: AttendanceStatus;
    checkInTime: string | null;
    checkOutTime: string | null;
    totalWorkDuration: number | null; // in minutes
    totalBreakDuration: number | null; // in minutes
    breaks: BreakRecord[];
};

// --- Accounting Module Types ---

export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export type Account = {
    id: string;
    name: string;
    type: AccountType;
};

export type LedgerEntry = {
    id: string;
    date: string;
    description: string;
    sourceTransactionId: string; // e.g. ORD-2024-001 or EXP-001
    accountId: string;
    debit: number;
    credit: number;
};

export type BalanceSheetCategory = {
    accounts: {
        id: string;
        name: string;
        balance: number;
    }[];
    total: number;
};

export type BalanceSheet = {
    asOf: string;
    assets: BalanceSheetCategory;
    liabilities: BalanceSheetCategory;
    equity: BalanceSheetCategory;
};
