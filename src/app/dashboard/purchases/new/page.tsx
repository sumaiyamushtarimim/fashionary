
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

type GeneralOrderItem = {
    id: string;
    productId: string;
    variantId: string;
    quantity: number;
    unitCost: number;
    lineTotal: number;
};

type Payment = {
    cash: number;
    check: number;
    checkDate: string;
}

const initialPaymentState: Payment = { cash: 0, check: 0, checkDate: '' };
const initialOrderItemState: Omit<OrderItem, 'id' | 'lineTotal'> = { productId: '', variantId: '', productQty: 1, ornaCost: 0, jamaCost: 0, selowarCost: 0 };
const initialGeneralOrderItemState: Omit<GeneralOrderItem, 'id' | 'lineTotal'> = { productId: '', variantId: '', quantity: 1, unitCost: 0 };

type PurchaseType = 'three-piece' | 'general';


export default function NewPurchaseOrderPage() {
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('three-piece');

  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: `item-${Date.now()}`, ...initialOrderItemState, lineTotal: 0 }
  ]);
  const [generalOrderItems, setGeneralOrderItems] = useState<GeneralOrderItem[]>([
      { id: `gen-item-${Date.now()}`, ...initialGeneralOrderItemState, lineTotal: 0 }
  ]);
  
  const [fabricPayment, setFabricPayment] = useState<Payment>(initialPaymentState);
  const [generalPayment, setGeneralPayment] = useState<Payment>(initialPaymentState);

  const fabricBillSummary = useMemo(() => {
    let totalOrnaYards = 0;
    let totalJamaYards = 0;
    let totalSelowarYards = 0;
    let totalOrnaCost = 0;
    let totalJamaCost = 0;
    let totalSelowarCost = 0;

    orderItems.forEach(item => {
        const ornaFabricPerProduct = 2.5; 
        const jamaFabricPerProduct = 3.0; 
        const selowarFabricPerProduct = 2.0;

        const qty = Number(item.productQty) || 0;
        const ornaYards = qty * ornaFabricPerProduct;
        const jamaYards = qty * jamaFabricPerProduct;
        const selowarYards = qty * selowarFabricPerProduct;

        totalOrnaYards += ornaYards;
        totalJamaYards += jamaYards;
        totalSelowarYards += selowarYards;

        totalOrnaCost += ornaYards * (Number(item.ornaCost) || 0);
        totalJamaCost += jamaYards * (Number(item.jamaCost) || 0);
        totalSelowarCost += selowarYards * (Number(item.selowarCost) || 0);
    });
    
    const grandTotalYards = totalOrnaYards + totalJamaYards + totalSelowarYards;
    const grandTotalCost = totalOrnaCost + totalJamaCost + totalSelowarCost;

    return {
        totalOrnaYards,
        totalJamaYards,
        totalSelowarYards,
        totalOrnaCost,
        totalJamaCost,
        totalSelowarCost,
        grandTotalYards,
        grandTotalCost,
    };
  }, [orderItems]);
  
  const generalBillSummary = useMemo(() => {
      return generalOrderItems.reduce((acc, item) => acc + item.lineTotal, 0);
  }, [generalOrderItems]);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { id: `item-${Date.now()}`, ...initialOrderItemState, lineTotal: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };
  
  const handleAddGeneralItem = () => {
      setGeneralOrderItems([...generalOrderItems, {id: `gen-item-${Date.now()}`, ...initialGeneralOrderItemState, lineTotal: 0}]);
  };
  
  const handleRemoveGeneralItem = (id: string) => {
      setGeneralOrderItems(generalOrderItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof Omit<OrderItem, 'id' | 'lineTotal'>, value: string | number) => {
    setOrderItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
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

  const handleGeneralItemChange = (id: string, field: keyof Omit<GeneralOrderItem, 'id' | 'lineTotal'>, value: string | number) => {
    setGeneralOrderItems(prevItems => prevItems.map(item => {
        if (item.id === id) {
            let updatedItem = { ...item, [field]: value };

            const lineTotal = (Number(updatedItem.quantity) || 0) * (Number(updatedItem.unitCost) || 0);
            return { ...updatedItem, lineTotal };
        }
        return item;
    }));
  };

  const handlePaymentChange = (setter: React.Dispatch<React.SetStateAction<Payment>>, field: keyof Payment, value: string | number) => {
    setter(prev => ({ ...prev, [field]: value }));
  };

  const calculateDue = (totalCost: number, payment: Payment) => {
    const paid = (Number(payment.cash) || 0) + (Number(payment.check) || 0);
    return totalCost - paid;
  };
  
  const fabricDue = useMemo(() => calculateDue(fabricBillSummary.grandTotalCost, fabricPayment), [fabricBillSummary.grandTotalCost, fabricPayment]);
  const generalDue = useMemo(() => calculateDue(generalBillSummary, generalPayment), [generalBillSummary, generalPayment]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold">
            Create New Purchase Order
          </h1>
          <p className="text-muted-foreground">
            Start a new production batch or purchase ready-made goods.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
                <Link href="/dashboard/purchases">Cancel</Link>
            </Button>
            <Button>Create Purchase Order</Button>
        </div>
      </div>

       <Card>
          <CardHeader>
              <CardTitle>Purchase Type</CardTitle>
          </CardHeader>
          <CardContent>
               <RadioGroup defaultValue={purchaseType} onValueChange={(value: PurchaseType) => setPurchaseType(value)} className="flex flex-col sm:flex-row gap-4">
                  <Label htmlFor="three-piece" className="flex flex-col items-start gap-3 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary flex-1 cursor-pointer">
                      <RadioGroupItem value="three-piece" id="three-piece" />
                      <div className="font-bold">Three-Piece Production</div>
                      <p className="text-sm text-muted-foreground">
                          Order raw fabric for manufacturing three-piece suits. Calculates fabric needs based on product specifications.
                      </p>
                  </Label>
                  <Label htmlFor="general" className="flex flex-col items-start gap-3 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary flex-1 cursor-pointer">
                      <RadioGroupItem value="general" id="general" />
                       <div className="font-bold">General Purchase</div>
                      <p className="text-sm text-muted-foreground">
                         Purchase ready-made products directly from a supplier. Ideal for items that do not require production.
                      </p>
                  </Label>
              </RadioGroup>
          </CardContent>
      </Card>


        {purchaseType === 'three-piece' && (
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
                                            <TableHead className="text-right">Line Total</TableHead>
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
                                                <TableCell className="font-medium text-right font-mono">৳{item.lineTotal.toFixed(2)}</TableCell>
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Fabric Bill</CardTitle>
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
                                <Label>Send to Printing Vendor</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a printing vendor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vendors.filter(v => v.type === 'Printing').map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                            <div className="space-y-2 text-sm">
                                <Label className="font-medium">Bill Summary</Label>
                                <div className="grid grid-cols-3 gap-x-4 gap-y-1 p-2 rounded-md bg-muted/50">
                                    <div className="font-medium">Part</div>
                                    <div className="font-medium text-right">Total Yards</div>
                                    <div className="font-medium text-right">Total Cost</div>

                                    <div>Orna</div>
                                    <div className="text-right">{fabricBillSummary.totalOrnaYards.toFixed(2)} yds</div>
                                    <div className="text-right font-mono">৳{fabricBillSummary.totalOrnaCost.toFixed(2)}</div>

                                    <div>Jama</div>
                                    <div className="text-right">{fabricBillSummary.totalJamaYards.toFixed(2)} yds</div>
                                    <div className="text-right font-mono">৳{fabricBillSummary.totalJamaCost.toFixed(2)}</div>
                                    
                                    <div>Selowar</div>
                                    <div className="text-right">{fabricBillSummary.totalSelowarYards.toFixed(2)} yds</div>
                                    <div className="text-right font-mono">৳{fabricBillSummary.totalSelowarCost.toFixed(2)}</div>

                                    <div className="col-span-3"><Separator className="my-1"/></div>
                                    
                                    <div className="font-bold">Grand Total</div>
                                    <div className="font-bold text-right">{fabricBillSummary.grandTotalYards.toFixed(2)} yds</div>
                                    <div className="font-bold text-right font-mono">৳{fabricBillSummary.grandTotalCost.toFixed(2)}</div>
                                </div>
                            </div>
                            <Separator />
                            <Label className="font-medium">Payment</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cash-fabric">Cash Amount</Label>
                                    <Input id="cash-fabric" placeholder="0.00" type="number" value={fabricPayment.cash || ''} onChange={e => handlePaymentChange(setFabricPayment, 'cash', parseFloat(e.target.value) || 0)} disabled={fabricBillSummary.grandTotalCost > 0 && fabricBillSummary.grandTotalCost === fabricPayment.check} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="check-fabric">Check Amount</Label>
                                    <Input id="check-fabric" placeholder="0.00" type="number" value={fabricPayment.check || ''} onChange={e => handlePaymentChange(setFabricPayment, 'check', parseFloat(e.target.value) || 0)} disabled={fabricBillSummary.grandTotalCost > 0 && fabricBillSummary.grandTotalCost === fabricPayment.cash} />
                                </div>
                            </div>
                            {(Number(fabricPayment.check) || 0) > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="check-date-fabric">Check Passing Date</Label>
                                    <Input id="check-date-fabric" type="date" value={fabricPayment.checkDate} onChange={e => handlePaymentChange(setFabricPayment, 'checkDate', e.target.value)} />
                                </div>
                            )}
                            <Separator />
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Bill:</span>
                                    <span className="font-medium font-mono">৳{fabricBillSummary.grandTotalCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Paid:</span>
                                    <span className="font-medium font-mono">৳{((Number(fabricPayment.cash) || 0) + (Number(fabricPayment.check) || 0)).toFixed(2)}</span>
                                </div>
                                 <div className="flex justify-between font-semibold">
                                    <span className={fabricDue > 0 ? "text-destructive" : ""}>Due Amount:</span>
                                    <span className={fabricDue > 0 ? "text-destructive font-mono" : "font-mono"}>৳{fabricDue.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )}

        {purchaseType === 'general' && (
             <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-4">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Purchase Details</CardTitle>
                            <CardDescription>Add the ready-made products you are purchasing.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[200px]">Product</TableHead>
                                        <TableHead className="min-w-[150px]">Variant</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Unit Cost</TableHead>
                                        <TableHead className="text-right">Line Total</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {generalOrderItems.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Select value={item.productId} onValueChange={(value) => handleGeneralItemChange(item.id, 'productId', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Product" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Select value={item.variantId} onValueChange={(value) => handleGeneralItemChange(item.id, 'variantId', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Variant" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {/* This should be populated based on the selected product */}
                                                        <SelectItem value="s">Small</SelectItem>
                                                        <SelectItem value="m">Medium</SelectItem>
                                                        <SelectItem value="l">Large</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input type="number" placeholder="Qty" className="w-24" value={item.quantity || ''} onChange={e => handleGeneralItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)} />
                                            </TableCell>
                                            <TableCell>
                                                <Input type="number" placeholder="Cost" className="w-24" value={item.unitCost || ''} onChange={e => handleGeneralItemChange(item.id, 'unitCost', parseFloat(e.target.value) || 0)} />
                                            </TableCell>
                                            <TableCell className="text-right font-mono">৳{item.lineTotal.toFixed(2)}</TableCell>
                                            <TableCell>
                                                 {generalOrderItems.length > 1 && (
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveGeneralItem(item.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                             <Button variant="outline" size="sm" onClick={handleAddGeneralItem} className="mt-4 max-w-fit">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Item
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                 <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Purchase Bill</CardTitle>
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
                            <Separator />
                            <Label className="font-medium">Payment</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cash-general">Cash Amount</Label>
                                    <Input id="cash-general" placeholder="0.00" type="number" value={generalPayment.cash || ''} onChange={e => handlePaymentChange(setGeneralPayment, 'cash', parseFloat(e.target.value) || 0)} disabled={generalBillSummary > 0 && generalBillSummary === generalPayment.check} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="check-general">Check Amount</Label>
                                    <Input id="check-general" placeholder="0.00" type="number" value={generalPayment.check || ''} onChange={e => handlePaymentChange(setGeneralPayment, 'check', parseFloat(e.target.value) || 0)} disabled={generalBillSummary > 0 && generalBillSummary === generalPayment.cash} />
                                </div>
                            </div>
                            {(Number(generalPayment.check) || 0) > 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="check-date-general">Check Passing Date</Label>
                                    <Input id="check-date-general" type="date" value={generalPayment.checkDate} onChange={e => handlePaymentChange(setGeneralPayment, 'checkDate', e.target.value)} />
                                </div>
                            )}
                            <Separator />
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between font-semibold">
                                    <span className="text-muted-foreground">Total Bill:</span>
                                    <span className="font-bold font-mono text-lg">৳{generalBillSummary.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Paid:</span>
                                    <span className="font-medium font-mono">৳{((Number(generalPayment.cash) || 0) + (Number(generalPayment.check) || 0)).toFixed(2)}</span>
                                </div>
                                 <div className="flex justify-between font-semibold">
                                    <span className={generalDue > 0 ? "text-destructive" : ""}>Due Amount:</span>
                                    <span className={generalDue > 0 ? "text-destructive font-mono" : "font-mono"}>৳{generalDue.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )}
    </div>
  );
}
