
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import React from "react";

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
  { href: "/dashboard/analytics", icon: BarChartHorizontal, label: "Analytics" },
  { href: "/dashboard/staff", icon: User, label: "Staff" },
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
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
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

function MobileNavLinks() {
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
                className={cn(
                    "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
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
  const pathname = usePathname();
  const isSettingsPage = pathname.startsWith('/dashboard/settings');

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo />
              <span className="font-headline text-xl">Fashionary</span>
            </Link>
          </div>
          <div className="flex-1">
            <NavLinks />
          </div>
          <div className="mt-auto p-4">
            <Link
              href="/dashboard/settings"
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", isSettingsPage && "bg-muted text-primary")}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
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
              <MobileNavLinks />
              <div className="mt-auto">
                 <Link
                    href="/dashboard/settings"
                    className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground", isSettingsPage && "bg-muted text-foreground")}
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
              </div>
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
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>New order #ORD-2024-005 received.</DropdownMenuItem>
                <DropdownMenuItem>Stock running low for "Organic Cotton T-Shirt".</DropdownMenuItem>
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
                <Link href="/dashboard/settings">Settings</Link>
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
