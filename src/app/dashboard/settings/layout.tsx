
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Settings,
  Store,
  LayoutGrid,
  Plug,
  Truck,
  MessageSquare,
  Mail,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const settingsNav = [
  { href: '/dashboard/settings', label: 'Dashboard', icon: Settings },
  { href: '/dashboard/settings/general', label: 'General', icon: Settings },
  { href: '/dashboard/settings/business', label: 'Business', icon: Store },
  { href: '/dashboard/settings/categories', label: 'Categories', icon: LayoutGrid },
  { href: '/dashboard/settings/integrations', label: 'Integrations', icon: Plug },
  { href: '/dashboard/settings/courier', label: 'Courier', icon: Truck },
  { href: '/dashboard/settings/sms', label: 'SMS Gateway', icon: MessageSquare },
  { href: '/dashboard/settings/smtp', label: 'SMTP', icon: Mail },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh_-_3.5rem)] flex-col">
      <div className="flex flex-col space-y-8 p-4 lg:p-6 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {settingsNav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  pathname === href
                    ? 'bg-muted hover:bg-muted'
                    : 'hover:bg-transparent hover:underline',
                  'justify-start'
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
