

'use client';

import { MoreHorizontal, PlusCircle, Handshake, DollarSign } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSuppliers, getVendors, getPurchaseOrdersByPartner } from "@/services/partners";
import { getPurchaseOrders } from "@/services/purchases";
import type { Supplier, Vendor, PurchaseOrder } from "@/types";

const ITEMS_PER_PAGE = 5;
type Partner = Supplier | Vendor;

export default function PartnersPage() {
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [allPurchaseOrders, setAllPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentSupplierPage, setCurrentSupplierPage] = useState(1);
  const [currentVendorPage, setCurrentVendorPage] = useState(1);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'addSupplier' | 'addVendor' | 'editSupplier' | 'editVendor' | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
        getSuppliers(),
        getVendors(),
        getPurchaseOrders()
    ]).then(([suppliersData, vendorsData, poData]) => {
        setAllSuppliers(suppliersData);
        setAllVendors(vendorsData);
        setAllPurchaseOrders(poData);
        setIsLoading(false);
    });
  }, []);

  const openDialog = (mode: typeof dialogMode, partner?: Partner) => {
    setDialogMode(mode);
    setSelectedPartner(partner || null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
      setIsDialogOpen(false);
      setDialogMode(null);
      setSelectedPartner(null);
  }

  const partnerDues = useMemo(() => {
    const partnerFinancials: Record<string, { totalBusiness: number, totalPaid: number }> = {};

    const initializePartner = (name: string) => {
        if (!partnerFinancials[name]) {
            partnerFinancials[name] = { totalBusiness: 0, totalPaid: 0 };
        }
    };

    allPurchaseOrders.forEach(po => {
        if (po.supplier) {
            initializePartner(po.supplier);
            partnerFinancials[po.supplier].totalBusiness += po.total;
            if (po.fabricPayment) {
                 partnerFinancials[po.supplier].totalPaid += (po.fabricPayment.cash || 0) + (po.fabricPayment.check || 0);
            }
        }
        if (po.printingVendor && po.printingPayment) {
            initializePartner(po.printingVendor);
            const printingCost = (po.printingPayment.cash || 0) + (po.printingPayment.check || 0);
            partnerFinancials[po.printingVendor].totalBusiness += printingCost;
            partnerFinancials[po.printingVendor].totalPaid += printingCost;
        }
        if (po.cuttingVendor && po.cuttingPayment) {
            initializePartner(po.cuttingVendor);
            const cuttingCost = (po.cuttingPayment.cash || 0) + (po.cuttingPayment.check || 0);
            partnerFinancials[po.cuttingVendor].totalBusiness += cuttingCost;
            partnerFinancials[po.cuttingVendor].totalPaid += cuttingCost;
        }
    });

    const finalDues: Record<string, number> = {};
    for (const name in partnerFinancials) {
        finalDues[name] = partnerFinancials[name].totalBusiness - partnerFinancials[name].totalPaid;
    }

    return finalDues;
  }, [allPurchaseOrders]);

   const overviewStats = useMemo(() => {
    let totalBusiness = 0;
    let totalDue = 0;

    Object.values(partnerDues).forEach(due => {
      totalDue += due;
    });

    allPurchaseOrders.forEach(po => {
        totalBusiness += po.total;
        if(po.printingPayment) totalBusiness += (po.printingPayment.cash || 0) + (po.printingPayment.check || 0);
        if(po.cuttingPayment) totalBusiness += (po.cuttingPayment.cash || 0) + (po.cuttingPayment.check || 0);
    });

    return {
        totalBusiness,
        totalDue
    };
  }, [partnerDues, allPurchaseOrders]);


  const totalSupplierPages = Math.ceil(allSuppliers.length / ITEMS_PER_PAGE);
  const paginatedSuppliers = useMemo(() => {
      const startIndex = (currentSupplierPage - 1) * ITEMS_PER_PAGE;
      return allSuppliers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentSupplierPage, allSuppliers]);

  const totalVendorPages = Math.ceil(allVendors.length / ITEMS_PER_PAGE);
  const paginatedVendors = useMemo(() => {
        const startIndex = (currentVendorPage - 1) * ITEMS_PER_PAGE;
        return allVendors.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentVendorPage, allVendors]);


  const renderSupplierTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Supplier Name</TableHead>
          <TableHead>Contact Person</TableHead>
          <TableHead className="hidden sm:table-cell">Email</TableHead>
          <TableHead className="text-right">Total Due</TableHead>
          <TableHead><span className="sr-only">Actions</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedSuppliers.map((supplier) => {
          const due = partnerDues[supplier.name] || 0;
          return (
            <TableRow key={supplier.id}>
              <TableCell className="font-medium">
                <Link href={`/dashboard/partners/${supplier.id}`} className="hover:underline">
                  {supplier.name}
                </Link>
              </TableCell>
              <TableCell>{supplier.contactPerson}</TableCell>
              <TableCell className="hidden sm:table-cell">{supplier.email}</TableCell>
              <TableCell className={cn("text-right font-mono", due > 0 ? "text-destructive" : "")}>
                ৳{due.toFixed(2)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/partners/${supplier.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDialog('editSupplier', supplier)}>Edit</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  const renderSupplierCards = () => (
    <div className="space-y-4">
      {paginatedSuppliers.map((supplier) => {
        const due = partnerDues[supplier.name] || 0;
        return (
          <Card key={supplier.id} className="overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/dashboard/partners/${supplier.id}`} className="font-semibold hover:underline">
                    {supplier.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
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
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/partners/${supplier.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDialog('editSupplier', supplier)}>Edit</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Separator />
              <div className="flex justify-between items-end">
                <p className="text-xs text-muted-foreground">{supplier.email}</p>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Due</p>
                  <p className={cn("font-semibold font-mono", due > 0 ? "text-destructive" : "")}>৳{due.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderVendorTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vendor Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Contact Person</TableHead>
          <TableHead className="text-right">Total Due</TableHead>
          <TableHead><span className="sr-only">Actions</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedVendors.map((vendor) => {
          const due = partnerDues[vendor.name] || 0;
          return (
            <TableRow key={vendor.id}>
              <TableCell className="font-medium">
                <Link href={`/dashboard/partners/${vendor.id}`} className="hover:underline">
                  {vendor.name}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant={vendor.type === "Printing" ? "secondary" : "outline"}>
                  {vendor.type}
                </Badge>
              </TableCell>
              <TableCell>{vendor.contactPerson}</TableCell>
              <TableCell className={cn("text-right font-mono", due > 0 ? "text-destructive" : "")}>
                ৳{due.toFixed(2)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/partners/${vendor.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDialog('editVendor', vendor)}>Edit</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  const renderVendorCards = () => (
    <div className="space-y-4">
      {paginatedVendors.map((vendor) => {
        const due = partnerDues[vendor.name] || 0;
        return (
          <Card key={vendor.id} className="overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/dashboard/partners/${vendor.id}`} className="font-semibold hover:underline">
                    {vendor.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{vendor.contactPerson}</p>
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
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/partners/${vendor.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDialog('editVendor', vendor)}>Edit</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Separator />
              <div className="flex justify-between items-end">
                <Badge variant={vendor.type === "Printing" ? "secondary" : "outline"}>
                  {vendor.type}
                </Badge>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Due</p>
                  <p className={cn("font-semibold font-mono", due > 0 ? "text-destructive" : "")}>৳{due.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center mb-4">
        <div className="flex-1">
          <h1 className="font-headline text-2xl font-bold">Partners</h1>
          <p className="text-muted-foreground hidden sm:block">
            Manage your suppliers and vendors.
          </p>
        </div>
      </div>

       <div className="grid gap-4 grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Business</CardTitle>
                    <Handshake className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">৳{overviewStats.totalBusiness.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total transaction with all partners</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Due</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={cn("text-2xl font-bold", overviewStats.totalDue > 0 && "text-destructive")}>
                        ৳{overviewStats.totalDue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Total outstanding amount to all partners</p>
                </CardContent>
            </Card>
        </div>

      <Tabs defaultValue="suppliers">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>
        <TabsContent value="suppliers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Suppliers</CardTitle>
                <CardDescription>
                  Manage your material and service suppliers.
                </CardDescription>
              </div>
               <Button onClick={() => openDialog('addSupplier')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Supplier
                </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-24 text-center flex items-center justify-center text-muted-foreground">Loading...</div>
              ) : (
                <>
                  <div className="hidden sm:block">{renderSupplierTable()}</div>
                  <div className="sm:hidden">{renderSupplierCards()}</div>
                </>
              )}
            </CardContent>
             <CardFooter>
                <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                        Showing <strong>{(currentSupplierPage - 1) * ITEMS_PER_PAGE + 1}-
                        {Math.min(currentSupplierPage * ITEMS_PER_PAGE, allSuppliers.length)}
                        </strong> of <strong>{allSuppliers.length}</strong> suppliers
                    </div>
                    {totalSupplierPages > 1 && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious 
                                        href="#" 
                                        onClick={(e) => { e.preventDefault(); setCurrentSupplierPage(p => Math.max(1, p - 1))}} 
                                        className={currentSupplierPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext 
                                        href="#" 
                                        onClick={(e) => { e.preventDefault(); setCurrentSupplierPage(p => Math.min(totalSupplierPages, p + 1))}}
                                        className={currentSupplierPage === totalSupplierPages ? 'pointer-events-none opacity-50' : ''} 
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="vendors">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Vendors</CardTitle>
                <CardDescription>
                  Manage your printing and cutting vendors.
                </CardDescription>
              </div>
               <Button onClick={() => openDialog('addVendor')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Vendor
                </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-24 text-center flex items-center justify-center text-muted-foreground">Loading...</div>
              ) : (
                <>
                  <div className="hidden sm:block">{renderVendorTable()}</div>
                  <div className="sm:hidden">{renderVendorCards()}</div>
                </>
              )}
            </CardContent>
            <CardFooter>
                <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                        Showing <strong>{(currentVendorPage - 1) * ITEMS_PER_PAGE + 1}-
                        {Math.min(currentVendorPage * ITEMS_PER_PAGE, allVendors.length)}
                        </strong> of <strong>{allVendors.length}</strong> vendors
                    </div>
                    {totalVendorPages > 1 && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious 
                                        href="#" 
                                        onClick={(e) => { e.preventDefault(); setCurrentVendorPage(p => Math.max(1, p - 1))}} 
                                        className={currentVendorPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext 
                                        href="#" 
                                        onClick={(e) => { e.preventDefault(); setCurrentVendorPage(p => Math.min(totalVendorPages, p + 1))}}
                                        className={currentVendorPage === totalVendorPages ? 'pointer-events-none opacity-50' : ''} 
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
                {dialogMode?.startsWith('edit') ? 'Edit ' : 'Add New '}
                {dialogMode?.includes('Supplier') ? 'Supplier' : 'Vendor'}
            </DialogTitle>
             <DialogDescription>
                Fill in the details for the partner.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={selectedPartner?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input id="contactPerson" defaultValue={selectedPartner?.contactPerson} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={selectedPartner?.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue={selectedPartner?.phone} />
            </div>
            {dialogMode?.includes('Supplier') && (
                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue={(selectedPartner as Supplier)?.address} />
                </div>
            )}
             {dialogMode?.includes('Vendor') && (
                <>
                 <div className="space-y-2">
                    <Label htmlFor="type">Vendor Type</Label>
                    <Select defaultValue={(selectedPartner as Vendor)?.type}>
                        <SelectTrigger id="type">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Printing">Printing</SelectItem>
                            <SelectItem value="Cutting">Cutting</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="rate">Rate</Label>
                    <Input id="rate" defaultValue={(selectedPartner as Vendor)?.rate} />
                 </div>
                </>
             )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={closeDialog}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
