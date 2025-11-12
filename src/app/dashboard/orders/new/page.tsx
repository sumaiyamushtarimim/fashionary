
'use client';

import { useState, useMemo } from "react";
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
import { PlusCircle, Trash2, Store, Globe, Save } from "lucide-react";
import { customers, products, businesses, OrderPlatform, OrderProduct } from "@/lib/placeholder-data";

type OrderItem = {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    name: string;
    image: OrderProduct['image'];
};

type Payment = {
    cash: number;
    check: number;
};

const allPlatforms: OrderPlatform[] = ['TikTok', 'Messenger', 'Facebook', 'Instagram', 'Website'];

export default function NewOrderPage() {
    const [customerId, setCustomerId] = useState<string>('');
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [payment, setPayment] = useState<Payment>({ cash: 0, check: 0 });
    const [customerNote, setCustomerNote] = useState('');
    const [officeNote, setOfficeNote] = useState('');
    const [businessId, setBusinessId] = useState<string>('');
    const [platform, setPlatform] = useState<OrderPlatform>();

    const subtotal = useMemo(() => {
        return orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [orderItems]);

    const tax = useMemo(() => subtotal * 0.08, [subtotal]);
    const total = useMemo(() => subtotal + shippingCost + tax, [subtotal, shippingCost, tax]);
    const dueAmount = useMemo(() => total - (payment.cash + payment.check), [total, payment]);

    const handleAddItem = () => {
        const defaultProduct = products[0];
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
                    const newProduct = products.find(p => p.id === value);
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

    const handlePaymentChange = (field: keyof Payment, value: number) => {
        setPayment(prev => ({...prev, [field]: value}));
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-headline text-2xl font-bold">Create New Order</h1>
                    <p className="text-muted-foreground">Fill in the details to create a new customer order.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild><Link href="/dashboard/orders">Cancel</Link></Button>
                    <Button><Save className="mr-2 h-4 w-4" /> Create Order</Button>
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
                                                        {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} className="w-20" />
                                            </TableCell>
                                            <TableCell className="text-right font-mono">${item.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-mono">${(item.price * item.quantity).toFixed(2)}</TableCell>
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
                            <CardTitle>Customer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select value={customerId} onValueChange={setCustomerId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

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

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment & Shipping</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <Input type="number" value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value))} className="w-24 h-8 text-right" />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax (8%)</span>
                                    <span className="font-mono">${tax.toFixed(2)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="font-mono">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <Separator />
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cash-payment">Cash</Label>
                                    <Input id="cash-payment" type="number" value={payment.cash || ''} onChange={(e) => handlePaymentChange('cash', Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="check-payment">Check</Label>
                                    <Input id="check-payment" type="number" value={payment.check || ''} onChange={(e) => handlePaymentChange('check', Number(e.target.value))} />
                                </div>
                            </div>
                             <div className="flex justify-between font-semibold text-base">
                                <span className={cn(dueAmount > 0 && "text-destructive")}>Due</span>
                                <span className={cn("font-mono", dueAmount > 0 && "text-destructive")}>${dueAmount.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
