'use client';

import { useState, useMemo } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Circle, Dot, PlusCircle, Trash2 } from "lucide-react";
import { products } from "@/lib/placeholder-data";

const steps = [
  { name: "Fabric Order", status: "current" },
  { name: "Printing", status: "upcoming" },
  { name: "Cutting", status: "upcoming" },
  { name: "Delivery & Finish", status: "upcoming" },
];

type OrderItem = {
    id: string;
    productId: string;
    variantId: string;
    ornaQty: number;
    ornaCost: number;
    jamaQty: number;
    jamaCost: number;
    selowarQty: number;
    selowarCost: number;
};

export default function NewPurchaseOrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: `item-${Date.now()}`, productId: '', variantId: '', ornaQty: 0, ornaCost: 0, jamaQty: 0, jamaCost: 0, selowarQty: 0, selowarCost: 0 }
  ]);
  const [cashAmount, setCashAmount] = useState(0);
  const [checkAmount, setCheckAmount] = useState(0);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { id: `item-${Date.now()}`, productId: '', variantId: '', ornaQty: 0, ornaCost: 0, jamaQty: 0, jamaCost: 0, selowarQty: 0, selowarCost: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof Omit<OrderItem, 'id'>, value: string | number) => {
    setOrderItems(orderItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };
  
  const totalCost = useMemo(() => {
    return orderItems.reduce((total, item) => {
      return total + (item.ornaCost || 0) + (item.jamaCost || 0) + (item.selowarCost || 0);
    }, 0);
  }, [orderItems]);

  const dueAmount = useMemo(() => {
    const paid = (cashAmount || 0) + (checkAmount || 0);
    return totalCost - paid;
  }, [totalCost, cashAmount, checkAmount]);


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
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative md:flex md:flex-1">
              {step.status === "current" ? (
                <div className="group flex w-full items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </span>
                    <span className="ml-4 text-sm font-medium text-primary">
                      {step.name}
                    </span>
                  </span>
                </div>
              ) : (
                <div className="group flex items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                      <Circle className="h-6 w-6 text-gray-500" />
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-500">
                      {step.name}
                    </span>
                  </span>
                </div>
              )}

              {stepIdx !== steps.length - 1 ? (
                <>
                  <div
                    className="absolute right-0 top-0 hidden h-full w-5 md:block"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-full w-full text-gray-300"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0.5 0H22L0.5 80H0.5V0Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Fabric Order Details</CardTitle>
                    <CardDescription>Select products and specify fabric quantity and cost.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[200px]">Product</TableHead>
                                    <TableHead className="min-w-[150px]">Variant</TableHead>
                                    <TableHead>Orna (Qty)</TableHead>
                                    <TableHead>Jama (Qty)</TableHead>
                                    <TableHead>Selowar (Qty)</TableHead>
                                    <TableHead>Orna (Cost)</TableHead>
                                    <TableHead>Jama (Cost)</TableHead>
                                    <TableHead>Selowar (Cost)</TableHead>
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
                                        <TableCell><Input type="number" placeholder="0" className="w-20" onChange={(e) => handleItemChange(item.id, 'ornaQty', e.target.value)} /></TableCell>
                                        <TableCell><Input type="number" placeholder="0" className="w-20" onChange={(e) => handleItemChange(item.id, 'jamaQty', e.target.value)}/></TableCell>
                                        <TableCell><Input type="number" placeholder="0" className="w-20" onChange={(e) => handleItemChange(item.id, 'selowarQty', e.target.value)}/></TableCell>
                                        <TableCell><Input type="number" placeholder="0" className="w-24" onChange={(e) => handleItemChange(item.id, 'ornaCost', e.target.value)} /></TableCell>
                                        <TableCell><Input type="number" placeholder="0" className="w-24" onChange={(e) => handleItemChange(item.id, 'jamaCost', e.target.value)} /></TableCell>
                                        <TableCell><Input type="number" placeholder="0" className="w-24" onChange={(e) => handleItemChange(item.id, 'selowarCost', e.target.value)}/></TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleAddItem} className="mt-4">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Vendors</CardTitle>
                    <CardDescription>Assign vendors for this production batch.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="supplier">Fabric Supplier</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a supplier" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sup1">Global Textiles Inc.</SelectItem>
                                <SelectItem value="sup2">Denim Dreams Co.</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="printing-vendor">Printing Vendor</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a printing vendor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ven1">Precision Prints</SelectItem>
                                <SelectItem value="ven2">Ink & Thread</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Payment for Fabric</CardTitle>
                    <CardDescription>Record the payment for the fabric.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cash-amount">Cash Amount</Label>
                            <Input id="cash-amount" placeholder="0.00" type="number" value={cashAmount} onChange={e => setCashAmount(parseFloat(e.target.value) || 0)} disabled={totalCost > 0 && totalCost === checkAmount} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="check-amount">Check Amount</Label>
                            <Input id="check-amount" placeholder="0.00" type="number" value={checkAmount} onChange={e => setCheckAmount(parseFloat(e.target.value) || 0)} disabled={totalCost > 0 && totalCost === cashAmount}/>
                        </div>
                    </div>
                    {checkAmount > 0 && (
                        <div className="space-y-2">
                            <Label htmlFor="check-date">Check Passing Date</Label>
                            <Input id="check-date" type="date" />
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
                            <span className="font-medium">${((cashAmount || 0) + (checkAmount || 0)).toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between font-semibold text-lg">
                            <span className="text-destructive">Due Amount:</span>
                            <span className="text-destructive">${dueAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Create Purchase & Proceed</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
