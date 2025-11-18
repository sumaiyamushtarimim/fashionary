
'use client';

import * as React from 'react';
import {
  Package,
  CheckCircle,
  XCircle,
  History,
  Truck,
  FileText,
  Edit,
  PackageSearch,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { OrderLog, OrderStatus } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const statusIcons: Record<string, React.ElementType> = {
    'New': Package,
    'Confirmed': CheckCircle,
    'Canceled': XCircle,
    'Hold': History,
    'In-Courier': Truck,
    'RTS (Ready to Ship)': PackageSearch,
    'Shipped': Truck,
    'Delivered': CheckCircle,
    'Returned': History,
    'Return Pending': History,
    'Partial': Truck,
    'Notes updated': FileText, 
    'Order Edited': Edit,
    'Sent to Pathao': Truck,
    'Packing Hold': Clock,
};

export function OrderTimeline({ logs }: { logs: OrderLog[] }) {
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const sortedLogs = React.useMemo(() => logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()), [logs]);

    return (
        <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>
            {isClient ? (
                <ul className="space-y-8">
                    {sortedLogs.map((log, index) => {
                        const Icon = statusIcons[log.title] || History;
                        const isLast = index === sortedLogs.length - 1;
                        return (
                            <li key={`${log.timestamp}-${index}`} className="relative flex items-start gap-4">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center bg-background border-2",
                                    isLast ? "border-primary" : "border-border"
                                )}>
                                    <Icon className={cn("h-4 w-4", isLast ? "text-primary" : "text-muted-foreground")} />
                                </div>
                                <div className="flex-1 pt-1">
                                    <p className={cn("font-medium", isLast ? "text-foreground" : "text-muted-foreground")}>{log.title}</p>
                                    <p className="text-sm text-muted-foreground">{log.description}</p>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        <span>{format(new Date(log.timestamp), "MMM d, yyyy, h:mm a")}</span>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="space-y-8">
                    {logs.map((log, i) => (
                        <div key={`${log.timestamp}-${i}`} className="flex items-start gap-4">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
