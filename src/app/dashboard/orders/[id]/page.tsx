
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Copy,
  MoreVertical,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  History,
  FileText,
  Save,
  Mail,
  Phone,
  Store,
  Globe,
  Edit,
  Printer,
  File,
  Loader2,
  Clock,
  PackageCheck,
  Ban,
  RotateCcw,
  MessageSquare,
  StickyNote,
  PackageSearch,
} from 'lucide-react';
import { format, isAfter, subHours } from 'date-fns';
import * as React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { getOrderById, getStatuses, getOrdersByCustomerPhone } from '@/services/orders';
import { getBusinesses, getCourierServices } from '@/services/partners';
import { getDeliveryReport, type DeliveryReport } from '@/services/delivery-score';
import type { OrderProduct, OrderLog, Order as OrderType, OrderStatus, CourierService, Business } from '@/types';
import { useToast } from '@/hooks/use-toast';


const statusColors: Record<OrderType['status'], string> = {
    'New': 'bg-blue-500/20 text-blue-700',
    'Confirmed': 'bg-sky-500/20 text-sky-700',
    'Packing Hold': 'bg-amber-500/20 text-amber-700',
    'Canceled': 'bg-red-500/20 text-red-700',
    'Hold': 'bg-yellow-500/20 text-yellow-700',
    'In-Courier': 'bg-orange-500/20 text-orange-700',
    'RTS (Ready to Ship)': 'bg-purple-500/20 text-purple-700',
    'Shipped': 'bg-cyan-500/20 text-cyan-700',
    'Delivered': 'bg-green-500/20 text-green-700',
    'Return Pending': 'bg-pink-500/20 text-pink-700',
    'Returned': 'bg-gray-500/20 text-gray-700',
    'Partial': 'bg-fuchsia-500/20 text-fuchsia-700',
    'Incomplete': 'bg-gray-500/20 text-gray-700',
    'Incomplete-Cancelled': 'bg-red-500/20 text-red-700'
};

const statusIcons: Record<string, React.ElementType> = {
    'New': Package,
    'Confirmed': CheckCircle,
    'Canceled': XCircle,
    'Hold': History,
    'In-Courier': Truck,
    'RTS (Ready to Ship)': PackageSearch,
    'Shipped': Truck,
    'Delivered': CheckCircle,
    'Returned': History,
    'Return Pending': RotateCcw,
    'Partial': Truck,
    'Notes updated': FileText, 
    'Order Edited': Edit,
    'Sent to Pathao': Truck,
    'Packing Hold': Clock,
};


const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.78.46 3.45 1.28 4.91L2 22l5.25-1.38c1.39.75 2.96 1.18 4.59 1.18h.02c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91z" fill="currentColor"></path>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.165-.917-.325-.512-.198-.71-.198c-.198 0-.42.074-.644.371s-.883 1.11-.883 2.476.905 2.87 1.023 3.074c.118.204.883 1.37 2.147 1.874.314.124.56.198.785.248.225.049.433.042.592-.012.19-.06.883-.37 1.01-1.073.124-.704.124-1.304.074-1.423-.05-.12-.18-.18-.4-.28z" fill="#FFFFFF"></path>
    </svg>
);


function OrderHistory({ logs }: { logs: OrderLog[] }) {
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const sortedLogs = React.useMemo(() => logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [logs]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>
                    {isClient ? (
                        <ul className="space-y-6">
                            {sortedLogs.map((log, index) => {
                                const Icon = statusIcons[log.title] || History;
                                const isLast = index === 0;
                                return (
                                    <li key={`${log.timestamp}-${index}`} className="relative flex items-start gap-4">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center bg-background border",
                                            isLast ? "border-primary" : "border-border"
                                        )}>
                                            <Icon className={cn("h-4 w-4", isLast ? "text-primary" : "text-muted-foreground")} />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className={cn("font-medium", isLast ? "text-foreground" : "text-muted-foreground")}>{log.title}</p>
                                            <p className="text-sm text-muted-foreground">{log.description}</p>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                <span>{format(new Date(log.timestamp), "MMM d, yyyy, h:mm a")}</span>
                                                {log.user && <span className="font-medium"> by {log.user}</span>}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="space-y-6">
                            {logs.map((log, i) => (
                                <div key={`${log.timestamp}-${i}`} className="flex items-start gap-4">
                                    <Skeleton className="w-8 h-8 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

const statusUpdateSchema = z.object({
  status: z.string().min(1, "Status is required."),
  officeNote: z.string().optional(),
});
type StatusUpdateFormValues = z.infer<typeof statusUpdateSchema>;

export default function OrderDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const orderId = params.id as string;
  
  const [order, setOrder] = React.useState<OrderType | undefined>(undefined);
  const [customerHistory, setCustomerHistory] = React.useState<OrderType[]>([]);
  const [deliveryReport, setDeliveryReport] = React.useState<DeliveryReport | null>(null);
  const [isReportLoading, setIsReportLoading] = React.useState(true);
  const [allStatuses, setAllStatuses] = React.useState<OrderStatus[]>([]);
  const [businesses, setBusinesses] = React.useState<Business[]>([]);
  const [courierServices, setCourierServices] = React.useState<CourierService[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSending, setIsSending] = React.useState(false);
  const [selectedCourier, setSelectedCourier] = React.useState<string | undefined>();
  const [includeCustomerNote, setIncludeCustomerNote] = React.useState(false);
  
  const form = useForm<StatusUpdateFormValues>();

  React.useEffect(() => {
    if (orderId) {
        setIsLoading(true);
        Promise.all([
            getOrderById(orderId),
            getStatuses(),
            getBusinesses(),
            getCourierServices()
        ]).then(([orderData, statusesData, businessesData, couriersData]) => {
            if (orderData) {
                setOrder(orderData);
                form.reset({
                  status: orderData.status,
                  officeNote: orderData.officeNote,
                });
                
                setIsReportLoading(true);
                getDeliveryReport(orderData.customerPhone).then(report => {
                    setDeliveryReport(report);
                }).finally(() => setIsReportLoading(false));

                getOrdersByCustomerPhone(orderData.customerPhone).then(history => {
                    setCustomerHistory(history);
                })
            }
            setAllStatuses(statusesData);
            setBusinesses(businessesData);
            setCourierServices(couriersData);
            setIsLoading(false);
        });
    }
  }, [orderId, form]);

  const customerHistoryStats = React.useMemo(() => {
    const totalOrders = customerHistory.length;
    const delivered = customerHistory.filter(o => o.status === 'Delivered').length;
    const canceled = customerHistory.filter(o => o.status === 'Canceled').length;
    const returned = customerHistory.filter(o => o.status === 'Returned').length;
    const processing = totalOrders - (delivered + canceled + returned);
    const recentDate = subHours(new Date(), 48);
    const recentOrders = customerHistory.filter(o => isAfter(new Date(o.date), recentDate));
    
    return { totalOrders, delivered, canceled, returned, processing, recentOrders };
  }, [customerHistory]);

  function onSubmit(data: StatusUpdateFormValues) {
    toast({
        title: "Order Updated",
        description: `Status changed to ${data.status}.`,
    });
  }

  function handleSendToCourier() {
    setIsSending(true);
    setTimeout(() => {
        setIsSending(false);
        toast({
            title: "Order Sent to Courier",
            description: `Order ${orderId} has been dispatched to ${selectedCourier}.`,
        });
    }, 1500)
  }

  if (isLoading) {
    return <div className="p-6">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 justify-center items-center">
        <p>Order not found.</p>
        <Button asChild>
          <Link href="/dashboard/orders">Go Back to Orders</Link>
        </Button>
      </div>
    );
  }
  
  const whatsappMessage = `Hello ${order.customerName}, regarding your order ${order.id}:\n- Total: ৳${order.total.toFixed(2)}\n- Status: ${order.status}\n\nWe will update you shortly. Thank you!`;
  const subtotal = order.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + order.shipping + tax;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/dashboard/orders">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {order.id}
            </h1>
            <Badge
                variant="outline"
                className={cn('ml-auto sm:ml-0', statusColors[order.status])}
            >
                {order.status}
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/orders/print/invoice/${order.id}`} target="_blank">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Invoice
                    </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/orders/print/sticker/${order.id}`} target="_blank">
                        <File className="mr-2 h-4 w-4" />
                        Print Sticker
                    </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/orders/${order.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Order
                    </Link>
                </Button>
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 md:hidden">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                     <DropdownMenuItem asChild><Link href={`/dashboard/orders/${order.id}/edit`}>Edit Order</Link></DropdownMenuItem>
                     <DropdownMenuItem asChild><Link href={`/dashboard/orders/print/invoice/${order.id}`} target="_blank">Print Invoice</Link></DropdownMenuItem>
                     <DropdownMenuItem asChild><Link href={`/dashboard/orders/print/sticker/${order.id}`} target="_blank">Print Sticker</Link></DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-6 md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="hidden sm:block">
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {order.products.map((product) => (
                                    <TableRow key={product.productId}>
                                        <TableCell>
                                            <Image
                                                alt={product.name}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={product.image.imageUrl}
                                                width="64"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>SKU-452-187</TableCell>
                                        <TableCell className="text-right">{product.quantity}</TableCell>
                                        <TableCell className="text-right font-mono">৳{product.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-mono">৳{(product.price * product.quantity).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="sm:hidden grid gap-4">
                             {order.products.map((product) => (
                                <Card key={product.productId} className="overflow-hidden">
                                    <CardContent className="p-4 flex gap-4">
                                         <Image
                                            alt={product.name}
                                            className="aspect-square rounded-md object-cover"
                                            height="64"
                                            src={product.image.imageUrl}
                                            width="64"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">SKU-452-187</p>
                                             <div className="flex justify-between items-center mt-2">
                                                <p className="text-sm">Qty: {product.quantity}</p>
                                                <p className="font-medium font-mono">৳{(product.price * product.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                             ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Summary</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2 text-sm'>
                        <div className="flex items-center justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className='font-mono'>৳{subtotal.toFixed(2)}</dd></div>
                        <div className="flex items-center justify-between"><dt className="text-muted-foreground">Shipping</dt><dd className='font-mono'>৳{order.shipping.toFixed(2)}</dd></div>
                        <div className="flex items-center justify-between"><dt className="text-muted-foreground">Tax</dt><dd className='font-mono'>৳{tax.toFixed(2)}</dd></div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold"><dt>Total</dt><dd className='font-mono'>৳{total.toFixed(2)}</dd></div>
                        <div className="flex items-center justify-between"><dt className="text-muted-foreground">Paid</dt><dd className='font-mono text-green-600'>৳{order.paidAmount.toFixed(2)}</dd></div>
                        <div className="flex items-center justify-between font-semibold"><dt className={cn(total - order.paidAmount > 0 && "text-destructive")}>Amount Due</dt><dd className={cn("font-mono", total - order.paidAmount > 0 && "text-destructive")}>৳{(total - order.paidAmount).toFixed(2)}</dd></div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className='flex items-center gap-2'><StickyNote className='w-5 h-5 text-muted-foreground' /> Notes</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div><Label className='text-muted-foreground'>Customer Note</Label><p className="text-sm">{order.customerNote || 'No customer note provided.'}</p></div>
                        <div><Label className='text-muted-foreground'>Office Note</Label><p className="text-sm">{order.officeNote || 'No office note provided.'}</p></div>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1 grid auto-rows-max gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Customer & Shipping</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="font-medium flex items-center justify-between">
                            <Link href={`/dashboard/customers/${order.customerPhone}`} className='hover:underline'>{order.customerName}</Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8" type="button"><Copy className="h-4 w-4" /><span className="sr-only">Copy</span></Button>
                        </div>
                        <Separator />
                        <div className="grid gap-2">
                            <div className="font-medium">Contact Information</div>
                            <div className="text-muted-foreground">
                            {order.customerEmail && (
                                <div className="flex items-center gap-2"><p>{order.customerEmail}</p>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild><a href={`mailto:${order.customerEmail}?subject=Regarding your order ${order.id}`}><Mail className="h-4 w-4" /></a></Button>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <p>{order.customerPhone}</p>
                                <Button variant="ghost" size="icon" className="h-7 w-7" asChild><a href={`tel:${order.customerPhone}`}><Phone className="h-4 w-4" /></a></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" asChild><a href={`https://wa.me/${order.customerPhone.replace(/\+/g, '')}?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="h-4 w-4 text-green-500" /></a></Button>
                            </div>
                            </div>
                        </div>
                        <Separator />
                        <Card>
                            <CardHeader className="p-2 pt-0">
                                <CardTitle className="text-sm">Customer History</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 pt-0 text-xs">
                                <div className="flex flex-wrap gap-x-4 gap-y-2">
                                    <div className="flex items-center gap-2"><Package className="w-4 h-4 text-muted-foreground" /><span>Total: {customerHistoryStats.totalOrders}</span></div>
                                    <div className="flex items-center gap-2"><PackageCheck className="w-4 h-4 text-green-600" /><span>Delivered: {customerHistoryStats.delivered}</span></div>
                                    <div className="flex items-center gap-2"><Ban className="w-4 h-4 text-red-500" /><span>Canceled: {customerHistoryStats.canceled}</span></div>
                                    <div className="flex items-center gap-2"><RotateCcw className="w-4 h-4 text-orange-500" /><span>Returned: {customerHistoryStats.returned}</span></div>
                                </div>
                                {customerHistoryStats.recentOrders.length > 0 && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="link" className="p-0 h-auto text-xs mt-2">
                                                Recent Orders: {customerHistoryStats.recentOrders.length} in last 48h
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Recent Orders (Last 48 Hours)</DialogTitle>
                                                <DialogDescription>Orders placed by {order.customerName} in the last 48 hours.</DialogDescription>
                                            </DialogHeader>
                                            <div className="max-h-80 overflow-y-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow><TableHead>Order ID</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Total</TableHead></TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {customerHistoryStats.recentOrders.map(o => (
                                                            <TableRow key={o.id}>
                                                                <TableCell><Link href={`/dashboard/orders/${o.id}`} className="text-primary hover:underline">{o.id}</Link></TableCell>
                                                                <TableCell><Badge variant="outline" className={cn(statusColors[o.status])}>{o.status}</Badge></TableCell>
                                                                <TableCell className="text-right font-mono">৳{o.total.toFixed(2)}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </CardContent>
                        </Card>
                        <Separator />
                        <div className="grid gap-2">
                            <div className="font-medium">Shipping Address</div>
                            <address className="not-italic text-muted-foreground">{order.shippingAddress.address}</address>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Order Actions</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Form {...form}>
                            <div className="space-y-4">
                                <FormField control={form.control} name="status" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Update Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                                            <SelectContent>{allStatuses.map(status => (<SelectItem key={status} value={status}>{status}</SelectItem>))}</SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="officeNote" render={({ field }) => (
                                    <FormItem><FormLabel>Update Office Note</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                                )} />
                                <Button className='w-full' onClick={form.handleSubmit(onSubmit)}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
                            </div>
                        </Form>
                        <Separator />
                        <div className="space-y-2">
                            <Label>Courier Management</Label>
                            <Select value={selectedCourier} onValueChange={setSelectedCourier}><SelectTrigger><SelectValue placeholder="Select a courier" /></SelectTrigger>
                                <SelectContent>{courierServices.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        {selectedCourier && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button className="w-full" type="button" disabled={isSending}>
                                        {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Truck className="mr-2 h-4 w-4" />}
                                        {isSending ? `Sending to ${selectedCourier}...` : `Send to ${selectedCourier}`}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirm Order Dispatch</AlertDialogTitle>
                                        <AlertDialogDescription>This will send the order details for <strong>{order.id}</strong> to <strong>{selectedCourier}</strong> for delivery. Are you sure?</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleSendToCourier}>Confirm & Send</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </CardContent>
                </Card>
                 <OrderHistory logs={order.logs} />
            </div>
        </div>
    </div>
  );
}
