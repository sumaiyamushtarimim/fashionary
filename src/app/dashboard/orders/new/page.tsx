

'use client';

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Store, Globe, Save, PackageSearch, Loader2 } from "lucide-react";
import { OrderPlatform, PaymentMethod, bdDistricts } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { getProducts } from "@/services/products";
import { getBusinesses } from "@/services/partners";
import { getDeliveryReport, type DeliveryReport } from '@/services/delivery-score';
import { Skeleton } from "@/components/ui/skeleton";
import type { Product, Business, OrderProduct } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type OrderItem = {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    name: string;
    image: OrderProduct['image'];
};

const allPlatforms: OrderPlatform[] = ['TikTok', 'Messenger', 'Facebook', 'Instagram', 'Website'];
const allPaymentMethods: PaymentMethod[] = ['Cash on Delivery', 'bKash', 'Nagad'];

function CourierReport({ report, isLoading }: { report: DeliveryReport | null, isLoading: boolean }) {
     const courierStatsData = useMemo(() => {
        if (!report || !report.Summaries) return [];
        return Object.entries(report.Summaries).map(([name, data]) => ({
            name,
            total: data["Total Parcels"] || data["Total Delivery"] || 0,
            delivered: data["Delivered Parcels"] || data["Successful Delivery"] || 0,
            canceled: data["Canceled Parcels"] || data["Canceled Delivery"] || 0,
        }));
    }, [report]);

    const { totalParcels, totalDelivered, totalCanceled } = useMemo(() => {
        return courierStatsData.reduce((acc, courier) => {
            acc.totalParcels += courier.total;
            acc.totalDelivered += courier.delivered;
            acc.totalCanceled += courier.canceled;
            return acc;
        }, { totalParcels: 0, totalDelivered: 0, totalCanceled: 0 });
    }, [courierStatsData]);

    const deliveryRatio = totalParcels > 0 ? (totalDelivered / totalParcels) * 100 : 0;
    const cancelRatio = totalParcels > 0 ? (totalCanceled / totalParcels) * 100 : 0;

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Courier Delivery Report</CardTitle>
                    <CardDescription>Fetching delivery history...</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (!report) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Courier Delivery Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-4 flex flex-col items-center gap-2">
                        <PackageSearch className="w-8 h-8" />
                        <span>Enter a valid phone number to see the report.</span>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Courier Delivery Report</CardTitle>
                <CardDescription>
                    Parcel history for the entered phone number.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {courierStatsData.length > 0 ? (
                    <>
                        <div className="grid grid-cols-4 gap-x-4 border-b pb-2 text-xs font-medium text-muted-foreground">
                            <div className="col-span-1">Courier</div>
                            <div className="col-span-1 text-center">Total</div>
                            <div className="col-span-1 text-center">Delivered</div>
                            <div className="col-span-1 text-center">Canceled</div>
                        </div>
                        {courierStatsData.map(courier => (
                            <div key={courier.name} className="grid grid-cols-4 gap-x-4 items-center text-sm">
                                <div className="col-span-1 font-semibold">{courier.name}</div>
                                <div className="col-span-1 text-center font-medium">{courier.total}</div>
                                <div className="col-span-1 text-center font-medium text-green-600">{courier.delivered}</div>
                                <div className="col-span-1 text-center font-medium text-red-500">{courier.canceled}</div>
                            </div>
                        ))}
                        <Separator />
                        <div className="grid grid-cols-4 gap-x-4 items-center text-sm font-bold">
                            <div className="col-span-1">Total</div>
                            <div className="col-span-1 text-center">{totalParcels}</div>
                            <div className="col-span-1 text-center text-green-600">{totalDelivered}</div>
                            <div className="col-span-1 text-center text-red-500">{totalCanceled}</div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-green-500 h-2.5 rounded-l-full" style={{ width: `${deliveryRatio}%`, display: 'inline-block' }}></div>
                                <div className="bg-red-500 h-2.5 rounded-r-full" style={{ width: `${cancelRatio}%`, display: 'inline-block' }}></div>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    <span>Delivery: <strong>{deliveryRatio.toFixed(1)}%</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                    <span>Cancel: <strong>{cancelRatio.toFixed(1)}%</strong></span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-muted-foreground py-4">No courier data found for this number.</div>
                )}
            </CardContent>
        </Card>
    );
}

export default function NewOrderPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerDistrict, setCustomerDistrict] = useState('');

    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [shippingCost, setShippingCost] = useState<number>(0);
    
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
    const [paidAmount, setPaidAmount] = useState<number>(0);

    const [customerNote, setCustomerNote] = useState('');
    const [officeNote, setOfficeNote] = useState('');
    const [businessId, setBusinessId] = useState<string>('');
    const [platform, setPlatform] = useState<OrderPlatform>();

    const [deliveryReport, setDeliveryReport] = useState<DeliveryReport | null>(null);
    const [isReportLoading, setIsReportLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            getProducts(),
            getBusinesses()
        ]).then(([productsData, businessesData]) => {
            setAllProducts(productsData);
            setBusinesses(businessesData);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (customerPhone && customerPhone.length >= 11) {
                setIsReportLoading(true);
                getDeliveryReport(customerPhone)
                    .then(report => {
                        setDeliveryReport(report);
                    })
                    .finally(() => {
                        setIsReportLoading(false);
                    });
            } else {
                setDeliveryReport(null);
            }
        }, 500); // Debounce API call

        return () => {
            clearTimeout(handler);
        };
    }, [customerPhone]);


    const subtotal = useMemo(() => {
        return orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [orderItems]);

    const tax = useMemo(() => subtotal * 0.08, [subtotal]);
    const total = useMemo(() => subtotal + shippingCost + tax, [subtotal, shippingCost, tax]);
    const dueAmount = useMemo(() => total - paidAmount, [total, paidAmount]);

    const handleAddItem = () => {
        const defaultProduct = allProducts[0];
        if (!defaultProduct) return;
        setOrderItems(prev => [
            ...prev,
            {
                id: `new-item-${Date.now()}`,
                productId: defaultProduct.id,
                quantity: 1,
                price: defaultProduct.price,
                name: defaultProduct.name,
                image: defaultProduct.image,
            }
        ]);
    };

    const handleItemChange = (itemId: string, field: 'productId' | 'quantity', value: string | number) => {
        setOrderItems(prev => prev.map(item => {
            if (item.id === itemId) {
                if (field === 'productId') {
                    const newProduct = allProducts.find(p => p.id === value);
                    if (!newProduct) return item;
                    return { ...item, productId: newProduct.id, name: newProduct.name, price: newProduct.price, image: newProduct.image };
                }
                if (field === 'quantity') {
                    return { ...item, quantity: Math.max(1, Number(value)) };
                }
            }
            return item;
        }));
    };
    
    const handleRemoveItem = (itemId: string) => {
        setOrderItems(prev => prev.filter(item => item.id !== itemId));
    };

    const handleCreateOrder = () => {
        setIsCreating(true);
        // Simulate API call
        setTimeout(() => {
            setIsCreating(false);
            toast({
                title: "Order Created",
                description: "The new order has been successfully created.",
            });
            router.push('/dashboard/orders');
        }, 2000);
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-headline text-2xl font-bold">Create New Order</h1>
                    <p className="text-muted-foreground hidden sm:block">Fill in the details to create a new customer order.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild><Link href="/dashboard/orders">Cancel</Link></Button>
                    <Button onClick={handleCreateOrder} disabled={isCreating}>
                        {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isCreating ? 'Creating Order...' : 'Create Order'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-4">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[250px]">Product</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead><span className="sr-only">Remove</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderItems.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Select value={item.productId} onValueChange={(value) => handleItemChange(item.id, 'productId', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a product" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {allProducts.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} className="w-20" />
                                            </TableCell>
                                            <TableCell className="text-right font-mono">৳{item.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-mono">৳{(item.price * item.quantity).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Button variant="outline" size="sm" onClick={handleAddItem} className="mt-4">
                                <PlusCircle className="h-4 w-4 mr-2" /> Add Product
                            </Button>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Payment & Shipping</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-mono">৳{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <Input type="number" value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value))} className="w-24 h-8 text-right" />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax (8%)</span>
                                    <span className="font-mono">৳{tax.toFixed(2)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="font-mono">৳{total.toFixed(2)}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label htmlFor="payment-method">Payment Method</Label>
                                <Select value={paymentMethod} onValueChange={(v: PaymentMethod) => setPaymentMethod(v)}>
                                    <SelectTrigger id="payment-method">
                                        <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allPaymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="paid-amount">Paid Amount (Advance)</Label>
                                <Input id="paid-amount" type="number" value={paidAmount || ''} onChange={(e) => setPaidAmount(Number(e.target.value))} placeholder="0.00"/>
                            </div>
                             <div className="flex justify-between font-semibold text-base mt-4">
                                <span className={cn(dueAmount > 0 && "text-destructive")}>Due Amount</span>
                                <span className={cn("font-mono", dueAmount > 0 && "text-destructive")}>৳{dueAmount.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="customer-note">Customer Note</Label>
                                <Textarea id="customer-note" value={customerNote} onChange={(e) => setCustomerNote(e.target.value)} placeholder="Notes visible to the customer..." />
                            </div>
                            <div>
                                <Label htmlFor="office-note">Office Note (Internal)</Label>
                                <Textarea id="office-note" value={officeNote} onChange={(e) => setOfficeNote(e.target.value)} placeholder="Internal notes for the team..." />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="customer-name">Name</Label>
                                <Input id="customer-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter customer's name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customer-phone">Phone Number</Label>
                                <Input id="customer-phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Phone number (used to find existing customer)" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="customer-address">Address</Label>
                                <Textarea id="customer-address" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Enter full delivery address" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="customer-district">District</Label>
                                     <Select value={customerDistrict} onValueChange={setCustomerDistrict}>
                                        <SelectTrigger id="customer-district">
                                            <SelectValue placeholder="Select District" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {bdDistricts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="customer-country">Country</Label>
                                    <Input id="customer-country" value="Bangladesh" disabled />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <CourierReport report={deliveryReport} isLoading={isReportLoading} />
                    
                     <Card>
                        <CardHeader>
                            <CardTitle>Order Source</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="space-y-2">
                                <Label>Business</Label>
                                <Select value={businessId} onValueChange={setBusinessId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a business" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {businesses.map(b => (
                                            <SelectItem key={b.id} value={b.id}>
                                                <div className="flex items-center gap-2">
                                                    <Store className="h-4 w-4 text-muted-foreground" />
                                                    <span>{b.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Platform</Label>
                                <Select value={platform} onValueChange={(v: OrderPlatform) => setPlatform(v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allPlatforms.map(p => (
                                            <SelectItem key={p} value={p}>
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                                    <span>{p}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                   
                </div>
            </div>
        </div>
    );
}
