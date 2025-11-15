
import { ShoppingCart, Warehouse, Archive } from 'lucide-react';
import type { Notification } from '@/types';

const notifications: Notification[] = [
    {
        id: '1',
        icon: ShoppingCart,
        title: "New order received",
        description: "#ORD-2024-005",
        time: "5m ago",
        read: false,
        href: '/dashboard/orders/ORD-2024-005'
    },
    {
        id: '2',
        icon: Warehouse,
        title: "Stock running low",
        description: "Organic Cotton T-Shirt",
        time: "30m ago",
        read: false,
        href: '/dashboard/products/PROD001'
    },
    {
        id: '3',
        icon: Archive,
        title: "New product added",
        description: "Leather Biker Jacket",
        time: "2h ago",
        read: true,
        href: '/dashboard/products/PROD004'
    },
    {
        id: '4',
        icon: ShoppingCart,
        title: "Order #ORD-2024-004 shipped",
        description: "Customer: Diana Prince",
        time: "1d ago",
        read: true,
        href: '/dashboard/orders/ORD-2024-004'
    },
     {
        id: '5',
        icon: ShoppingCart,
        title: "Order #ORD-2024-001 delivered",
        description: "Customer: Alice Johnson",
        time: "2d ago",
        read: true,
        href: '/dashboard/orders/ORD-2024-001'
    },
];

export async function getNotifications(): Promise<Notification[]> {
    return Promise.resolve(notifications);
}
