
'use client';

import { MoreHorizontal, PlusCircle } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { Textarea } from "@/components/ui/textarea";
import { inventory, products } from "@/lib/placeholder-data";


export default function InventoryPage() {
    const [selectedProduct, setSelectedProduct] = React.useState<string | undefined>(undefined);
    const currentStock = React.useMemo(() => {
        if (!selectedProduct) return 0;
        return inventory.find(item => item.productId === selectedProduct)?.quantity || 0;
    }, [selectedProduct]);


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <div className="flex-1">
            <h1 className="font-headline text-2xl font-bold">Inventory</h1>
            <p className="text-muted-foreground hidden sm:block">Track stock levels and movements.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Export
          </Button>
           <Dialog>
            <DialogTrigger asChild>
                <Button size="sm">
                    Adjust Stock
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Adjust Stock</DialogTitle>
                <DialogDescription>
                    Make changes to your inventory quantities.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid gap-3">
                        <Label htmlFor="product">Product</Label>
                        <Select onValueChange={setSelectedProduct}>
                            <SelectTrigger id="product">
                                <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map(product => (
                                    <SelectItem key={product.id} value={product.id}>
                                        {product.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedProduct && <p className="text-sm text-muted-foreground">Current stock: {currentStock} units</p>}
                    </div>
                    <div className="grid gap-3">
                        <Label>Adjustment Type</Label>
                        <RadioGroup defaultValue="add" className="flex gap-4">
                            <Label htmlFor="add" className="flex items-center gap-2 cursor-pointer text-sm font-normal">
                                <RadioGroupItem value="add" id="add" />
                                Add
                            </Label>
                             <Label htmlFor="remove" className="flex items-center gap-2 cursor-pointer text-sm font-normal">
                                <RadioGroupItem value="remove" id="remove" />
                                Remove
                            </Label>
                             <Label htmlFor="set" className="flex items-center gap-2 cursor-pointer text-sm font-normal">
                                <RadioGroupItem value="set" id="set" />
                                Set New Quantity
                            </Label>
                        </RadioGroup>
                    </div>
                     <div className="grid gap-3">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" type="number" placeholder="e.g., 10" />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="notes">Reason / Note</Label>
                        <Textarea id="notes" placeholder="e.g., Damaged goods, stock count correction" />
                    </div>
                </div>
                <DialogFooter>
                <Button type="submit">Save Adjustment</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="hidden sm:table-cell">SKU</TableHead>
                <TableHead className="hidden md:table-cell">Lot (FIFO)</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id} className={item.quantity <= 10 ? "bg-destructive/10" : ""}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="hidden sm:table-cell">{item.sku}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col">
                        <span>{item.lotNumber}</span>
                        <span className="text-xs text-muted-foreground">{item.receivedDate}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span>{item.quantity}</span>
                      {item.quantity <= 10 && (
                        <Badge variant="destructive" className="ml-2 hidden sm:inline-flex">Low Stock</Badge>
                      )}
                       {item.quantity <= 10 && (
                        <div className="sm:hidden h-2 w-2 rounded-full bg-red-500" title="Low Stock"></div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{item.location}</TableCell>
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Movement</DropdownMenuItem>
                        <DropdownMenuItem>Adjust Quantity</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
