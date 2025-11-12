import { MoreHorizontal, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { suppliers, vendors, purchaseOrders } from "@/lib/placeholder-data";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function PartnersPage() {

  const calculatePartnerDues = () => {
    const partnerFinancials: Record<string, { totalBusiness: number, totalPaid: number }> = {};

    const initializePartner = (name: string) => {
        if (!partnerFinancials[name]) {
            partnerFinancials[name] = { totalBusiness: 0, totalPaid: 0 };
        }
    };

    purchaseOrders.forEach(po => {
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
  }

  const partnerDues = calculatePartnerDues();


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center mb-4">
        <div className="flex-1">
          <h1 className="font-headline text-2xl font-bold">Partners</h1>
          <p className="text-muted-foreground">
            Manage your suppliers and vendors.
          </p>
        </div>
      </div>

      <Tabs defaultValue="suppliers">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>
        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Suppliers</CardTitle>
              <CardDescription>
                Manage your material and service suppliers.
              </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Table for larger screens */}
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Supplier Name</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Email
                        </TableHead>
                        <TableHead className="text-right">Total Due</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {suppliers.map((supplier) => {
                        const due = partnerDues[supplier.name] || 0;
                        return (
                            <TableRow key={supplier.id}>
                            <TableCell className="font-medium">
                                <Link href={`/dashboard/partners/${supplier.id}`} className="hover:underline">
                                    {supplier.name}
                                </Link>
                            </TableCell>
                            <TableCell>{supplier.contactPerson}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                                {supplier.email}
                            </TableCell>
                            <TableCell className={cn("text-right font-mono", due > 0 ? "text-destructive" : "")}>
                                ৳{due.toFixed(2)}
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
                                    <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/partners/${supplier.id}`}>View Details</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Card list for smaller screens */}
                <div className="sm:hidden space-y-4">
                     {suppliers.map((supplier) => {
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
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/partners/${supplier.id}`}>View Details</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
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
                        )
                     })}
                </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>Vendors</CardTitle>
              <CardDescription>
                Manage your printing and cutting vendors.
              </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Table for larger screens */}
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead className="text-right">Total Due</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendors.map((vendor) => {
                        const due = partnerDues[vendor.name] || 0;
                        return (
                        <TableRow key={vendor.id}>
                          <TableCell className="font-medium">
                            <Link href={`/dashboard/partners/${vendor.id}`} className="hover:underline">
                                {vendor.name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                vendor.type === "Printing"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
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
                                 <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/partners/${vendor.id}`}>View Details</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )})}
                    </TableBody>
                  </Table>
                </div>
                 {/* Card list for smaller screens */}
                <div className="sm:hidden space-y-4">
                     {vendors.map((vendor) => {
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
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/partners/${vendor.id}`}>View Details</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-end">
                                        <Badge
                                            variant={
                                                vendor.type === "Printing"
                                                ? "secondary"
                                                : "outline"
                                            }
                                            >
                                            {vendor.type}
                                            </Badge>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Total Due</p>
                                            <p className={cn("font-semibold font-mono", due > 0 ? "text-destructive" : "")}>৳{due.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                     })}
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    