
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Mail, Phone, MapPin, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { getPartnerById, getPurchaseOrdersByPartner } from '@/services/partners';
import type { PurchaseOrder, Payment, Supplier, Vendor } from '@/types';


const poStatusColors = {
    'Received': 'bg-green-500/20 text-green-700',
    'Cutting': 'bg-purple-500/20 text-purple-700',
    'Printing': 'bg-yellow-500/20 text-yellow-700',
    'Fabric Ordered': 'bg-blue-500/20 text-blue-700',
    'Draft': 'bg-gray-500/20 text-gray-700',
    'Cancelled': 'bg-red-500/20 text-red-700',
};

type Partner = Supplier | Vendor;

type PaymentWithPO = Payment & {
    poId: string;
    paymentFor: 'Fabric' | 'Printing' | 'Cutting';
    date: string; // The PO date
};

export default function PartnerDetailsPage() {
  const params = useParams();
  const partnerId = params.id as string;
  const [isClient, setIsClient] = React.useState(false);
  const [partner, setPartner] = React.useState<Partner | undefined>(undefined);
  const [associatedPOs, setAssociatedPOs] = React.useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsClient(true);
    if (partnerId) {
        setIsLoading(true);
        getPartnerById(partnerId).then(partnerData => {
            setPartner(partnerData);
            if (partnerData) {
                getPurchaseOrdersByPartner(partnerData.name).then(poData => {
                    setAssociatedPOs(poData);
                });
            }
        }).finally(() => setIsLoading(false));
    }
  }, [partnerId]);
  
  const financials = React.useMemo(() => {
    if (!partner) return { totalBusiness: 0, totalPaid: 0, totalDue: 0 };
    let totalBusiness = 0;
    let totalPaid = 0;

    associatedPOs.forEach(po => {
        if (po.supplier === partner.name) {
            totalBusiness += po.total;
            if (po.fabricPayment) {
                totalPaid += (po.fabricPayment.cash || 0) + (po.fabricPayment.check || 0);
            }
        }
        if ('type' in partner && partner.type === 'Printing' && po.printingVendor === partner.name && po.printingPayment) {
             const printingCost = (po.printingPayment.cash || 0) + (po.printingPayment.check || 0);
             totalBusiness += printingCost;
             totalPaid += printingCost;
        }
        if ('type' in partner && partner.type === 'Cutting' && po.cuttingVendor === partner.name && po.cuttingPayment) {
            const cuttingCost = (po.cuttingPayment.cash || 0) + (po.cuttingPayment.check || 0);
            totalBusiness += cuttingCost;
            totalPaid += cuttingCost;
        }
    });

    return {
        totalBusiness,
        totalPaid,
        totalDue: totalBusiness - totalPaid,
    }
  }, [associatedPOs, partner]);

  const paymentHistory: PaymentWithPO[] = React.useMemo(() => {
    if (!isClient || !partner) return [];
    const payments: PaymentWithPO[] = [];
    associatedPOs.forEach(po => {
        if (po.supplier === partner?.name && po.fabricPayment) {
            payments.push({ ...po.fabricPayment, poId: po.id, paymentFor: 'Fabric', date: po.date });
        }
        if (partner && 'type' in partner && partner.type === 'Printing' && po.printingVendor === partner.name && po.printingPayment) {
            payments.push({ ...po.printingPayment, poId: po.id, paymentFor: 'Printing', date: po.date });
        }
        if (partner && 'type' in partner && partner.type === 'Cutting' && po.cuttingVendor === partner.name && po.cuttingPayment) {
            payments.push({ ...po.cuttingPayment, poId: po.id, paymentFor: 'Cutting', date: po.date });
        }
    });
    return payments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [associatedPOs, partner, isClient]);

  if (isLoading) {
      return (
          <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
              <Skeleton className="h-10 w-1/4" />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Skeleton className="h-48" />
                  <Skeleton className="lg:col-span-2 h-48" />
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                  <Skeleton className="h-64" />
                  <Skeleton className="h-64" />
              </div>
          </div>
      )
  }

  if (!partner) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 lg:gap-6 lg:p-6">
        <p>Partner not found.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/partners">Back to Partners</Link>
        </Button>
      </div>
    );
  }

  const isSupplier = 'address' in partner;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard/partners">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-headline text-xl font-semibold sm:text-2xl">{partner.name}</h1>
          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            {isSupplier ? <Badge variant="secondary">Supplier</Badge> : <Badge variant="outline">{partner.type}</Badge>}
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div>
                    <p className="font-medium">Contact Person</p>
                    <p className="text-muted-foreground">{partner.contactPerson}</p>
                </div>
                <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <a href={`mailto:${partner.email}`} className="text-primary hover:underline">{partner.email}</a>
                </div>
                 <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                     <a href={`tel:${partner.phone}`} className="text-primary hover:underline">{partner.phone}</a>
                </div>
                {isSupplier && (
                     <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="text-muted-foreground">{partner.address}</div>
                    </div>
                )}
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-y-4 sm:grid-cols-3 sm:gap-x-4">
                {isClient ? (
                    <>
                        <div className="rounded-lg border bg-card p-4">
                            <p className="text-xs text-muted-foreground">Total Business</p>
                            <p className="text-2xl font-bold">৳{financials.totalBusiness.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                        </div>
                        <div className="rounded-lg border bg-card p-4">
                            <p className="text-xs text-muted-foreground">Total Paid</p>
                            <p className="text-2xl font-bold text-green-600">৳{financials.totalPaid.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                        </div>
                        <div className="rounded-lg border bg-card p-4">
                            <p className="text-xs text-muted-foreground">Total Due</p>
                            <p className={cn("text-2xl font-bold", financials.totalDue > 0 ? "text-destructive" : "")}>
                                ৳{financials.totalDue.toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <Skeleton className="h-[98px]" />
                        <Skeleton className="h-[98px]" />
                        <Skeleton className="h-[98px]" />
                    </>
                )}
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Purchase Orders</CardTitle>
                    <CardDescription>All purchase orders involving this partner.</CardDescription>
                </CardHeader>
                <CardContent>
                     {/* For small screens */}
                    <div className="space-y-4 sm:hidden">
                        {associatedPOs.map((po) => (
                            <Card key={po.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Link href={`/dashboard/purchases/${po.id}`} className="font-semibold hover:underline">
                                            {po.id}
                                        </Link>
                                        <p className="text-sm text-muted-foreground">{format(new Date(po.date), "MMM d, yyyy")}</p>
                                    </div>
                                    <Badge variant={'outline'} className={cn('text-xs', poStatusColors[po.status] || 'bg-gray-500/20 text-gray-700')}>
                                        {po.status}
                                    </Badge>
                                </div>
                                <Separator className="my-3" />
                                <div className="flex justify-end items-center">
                                    <p className="font-semibold font-mono">৳{po.total.toFixed(2)}</p>
                                </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {/* For larger screens */}
                    <div className="hidden sm:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>PO Number</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {associatedPOs.map((po) => (
                                <TableRow key={po.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/dashboard/purchases/${po.id}`} className="text-primary hover:underline">
                                            {po.id}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{format(new Date(po.date), "MMM d, yyyy")}</TableCell>
                                    <TableCell>
                                        <Badge variant={'outline'} className={cn(poStatusColors[po.status] || 'bg-gray-500/20 text-gray-700')}>
                                            {po.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">৳{po.total.toFixed(2)}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                     {associatedPOs.length === 0 && (
                        <div className="flex items-center justify-center text-muted-foreground h-24">
                            No purchase orders found.
                        </div>
                    )}
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>All payments made to this partner.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>PO Ref</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isClient ? paymentHistory.map((payment, index) => {
                                const totalPayment = (payment.cash || 0) + (payment.check || 0);
                                if (totalPayment === 0) return null;
                                const paymentDate = payment.checkDate ? payment.checkDate : payment.date;
                                return (
                                <TableRow key={`${payment.poId}-${payment.paymentFor}-${index}`}>
                                    <TableCell>{format(new Date(paymentDate), "MMM d, yyyy")}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{payment.check > 0 && payment.cash > 0 ? 'Cash & Check' : payment.check > 0 ? 'Check' : 'Cash'}</span>
                                            <span className="text-xs text-muted-foreground">{payment.paymentFor}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                         <Link href={`/dashboard/purchases/${payment.poId}`} className="text-primary hover:underline">
                                            {payment.poId}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">৳{totalPayment.toFixed(2)}</TableCell>
                                </TableRow>
                            )}) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Loading payment history...
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {isClient && paymentHistory.length === 0 && (
                        <div className="flex items-center justify-center text-muted-foreground h-24">
                            No payment history found.
                        </div>
                    )}
                </CardContent>
            </Card>

      </div>
    </div>
  );
}
