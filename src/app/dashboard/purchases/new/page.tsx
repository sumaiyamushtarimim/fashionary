'use client';

import { useState, useMemo, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2 } from "lucide-react";
import { products, suppliers, vendors } from "@/lib/placeholder-data";
import Link from "next/link";

type OrderItem = {
    id: string;
    productId: string;
    variantId: string;
    productQty: number;
    ornaCost: number;
    jamaCost: number;
    selowarCost: number;
    lineTotal: number;
};

type Payment = {
    cash: number;
    check: number;
    checkDate: string;
}

const initialPaymentState: Payment = { cash: 0, check: 0, checkDate: '' };
const initialOrderItemState: Omit<OrderItem, 'id' | 'lineTotal'> = { productId: '', variantId: '', productQty: 1, ornaCost: 0, jamaCost: 0, selowarCost: 0 };


export default function NewPurchaseOrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: `item-${Date.now()}`, ...initialOrderItemState, lineTotal: 0 }
  ]);
  
  const [fabricCost, setFabricCost] = useState(0);
  const [fabricPayment, setFabricPayment] = useState<Payment>(initialPaymentState);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { id: `item-${Date.now()}`, ...initialOrderItemState, lineTotal: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof Omit<OrderItem, 'id' | 'lineTotal'>, value: string | number) => {
    setOrderItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // These fabric consumption values would come from the selected product's data in a real scenario
        const ornaFabric = 2.5; 
        const jamaFabric = 3.0; 
        const selowarFabric = 2.0;

        const { productQty, ornaCost, jamaCost, selowarCost } = updatedItem;
        
        const ornaTotal = (Number(productQty) || 0) * ornaFabric * (Number(ornaCost) || 0);
        const jamaTotal = (Number(productQty) || 0) * jamaFabric * (Number(jamaCost) || 0);
        const selowarTotal = (Number(productQty) || 0) * selowarFabric * (Number(selowarCost) || 0);

        const lineTotal = ornaTotal + jamaTotal + selowarTotal;
        return { ...updatedItem, lineTotal };
      }
      return item;
    }));
  };
  
  useEffect(() => {
    const totalFabricCost = orderItems.reduce((total, item) => total + item.lineTotal, 0);
    setFabricCost(totalFabricCost);
  }, [orderItems]);


  const handlePaymentChange = (setter: React.Dispatch<React.SetStateAction<Payment>>, field: keyof Payment, value: string | number) => {
    setter(prev => ({ ...prev, [field]: value }));
  };

  const calculateDue = (totalCost: number, payment: Payment) => {
    const paid = (Number(payment.cash) || 0) + (Number(payment.check) || 0);
    return totalCost - paid;
  };
  
  const fabricDue = useMemo(() => calculateDue(fabricCost, fabricPayment), [fabricCost, fabricPayment]);

  const renderPaymentCard = (
    title: string, 
    totalCost: number, 
    payment: Payment, 
    handlePaymentChange: (field: keyof Payment, value: string | number) => void,
    dueAmount: number,
    vendorType: 'supplier'
  ) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-2">
            <Label>Supplier</Label>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                    {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label>Total Cost</Label>
            <Input placeholder="0.00" type="number" value={totalCost || ''} readOnly />
        </div>
        <Separator />
        <Label className="font-medium">Payment</Label>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor={`cash-${vendorType}`}>Cash Amount</Label>
                <Input id={`cash-${vendorType}`} placeholder="0.00" type="number" value={payment.cash || ''} onChange={e => handlePaymentChange('cash', parseFloat(e.target.value) || 0)} disabled={totalCost > 0 && totalCost === payment.check} />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`check-${vendorType}`}>Check Amount</Label>
                <Input id={`check-${vendorType}`} placeholder="0.00" type="number" value={payment.check || ''} onChange={e => handlePaymentChange('check', parseFloat(e.target.value) || 0)} disabled={totalCost > 0 && totalCost === payment.cash} />
            </div>
        </div>
        {(Number(payment.check) || 0) > 0 && (
            <div className="space-y-2">
                <Label htmlFor={`check-date-${vendorType}`}>Check Passing Date</Label>
                <Input id={`check-date-${vendorType}`} type="date" value={payment.checkDate} onChange={e => handlePaymentChange('checkDate', e.target.value)} />
            </div>
        )}
        <Separator />
        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Total Cost:</span>
                <span className="font-medium">${totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Paid:</span>
                <span className="font-medium">${((Number(payment.cash) || 0) + (Number(payment.check) || 0)).toFixed(2)}</span>
            </div>
             <div className="flex justify-between font-semibold">
                <span className={dueAmount > 0 ? "text-destructive" : ""}>Due Amount:</span>
                <span className={dueAmount > 0 ? "text-destructive" : ""}>${dueAmount.toFixed(2)}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold">
            Create New Purchase Order
          </h1>
          <p className="text-muted-foreground">
            Create a new production batch by ordering fabric.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
                <Link href="/dashboard/purchases">Cancel</Link>
            </Button>
            <Button>Create Purchase Order</Button>
        </div>
      </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-4">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Fabric Order Details</CardTitle>
                        <CardDescription>Select products and specify fabric costs. The system will calculate fabric quantity based on product data.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[200px]">Product</TableHead>
                                        <TableHead className="min-w-[150px]">Variant</TableHead>
                                        <TableHead>Product Qty</TableHead>
                                        <TableHead>Orna Cost/yd</TableHead>
                                        <TableHead>Jama Cost/yd</TableHead>
                                        <TableHead>Selowar Cost/yd</TableHead>
                                        <TableHead>Line Total</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderItems.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Select onValueChange={(value) => handleItemChange(item.id, 'productId', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Product" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Select onValueChange={(value) => handleItemChange(item.id, 'variantId', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Variant" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="s">Small</SelectItem>
                                                        <SelectItem value="m">Medium</SelectItem>
                                                        <SelectItem value="l">Large</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input type="number" placeholder="Qty" className="w-24" value={item.productQty || ''} onChange={(e) => handleItemChange(item.id, 'productQty', parseFloat(e.target.value) || 0)} />
                                            </TableCell>
                                            <TableCell>
                                                <Input type="number" placeholder="Cost" className="w-24" value={item.ornaCost || ''} onChange={(e) => handleItemChange(item.id, 'ornaCost', parseFloat(e.target.value) || 0)} />
                                            </TableCell>
                                            <TableCell>
                                                <Input type="number" placeholder="Cost" className="w-24" value={item.jamaCost || ''} onChange={(e) => handleItemChange(item.id, 'jamaCost', parseFloat(e.target.value) || 0)}/>
                                            </TableCell>
                                            <TableCell>
                                                <Input type="number" placeholder="Cost" className="w-24" value={item.selowarCost || ''} onChange={(e) => handleItemChange(item.id, 'selowarCost', parseFloat(e.target.value) || 0)}/>
                                            </TableCell>
                                            <TableCell className="font-medium">${item.lineTotal.toFixed(2)}</TableCell>
                                            <TableCell>
                                                {orderItems.length > 1 && (
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleAddItem} className="mt-4 max-w-fit">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8">
                {renderPaymentCard("Fabric Bill", fabricCost, fabricPayment, (field, value) => handlePaymentChange(setFabricPayment, field, value), fabricDue, 'supplier')}
            </div>
        </div>
    </div>
  );
}
