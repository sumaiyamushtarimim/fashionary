'use client';

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Check, HardHat, Package, Truck, Minus, Plus, History, FileText, Printer, Scissors } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { getPurchaseOrderById } from "@/services/purchases";
import { getSuppliers, getVendors } from "@/services/partners";
import type { PurchaseOrder, PurchaseOrderLog, Supplier, Vendor } from "@/types";

type Payment = {
    cash: number;
    check: number;
    checkDate: string;
}

const initialPaymentState: Payment = { cash: 0, check: 0, checkDate: '' };

const productionSteps = [
    { id: 'fabric', name: 'Fabric Ordered', status: 'complete', icon: Package },
    { id: 'printing', name: 'Printing', status: 'current', icon: HardHat },
    { id: 'cutting', name: 'Cutting', status: 'pending', icon: Scissors },
    { id: 'delivery', name: 'Delivery', status: 'pending', icon: Truck },
];

const statusIcons: Record<string, React.ElementType> = {
    'Fabric Ordered': Package,
    'Printing': HardHat,
    'Cutting': Scissors,
    'Received': Check,
    'Cancelled': FileText,
    'Draft': FileText,
};


const calculateDue = (totalCost: number, payment: Payment) => {
    const paid = (Number(payment.cash) || 0) + (Number(payment.check) || 0);
    return totalCost - paid;
};

const PaymentSection = ({ cost, payment, onPaymentChange, due, costDisabled = false }: { cost: number, payment: Payment, onPaymentChange: (field: keyof Payment, value: any) => void, due: number, costDisabled?: boolean }) => (
    <>
        <Separator />
        <Label className="font-medium">Payment</Label>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor={`cash-${cost}`}>Cash Amount</Label>
                <Input id={`cash-${cost}`} placeholder="0.00" type="number" value={payment.cash || ''} onChange={e => onPaymentChange('cash', parseFloat(e.target.value) || 0)} disabled={cost > 0 && cost === payment.check} />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`check-${cost}`}>Check Amount</Label>
                <Input id={`check-${cost}`} placeholder="0.00" type="number" value={payment.check || ''} onChange={e => onPaymentChange('check', parseFloat(e.target.value) || 0)} disabled={cost > 0 && cost === payment.cash} />
            </div>
        </div>
        {(Number(payment.check) || 0) > 0 && (
            <div className="space-y-2">
                <Label htmlFor={`check-date-${cost}`}>Check Passing Date</Label>
                <Input id={`check-date-${cost}`} type="date" value={payment.checkDate} onChange={e => onPaymentChange('checkDate', e.target.value)} />
            </div>
        )}
        <Separator />
        <div className="space-y-1 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Total Bill:</span>
                <span className="font-medium">৳{cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Paid:</span>
                <span className="font-medium">৳{((Number(payment.cash) || 0) + (Number(payment.check) || 0)).toFixed(2)}</span>
            </div>
             <div className="flex justify-between font-semibold">
                <span className={due > 0 ? "text-destructive" : ""}>Due Amount:</span>
                <span className={due > 0 ? "text-destructive" : ""}>৳{due.toFixed(2)}</span>
            </div>
        </div>
    </>
);

function PurchaseOrderHistory({ logs }: { logs: PurchaseOrderLog[] }) {
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const sortedLogs = React.useMemo(() => logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [logs]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Purchase Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>
                    {isClient ? (
                        <ul className="space-y-6">
                            {sortedLogs.map((log, index) => {
                                const Icon = statusIcons[log.status] || History;
                                const isLast = index === 0;
                                return (
                                    <li key={`${log.timestamp}-${index}`} className="relative flex items-start gap-4">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center bg-background border",
                                            isLast ? "border-primary" : "border-border"
                                        )}>
                                            <Icon className={cn("h-4 w-4", isLast ? "text-primary" : "text-muted-foreground")} />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className={cn("font-medium", isLast ? "text-foreground" : "text-muted-foreground")}>{log.status}</p>
                                            <p className="text-sm text-muted-foreground">{log.description}</p>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                <span>{format(new Date(log.timestamp), "MMM d, yyyy, h:mm a")}</span>
                                                {log.user && <span className="font-medium"> by {log.user}</span>}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="space-y-6">
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
            </CardContent>
        </Card>
    );
}


export default function PurchaseOrderDetailsPage() {
    const params = useParams();
    const poId = params.id as string;
    
    const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | undefined>(undefined);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [printingQty, setPrintingQty] = useState<number>(0);
    const [printingCost, setPrintingCost] = useState<number>(0);
    const [printingPayment, setPrintingPayment] = useState<Payment>(initialPaymentState);
    
    const [cuttingQty, setCuttingQty] = useState<number>(0);
    const [cuttingCost, setCuttingCost] = useState<number>(0);
    const [cuttingPayment, setCuttingPayment] = useState<Payment>(initialPaymentState);

    const [finalReceivedQty, setFinalReceivedQty] = useState<number>(0);

    React.useEffect(() => {
        if (poId) {
            setIsLoading(true);
            Promise.all([
                getPurchaseOrderById(poId),
                getSuppliers(),
                getVendors()
            ]).then(([poData, suppliersData, vendorsData]) => {
                setPurchaseOrder(poData);
                setSuppliers(suppliersData);
                setVendors(vendorsData);
                if (poData) {
                    setPrintingQty(poData.items);
                    setCuttingQty(poData.items);
                    setFinalReceivedQty(poData.items);
                }
                setIsLoading(false);
            });
        }
    }, [poId]);

    const handlePaymentChange = (setter: React.Dispatch<React.SetStateAction<Payment>>, field: keyof Payment, value: string | number) => {
        setter(prev => ({ ...prev, [field]: value }));
    };
    
    const printingDue = useMemo(() => calculateDue(printingCost, printingPayment), [printingCost, printingPayment]);
    const cuttingDue = useMemo(() => calculateDue(cuttingCost, cuttingPayment), [cuttingCost, cuttingPayment]);
    
    const supplier = useMemo(() => suppliers.find(s => s.name === purchaseOrder?.supplier), [suppliers, purchaseOrder]);

    if (isLoading) {
        return <div className="p-6">Loading Purchase Order...</div>
    }

    if (!purchaseOrder) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 items-center justify-center">
                <p>Purchase Order not found.</p>
                <Button asChild variant="outline"><Link href="/dashboard/purchases">Go Back</Link></Button>
            </div>
        );
    }

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="font-headline text-2xl font-bold">
                    Purchase Order: {purchaseOrder.id}
                </h1>
                <p className="text-muted-foreground hidden sm:block">
                    Manage and track production for this order.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/purchases">Back to List</Link>
                </Button>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Production Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center">
                {productionSteps.map((step, index) => (
                    <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center gap-2">
                        <div
                        className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full",
                            step.status === 'complete' && "bg-primary text-primary-foreground",
                            step.status === 'current' && "border-2 border-primary bg-background text-primary",
                            step.status === 'pending' && "border border-dashed bg-background text-muted-foreground"
                        )}
                        >
                        {step.status === 'complete' ? <Check className="h-6 w-6" /> : <step.icon className="h-6 w-6" />}
                        </div>
                        <p className={cn(
                            "text-sm font-medium text-center",
                            step.status === 'current' && 'text-primary',
                            step.status === 'pending' && 'text-muted-foreground'
                        )}>{step.name}</p>
                    </div>
                    {index < productionSteps.length - 1 && (
                        <div className={cn(
                            "flex-1 h-px bg-border -mx-2 mb-7",
                            step.status === 'complete' && 'bg-primary'
                        )} />
                    )}
                    </React.Fragment>
                ))}
                </div>
            </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Order Summary</CardTitle>
                        <Button variant="outline" size="sm">
                            <Printer className="mr-2 h-4 w-4" />
                            Print Invoice
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Order Date:</span>
                            <span className="font-medium">{purchaseOrder.date}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Supplier:</span>
                            <span className="font-medium">{supplier?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Fabric Cost:</span>
                            <span className="font-medium">৳{purchaseOrder.total.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium">{purchaseOrder.status}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Step 4: Delivery & Finish</CardTitle>
                        <CardDescription>Receive final goods and update inventory.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="final-qty">Final Received Quantity</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Button variant="outline" size="icon" onClick={() => setFinalReceivedQty(q => Math.max(0, q - 1))}><Minus className="h-4 w-4" /></Button>
                                <Input id="final-qty" type="number" className="text-center" value={finalReceivedQty} onChange={e => setFinalReceivedQty(Number(e.target.value) || 0)} />
                                <Button variant="outline" size="icon" onClick={() => setFinalReceivedQty(q => q + 1)}><Plus className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full">Update Stock & Complete Order</Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Step 2: Printing</CardTitle>
                            <CardDescription>Manage printing vendor and costs.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            <Printer className="mr-2 h-4 w-4" />
                            Print Invoice
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-2">
                                <Label>Printing Vendor</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a printing vendor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vendors.filter(v => v.type === 'Printing').map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="printing-qty">Quantity Received</Label>
                                <Input id="printing-qty" placeholder="0" type="number" value={printingQty || ''} onChange={e => setPrintingQty(parseFloat(e.target.value) || 0)} />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="printing-cost">Total Printing Cost</Label>
                                <Input id="printing-cost" placeholder="0.00" type="number" value={printingCost || ''} onChange={e => setPrintingCost(parseFloat(e.target.value) || 0)} />
                            </div>
                        </div>
                        
                        <PaymentSection 
                            cost={printingCost}
                            payment={printingPayment}
                            onPaymentChange={(field, value) => handlePaymentChange(setPrintingPayment, field, value)}
                            due={printingDue}
                        />
                    </CardContent>
                    <CardFooter>
                         <Button>Approve for Printing</Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Step 3: Cutting</CardTitle>
                            <CardDescription>Manage cutting vendor and costs.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            <Printer className="mr-2 h-4 w-4" />
                            Print Invoice
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-2">
                                <Label>Cutting Vendor</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a cutting vendor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vendors.filter(v => v.type === 'Cutting').map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="cutting-qty">Quantity Received</Label>
                                <Input id="cutting-qty" placeholder="0" type="number" value={cuttingQty || ''} onChange={e => setCuttingQty(parseFloat(e.target.value) || 0)} />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="cutting-cost">Total Cutting Cost</Label>
                                <Input id="cutting-cost" placeholder="0.00" type="number" value={cuttingCost || ''} onChange={e => setCuttingCost(parseFloat(e.target.value) || 0)} />
                            </div>
                        </div>
                        
                        <PaymentSection 
                            cost={cuttingCost}
                            payment={cuttingPayment}
                            onPaymentChange={(field, value) => handlePaymentChange(setCuttingPayment, field, value)}
                            due={cuttingDue}
                        />
                    </CardContent>
                    <CardFooter>
                         <Button>Approve for Cutting</Button>
                    </CardFooter>
                </Card>
                <div className="lg:col-span-3">
                  <PurchaseOrderHistory logs={purchaseOrder.logs} />
                </div>
            </div>
        </div>
    </div>
  );
}
