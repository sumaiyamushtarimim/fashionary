
'use client';

import {
  Bell,
  ShoppingCart,
  Warehouse,
  Archive,
} from 'lucide-react';
import * as React from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

const allNotifications = [
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

type Notification = typeof allNotifications[0];

function NotificationItem({ notification }: { notification: Notification }) {
    const itemContent = (
        <div className={cn("flex items-start gap-4 p-4 border-b hover:bg-muted/50 transition-colors", !notification.read && "bg-blue-500/5")}>
            <div className={cn("p-2 rounded-full", !notification.read ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                <notification.icon className="h-6 w-6" />
            </div>
            <div className="flex-1 grid gap-1">
                <p className="font-semibold">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
                 <time className="text-xs text-muted-foreground">{notification.time}</time>
            </div>
            {!notification.read && (
                <div className="flex items-center h-full">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                </div>
            )}
        </div>
    );
    
    return <Link href={notification.href}>{itemContent}</Link>;
}


export default function NotificationsPage() {
    const [notifications, setNotifications] = React.useState(allNotifications);

    const unreadNotifications = notifications.filter(n => !n.read);
    const readNotifications = notifications.filter(n => n.read);
    
    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({...n, read: true})))
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-headline text-2xl font-bold">Notifications</h1>
                    <p className="text-muted-foreground hidden sm:block">View and manage all your notifications.</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>Mark all as read</Button>
            </div>
            <Card>
                <CardHeader className="p-0">
                    <Tabs defaultValue="all">
                        <TabsList className="grid w-full grid-cols-3 rounded-t-lg rounded-b-none">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="unread">
                                <div className="flex items-center gap-2">
                                    <span>Unread</span>
                                    {unreadNotifications.length > 0 && <Badge>{unreadNotifications.length}</Badge>}
                                </div>
                            </TabsTrigger>
                            <TabsTrigger value="archived">Archived</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="m-0">
                            {notifications.map(n => <NotificationItem key={n.id} notification={n} />)}
                        </TabsContent>
                        <TabsContent value="unread" className="m-0">
                             {unreadNotifications.length > 0 ? (
                                unreadNotifications.map(n => <NotificationItem key={n.id} notification={n} />)
                             ) : (
                                <div className="p-8 text-center text-muted-foreground">No unread notifications.</div>
                             )}
                        </TabsContent>
                         <TabsContent value="archived" className="m-0">
                            {readNotifications.map(n => <NotificationItem key={n.id} notification={n} />)}
                        </TabsContent>
                    </Tabs>
                </CardHeader>
            </Card>
        </div>
    );
}
