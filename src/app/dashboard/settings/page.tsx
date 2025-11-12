
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Building, Settings, Handshake, Bell, CreditCard, FolderKanban, Truck, MessageSquare, Mail } from "lucide-react";

const settingsItems = [
    {
        href: "/dashboard/settings/general",
        icon: Settings,
        title: "General",
        description: "Manage general application settings."
    },
    {
        href: "/dashboard/staff",
        icon: User,
        title: "Profile & Staff",
        description: "Manage your personal profile and staff members."
    },
    {
        href: "/dashboard/settings/billing",
        icon: CreditCard,
        title: "Billing",
        description: "Manage your subscription and payment methods."
    },
    {
        href: "/dashboard/settings/business",
        icon: Building,
        title: "Business Management",
        description: "Manage your company details and brands."
    },
    {
        href: "/dashboard/settings/categories",
        icon: FolderKanban,
        title: "Categories",
        description: "Manage product and expense categories."
    },
    {
        href: "/dashboard/settings/integrations",
        icon: Handshake,
        title: "Integrations",
        description: "Connect your other services to Fashionary."
    },
    {
        href: "/dashboard/settings/courier",
        icon: Truck,
        title: "Courier Integrations",
        description: "Connect and manage courier services."
    },
    {
        href: "/dashboard/settings/sms",
        icon: MessageSquare,
        title: "SMS Gateway",
        description: "Configure your SMS provider for notifications."
    },
    {
        href: "/dashboard/settings/smtp",
        icon: Mail,
        title: "SMTP",
        description: "Set up your email sending service."
    },
    {
        href: "#",
        icon: Bell,
        title: "Notifications",
        description: "Configure how you receive notifications."
    }
]

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold font-headline">Settings</h1>
        <p className="text-muted-foreground mb-4">Manage your application and account settings.</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {settingsItems.map((item) => (
              <Link href={item.href} key={item.title}>
                  <Card className="hover:bg-muted/50 transition-colors h-full">
                      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                          <div className="bg-muted p-3 rounded-md">
                              <item.icon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                              <CardTitle className="text-xl">{item.title}</CardTitle>
                              <CardDescription>{item.description}</CardDescription>
                          </div>
                      </CardHeader>
                  </Card>
              </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
