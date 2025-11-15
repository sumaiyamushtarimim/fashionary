
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Home,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  Truck,
  Settings,
  User,
  PanelLeft,
  Building,
  Handshake,
  Landmark,
  Wallet,
  BarChartHorizontal,
  Archive,
  FileSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuFooter
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import React from "react";
import { Badge } from "@/components/ui/badge";

// In a real app, this would be fetched from a settings service
const isCourierReportEnabled = true; 

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/dashboard/products", icon: Package, label: "Products" },
  { href: "/dashboard/inventory", icon: Warehouse, label: "Inventory" },
  { href: "/dashboard/customers", icon: Users, label: "Customers" },
  { href: "/dashboard/purchases", icon: Truck, label: "Purchases" },
  { href: "/dashboard/expenses", icon: Wallet, label: "Expenses" },
  { href: "/dashboard/check-passing", icon: Landmark, label: "Check Passing"},
  { href: "/dashboard/partners", icon: Handshake, label: "Partners" },
  ...(isCourierReportEnabled ? [{ href: "/dashboard/courier-report", icon: FileSearch, label: "Courier Report" }] : []),
  { href: "/dashboard/analytics", icon: BarChartHorizontal, label: "Analytics" },
  { href: "/dashboard/staff", icon: User, label: "Staff" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const initialNotifications = [
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
];

function NavLinks() {
    const pathname = usePathname();
    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {navItems.map(({ href, icon: Icon, label }) => (
            <Link
            key={href}
            href={href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary",
                pathname.startsWith(href) && href !== "/dashboard" && "bg-muted text-primary",
                pathname === href && "bg-muted text-primary"
            )}
            >
            <Icon className="h-4 w-4" />
            {label}
            </Link>
        ))}
        </nav>
    );
}

function MobileNavLinks({ onLinkClick }: { onLinkClick: () => void }) {
    const pathname = usePathname();
    return (
        <nav className="grid gap-2 text-lg font-medium">
            <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold mb-4"
            >
                <Logo />
                <span className="sr-only">Fashionary</span>
            </Link>
            {navItems.map(({ href, icon: Icon, label }) => (
                <Link
                    key={href}
                    href={href}
                    onClick={onLinkClick}
                    className={cn(
                        "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground",
                        pathname.startsWith(href) && href !== "/dashboard" && "bg-muted text-foreground",
                        pathname === href && "bg-muted text-foreground"
                    )}
                >
                    <Icon className="h-5 w-5" />
                    {label}
                </Link>
            ))}
        </nav>
    );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(initialNotifications);
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications =>
        prevNotifications.map(n => ({ ...n, read: true }))
    );
  };

  const handleNotificationClick = (href: string) => {
    router.push(href);
  };


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="sticky top-0 flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo />
              <span className="font-headline text-xl">Fashionary</span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <NavLinks />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-muted px-4 lg:h-[60px] lg:px-6">
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <MobileNavLinks onLinkClick={() => setIsMobileNavOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
             <div className="flex h-full items-center justify-center md:hidden">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <span className="font-headline text-xl">Fashionary</span>
                </Link>
             </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative h-8 w-8">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && <Badge className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{unreadCount}</Badge>}
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Badge variant="secondary">{unreadCount} unread</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                        <DropdownMenuItem key={notification.id} className={cn("flex items-start gap-3 p-3", !notification.read && "bg-blue-500/10")} onSelect={() => handleNotificationClick(notification.href)}>
                           <div className={cn("p-2 rounded-full", !notification.read ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                             <notification.icon className="h-5 w-5" />
                           </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm">{notification.title}</p>
                                <p className="text-xs text-muted-foreground">{notification.description}</p>
                            </div>
                            <time className="text-xs text-muted-foreground">{notification.time}</time>
                        </DropdownMenuItem>
                    ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuFooter className="p-2 flex justify-between items-center">
                    <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>Mark all as read</Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/notifications">View all</Link>
                    </Button>
                </DropdownMenuFooter>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/account">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
