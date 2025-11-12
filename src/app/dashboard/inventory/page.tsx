import { MoreHorizontal } from "lucide-react";

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
import { inventory } from "@/lib/placeholder-data";

export default function InventoryPage() {
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
          <Button size="sm">
            Adjust Stock
          </Button>
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

    