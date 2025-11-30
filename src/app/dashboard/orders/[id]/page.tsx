

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
  File as FileIcon,
  Loader2,
  Clock,
  PackageCheck,
  Ban,
  RotateCcw,
  MessageSquare,
  StickyNote,
  PackageSearch,
  AlertCircle,
  User,
  CreditCard,
  ClipboardList,
  UserCheck,
} from 'lucide-react';
import { format, isAfter, subHours } from 'date-fns';
import * as React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";


import { Badge } from "@/components/ui/badge";
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
  AlertDialogTrigger,
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getOrderById, getStatuses, getOrdersByCustomerPhone } from '@/services/orders';
import { getBusinesses, getCourierServices } from '@/services/partners';
import { createIssue, getIssuesByOrderId } from '@/services/issues';
import { getStaff, getStaffMemberById } from '@/services/staff';
import { getDeliveryReport, type DeliveryReport } from '@/services/delivery-score';
import type { OrderProduct, OrderLog, Order as OrderType, OrderStatus, CourierService, Business, IssuePriority, Issue, StaffMember } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { OrderTimeline } from '@/components/ui/order-timeline';

const LOGGED_IN_STAFF_ID = 'STAFF002'; // Mock: Saleha Akter is logged in

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


function CourierReport({ report, isLoading }: { report: DeliveryReport | null, isLoading: boolean }) {
     const courierStatsData = React.useMemo(() => {
        if (!report || !report.Summaries) return [];
        return Object.entries(report.Summaries).map(([name, data]) => ({
            name,
            total: data["Total Parcels"] || data["Total Delivery"] || 0,
            delivered: data["Delivered Parcels"] || data["Successful Delivery"] || 0,
            canceled: data["Canceled Parcels"] || data["Canceled Delivery"] || 0,
        }));
    }, [report]);

    const { totalParcels, totalDelivered, totalCanceled } = React.useMemo(() => {
        return courierStatsData.reduce((acc, courier) => {
            acc.totalParcels += courier.total;
            acc.totalDelivered += courier.delivered;
            acc.totalCanceled += courier.canceled;
            return acc;
        }, { totalParcels: 0, totalDelivered: 0, totalCanceled: 0 });
    }, [courierStatsData]);

    const deliveryRatio = totalParcels > 0 ? (totalDelivered / totalParcels) * 100 : 0;
    const cancelRatio = totalParcels > 0 ? (totalCanceled / totalParcels) * 100 : 0;

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><ClipboardList className='w-5 h-5 text-muted-foreground' />Courier Delivery Report</CardTitle>
                    <CardDescription>Fetching delivery history...</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (!report) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><ClipboardList className='w-5 h-5 text-muted-foreground' />Courier Delivery Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-4 flex flex-col items-center gap-2">
                        <PackageSearch className="w-8 h-8" />
                        <span>No report found for this customer.</span>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'><ClipboardList className='w-5 h-5 text-muted-foreground' />Courier Delivery Report</CardTitle>
                <CardDescription>
                    Parcel history for this phone number.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {courierStatsData.length > 0 ? (
                    <>
                        <div className="grid grid-cols-4 gap-x-4 border-b pb-2 text-xs font-medium text-muted-foreground">
                            <div className="col-span-1">Courier</div>
                            <div className="col-span-1 text-center">Total</div>
                            <div className="col-span-1 text-center">Delivered</div>
                            <div className="col-span-1 text-center">Canceled</div>
                        </div>
                        {courierStatsData.map(courier => (
                            <div key={courier.name} className="grid grid-cols-4 gap-x-4 items-center text-sm">
                                <div className="col-span-1 font-semibold">{courier.name}</div>
                                <div className="col-span-1 text-center font-medium">{courier.total}</div>
                                <div className="col-span-1 text-center font-medium text-green-600">{courier.delivered}</div>
                                <div className="col-span-1 text-center font-medium text-red-500">{courier.canceled}</div>
                            </div>
                        ))}
                        <Separator />
                        <div className="grid grid-cols-4 gap-x-4 items-center text-sm font-bold">
                            <div className="col-span-1">Total</div>
                            <div className="col-span-1 text-center">{totalParcels}</div>
                            <div className="col-span-1 text-center text-green-600">{totalDelivered}</div>
                            <div className="col-span-1 text-center text-red-500">{totalCanceled}</div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-green-500 h-2.5 rounded-l-full" style={{ width: `${deliveryRatio}%`, display: 'inline-block' }}></div>
                                <div className="bg-red-500 h-2.5 rounded-r-full" style={{ width: `${cancelRatio}%`, display: 'inline-block' }}></div>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    <span>Delivery: <strong>{deliveryRatio.toFixed(1)}%</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                    <span>Cancel: <strong>{cancelRatio.toFixed(1)}%</strong></span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-muted-foreground py-4">No courier data found for this number.</div>
                )}
            </CardContent>
        </Card>
    );
}


const statusUpdateSchema = z.object({
  status: z.string().min(1, "Status is required."),
  officeNote: z.string().optional(),
});
type StatusUpdateFormValues = z.infer<typeof statusUpdateSchema>;

const issueFormSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters."),
    description: z.string().min(10, "Please provide a detailed description."),
    priority: z.enum(['Low', 'Medium', 'High']),
});
type IssueFormValues = z.infer<typeof issueFormSchema>;


// Cache for delivery reports
const reportCache = new Map<string, { data: DeliveryReport; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function OrderDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = React.useState<OrderType | undefined>(undefined);
  const [allStaff, setAllStaff] = React.useState<StaffMember[]>([]);
  const [currentUser, setCurrentUser] = React.useState<StaffMember | null>(null);
  const [customerHistory, setCustomerHistory] = React.useState<OrderType[]>([]);
  const [relatedIssues, setRelatedIssues] = React.useState<Issue[]>([]);
  const [deliveryReport, setDeliveryReport] = React.useState<DeliveryReport | null>(null);
  const [isReportLoading, setIsReportLoading] = React.useState(true);
  const [allStatuses, setAllStatuses] = React.useState<OrderStatus[]>([]);
  const [businesses, setBusinesses] = React.useState<Business[]>([]);
  const [courierServices, setCourierServices] = React.useState<CourierService[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSending, setIsSending] = React.useState(false);
  const [selectedCourier, setSelectedCourier] = React.useState<string | undefined>();
  const [isIssueDialogOpen, setIsIssueDialogOpen] = React.useState(false);
  const [isReassignDialogOpen, setIsReassignDialogOpen] = React.useState(false);

  
  const statusForm = useForm<StatusUpdateFormValues>();
  const issueForm = useForm<IssueFormValues>({
      resolver: zodResolver(issueFormSchema),
      defaultValues: {
          title: '',
          description: '',
          priority: 'Medium',
      },
  });

  React.useEffect(() => {
    if (orderId) {
        setIsLoading(true);
        Promise.all([
            getOrderById(orderId),
            getStatuses(),
            getBusinesses(),
            getCourierServices(),
            getIssuesByOrderId(orderId),
            getStaff(),
            getStaffMemberById(LOGGED_IN_STAFF_ID),
        ]).then(([orderData, statusesData, businessesData, couriersData, issuesData, staffData, currentUserData]) => {
            if (orderData) {
                setOrder(orderData);
                setRelatedIssues(issuesData);
                statusForm.reset({
                  status: orderData.status,
                  officeNote: orderData.officeNote,
                });
                
                getOrdersByCustomerPhone(orderData.customerPhone).then(history => {
                    setCustomerHistory(history);
                });

                handleFetchReport(orderData.customerPhone);
            }
            setAllStatuses(statusesData);
            setBusinesses(businessesData);
            setCourierServices(couriersData);
            setAllStaff(staffData);
            if (currentUserData) setCurrentUser(currentUserData);
            setIsLoading(false);
        });
    }
  }, [orderId, statusForm]);

  const handleFetchReport = React.useCallback(async (phone: string) => {
    if (!phone) return;

    const cached = reportCache.get(phone);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        setDeliveryReport(cached.data);
        setIsReportLoading(false);
        return;
    }

    setIsReportLoading(true);
    try {
        const report = await getDeliveryReport(phone);
        if (report) {
            reportCache.set(phone, { data: report, timestamp: Date.now() });
            setDeliveryReport(report);
        }
    } finally {
        setIsReportLoading(false);
    }
  }, []);

  const customerHistoryStats = React.useMemo(() => {
    const totalOrders = customerHistory.length;
    const delivered = customerHistory.filter(o => o.status === 'Delivered').length;
    const canceled = customerHistory.filter(o => o.status === 'Canceled').length;
    const returned = customerHistory.filter(o => o.status === 'Returned' || o.status === 'Return Pending').length;
    const processing = totalOrders - (delivered + canceled + returned);
    const recentDate = subHours(new Date(), 48);
    const recentOrders = customerHistory.filter(o => isAfter(new Date(o.date), recentDate));
    
    return { totalOrders, delivered, canceled, returned, processing, recentOrders };
  }, [customerHistory]);

  function onStatusSubmit(data: StatusUpdateFormValues) {
    toast({
        title: "Order Updated",
        description: `Status changed to ${data.status}.`,
    });
  }

  async function onIssueSubmit(data: IssueFormValues) {
    if (!order) return;
    const newIssue = await createIssue(order.id, data.title, data.description, data.priority);
    setRelatedIssues(prev => [newIssue, ...prev]);
    toast({
        title: "Issue Created",
        description: `Issue #${newIssue.id} has been created for order ${order.id}.`,
    });
    setIsIssueDialogOpen(false);
    issueForm.reset();
    router.push(`/dashboard/issues/${newIssue.id}`);
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

  const handleAssignToMe = () => {
    if (order && currentUser) {
      setOrder({ ...order, assignedTo: currentUser.name, assignedToId: currentUser.id });
      toast({
        title: "Order Assigned",
        description: `Order ${order.id} has been assigned to you.`,
      });
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 justify-center items-center">
        <p>Order not found.</p>
        <Button asChild>
          <Link href="/dashboard/orders/all">Go Back to Orders</Link>
        </Button>
      </div>
    );
  }
  
  const whatsappMessage = `Hello ${order.customerName}, regarding your order ${order.id}:\n- Total: ৳${order.total.toFixed(2)}\n- Status: ${order.status}\n\nWe will update you shortly. Thank you!`;
  const subtotal = order.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const total = subtotal + order.shipping;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6 xl:p-8">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/dashboard/orders/all">
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
                    <Link href={`/dashboard/orders/${order.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Order
                    </Link>
                </Button>
                <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Create Issue
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Issue for Order {order.id}</DialogTitle>
                            <DialogDescription>
                                Report a problem or issue related to this order.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...issueForm}>
                            <form onSubmit={issueForm.handleSubmit(onIssueSubmit)} className="space-y-4">
                                <FormField control={issueForm.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Wrong product delivered" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={issueForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Provide a detailed description of the issue..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={issueForm.control} name="priority" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem></SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsIssueDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit">Create Issue</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 md:hidden">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                     <DropdownMenuItem asChild><Link href={`/dashboard/orders/${order.id}/edit`}>Edit Order</Link></DropdownMenuItem>
                     <DropdownMenuItem asChild><Link href={`/dashboard/print/invoice/${order.id}`} target="_blank">Print Invoice</Link></DropdownMenuItem>
                     <DropdownMenuItem asChild><Link href={`/dashboard/print/sticker/${order.id}`} target="_blank">Print Sticker</Link></DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
                        <DialogTrigger asChild>
                           <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>Create Issue</DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                           <DialogHeader>
                                <DialogTitle>Create Issue for Order {order.id}</DialogTitle>
                                <DialogDescription>
                                    Report a problem or issue related to this order.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...issueForm}>
                                <form onSubmit={issueForm.handleSubmit(onIssueSubmit)} className="space-y-4">
                                    <FormField control={issueForm.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Wrong product delivered" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={issueForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Provide a detailed description of the issue..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={issueForm.control} name="priority" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Priority</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger></FormControl>
                                                <SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem></SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsIssueDialogOpen(false)}>Cancel</Button>
                                        <Button type="submit">Create Issue</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                     </Dialog>
                </DropdownMenuContent>
             </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
            <div className="lg:col-span-2 space-y-6">
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

                {relatedIssues.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Related Issues</CardTitle>
                            <CardDescription>
                                All issues associated with this order.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="hidden sm:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Issue ID</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Priority</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {relatedIssues.map(issue => (
                                            <TableRow key={issue.id}>
                                                <TableCell className="font-medium">
                                                    <Link href={`/dashboard/issues/${issue.id}`} className="text-primary hover:underline">{issue.id}</Link>
                                                </TableCell>
                                                <TableCell>{issue.title}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn('text-xs', statusColors[issue.status] || 'bg-gray-500/20 text-gray-700')}>{issue.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={issue.priority === 'High' ? 'destructive' : 'secondary'}>{issue.priority}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="sm:hidden space-y-4">
                                {relatedIssues.map(issue => (
                                     <Card key={issue.id}>
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Link href={`/dashboard/issues/${issue.id}`} className="font-semibold hover:underline">{issue.id}</Link>
                                                    <p className="text-sm text-muted-foreground">{issue.title}</p>
                                                </div>
                                                <Badge variant={issue.priority === 'High' ? 'destructive' : 'secondary'}>{issue.priority}</Badge>
                                            </div>
                                            <Separator className="my-3" />
                                            <div className="flex justify-between items-center">
                                                <Badge variant="outline" className={cn('text-xs', statusColors[issue.status] || 'bg-gray-500/20 text-gray-700')}>{issue.status}</Badge>
                                                <p className="text-xs text-muted-foreground">
                                                    Assigned to: {issue.assignedTo || 'Unassigned'}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                 <Card>
                    <CardHeader><CardTitle className='flex items-center gap-2'><StickyNote className='w-5 h-5 text-muted-foreground' /> Notes</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div><Label className='text-muted-foreground'>Customer Note</Label><p className="text-sm">{order.customerNote || 'No customer note provided.'}</p></div>
                        <div><Label className='text-muted-foreground'>Office Note</Label><p className="text-sm">{order.officeNote || 'No office note provided.'}</p></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Order History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OrderTimeline logs={order.logs} />
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'><User className='w-5 h-5 text-muted-foreground' />Customer & Shipping</CardTitle>
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
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <UserCheck className="w-4 h-4 text-muted-foreground" />
                                    Assigned To
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 pt-0">
                                {order.assignedTo ? (
                                     <div className="flex justify-between items-center">
                                        <span className="font-medium text-sm">{order.assignedTo}</span>
                                        {/* Assuming Admin/Manager can re-assign */}
                                         <Dialog open={isReassignDialogOpen} onOpenChange={setIsReassignDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">Re-assign</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Re-assign Order</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-2">
                                                    <Label>Select Staff</Label>
                                                    <Select>
                                                        <SelectTrigger><SelectValue placeholder="Select a staff member" /></SelectTrigger>
                                                        <SelectContent>
                                                            {allStaff.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsReassignDialogOpen(false)}>Cancel</Button>
                                                    <Button onClick={() => setIsReassignDialogOpen(false)}>Assign</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Unassigned</span>
                                        <Button size="sm" onClick={handleAssignToMe}>Assign to Me</Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
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
                    <CardHeader><CardTitle className='flex items-center gap-2'><CreditCard className='w-5 h-5 text-muted-foreground' />Payment Summary</CardTitle></CardHeader>
                    <CardContent className='space-y-2 text-sm'>
                        <div className="flex items-center justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className='font-mono'>৳{subtotal.toFixed(2)}</dd></div>
                        <div className="flex items-center justify-between"><dt className="text-muted-foreground">Shipping</dt><dd className='font-mono'>৳{order.shipping.toFixed(2)}</dd></div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold"><dt>Total</dt><dd className='font-mono'>৳{total.toFixed(2)}</dd></div>
                        <div className="flex items-center justify-between"><dt className="text-muted-foreground">Paid</dt><dd className='font-mono text-green-600'>৳{order.paidAmount.toFixed(2)}</dd></div>
                        <div className="flex items-center justify-between font-semibold"><dt className={cn(total - order.paidAmount > 0 && "text-destructive")}>Amount Due</dt><dd className={cn("font-mono", total - order.paidAmount > 0 && "text-destructive")}>৳{(total - order.paidAmount).toFixed(2)}</dd></div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader><CardTitle>Order Actions</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Form {...statusForm}>
                            <div className="space-y-4">
                                <FormField control={statusForm.control} name="status" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Update Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                                            <SelectContent>{allStatuses.map(status => (<SelectItem key={status} value={status}>{status}</SelectItem>))}</SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={statusForm.control} name="officeNote" render={({ field }) => (
                                    <FormItem><FormLabel>Update Office Note</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                                )} />
                                <Button className='w-full' onClick={statusForm.handleSubmit(onStatusSubmit)}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
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
                
                <CourierReport report={deliveryReport} isLoading={isReportLoading} />
            </div>
        </div>
    </div>
  );
}
