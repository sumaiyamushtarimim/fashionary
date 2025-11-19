

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
  ClipboardList,
  ChevronDown,
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import React, { Suspense, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { UserButton, useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLoader } from "@/components/ui/page-loader";
import { getNotifications } from "@/services/notifications";
import type { Notification, StaffMember, StaffRole } from "@/types";

// In a real app, this would be fetched from a settings service or user permissions
const isCourierReportEnabled = true; 

// Mock user role. In a real app, this would come from your auth context (e.g., Clerk session claims).
const MOCK_USER_ROLE: StaffRole = 'Admin'; 
const isPackingAssistant = MOCK_USER_ROLE === 'Packing Assistant';

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  ...(!isPackingAssistant ? [
    { 
        label: "Orders", 
        icon: ShoppingCart, 
        subItems: [
            { href: "/dashboard/orders", label: "All Orders" },
            { href: "/dashboard/orders/incomplete", label: "Incomplete Orders" },
            { href: "/dashboard/packing-orders", label: "Packing Orders" },
        ]
    },
    ...(isCourierReportEnabled ? [{ href: "/dashboard/courier-report", icon: FileSearch, label: "Courier Report" }] : []),
    { href: "/dashboard/products", icon: Package, label: "Products" },
    { href: "/dashboard/inventory", icon: Warehouse, label: "Inventory" },
    { href: "/dashboard/customers", icon: Users, label: "Customers" },
    { href: "/dashboard/purchases", icon: Truck, label: "Purchases" },
    { href: "/dashboard/expenses", icon: Wallet, label: "Expenses" },
    { href: "/dashboard/check-passing", icon: Landmark, label: "Check Passing"},
    { href: "/dashboard/partners", icon: Handshake, label: "Partners" },
    { href: "/dashboard/analytics", icon: BarChartHorizontal, label: "Analytics" },
    { href: "/dashboard/staff", icon: User, label: "Staff" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ] : [
      { href: "/dashboard/packing-orders", icon: ClipboardList, label: "Packing Orders" }
  ])
];

function NavLinks() {
    const pathname = usePathname();
    const isOrderRelatedPage = pathname.startsWith('/dashboard/orders') || pathname === '/dashboard/packing-orders';
    
    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {navItems.map((item, index) => {
            if ('subItems' in item) {
                return (
                    <Collapsible key={index} defaultOpen={isOrderRelatedPage}>
                        <CollapsibleTrigger asChild>
                            <div
                                className={cn(
                                    "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary",
                                    isOrderRelatedPage && "text-primary"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </div>
                                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-7 pt-1">
                            <nav className="grid items-start text-sm font-medium">
                                {item.subItems.map(subItem => (
                                     <Link
                                        key={subItem.href}
                                        href={subItem.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary",
                                            pathname === subItem.href && "bg-muted text-primary"
                                        )}
                                    >
                                        {subItem.label}
                                    </Link>
                                ))}
                            </nav>
                        </CollapsibleContent>
                    </Collapsible>
                )
            }
            return (
                <Link
                    key={item.href}
                    href={item.href!}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary",
                        pathname === item.href && "bg-muted text-primary"
                    )}
                    >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                </Link>
            )
        })}
        </nav>
    );
}

function MobileNavLinks({ onLinkClick }: { onLinkClick: () => void }) {
    const pathname = usePathname();
    const isOrderRelatedPage = pathname.startsWith('/dashboard/orders') || pathname === '/dashboard/packing-orders';
    
    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold mb-4"
            >
                <Logo variant="full" />
            </Link>
            {navItems.map((item, index) => {
                 if ('subItems' in item) {
                     return (
                         <Collapsible key={index} defaultOpen={pathname.startsWith('/dashboard/orders')}>
                             <CollapsibleTrigger asChild>
                                <div className="mx-[-0.65rem] flex items-center justify-between gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                                    <div className="flex items-center gap-4">
                                         <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </div>
                                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                                </div>
                             </CollapsibleTrigger>
                             <CollapsibleContent className="pl-8 pt-1">
                                 <div className="flex flex-col gap-1">
                                    {item.subItems.map(subItem => (
                                        <Link
                                            key={subItem.href}
                                            href={subItem.href}
                                            onClick={onLinkClick}
                                            className={cn(
                                                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground",
                                                pathname === subItem.href && "bg-muted text-foreground"
                                            )}
                                        >
                                            {subItem.label}
                                        </Link>
                                    ))}
                                 </div>
                            </CollapsibleContent>
                         </Collapsible>
                     )
                 }
                return (
                    <Link
                        key={item.href}
                        href={item.href!}
                        onClick={onLinkClick}
                        className={cn(
                            "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground",
                            pathname.startsWith(item.href!) && item.href! !== "/dashboard" && "bg-muted text-foreground",
                            pathname === item.href! && "bg-muted text-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                )
            })}
        </nav>
    );
}

function UserMenu() {
    const [isMounted, setIsMounted] = useState(false);
    const [loggedInStaff, setLoggedInStaff] = useState<StaffMember | null>(null);

    useEffect(() => {
        setIsMounted(true);
        const staff = JSON.parse(localStorage.getItem('loggedInStaff') || 'null');
        setLoggedInStaff(staff);
    }, []);

    if (!isMounted) {
        return <Skeleton className="h-8 w-8 rounded-full" />;
    }

    return <UserButton afterSignOutUrl="/" />;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const [loggedInStaff, setLoggedInStaff] = useState<StaffMember | null>(null);

  React.useEffect(() => {
    // In a real app, you'd fetch this based on the signed-in user's ID
    if (isSignedIn) {
        const staff: StaffMember = {
            id: user.id,
            name: user.fullName || "User",
            email: user.primaryEmailAddress?.emailAddress || "",
            role: (user.publicMetadata.role as StaffRole) || 'Moderator',
            accessibleBusinessIds: (user.publicMetadata.accessibleBusinessIds as string[]) || [],
            lastLogin: user.lastSignInAt?.toISOString() || new Date().toISOString(),
            // Mock data for other fields
            paymentType: 'Salary',
            permissions: {}, 
            financials: { totalEarned: 0, totalPaid: 0, dueAmount: 0},
            paymentHistory: [],
            incomeHistory: [],
            performance: { ordersCreated: 0, ordersConfirmed: 0, statusBreakdown: {} as any },
        };
        setLoggedInStaff(staff);
        localStorage.setItem('loggedInStaff', JSON.stringify(staff));

        // Check for role and redirect if necessary
        if(staff.role === 'Packing Assistant' && pathname !== '/dashboard/packing-orders') {
            router.replace('/dashboard/packing-orders');
        }

        const allowedPaths = navItems.flatMap(item => 'subItems' in item ? item.subItems.map(sub => sub.href) : [item.href]);
        if (!allowedPaths.some(p => pathname.startsWith(p!))) {
           // Maybe show a popup or redirect to dashboard
           console.warn(`Access to ${pathname} is not allowed for role ${staff.role}`);
        }

    }
  }, [isLoaded, isSignedIn, user, router, pathname]);
  
  React.useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

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
              <Logo variant="full" />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <NavLinks />
          </div>
        </div>
      </div>
      <div className="flex flex-col h-screen">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-muted px-4 lg:h-[60px] lg:px-6">
           <Suspense fallback={null}>
              <PageLoader />
           </Suspense>
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <MobileNavLinks onLinkClick={() => setIsMobileNavOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
             <div className="flex h-full items-center justify-center md:hidden">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <Logo variant="full" />
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
          <UserMenu />
        </header>
        <main className="flex flex-1 flex-col bg-background overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
