

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
  RotateCcw,
  UserCog,
  AlertCircle,
  Clock,
  Play,
  Pause,
  Coffee,
  LogOut,
  LogIn,
  BookUser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuFooter,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
import { UnauthorizedAccessModal } from "@/components/ui/unauthorized-access-modal";
import { getNotifications } from "@/services/notifications";
import type { Notification, StaffMember, StaffRole, Permission } from "@/types";

const isPublicRoute = (pathname: string) => {
    return pathname.startsWith('/shop') || pathname.startsWith('/track-order');
}

const hasAccess = (permission: Permission | boolean | undefined): boolean => {
    if (permission === undefined) return false;
    if (typeof permission === 'boolean') return permission;
    if (typeof permission === 'object' && permission !== null) return permission.read;
    return false;
}

// --- PERMISSIONS PRESETS for mocking in development ---
const NO_ACCESS: Permission = { create: false, read: false, update: false, delete: false };
const READ_ONLY: Permission = { create: false, read: true, update: false, delete: false };
const CREATE_READ_UPDATE: Permission = { create: true, read: true, update: true, delete: false };
const FULL_ACCESS: Permission = { create: true, read: true, update: true, delete: false };

const PERMISSIONS: Record<StaffRole, StaffMember['permissions']> = {
    Admin: {
        orders: FULL_ACCESS, packingOrders: FULL_ACCESS, products: FULL_ACCESS, inventory: FULL_ACCESS,
        customers: FULL_ACCESS, purchases: FULL_ACCESS, expenses: FULL_ACCESS, checkPassing: FULL_ACCESS,
        partners: FULL_ACCESS, courierReport: FULL_ACCESS, staff: FULL_ACCESS, settings: FULL_ACCESS, analytics: FULL_ACCESS,
        issues: FULL_ACCESS, attendance: FULL_ACCESS, accounting: FULL_ACCESS,
    },
    Manager: {
        orders: CREATE_READ_UPDATE, packingOrders: READ_ONLY, products: CREATE_READ_UPDATE, inventory: CREATE_READ_UPDATE,
        customers: CREATE_READ_UPDATE, purchases: CREATE_READ_UPDATE, expenses: CREATE_READ_UPDATE, checkPassing: { ...CREATE_READ_UPDATE, create: false },
        partners: CREATE_READ_UPDATE, courierReport: READ_ONLY, staff: { ...CREATE_READ_UPDATE, delete: false }, settings: READ_ONLY, analytics: NO_ACCESS,
        issues: CREATE_READ_UPDATE, attendance: READ_ONLY, accounting: READ_ONLY,
    },
    Moderator: {
        orders: CREATE_READ_UPDATE, packingOrders: NO_ACCESS, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: CREATE_READ_UPDATE, attendance: NO_ACCESS, accounting: NO_ACCESS,
    },
    'Packing Assistant': {
        orders: NO_ACCESS, packingOrders: { ...CREATE_READ_UPDATE, create: false, delete: false }, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: NO_ACCESS, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: NO_ACCESS, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: NO_ACCESS, attendance: NO_ACCESS, accounting: NO_ACCESS,
    },
    'Seller': {
        orders: CREATE_READ_UPDATE, packingOrders: NO_ACCESS, products: READ_ONLY, inventory: READ_ONLY,
        customers: CREATE_READ_UPDATE, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: { ...CREATE_READ_UPDATE, create: true, read: true, update: true, delete: false }, attendance: NO_ACCESS, accounting: NO_ACCESS,
    },
    'Call Assistant': {
        orders: READ_ONLY, packingOrders: NO_ACCESS, products: READ_ONLY, inventory: READ_ONLY,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: { ...CREATE_READ_UPDATE, create: false, read: true, update: true, delete: false }, attendance: NO_ACCESS, accounting: NO_ACCESS,
    },
    'Call Centre Manager': {
        orders: READ_ONLY, packingOrders: NO_ACCESS, products: READ_ONLY, inventory: READ_ONLY,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: READ_ONLY, settings: NO_ACCESS, analytics: READ_ONLY,
        issues: CREATE_READ_UPDATE, attendance: READ_ONLY, accounting: READ_ONLY,
    },
    'Courier Manager': {
        orders: { ...CREATE_READ_UPDATE, create: false, delete: false }, packingOrders: READ_ONLY, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: READ_ONLY,
        partners: NO_ACCESS, courierReport: FULL_ACCESS, staff: NO_ACCESS, settings: { ...NO_ACCESS, read: true }, analytics: NO_ACCESS,
        issues: { ...CREATE_READ_UPDATE, create: true, read: true, update: true, delete: false }, attendance: NO_ACCESS, accounting: NO_ACCESS,
    },
    'Courier Call Assistant': {
        orders: READ_ONLY, packingOrders: NO_ACCESS, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: READ_ONLY, purchases: NO_ACCESS, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: READ_ONLY, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: { ...CREATE_READ_UPDATE, create: false, read: true, update: true, delete: false }, attendance: NO_ACCESS, accounting: NO_ACCESS,
    },
    'Vendor/Supplier': {
        orders: NO_ACCESS, packingOrders: NO_ACCESS, products: NO_ACCESS, inventory: NO_ACCESS,
        customers: NO_ACCESS, purchases: { create: false, read: true, update: true, delete: false }, expenses: NO_ACCESS, checkPassing: NO_ACCESS,
        partners: NO_ACCESS, courierReport: NO_ACCESS, staff: NO_ACCESS, settings: NO_ACCESS, analytics: NO_ACCESS,
        issues: NO_ACCESS, attendance: NO_ACCESS, accounting: NO_ACCESS,
    },
    'Custom': NO_ACCESS,
};
// --- END OF PERMISSIONS PRESETS ---


const navItems = (permissions: StaffMember['permissions'] | null) => [
  { href: "/dashboard", icon: Home, label: "Dashboard", access: true },
  { 
      label: "Orders", 
      icon: ShoppingCart, 
      access: hasAccess(permissions?.orders),
      subItems: [
          { href: "/dashboard/orders/all", label: "All Orders", access: hasAccess(permissions?.orders) },
          { href: "/dashboard/orders/incomplete", label: "Incomplete Orders", access: hasAccess(permissions?.orders) },
      ]
  },
  { href: "/dashboard/issues", icon: AlertCircle, label: "Issues", access: hasAccess(permissions?.issues) },
  { href: "/dashboard/packing-orders", icon: ClipboardList, label: "Packing Orders", access: hasAccess(permissions?.packingOrders) },
  { href: "/dashboard/courier-report", icon: FileSearch, label: "Courier Report", access: hasAccess(permissions?.courierReport) },
  { href: "/dashboard/products", icon: Package, label: "Products", access: hasAccess(permissions?.products) },
  { href: "/dashboard/inventory", icon: Warehouse, label: "Inventory", access: hasAccess(permissions?.inventory) },
  { href: "/dashboard/customers", icon: Users, label: "Customers", access: hasAccess(permissions?.customers) },
  { href: "/dashboard/purchases", icon: Truck, label: "Purchases", access: hasAccess(permissions?.purchases) },
  { href: "/dashboard/expenses", icon: Wallet, label: "Expenses", access: hasAccess(permissions?.expenses) },
  { href: "/dashboard/check-passing", icon: Landmark, label: "Check Passing", access: hasAccess(permissions?.checkPassing) },
  { href: "/dashboard/partners", icon: Handshake, label: "Partners", access: hasAccess(permissions?.partners) },
  { href: "/dashboard/analytics", icon: BarChartHorizontal, label: "Analytics", access: hasAccess(permissions?.analytics) },
  { href: "/dashboard/accounting", icon: BookUser, label: "Accounting", access: hasAccess(permissions?.accounting) },
  { href: "/dashboard/staff", icon: User, label: "Staff", access: hasAccess(permissions?.staff) },
  { href: "/dashboard/attendance", icon: Clock, label: "Attendance", access: hasAccess(permissions?.attendance) },
  { href: "/dashboard/settings", icon: Settings, label: "Settings", access: hasAccess(permissions?.settings) },
];


function NavLinks({ permissions }: { permissions: StaffMember['permissions'] | null }) {
    const pathname = usePathname();
    const isOrderRelatedPage = pathname.startsWith('/dashboard/orders') || pathname === '/dashboard/packing-orders';
    
    const accessibleNavItems = navItems(permissions).filter(item => item.access);

    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {accessibleNavItems.map((item, index) => {
            if ('subItems' in item) {
                const accessibleSubItems = item.subItems?.filter(sub => sub.access);
                if (!accessibleSubItems || accessibleSubItems.length === 0) return null;

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
                                {accessibleSubItems.map(subItem => (
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

function MobileNavLinks({ onLinkClick, permissions }: { onLinkClick: () => void, permissions: StaffMember['permissions'] | null }) {
    const pathname = usePathname();
    const isOrderRelatedPage = pathname.startsWith('/dashboard/orders') || pathname === '/dashboard/packing-orders';
    const accessibleNavItems = navItems(permissions).filter(item => item.access);

    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {accessibleNavItems.map((item, index) => {
                 if ('subItems' in item) {
                     const accessibleSubItems = item.subItems?.filter(sub => sub.access);
                     if (!accessibleSubItems || accessibleSubItems.length === 0) return null;
                     
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
                                    {accessibleSubItems.map(subItem => (
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
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <Skeleton className="h-8 w-8 rounded-full" />;
    }

    return <UserButton afterSignOutUrl="/" />;
}

function DevRoleSwitcher() {
    const [mockRole, setMockRole] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentMockRole = document.cookie.split('; ').find(row => row.startsWith('mock_role='))?.split('=')[1] || '';
            setMockRole(currentMockRole);
        }
    }, []);

    const handleRoleChange = (role: string) => {
        setMockRole(role);
        if (role) {
            document.cookie = `mock_role=${role}; path=/; max-age=86400`; // Expires in 1 day
        } else {
            document.cookie = 'mock_role=; path=/; max-age=-1'; // Delete cookie
        }
        router.refresh();
    };

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <UserCog className="h-4 w-4" />
                    <span className="sr-only">Switch Role</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Switch Dev Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={mockRole} onValueChange={handleRoleChange}>
                    <DropdownMenuRadioItem value="">None (Use Clerk)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Admin">Admin</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Manager">Manager</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Moderator">Moderator</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Seller">Seller</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Packing Assistant">Packing Assistant</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Call Assistant">Call Assistant</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Call Centre Manager">Call Centre Manager</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Courier Manager">Courier Manager</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function AttendanceWidget() {
    const [status, setStatus] = React.useState<'clocked-out' | 'clocked-in' | 'on-break'>('clocked-out');
    const [timer, setTimer] = React.useState(0);
    const [breakTimer, setBreakTimer] = React.useState(0);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);
    const breakTimerRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (breakTimerRef.current) clearInterval(breakTimerRef.current);
        };
    }, []);

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const startBreakTimer = () => {
        if (breakTimerRef.current) clearInterval(breakTimerRef.current);
        breakTimerRef.current = setInterval(() => {
            setBreakTimer(prev => prev + 1);
        }, 1000);
    };

    const stopBreakTimer = () => {
        if (breakTimerRef.current) clearInterval(breakTimerRef.current);
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const handleClockIn = () => {
        setStatus('clocked-in');
        setTimer(0);
        startTimer();
    };

    const handleClockOut = () => {
        setStatus('clocked-out');
        stopTimer();
        stopBreakTimer();
        setTimer(0);
        setBreakTimer(0);
    };

    const handleBreak = () => {
        if (status === 'clocked-in') {
            setStatus('on-break');
            stopTimer();
            startBreakTimer();
        } else if (status === 'on-break') {
            setStatus('clocked-in');
            stopBreakTimer();
            startTimer();
        }
    };

    if (status === 'clocked-out') {
        return (
            <Button size="sm" onClick={handleClockIn}>
                <LogIn className="mr-2 h-4 w-4"/>
                Clock In
            </Button>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className={cn(
                "flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-mono",
                status === 'on-break' && 'bg-yellow-500/20 border-yellow-500/30'
            )}>
                {status === 'clocked-in' && <Play className="h-4 w-4 text-green-500" />}
                {status === 'on-break' && <Pause className="h-4 w-4 text-yellow-500" />}
                <span>{status === 'clocked-in' ? formatTime(timer) : formatTime(breakTimer)}</span>
            </div>
            <Button size="sm" variant="outline" onClick={handleBreak}>
                {status === 'on-break' ? <Play className="mr-2 h-4 w-4"/> : <Coffee className="mr-2 h-4 w-4"/>}
                {status === 'on-break' ? 'End Break' : 'Take a Break'}
            </Button>
             <Button size="sm" variant="destructive" onClick={handleClockOut}>
                <LogOut className="mr-2 h-4 w-4"/>
                Clock Out
            </Button>
        </div>
    )
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
  const [permissions, setPermissions] = useState<StaffMember['permissions'] | null>(null);

  React.useEffect(() => {
    if (isLoaded && !isSignedIn && !isPublicRoute(pathname)) {
        router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, pathname, router]);

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
        const mockRole = document.cookie.split('; ').find(row => row.startsWith('mock_role='))?.split('=')[1] as StaffRole | undefined;
        if (mockRole && PERMISSIONS[mockRole]) {
            setPermissions(PERMISSIONS[mockRole]);
            return;
        }
    }
    
    if (isLoaded && isSignedIn && user) {
        const userPermissions = user.publicMetadata.permissions as StaffMember['permissions'] | null;
        setPermissions(userPermissions || null);
    }
  }, [isLoaded, isSignedIn, user, pathname]);
  
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


  if (!isLoaded || !permissions) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <PageLoader />
          </div>
      )
  }

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
            <NavLinks permissions={permissions} />
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
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 font-semibold"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <Logo variant="full" />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto">
                <MobileNavLinks onLinkClick={() => setIsMobileNavOpen(false)} permissions={permissions} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1 md:hidden">
             <div className="flex h-full items-center justify-center">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <Logo variant="full" />
                </Link>
             </div>
          </div>
          <div className="hidden md:flex flex-1 items-center gap-4">
            <AttendanceWidget />
          </div>
          <DevRoleSwitcher />
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
          <Suspense fallback={<PageLoader />}>
            <UnauthorizedAccessModal />
          </Suspense>
          {children}
        </main>
      </div>
    </div>
  );
}
