
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
import { purchaseOrders } from "@/lib/placeholder-data";
import {
  addDays,
  format,
  isSameDay,
  isTomorrow,
  isToday,
  startOfToday,
} from "date-fns";
import { cn } from "@/lib/utils";
import Link from 'next/link';

type CheckPayment = {
  date: string;
  amount: number;
  poId: string;
  vendor: string;
  type: 'Fabric' | 'Printing' | 'Cutting';
};

export default function CheckPassingPage() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const allChecks = React.useMemo<CheckPayment[]>(() => {
    const checks: CheckPayment[] = [];
    purchaseOrders.forEach((po) => {
      if (po.fabricPayment?.check && po.fabricPayment?.checkDate) {
        checks.push({
          date: po.fabricPayment.checkDate,
          amount: po.fabricPayment.check,
          poId: po.id,
          vendor: po.supplier,
          type: 'Fabric',
        });
      }
      if (po.printingPayment?.check && po.printingPayment?.checkDate) {
        checks.push({
          date: po.printingPayment.checkDate,
          amount: po.printingPayment.check,
          poId: po.id,
          vendor: po.printingVendor || 'N/A',
          type: 'Printing',
        });
      }
      if (po.cuttingPayment?.check && po.cuttingPayment?.checkDate) {
        checks.push({
          date: po.cuttingPayment.checkDate,
          amount: po.cuttingPayment.check,
          poId: po.id,
          vendor: po.cuttingVendor || 'N/A',
          type: 'Cutting',
        });
      }
    });
    return checks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  const overviewDays = [
    { label: 'Today', date: startOfToday() },
    { label: 'Tomorrow', date: addDays(startOfToday(), 1) },
    { label: 'In 2 Days', date: addDays(startOfToday(), 2) },
    { label: 'In 3 Days', date: addDays(startOfToday(), 3) },
    { label: 'In 7 Days', date: addDays(startOfToday(), 7) },
  ];

  const overviewData = overviewDays.map(day => {
    const checksForDay = allChecks.filter(check => isSameDay(new Date(check.date), day.date));
    const totalAmount = checksForDay.reduce((acc, check) => acc + check.amount, 0);
    return {
      label: day.label,
      date: day.date,
      count: checksForDay.length,
      total: totalAmount,
    };
  });

  const upcomingChecks = allChecks.filter(check => new Date(check.date) >= startOfToday());


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <div className="flex-1">
          <h1 className="font-headline text-2xl font-bold">Check Passing</h1>
          <p className="text-muted-foreground">
            Overview and list of upcoming check payments.
          </p>
        </div>
      </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {overviewData.map(day => (
                <Card key={day.label}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{day.label}</CardTitle>
                        <span className="text-xs text-muted-foreground">{format(day.date, 'MMM d')}</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${day.total.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{day.count} {day.count === 1 ? 'check' : 'checks'} passing</p>
                    </CardContent>
                </Card>
            ))}
        </div>

      <Card>
        <CardHeader>
            <CardTitle>Upcoming Checks</CardTitle>
            <CardDescription>All scheduled check payments from today onwards.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Passing Date</TableHead>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor/Supplier</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isClient && upcomingChecks.length > 0 ? (
                upcomingChecks.map((check, index) => {
                  const checkDate = new Date(check.date);
                  const isTodayCheck = isToday(checkDate);
                  const isTomorrowCheck = isTomorrow(checkDate);
                  return (
                    <TableRow key={`${check.poId}-${check.type}-${index}`} className={cn(isTodayCheck && "bg-primary/10")}>
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
                      <TableCell className="text-right font-mono">${check.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })
              ) : isClient && upcomingChecks.length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No upcoming checks found.
                    </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                       Loading checks...
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
