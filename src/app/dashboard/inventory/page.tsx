

'use client';

import { MoreHorizontal, PlusCircle, History, ArrowRight } from "lucide-react";
import * as React from "react";
import Link from 'next/link';
import Image from 'next/image';

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
import { inventory, products, inventoryMovements, InventoryItem, ProductVariant, InventoryMovement } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";


type DialogState = {
    isOpen: boolean;
    mode: 'adjust' | 'viewMovement' | null;
    selectedItem: InventoryItem | null;
};


export default function InventoryPage() {
    const [selectedProduct, setSelectedProduct] = React.useState<string | undefined>(undefined);
    const [selectedVariant, setSelectedVariant] = React.useState<string | undefined>(undefined);

    const [dialogState, setDialogState] = React.useState<DialogState>({
        isOpen: false,
        mode: null,
        selectedItem: null,
    });

    const openDialog = (mode: 'adjust' | 'viewMovement', item?: InventoryItem) => {
        setDialogState({ isOpen: true, mode, selectedItem: item || null });
        if (item) {
            setSelectedProduct(item.productId);
            if (item.variants && item.variants.length > 0) {
                 const variant = item.variants.find(v => v.sku === item.sku);
                 if(variant) setSelectedVariant(variant.id);
            }
        }
    };
    
    const closeDialog = () => {
        setDialogState({ isOpen: false, mode: null, selectedItem: null });
        setSelectedProduct(undefined);
        setSelectedVariant(undefined);
    };

    const currentItem = dialogState.selectedItem;

    const availableVariants = React.useMemo(() => {
        if (!selectedProduct) return [];
        return products.find(p => p.id === selectedProduct)?.variants || [];
    }, [selectedProduct]);

    const currentStock = React.useMemo(() => {
        if (!selectedProduct) return 0;
        // This logic needs to be more sophisticated in a real app,
        // probably finding the specific variant's stock.
        const item = inventory.find(i => i.productId === selectedProduct && (selectedVariant ? i.sku.includes(selectedVariant) : true));
        return item?.quantity || 0;
    }, [selectedProduct, selectedVariant]);
    
    const movements: InventoryMovement[] = currentItem ? inventoryMovements[currentItem.id] || [] : [];


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
           <Button size="sm" onClick={() => openDialog('adjust')}>
                Adjust Stock
            </Button>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
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
              {inventory.map((item) => {
                const product = products.find(p => p.id === item.productId);
                return (
                    <TableRow key={item.id} className={item.quantity <= 10 ? "bg-destructive/10" : ""}>
                        <TableCell className="hidden sm:table-cell">
                            {product && (
                                <Image
                                    alt={product.name}
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src={product.image.imageUrl}
                                    width="64"
                                />
                            )}
                        </TableCell>
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
                            <DropdownMenuItem onClick={() => openDialog('viewMovement', item)}>View Movement</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDialog('adjust', item)}>Adjust Quantity</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogState.isOpen} onOpenChange={closeDialog}>
        <DialogContent className={cn("sm:max-w-xl", dialogState.mode === 'viewMovement' && 'sm:max-w-3xl')}>
            {dialogState.mode === 'adjust' && (
                <>
                <DialogHeader>
                    <DialogTitle>Adjust Stock</DialogTitle>
                    <DialogDescription>
                        Make changes to inventory quantities. Select a product and specify the adjustment.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="product">Product</Label>
                            <Select onValueChange={setSelectedProduct} value={selectedProduct} disabled={!!dialogState.selectedItem}>
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
                        </div>
                        {availableVariants.length > 0 && (
                            <div className="grid gap-3">
                                <Label htmlFor="variant">Variant</Label>
                                <Select onValueChange={setSelectedVariant} value={selectedVariant} disabled={!!dialogState.selectedItem}>
                                    <SelectTrigger id="variant">
                                        <SelectValue placeholder="Select a variant" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableVariants.map(variant => (
                                            <SelectItem key={variant.id} value={variant.id}>
                                                {variant.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    {selectedProduct && <p className="text-sm text-muted-foreground -mt-2">Current stock: {currentStock} units</p>}
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
                    <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                    <Button type="submit">Save Adjustment</Button>
                </DialogFooter>
                </>
            )}

            {dialogState.mode === 'viewMovement' && currentItem && (
                 <>
                <DialogHeader>
                    <DialogTitle>Movement History: {currentItem.productName}</DialogTitle>
                    <DialogDescription>
                        Showing the stock movement history for SKU: {currentItem.sku}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                   <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead>Balance</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Notes/Ref</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {movements.length > 0 ? movements.map(mov => (
                                <TableRow key={mov.id}>
                                    <TableCell>{mov.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={mov.type === 'Sold' || mov.type === 'Adjusted' && mov.quantityChange < 0 ? 'destructive' : mov.type === 'Received' ? 'default' : 'secondary'}>{mov.type}</Badge>
                                    </TableCell>
                                    <TableCell className={cn("font-medium", mov.quantityChange < 0 ? "text-destructive" : "text-green-600")}>
                                        {mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange}
                                    </TableCell>
                                    <TableCell>{mov.balance}</TableCell>
                                    <TableCell>{mov.user}</TableCell>
                                    <TableCell>
                                        {mov.reference.startsWith('ORD') ? (
                                            <Button variant="link" asChild className="p-0 h-auto">
                                                <Link href={`/dashboard/orders/${mov.reference}`}>{mov.reference}</Link>
                                            </Button>
                                        ) : mov.reference.startsWith('PO') ? (
                                             <Button variant="link" asChild className="p-0 h-auto">
                                                <Link href={`/dashboard/purchases/${mov.reference}`}>{mov.reference}</Link>
                                            </Button>
                                        ) : (
                                            mov.notes
                                        )}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No movement history found for this item.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                   </Table>
                </div>
                <DialogFooter>
                    <Button onClick={closeDialog}>Close</Button>
                </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


