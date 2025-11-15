
import {
  Settings,
  Store,
  LayoutGrid,
  Plug,
  Truck,
  MessageSquare,
  Mail,
  BellRing,
  Radar,
  FileSearch,
} from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const settingsLinks = [
  {
    href: '/dashboard/settings/general',
    title: 'General Settings',
    description: 'Manage store details, currency, and language.',
    icon: Settings,
  },
  {
    href: '/dashboard/settings/business',
    title: 'Business',
    description: 'Manage your business entities and brands.',
    icon: Store,
  },
  {
    href: '/dashboard/settings/categories',
    title: 'Categories',
    description: 'Organize your products and expenses.',
    icon: LayoutGrid,
  },
  {
    href: '/dashboard/settings/notifications',
    title: 'Notifications',
    description: 'Configure SMS and Email templates for events.',
    icon: BellRing,
  },
  {
    href: '/dashboard/settings/integrations',
    title: 'WooCommerce',
    description: 'Connect and manage your WooCommerce stores.',
    icon: Plug,
  },
  {
    href: '/dashboard/settings/courier',
    title: 'Courier',
    description: 'Manage shipping and courier services.',
    icon: Truck,
  },
  {
      href: '/dashboard/settings/delivery-score',
      title: 'Delivery Score',
      description: 'Configure Courier Search API for reports.',
      icon: Radar
  },
  {
    href: '/dashboard/settings/gateways/sms',
    title: 'SMS Gateway',
    description: 'Configure your SMS provider.',
    icon: MessageSquare,
  },
  {
    href: '/dashboard/settings/gateways/smtp',
    title: 'SMTP',
    description: 'Configure your email sending service.',
    icon: Mail,
  },
];

export default function SettingsDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your store&apos;s settings and configurations.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {settingsLinks.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="h-full hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
