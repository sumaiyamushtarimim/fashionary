
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import OrdersClientPage from './client-page';

function OrdersPageSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 flex-grow">
                    <Skeleton className="h-10 w-full sm:w-auto sm:min-w-[180px]" />
                    <Skeleton className="h-10 w-full sm:w-auto sm:min-w-[180px]" />
                </div>
                <div className="hidden sm:flex items-center gap-2 justify-end">
                    <Skeleton className="h-9 w-[150px]" />
                    <Skeleton className="h-9 w-[90px]" />
                    <Skeleton className="h-9 w-[120px]" />
                </div>
            </div>
            <Skeleton className="h-[600px] w-full" />
        </div>
    );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={<OrdersPageSkeleton />}>
            <OrdersClientPage />
        </Suspense>
    );
}
