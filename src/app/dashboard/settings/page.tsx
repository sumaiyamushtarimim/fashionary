import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Building, Settings, Handshake, Bell, CreditCard } from "lucide-react";

const settingsItems = [
    {
        href: "/dashboard/staff",
        icon: User,
        title: "Profile & Staff",
        description: "Manage your personal profile and staff members."
    },
    {
        href: "#",
        icon: Building,
        title: "Company",
        description: "Manage your company details and branding."
    },
    {
        href: "/dashboard/settings/integrations",
        icon: Handshake,
        title: "Integrations",
        description: "Connect your other services to Fashionary."
    },
    {
        href: "#",
        icon: Bell,
        title: "Notifications",
        description: "Configure how you receive notifications."
    },
    {
        href: "#",
        icon: CreditCard,
        title: "Billing",
        description: "Manage your subscription and payment methods."
    },
    {
        href: "#",
        icon: Settings,
        title: "General",
        description: "Manage general application settings."
    }
]

export default function SettingsPage() {
  return (
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
  );
}
