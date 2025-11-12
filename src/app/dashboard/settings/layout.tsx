
'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    User,
    Building,
    Settings,
    Handshake,
    Bell,
    CreditCard,
    FolderKanban,
    Truck,
    MessageSquare,
    Mail
} from "lucide-react";

const sidebarNavItems = [
    {
        title: "General",
        href: "/dashboard/settings/general",
        icon: Settings
    },
    {
        title: "Profile & Staff",
        href: "/dashboard/staff",
        icon: User
    },
    {
        title: "Businesses",
        href: "/dashboard/settings/business",
        icon: Building
    },
    {
        title: "Categories",
        href: "/dashboard/settings/categories",
        icon: FolderKanban
    },
    {
        title: "Integrations",
        href: "/dashboard/settings/integrations",
        icon: Handshake
    },
    {
        title: "Courier Services",
        href: "/dashboard/settings/courier",
        icon: Truck
    },
    {
        title: "SMS Gateway",
        href: "/dashboard/settings/sms",
        icon: MessageSquare
    },
    {
        title: "SMTP",
        href: "/dashboard/settings/smtp",
        icon: Mail
    },
    {
        title: "Notifications",
        href: "/dashboard/settings/notifications",
        icon: Bell
    },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()

  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and application preferences.
          </p>
        </div>
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
              {sidebarNavItems.map((item) => {
                 const Icon = item.icon;
                 return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full text-left justify-start px-4 py-2",
                        pathname === item.href
                            ? "bg-muted hover:bg-muted"
                            : "hover:bg-transparent hover:underline",
                        "justify-start"
                        )}
                    >
                         <Icon className="mr-2 h-4 w-4" />
                        {item.title}
                    </Link>
                 )
              })}
            </nav>
          </aside>
          <div className="flex-1 lg:max-w-4xl">{children}</div>
        </div>
      </div>
    </>
  )
}
