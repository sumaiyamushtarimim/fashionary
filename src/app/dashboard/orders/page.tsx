import { MoreHorizontal, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { orders } from "@/lib/placeholder-data";

export default function OrdersPage() {
  return (
    <Tabs defaultValue="all">
        <div className="flex flex-col items-start gap-y-4 gap-x-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              Export
            </Button>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Order
            </Button>
          </div>
        </div>
        <TabsContent value="all">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Orders</CardTitle>
                    <CardDescription>Manage and track all customer orders.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden text-right sm:table-cell">Total</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                        <TableCell>
                            <Badge
                                variant={
                                order.status === 'Completed' ? 'default' :
                                order.status === 'New' ? 'secondary' :
                                'outline'
                                }
                                className={
                                order.status === 'Completed' ? 'bg-green-500/20 text-green-700' :
                                order.status === 'New' ? 'bg-blue-500/20 text-blue-700' :
                                order.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-700' :
                                'bg-red-500/20 text-red-700'
                                }
                            >
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden text-right sm:table-cell">${order.total.toFixed(2)}</TableCell>
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
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Update Status</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
                <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>1-5</strong> of <strong>{orders.length}</strong> orders
                </div>
                </CardFooter>
            </Card>
        </TabsContent>
    </Tabs>
  );
}
