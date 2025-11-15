

'use client';

import { MoreHorizontal, PlusCircle, History, ArrowRight, Minus, Plus, Package, Warehouse, HardHat, CircleDollarSign, TrendingUp, BarChart } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { getInventory, getInventoryMovements, getStockLocations } from "@/services/inventory";
import { getProducts } from "@/services/products";
import type { InventoryItem, Product, ProductVariant, InventoryMovement, StockLocation } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";


type DialogState = {
    isOpen: boolean;
    mode: 'movement' | 'viewMovement' | null;
    selectedItem: InventoryItem | null;
};


export default function InventoryPage() {
    const [allInventory, setAllInventory] = React.useState<InventoryItem[]>([]);
    const [allProducts, setAllProducts] = React.useState<Product[]>([]);
    const [allMovements, setAllMovements] = React.useState<Record<string, InventoryMovement[]>>({});
    const [allLocations, setAllLocations] = React.useState<StockLocation[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const [selectedProduct, setSelectedProduct] = React.useState<string | undefined>(undefined);
    const [selectedVariant, setSelectedVariant] = React.useState<string | undefined>(undefined);
    const [isClient, setIsClient] = React.useState(false);
    const [locationFilter, setLocationFilter] = React.useState<string>('all');

    React.useEffect(() => {
        setIsClient(true);
        setIsLoading(true);
        Promise.all([
            getInventory(),
            getProducts(),
            getInventoryMovements(),
            getStockLocations()
        ]).then(([inventoryData, productsData, movementsData, locationsData]) => {
            setAllInventory(inventoryData);
            setAllProducts(productsData);
            setAllMovements(movementsData);
            setAllLocations(locationsData);
            setIsLoading(false);
        });
    }, []);

    const overviewStats = React.useMemo(() => {
        const filteredInventory = locationFilter === 'all'
            ? allInventory
            : allInventory.filter(item => item.locationId === locationFilter);

        let totalItems = 0;
        let totalCostValue = 0;
        let totalSaleValue = 0;

        filteredInventory.forEach(item => {
            const product = allProducts.find(p => p.id === item.productId);
            if (product) {
                totalItems += item.quantity;
                // Assuming cost is 50% of the sale price for this calculation
                const costPrice = product.price * 0.5;
                totalCostValue += item.quantity * costPrice;
                totalSaleValue += item.quantity * product.price;
            }
        });
        
        const potentialProfit = totalSaleValue - totalCostValue;

        return { totalItems, totalCostValue, totalSaleValue, potentialProfit };

    }, [allInventory, allProducts, locationFilter]);

    const [dialogState, setDialogState] = React.useState<DialogState>({
        isOpen: false,
        mode: null,
        selectedItem: null,
    });

    const openDialog = (mode: 'movement' | 'viewMovement', item?: InventoryItem) => {
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
        return allProducts.find(p => p.id === selectedProduct)?.variants || [];
    }, [selectedProduct, allProducts]);

    const currentStock = React.useMemo(() => {
        if (!selectedProduct) return 0;
        // In a real app, you'd also filter by location here
        const item = allInventory.find(i => i.productId === selectedProduct && (selectedVariant ? i.sku.includes(selectedVariant) : true));
        return item?.quantity || 0;
    }, [selectedProduct, selectedVariant, allInventory]);
    
    const movements: InventoryMovement[] = currentItem ? allMovements[currentItem.id] || [] : [];

    const renderTable = () => (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="hidden sm:table-cell">SKU</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allInventory.map((item) => {
            const product = allProducts.find(p => p.id === item.productId);
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
                    <Badge variant="outline">{item.locationName}</Badge>
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
                        <DropdownMenuItem onClick={() => openDialog('movement', item)}>Adjust/Transfer Stock</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
            )
          })}
        </TableBody>
      </Table>
    );

    const renderCardList = () => (
      <div className="space-y-4">
        {allInventory.map((item) => {
            const product = allProducts.find(p => p.id === item.productId);
            return (
              <Card key={item.id} className={cn("overflow-hidden", item.quantity <= 10 && "bg-destructive/10")}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {product && (
                        <Image
                            alt={product.name}
                            className="aspect-square rounded-md object-cover"
                            height="80"
                            src={product.image.imageUrl}
                            width="80"
                        />
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                           <p className="font-semibold">{item.productName}</p>
                           <p className="text-sm text-muted-foreground">{item.sku}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openDialog('viewMovement', item)}>View Movement</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDialog('movement', item)}>Adjust/Transfer Stock</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                       <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-muted-foreground">Lot: {item.lotNumber}</p>
                                <Badge variant="outline" className="mt-1">{item.locationName}</Badge>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-lg">{item.quantity} <span className="text-sm text-muted-foreground">units</span></p>
                                {item.quantity <= 10 && (
                                    <Badge variant="destructive" className="mt-1">Low Stock</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
        })}
      </div>
    );

    if (isLoading) {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <Skeleton className="h-10 w-1/4" />
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <div className="flex-1">
            <h1 className="font-headline text-2xl font-bold">Inventory</h1>
            <p className="text-muted-foreground hidden sm:block">Track stock levels and movements across all locations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Export
          </Button>
           <Button size="sm" onClick={() => openDialog('movement')}>
                Stock Movement
            </Button>
        </div>
      </div>

       <div className="space-y-4">
        <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold font-headline">Overview</h2>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {allLocations.map(loc => (
                        <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overviewStats.totalItems.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">units in stock</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Stock Value (Cost)</CardTitle>
                    <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">৳{overviewStats.totalCostValue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Estimated cost price</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Stock Value (Sale)</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">৳{overviewStats.totalSaleValue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total retail value</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Potential Profit</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">৳{overviewStats.potentialProfit.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Estimated profit from current stock</p>
                </CardContent>
            </Card>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isClient ? (
            <>
              <div className="hidden sm:block">{renderTable()}</div>
              <div className="sm:hidden">{renderCardList()}</div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              Loading inventory...
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogState.isOpen} onOpenChange={closeDialog}>
        <DialogContent className={cn("sm:max-w-xl", dialogState.mode === 'viewMovement' && 'sm:max-w-3xl')}>
            {dialogState.mode === 'movement' && (
                <Tabs defaultValue="receive" className="w-full">
                    <DialogHeader>
                        <DialogTitle>Stock Movement</DialogTitle>
                        <DialogDescription>Receive, adjust, or transfer inventory.</DialogDescription>
                    </DialogHeader>
                    <TabsList className="grid w-full grid-cols-3 mt-4">
                        <TabsTrigger value="receive">Receive</TabsTrigger>
                        <TabsTrigger value="adjust">Adjust</TabsTrigger>
                        <TabsTrigger value="transfer">Transfer</TabsTrigger>
                    </TabsList>
                    <TabsContent value="receive">
                        <div className="grid gap-6 py-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="product">Product</Label>
                                    <Select onValueChange={setSelectedProduct} value={selectedProduct}>
                                        <SelectTrigger id="product"><SelectValue placeholder="Select a product" /></SelectTrigger>
                                        <SelectContent>{allProducts.map(product => (<SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                                {availableVariants.length > 0 && (
                                    <div className="grid gap-3">
                                        <Label htmlFor="variant">Variant</Label>
                                        <Select onValueChange={setSelectedVariant} value={selectedVariant}>
                                            <SelectTrigger id="variant"><SelectValue placeholder="Select a variant" /></SelectTrigger>
                                            <SelectContent>{availableVariants.map(variant => (<SelectItem key={variant.id} value={variant.id}>{variant.name}</SelectItem>))}</SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input id="quantity" type="number" placeholder="e.g., 100" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="location-receive">Location</Label>
                                    <Input id="location-receive" value="Godown" disabled />
                                    <p className="text-xs text-muted-foreground -mt-2">New stock is always received in Godown.</p>
                                </div>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="ref">Reference / PO Number</Label>
                                <Input id="ref" placeholder="e.g., PO-2024-007" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                            <Button type="submit">Receive Stock</Button>
                        </DialogFooter>
                    </TabsContent>
                    <TabsContent value="adjust">
                         <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div className="grid gap-3">
                                    <Label htmlFor="product-adj">Product</Label>
                                    <Select onValueChange={setSelectedProduct} value={selectedProduct} disabled={!!dialogState.selectedItem}>
                                        <SelectTrigger id="product-adj"><SelectValue placeholder="Select a product" /></SelectTrigger>
                                        <SelectContent>{allProducts.map(product => (<SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="location-adj">Location</Label>
                                    <Select><SelectTrigger id="location-adj"><SelectValue placeholder="Select location" /></SelectTrigger>
                                        <SelectContent>{allLocations.map(loc => (<SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground -mt-2">Current stock: {currentStock} units</p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-3">
                                    <Label>Adjustment Type</Label>
                                    <RadioGroup defaultValue="add" className="flex gap-4 items-center">
                                        <Label htmlFor="add" className="flex items-center gap-2 cursor-pointer text-sm font-normal"><RadioGroupItem value="add" id="add" />Add</Label>
                                        <Label htmlFor="remove" className="flex items-center gap-2 cursor-pointer text-sm font-normal"><RadioGroupItem value="remove" id="remove" />Remove</Label>
                                    </RadioGroup>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="quantity-adj">Quantity</Label>
                                    <Input id="quantity-adj" type="number" placeholder="e.g., 10" />
                                </div>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="notes-adj">Reason / Note</Label>
                                <Textarea id="notes-adj" placeholder="e.g., Damaged goods, stock count correction" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                            <Button type="submit">Save Adjustment</Button>
                        </DialogFooter>
                    </TabsContent>
                    <TabsContent value="transfer">
                         <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div className="grid gap-3">
                                    <Label htmlFor="product-trans">Product</Label>
                                    <Select onValueChange={setSelectedProduct} value={selectedProduct} disabled={!!dialogState.selectedItem}>
                                        <SelectTrigger id="product-trans"><SelectValue placeholder="Select a product" /></SelectTrigger>
                                        <SelectContent>{allProducts.map(product => (<SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                                 <div className="grid gap-3">
                                    <Label htmlFor="quantity-trans">Quantity to Transfer</Label>
                                    <Input id="quantity-trans" type="number" placeholder="e.g., 5" />
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                               <div className="grid gap-3">
                                    <Label htmlFor="from-loc">From Location</Label>
                                    <Select><SelectTrigger id="from-loc"><SelectValue placeholder="Select source" /></SelectTrigger>
                                        <SelectContent>{allLocations.map(loc => (<SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="to-loc">To Location</Label>
                                     <Select><SelectTrigger id="to-loc"><SelectValue placeholder="Select destination" /></SelectTrigger>
                                        <SelectContent>{allLocations.map(loc => (<SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                             <p className="text-sm text-muted-foreground -mt-2">Available to transfer from source: {currentStock} units</p>
                            <div className="grid gap-3">
                                <Label htmlFor="notes-trans">Reason / Note for Transfer</Label>
                                <Textarea id="notes-trans" placeholder="e.g., Showroom restock" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                            <Button type="submit">Complete Transfer</Button>
                        </DialogFooter>
                    </TabsContent>
                </Tabs>
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
                    {/* For larger screens */}
                   <div className="hidden sm:block">
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
                                            <Badge variant={mov.type === 'Sold' || (mov.type === 'Adjusted' && mov.quantityChange < 0) ? 'destructive' : mov.type === 'Received' ? 'default' : 'secondary'}>{mov.type}</Badge>
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
                   {/* For smaller screens */}
                   <div className="sm:hidden space-y-4">
                         {movements.length > 0 ? movements.map(mov => (
                            <Card key={mov.id}>
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{mov.type}</p>
                                            <p className="text-sm text-muted-foreground">{mov.date}</p>
                                        </div>
                                         <Badge variant={mov.type === 'Sold' || (mov.type === 'Adjusted' && mov.quantityChange < 0) ? 'destructive' : mov.type === 'Received' ? 'default' : 'secondary'}>{mov.type}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex flex-col">
                                            <span className={cn("font-medium text-lg", mov.quantityChange < 0 ? "text-destructive" : "text-green-600")}>
                                                {mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange} units
                                            </span>
                                             <span className="text-muted-foreground">Balance: {mov.balance}</span>
                                        </div>
                                         <div className="text-right">
                                            <p className="text-muted-foreground">Ref: {mov.reference.startsWith('ORD') || mov.reference.startsWith('PO') ? (
                                                 <Button variant="link" asChild className="p-0 h-auto">
                                                    <Link href={`/dashboard/${mov.reference.startsWith('ORD') ? 'orders' : 'purchases'}/${mov.reference}`}>{mov.reference}</Link>
                                                </Button>
                                            ) : mov.notes}</p>
                                            <p className="text-xs text-muted-foreground">by {mov.user}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                         )) : (
                            <div className="h-24 text-center flex items-center justify-center text-muted-foreground">
                                No movement history found.
                            </div>
                         )}
                   </div>
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
