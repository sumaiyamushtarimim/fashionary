
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  addDays,
  format,
  isSameDay,
  isTomorrow,
  isToday,
  startOfToday,
  isWithinInterval,
} from "date-fns";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { getPurchaseOrders } from '@/services/purchases';
import type { PurchaseOrder, CheckStatus } from '@/types';


type CheckPayment = {
  id: string;
  date: string;
  amount: number;
  poId: string;
  vendor: string;
  type: 'Fabric' | 'Printing' | 'Cutting';
  status: CheckStatus;
};

const statusColors: Record<CheckStatus, string> = {
  Pending: "bg-yellow-500/20 text-yellow-700",
  Passed: "bg-green-500/20 text-green-700",
  Bounced: "bg-red-500/20 text-red-700",
  Cancelled: "bg-gray-500/20 text-gray-700",
};


const CheckOverviewCarousel = dynamic(
    () => Promise.resolve(({ data }: { data: OverviewData[] }) => (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full max-w-xs mx-auto"
        >
            <CarouselContent>
                {data.map((day, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{day.label}</CardTitle>
                                    <span className="text-xs text-muted-foreground">{format(day.date, 'MMM d')}</span>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center p-6 pt-2">
                                    <div className="text-3xl font-bold">৳{day.total.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground mt-1">{day.count} pending {day.count === 1 ? 'check' : 'checks'}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
        </Carousel>
    )),
    { 
        ssr: false,
        loading: () => <Skeleton className="h-[138px] w-full max-w-xs mx-auto" />
    }
);


type OverviewData = {
    label: string;
    date: Date;
    count: number;
    total: number;
};


export default function CheckPassingPage() {
  const [isClient, setIsClient] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [allChecks, setAllChecks] = React.useState<CheckPayment[]>([]);
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsClient(true);
    setIsLoading(true);
    getPurchaseOrders().then(purchaseOrders => {
        const checks: CheckPayment[] = [];
        purchaseOrders.forEach((po) => {
          if (po.fabricPayment?.check && po.fabricPayment?.checkDate) {
            checks.push({
              id: `${po.id}-fabric`,
              date: po.fabricPayment.checkDate,
              amount: po.fabricPayment.check,
              poId: po.id,
              vendor: po.supplier,
              type: 'Fabric',
              status: po.fabricPayment.checkStatus || 'Pending',
            });
          }
          if (po.printingPayment?.check && po.printingPayment?.checkDate) {
            checks.push({
              id: `${po.id}-printing`,
              date: po.printingPayment.checkDate,
              amount: po.printingPayment.check,
              poId: po.id,
              vendor: po.printingVendor || 'N/A',
              type: 'Printing',
              status: po.printingPayment.checkStatus || 'Pending',
            });
          }
          if (po.cuttingPayment?.check && po.cuttingPayment?.checkDate) {
            checks.push({
              id: `${po.id}-cutting`,
              date: po.cuttingPayment.checkDate,
              amount: po.cuttingPayment.check,
              poId: po.id,
              vendor: po.cuttingVendor || 'N/A',
              type: 'Cutting',
              status: po.cuttingPayment.checkStatus || 'Pending',
            });
          }
        });
        setAllChecks(checks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        setIsLoading(false);
    })
  }, []);

  const overviewDays = [
    { label: 'Today', date: startOfToday() },
    { label: 'Tomorrow', date: addDays(startOfToday(), 1) },
    { label: 'In 2 Days', date: addDays(startOfToday(), 2) },
    { label: 'In 3 Days', date: addDays(startOfToday(), 3) },
    { label: 'In 7 Days', date: addDays(startOfToday(), 7) },
  ];

  const overviewData = overviewDays.map(day => {
    const checksForDay = allChecks.filter(check => isSameDay(new Date(check.date), day.date) && check.status === 'Pending');
    const totalAmount = checksForDay.reduce((acc, check) => acc + check.amount, 0);
    return {
      label: day.label,
      date: day.date,
      count: checksForDay.length,
      total: totalAmount,
    };
  });

  const upcomingChecks = React.useMemo(() => {
    if (!isClient) return [];
    if (!dateRange || !dateRange.from) {
        return allChecks.filter(c => new Date(c.date) >= startOfToday());
    }
    return allChecks.filter(check => {
        const checkDate = new Date(check.date);
        const dateMatch = dateRange?.from && dateRange?.to 
            ? isWithinInterval(checkDate, { start: dateRange.from, end: dateRange.to })
            : isSameDay(checkDate, dateRange.from);
        return dateMatch;
    });
  }, [allChecks, dateRange, isClient]);

  if (isLoading) {
      return (
          <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <Skeleton className="h-10 w-1/4" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24" />)}
            </div>
            <Skeleton className="h-96" />
          </div>
      )
  }


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <div className="flex-1">
          <h1 className="font-headline text-2xl font-bold">Check Passing</h1>
          <p className="text-muted-foreground hidden sm:block">
            Overview and list of upcoming check payments.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
      </div>

        {isClient && isMobile ? (
            <div className='py-4'>
                <CheckOverviewCarousel data={overviewData} />
            </div>
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {overviewData.map(day => (
                    <Card key={day.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{day.label}</CardTitle>
                            <span className="text-xs text-muted-foreground">{format(day.date, 'MMM d')}</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">৳{day.total.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">{day.count} pending {day.count === 1 ? 'check' : 'checks'}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}

      <Card>
        <CardHeader>
            <CardTitle>Upcoming Checks</CardTitle>
            <CardDescription>
                {dateRange?.from 
                    ? `Showing checks from ${format(dateRange.from, "LLL dd, y")}${dateRange.to ? ` to ${format(dateRange.to, "LLL dd, y")}`: ''}`
                    : "All scheduled check payments from today onwards."
                }
            </CardDescription>
        </CardHeader>
        <CardContent>
            {/* Table for larger screens */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Passing Date</TableHead>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Vendor/Supplier</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isClient && upcomingChecks.length > 0 ? (
                    upcomingChecks.map((check) => {
                      const checkDate = new Date(check.date);
                      const isTodayCheck = isToday(checkDate);
                      const isTomorrowCheck = isTomorrow(checkDate);
                      return (
                        <TableRow key={check.id} className={cn(isTodayCheck && "bg-primary/10")}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                                <span>{format(checkDate, "MMMM d, yyyy")}</span>
                                 {(isTodayCheck || isTomorrowCheck) && (
                                    <Badge variant={isTodayCheck ? "destructive" : "secondary"} className="w-fit mt-1">
                                        {isTodayCheck ? "Today" : "Tomorrow"}
                                    </Badge>
                                 )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="link" asChild className="p-0 h-auto">
                                <Link href={`/dashboard/purchases/${check.poId}`}>{check.poId}</Link>
                            </Button>
                          </TableCell>
                          <TableCell>{check.vendor}</TableCell>
                          <TableCell>
                              <Badge variant="outline">{check.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(statusColors[check.status])}>{check.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">৳{check.amount.toFixed(2)}</TableCell>
                           <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                <DropdownMenuItem>Mark as Passed</DropdownMenuItem>
                                <DropdownMenuItem>Mark as Bounced</DropdownMenuItem>
                                <DropdownMenuItem>Mark as Cancelled</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : isClient && upcomingChecks.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            No upcoming checks found for the selected date range.
                        </TableCell>
                    </TableRow>
                  ) : (
                    [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell>
                        </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Card list for smaller screens */}
             {isClient && (
                <div className="sm:hidden space-y-4">
                    {upcomingChecks.length > 0 ? (
                        upcomingChecks.map((check) => {
                            const checkDate = new Date(check.date);
                            const isTodayCheck = isToday(checkDate);
                            const isTomorrowCheck = isTomorrow(checkDate);
                            return (
                                <Card key={check.id} className={cn(isTodayCheck && "bg-primary/10")}>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold">{check.vendor}</p>
                                                <p className="text-sm">
                                                    PO: <Button variant="link" asChild className="p-0 h-auto text-sm">
                                                            <Link href={`/dashboard/purchases/${check.poId}`}>{check.poId}</Link>
                                                        </Button>
                                                </p>
                                                <div className="mt-2">
                                                    <Badge variant="outline">{check.type}</Badge>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <p className="font-semibold font-mono">৳{check.amount.toFixed(2)}</p>
                                                <div className="mt-2">
                                                    <Badge variant="outline" className={cn(statusColors[check.status])}>{check.status}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <Separator className="my-3" />
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-muted-foreground">{format(checkDate, "MMMM d, yyyy")}</span>
                                                {(isTodayCheck || isTomorrowCheck) && (
                                                    <Badge variant={isTodayCheck ? "destructive" : "secondary"} className="w-fit mt-1">
                                                        {isTodayCheck ? "Today" : "Tomorrow"}
                                                    </Badge>
                                                )}
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                    aria-haspopup="true"
                                                    size="icon"
                                                    variant="ghost"
                                                    >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                                    <DropdownMenuItem>Mark as Passed</DropdownMenuItem>
                                                    <DropdownMenuItem>Mark as Bounced</DropdownMenuItem>
                                                    <DropdownMenuItem>Mark as Cancelled</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    ) : (
                        <div className="h-24 text-center text-muted-foreground flex items-center justify-center">
                            No upcoming checks found.
                        </div>
                    )}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
