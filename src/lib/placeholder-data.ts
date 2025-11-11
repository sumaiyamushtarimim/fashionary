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

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'New' | 'Processing' | 'Completed' | 'Cancelled';
  total: number;
  items: number;
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

export type PurchaseOrder = {
    id: string;
    supplier: string;
    date: string;
    status: 'Draft' | 'Sent' | 'Received' | 'Cancelled';
    total: number;
    items: number;
};

export type StaffMember = {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Manager' | 'Sales' | 'Warehouse';
    lastLogin: string;
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
  { id: 'ORD-2024-001', customerName: 'Alice Johnson', customerEmail: 'alice@example.com', date: '2024-05-20', status: 'Completed', total: 104.99, items: 2 },
  { id: 'ORD-2024-002', customerName: 'Bob Williams', customerEmail: 'bob@example.com', date: '2024-05-21', status: 'Processing', total: 25.00, items: 1 },
  { id: 'ORD-2024-003', customerName: 'Charlie Brown', customerEmail: 'charlie@example.com', date: '2024-05-22', status: 'New', total: 215.49, items: 2 },
  { id: 'ORD-2024-004', customerName: 'Diana Prince', customerEmail: 'diana@example.com', date: '2024-05-22', status: 'Completed', total: 350.00, items: 1 },
  { id: 'ORD-2024-005', customerName: 'Ethan Hunt', customerEmail: 'ethan@example.com', date: '2024-05-23', status: 'New', total: 120.00, items: 5 },
];

export const customers: Customer[] = [
    { id: 'CUST001', name: 'Alice Johnson', email: 'alice@example.com', phone: '123-456-7890', totalOrders: 5, totalSpent: 750.25, joinDate: '2023-01-15' },
    { id: 'CUST002', name: 'Bob Williams', email: 'bob@example.com', phone: '234-567-8901', totalOrders: 2, totalSpent: 125.00, joinDate: '2023-03-22' },
    { id: 'CUST003', name: 'Charlie Brown', email: 'charlie@example.com', phone: '345-678-9012', totalOrders: 8, totalSpent: 1200.50, joinDate: '2022-11-30' },
    { id: 'CUST004', name: 'Diana Prince', email: 'diana@example.com', phone: '456-789-0123', totalOrders: 3, totalSpent: 450.00, joinDate: '2023-08-10' },
    { id: 'CUST005', name: 'Ethan Hunt', email: 'ethan@example.com', phone: '567-890-1234', totalOrders: 1, totalSpent: 95.00, joinDate: '2024-02-28' },
];

export const inventory: InventoryItem[] = [
    { id: 'INV001', productId: 'PROD001', productName: 'Organic Cotton T-Shirt', sku: 'OCT-W-S', quantity: 50, location: 'A-1-1', lotNumber: 'LOT2024A', receivedDate: '2024-04-10'},
    { id: 'INV002', productId: 'PROD001', productName: 'Organic Cotton T-Shirt', sku: 'OCT-W-M', quantity: 5, location: 'A-1-2', lotNumber: 'LOT2024A', receivedDate: '2024-04-10'},
    { id: 'INV003', productId: 'PROD002', productName: 'Slim Fit Denim Jeans', sku: 'SFDJ-32', quantity: 30, location: 'B-2-5', lotNumber: 'LOT2024B', receivedDate: '2024-04-15'},
    { id: 'INV004', productId: 'PROD003', productName: 'Cashmere V-Neck Sweater', sku: 'CVNS-B-L', quantity: 15, location: 'C-3-1', lotNumber: 'LOT2024C', receivedDate: '2024-04-20'},
    { id: 'INV005', productId: 'PROD004', productName: 'Leather Biker Jacket', sku: 'LBJ-BLK-M', quantity: 8, location: 'D-1-1', lotNumber: 'LOT2024D', receivedDate: '2024-05-01'},
    { id: 'INV006', productId: 'PROD005', productName: 'Linen Blend Blazer', sku: 'LBB-N-40R', quantity: 22, location: 'E-2-3', lotNumber: 'LOT2024E', receivedDate: '2024-05-05'},
];

export const purchaseOrders: PurchaseOrder[] = [
    { id: 'PO-2024-001', supplier: 'Global Textiles Inc.', date: '2024-03-15', status: 'Received', total: 5000.00, items: 200 },
    { id: 'PO-2024-002', supplier: 'Denim Dreams Co.', date: '2024-03-20', status: 'Received', total: 12000.00, items: 150 },
    { id: 'PO-2024-003', supplier: 'Luxury Fibers Ltd.', date: '2024-04-01', status: 'Sent', total: 8500.00, items: 100 },
    { id: 'PO-2024-004', supplier: 'Leather Masters', date: '2024-04-15', status: 'Draft', total: 25000.00, items: 50 },
];

export const staff: StaffMember[] = [
    { id: 'STAFF001', name: 'Jane Doe', email: 'jane.doe@fashionary.com', role: 'Admin', lastLogin: '2024-05-23T10:00:00Z' },
    { id: 'STAFF002', name: 'John Smith', email: 'john.smith@fashionary.com', role: 'Manager', lastLogin: '2024-05-23T09:30:00Z' },
    { id: 'STAFF003', name: 'Emily White', email: 'emily.white@fashionary.com', role: 'Sales', lastLogin: '2024-05-22T15:45:00Z' },
    { id: 'STAFF004', name: 'Michael Brown', email: 'michael.brown@fashionary.com', role: 'Warehouse', lastLogin: '2024-05-23T08:15:00Z' },
];

export const suppliers: Supplier[] = [
    { id: 'SUP001', name: 'Global Textiles Inc.', contactPerson: 'Sarah Chen', email: 'sarah.chen@globaltextiles.com', phone: '111-222-3333', address: '123 Fabric Row, Textile City, 12345' },
    { id: 'SUP002', name: 'Denim Dreams Co.', contactPerson: 'Mike Rivera', email: 'mike.r@denimdreams.com', phone: '222-333-4444', address: '456 Jean Ave, Indigo Town, 23456' },
    { id: 'SUP003', name: 'Luxury Fibers Ltd.', contactPerson: 'Helen Troy', email: 'helen.t@luxuryfibers.com', phone: '333-444-5555', address: '789 Silk Blvd, Cashmere Ville, 34567' },
    { id: 'SUP004', name: 'Leather Masters', contactPerson: 'Leo Adler', email: 'leo.a@leathermasters.com', phone: '444-555-6666', address: '101 Hide St, Tanner Creek, 45678' },
];

export const vendors: Vendor[] = [
    { id: 'VEN001', name: 'Precision Prints', type: 'Printing', contactPerson: 'Anna Garcia', email: 'anna.g@precisionprints.com', phone: '555-666-7777', rate: '$0.50 / print' },
    { id: 'VEN002', name: 'Sharp Cuts', type: 'Cutting', contactPerson: 'David Lee', email: 'david.l@sharpcuts.com', phone: '666-777-8888', rate: '$0.20 / piece' },
    { id: 'VEN003', name: 'Ink & Thread', type: 'Printing', contactPerson: 'Maria Rodriguez', email: 'maria.r@inkthread.com', phone: '777-888-9999', rate: '$0.45 / print' },
    { id: 'VEN004', name: 'CutRight Solutions', type: 'Cutting', contactPerson: 'Tom Wilson', email: 'tom.w@cutright.com', phone: '888-999-0000', rate: '$0.18 / piece' },
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
