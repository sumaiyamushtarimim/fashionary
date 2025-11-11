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
import { CheckCircle, Circle, PlusCircle, Trash2 } from "lucide-react";
import { products, suppliers, vendors } from "@/lib/placeholder-data";

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
  const [currentStep, setCurrentStep] = useState(0);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: `item-${Date.now()}`, ...initialOrderItemState, lineTotal: 0 }
  ]);
  
  const [fabricCost, setFabricCost] = useState(0);
  const [printingCost, setPrintingCost] = useState(0);
  const [cuttingCost, setCuttingCost] = useState(0);

  const [fabricPayment, setFabricPayment] = useState<Payment>(initialPaymentState);
  const [printingPayment, setPrintingPayment] = useState<Payment>(initialPaymentState);
  const [cuttingPayment, setCuttingPayment] = useState<Payment>(initialPaymentState);

  const steps = [
    { name: "Fabric Order" },
    { name: "Printing" },
    { name: "Cutting" },
    { name: "Delivery & Finish" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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
        
        const selectedProduct = products.find(p => p.id === updatedItem.productId);
        const ornaFabric = 2.5; // placeholder, would come from selectedProduct.ornaFabric
        const jamaFabric = 3.0; // placeholder, would come from selectedProduct.jamaFabric
        const selowarFabric = 2.0; // placeholder, would come from selectedProduct.selowarFabric


        const { productQty, ornaCost, jamaCost, selowarCost } = updatedItem;
        
        const ornaTotal = productQty * ornaFabric * ornaCost;
        const jamaTotal = productQty * jamaFabric * jamaCost;
        const selowarTotal = productQty * selowarFabric * selowarCost;

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
  const printingDue = useMemo(() => calculateDue(printingCost, printingPayment), [printingCost, printingPayment]);
  const cuttingDue = useMemo(() => calculateDue(cuttingCost, cuttingPayment), [cuttingCost, cuttingPayment]);

  const renderPaymentCard = (
    title: string, 
    totalCost: number, 
    setTotalCost: ((value: number) => void) | null,
    payment: Payment, 
    handlePaymentChange: (field: keyof Payment, value: string | number) => void,
    dueAmount: number,
    vendorType: 'supplier' | 'printing' | 'cutting'
  ) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-2">
            <Label>{vendorType === 'supplier' ? 'Supplier' : vendorType === 'printing' ? 'Printing Vendor' : 'Cutting Vendor'}</Label>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select a vendor" />
                </SelectTrigger>
                <SelectContent>
                    {vendorType === 'supplier' && suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    {vendorType === 'printing' && vendors.filter(v => v.type === 'Printing').map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                    {vendorType === 'cutting' && vendors.filter(v => v.type === 'Cutting').map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label>Total Cost</Label>
            <Input placeholder="0.00" type="number" value={totalCost || ''} onChange={e => setTotalCost ? setTotalCost(parseFloat(e.target.value) || 0) : null} readOnly={!setTotalCost} />
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
        {payment.check > 0 && (
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
            Follow the steps to create a new production batch.
          </p>
        </div>
        <Button variant="outline">Save Draft</Button>
      </div>

      <nav aria-label="Progress">
        <ol
          role="list"
          className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
        >
          {steps.map((step, stepIdx) => {
            const status = currentStep > stepIdx ? 'complete' : currentStep === stepIdx ? 'current' : 'upcoming';
            return (
                <li key={step.name} className="relative md:flex md:flex-1">
                <div className={`group flex w-full items-center`}>
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                        <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                            status === 'current' ? 'border-primary' : 
                            status === 'complete' ? 'border-primary bg-primary' : 'border-gray-300'
                        }`}>
                        {status === 'complete' ? <CheckCircle className="h-6 w-6 text-white" /> : 
                         status === 'current' ? <span className="text-primary">{`0${stepIdx + 1}`}</span> :
                         <span className="text-gray-500">{`0${stepIdx + 1}`}</span>
                        }
                        </span>
                        <span className={`ml-4 text-sm font-medium ${
                            status === 'current' ? 'text-primary' : 
                            status === 'complete' ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                        {step.name}
                        </span>
                    </span>
                    </div>
                {stepIdx !== steps.length - 1 ? (
                    <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                        <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                        <path d="M0.5 0H22L0.5 80H0.5V0Z" fill="currentColor" />
                        </svg>
                    </div>
                ) : null}
                </li>
            )
          })}
        </ol>
      </nav>

        {currentStep === 0 && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fabric Order Details</CardTitle>
                            <CardDescription>Select products and specify fabric costs. Quantity will be used to calculate total fabric needed.</CardDescription>
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
                    {renderPaymentCard("Fabric Bill", fabricCost, null, fabricPayment, (field, value) => handlePaymentChange(setFabricPayment, field, value), fabricDue, 'supplier')}
                </div>
            </div>
        )}

        {currentStep === 1 && (
             <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                            <CardDescription>Review of the products in this purchase order.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Variant</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderItems.map(item => {
                                        const product = products.find(p => p.id === item.productId);
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell>{product?.name || 'N/A'}</TableCell>
                                                <TableCell>{item.variantId.toUpperCase()}</TableCell>
                                                <TableCell className="text-right">{item.productQty}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                    {renderPaymentCard("Printing Cost", printingCost, setPrintingCost, printingPayment, (field, value) => handlePaymentChange(setPrintingPayment, field, value), printingDue, 'printing')}
                </div>
            </div>
        )}

        {currentStep === 2 && (
             <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-8">
                 <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                            <CardDescription>Review of the products in this purchase order.</CardDescription>
                        </CardHeader>
                         <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Variant</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderItems.map(item => {
                                        const product = products.find(p => p.id === item.productId);
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell>{product?.name || 'N/A'}</TableCell>
                                                <TableCell>{item.variantId.toUpperCase()}</TableCell>
                                                <TableCell className="text-right">{item.productQty}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                    {renderPaymentCard("Cutting Cost", cuttingCost, setCuttingCost, cuttingPayment, (field, value) => handlePaymentChange(setCuttingPayment, field, value), cuttingDue, 'cutting')}
                </div>
            </div>
        )}
        
        {currentStep === 3 && (
            <div className="mt-8">
                 <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Delivery & Finish</CardTitle>
                        <CardDescription>Confirm the final received quantities to update your inventory.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Variant</TableHead>
                                    <TableHead>Ordered Qty</TableHead>
                                    <TableHead>Received Qty</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                 {orderItems.map(item => {
                                    const product = products.find(p => p.id === item.productId);
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>{product?.name || 'N/A'}</TableCell>
                                            <TableCell>{item.variantId.toUpperCase()}</TableCell>
                                            <TableCell>{item.productQty}</TableCell>
                                            <TableCell>
                                                <Input type="number" placeholder="Enter received quantity" className="w-40" />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full">Complete Purchase & Update Stock</Button>
                    </CardFooter>
                </Card>
            </div>
        )}

      <div className="mt-8 flex justify-between">
        {currentStep > 0 ? (
          <Button variant="outline" onClick={handleBack}>
            Previous Step
          </Button>
        ) : <div></div>}
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext}>Next Step</Button>
        ) : (
            <div></div>
        )}
      </div>
    </div>
  );
}
