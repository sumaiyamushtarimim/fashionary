

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Copy,
  CreditCard,
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
  Trash2,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  PackageSearch,
  BookUser,
  StickyNote,
  Printer,
  File,
} from 'lucide-react';
import { format } from 'date-fns';
import * as React from 'react';
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getOrderById, getStatuses } from '@/services/orders';
import { getProducts } from '@/services/products';
import { getBusinesses, getCourierServices } from '@/services/partners';
import type { Product, Business, OrderPlatform, OrderProduct, OrderLog, Order as OrderType, OrderStatus, CourierService } from '@/types';


const statusColors: Record<OrderType['status'], string> = {
    'New': 'bg-blue-500/20 text-blue-700',
    'Confirmed': 'bg-sky-500/20 text-sky-700',
    'Canceled': 'bg-red-500/20 text-red-700',
    'Hold': 'bg-yellow-500/20 text-yellow-700',
    'In-Courier': 'bg-orange-500/20 text-orange-700',
    'RTS (Ready to Ship)': 'bg-purple-500/20 text-purple-700',
    'Shipped': 'bg-cyan-500/20 text-cyan-700',
    'Delivered': 'bg-green-500/20 text-green-700',
    'Returned': 'bg-gray-500/20 text-gray-700',
    'Paid Returned': 'bg-amber-500/20 text-amber-700',
    'Partial': 'bg-fuchsia-500/20 text-fuchsia-700',
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
    'Partial': Truck,
    'Paid Returned': History,
    'Notes updated': FileText, 
    'Order Edited': Edit,
    'Sent to Pathao': Truck,
};


const allPlatforms: OrderPlatform[] = ['TikTok', 'Messenger', 'Facebook', 'Instagram', 'Website'];


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
        <Card className="lg:col-span-2 xl:col-span-1">
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

// Placeholder data for courier stats
const courierStatsData = [
    { name: 'Pathao', total: 12, delivered: 10, canceled: 1 },
    { name: 'RedX', total: 8, delivered: 7, canceled: 1 },
    { name: 'Steadfast', total: 5, delivered: 4, canceled: 0 },
    { name: 'eCourier', total: 3, delivered: 3, canceled: 0 },
];
const totalParcels = courierStatsData.reduce((sum, c) => sum + c.total, 0);
const totalDelivered = courierStatsData.reduce((sum, c) => sum + c.delivered, 0);
const totalCanceled = courierStatsData.reduce((sum, c) => sum + c.canceled, 0);
const deliveryRatio = totalParcels > 0 ? (totalDelivered / totalParcels) * 100 : 0;
const cancelRatio = totalParcels > 0 ? (totalCanceled / totalParcels) * 100 : 0;

const orderFormSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  customerEmail: z.string().email().optional().or(z.literal('')),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  products: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    image: z.any(),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    price: z.number(),
  })).min(1, "Order must have at least one product"),
  shipping: z.coerce.number().min(0, "Shipping cost cannot be negative"),
  status: z.string(), // or z.enum(allStatuses)
  businessId: z.string().optional(),
  platform: z.string().optional(),
  customerNote: z.string().optional(),
  officeNote: z.string().optional(),
});
type OrderFormValues = z.infer<typeof orderFormSchema>;

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = React.useState<OrderType | undefined>(undefined);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [allStatuses, setAllStatuses] = React.useState<OrderStatus[]>([]);
  const [businesses, setBusinesses] = React.useState<Business[]>([]);
  const [courierServices, setCourierServices] = React.useState<CourierService[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [selectedCourier, setSelectedCourier] = React.useState<string | undefined>();
  const [includeCustomerNote, setIncludeCustomerNote] = React.useState(false);
  
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });
  
  const productsWatcher = form.watch("products");
  const shippingWatcher = form.watch("shipping");

  const subtotal = React.useMemo(() => 
    productsWatcher?.reduce((acc, p) => acc + (p.price * p.quantity), 0) || 0, 
    [productsWatcher]
  );
  const tax = subtotal * 0.08;
  const total = subtotal + (shippingWatcher || 0) + tax;


  React.useEffect(() => {
    if (orderId) {
        setIsLoading(true);
        Promise.all([
            getOrderById(orderId),
            getProducts(),
            getBusinesses(),
            getStatuses(),
            getCourierServices()
        ]).then(([orderData, productsData, businessesData, statusesData, couriersData]) => {
            if (orderData) {
                setOrder(orderData);
                form.reset({
                  customerName: orderData.customerName,
                  customerPhone: orderData.customerPhone,
                  customerEmail: orderData.customerEmail,
                  shippingAddress: orderData.shippingAddress.address,
                  products: orderData.products,
                  shipping: 5.0, // Should come from order data
                  status: orderData.status,
                  businessId: orderData.businessId,
                  platform: orderData.platform,
                  customerNote: orderData.customerNote,
                  officeNote: orderData.officeNote,
                });
            }
            setAllProducts(productsData);
            setBusinesses(businessesData);
            setAllStatuses(statusesData);
            setCourierServices(couriersData);
            setIsLoading(false);
        });
    }
  }, [orderId, form]);
  
  const handleEditToggle = () => {
    if (isEditing && order) { // Cancel logic
        form.reset({
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerEmail: order.customerEmail,
          shippingAddress: order.shippingAddress.address,
          products: order.products,
          shipping: 5.0,
          status: order.status,
          businessId: order.businessId,
          platform: order.platform,
          customerNote: order.customerNote,
          officeNote: order.officeNote,
        });
    }
    setIsEditing(!isEditing);
  };
  
  function onSubmit(data: OrderFormValues) {
    console.log("Saving changes...", data);
    // Here you would call an API to save the order
    // e.g., updateOrder(orderId, data).then(...)
    setIsEditing(false);
  }

  const handleAddProduct = () => {
      const firstProduct = allProducts[0];
      if (!firstProduct) return;
      
      append({
          productId: firstProduct.id,
          name: firstProduct.name,
          image: firstProduct.image,
          quantity: 1,
          price: firstProduct.price
      });
  };

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    <Link href={`/print/orders/invoice/${order.id}`} target="_blank">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Invoice
                    </Link>
                </Button>
                 <Button variant="outline" size="sm" asChild>
                    <Link href={`/print/orders/sticker/${order.id}`} target="_blank">
                        <File className="mr-2 h-4 w-4" />
                        Print Sticker
                    </Link>
                </Button>
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" type="button" onClick={handleEditToggle}>Cancel</Button>
                  <Button size="sm" type="submit"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
                </>
              ) : (
                <Button variant="outline" size="sm" type="button" onClick={handleEditToggle}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Order
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-3.5 w-3.5" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader className="hidden sm:table-header-group">
                      <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        {isEditing && <TableHead><span className="sr-only">Actions</span></TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="flex flex-col sm:table-row-group gap-4">
                      {fields.map((product, index) => (
                        <TableRow key={product.id} className="flex sm:table-row flex-col sm:flex-row rounded-lg border sm:border-0 p-4 sm:p-0">
                          <TableCell className="p-0 sm:p-4 w-[80px] hidden sm:table-cell">
                            <Image
                              alt={product.name}
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={product.image.imageUrl}
                              width="64"
                            />
                          </TableCell>
                           <TableCell className="font-medium p-0 sm:p-4 w-full">
                                <div className="flex items-start gap-4 pb-4 sm:pb-0 border-b sm:border-0">
                                    <Image
                                        alt={product.name}
                                        className="aspect-square rounded-md object-cover sm:hidden"
                                        height="64"
                                        src={product.image.imageUrl}
                                        width="64"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-sm text-muted-foreground">SKU-452-187</p>
                                    </div>
                                    {isEditing && (
                                        <Button variant="ghost" size="icon" className="text-destructive" type="button" onClick={() => remove(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <div className="sm:hidden pt-4">
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="col-span-1">
                                            <p className="text-sm text-muted-foreground">Qty</p>
                                             {isEditing ? (
                                                <FormField
                                                  control={form.control}
                                                  name={`products.${index}.quantity`}
                                                  render={({ field }) => (
                                                    <Input type="number" {...field} className="h-8 w-16 text-center"/>
                                                  )}
                                                />
                                            ) : (
                                                <p className="font-medium">{product.quantity}</p>
                                            )}
                                        </div>
                                        <div className="col-span-1 text-right">
                                            <p className="text-sm text-muted-foreground">Price</p>
                                            <p className="font-medium">৳{product.price.toFixed(2)}</p>
                                        </div>
                                         <div className="col-span-1 text-right">
                                            <p className="text-sm text-muted-foreground">Total</p>
                                            <p className="font-medium">৳{(product.price * product.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                          <TableCell className="hidden sm:table-cell">SKU-452-187</TableCell>
                          <TableCell className="p-0 sm:p-4 text-right hidden sm:table-cell">
                              {isEditing ? (
                                <FormField
                                  control={form.control}
                                  name={`products.${index}.quantity`}
                                  render={({ field }) => (
                                    <Input type="number" {...field} className="h-8 w-16 text-center ml-auto"/>
                                  )}
                                />
                              ) : (
                                product.quantity
                              )}
                          </TableCell>
                          <TableCell className="p-0 sm:p-4 text-right hidden sm:table-cell">
                            ৳{product.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="p-0 sm:p-4 text-right hidden sm:table-cell">
                            ৳{(product.price * product.quantity).toFixed(2)}
                          </TableCell>
                           {isEditing && (
                                <TableCell className="hidden sm:table-cell">
                                    <Button variant="ghost" size="icon" className="text-destructive" type="button" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {isEditing && (
                      <div className="mt-4">
                          <Button variant="outline" size="sm" type="button" onClick={handleAddProduct}><PlusCircle className="mr-2 h-4 w-4" />Add Product</Button>
                      </div>
                  )}
                </CardContent>
                <CardFooter>
                    <div className='w-full space-y-2'>
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Subtotal</dt>
                            <dd>৳{subtotal.toFixed(2)}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Shipping</dt>
                             {isEditing ? (
                                <FormField
                                  control={form.control}
                                  name="shipping"
                                  render={({ field }) => (
                                    <Input type="number" {...field} className="h-8 w-24 text-right" />
                                  )}
                                />
                            ) : (
                                <dd>৳{shippingWatcher.toFixed(2)}</dd>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Tax</dt>
                            <dd>৳{tax.toFixed(2)}</dd>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold text-lg">
                            <dt>Total</dt>
                            <dd>৳{total.toFixed(2)}</dd>
                        </div>
                    </div>
                </CardFooter>
              </Card>
              <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Delivery & Courier Report</CardTitle>
                        <CardDescription>
                            Parcel history for customer phone number: {order.customerPhone}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
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
                         <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                 <div className="flex justify-between items-center text-sm">
                                     <span className="font-semibold">Delivery Ratio</span>
                                     <span className="font-bold text-green-600">{deliveryRatio.toFixed(1)}%</span>
                                 </div>
                                 <Progress value={deliveryRatio} className="h-2 [&>div]:bg-green-500" />
                             </div>
                              <div className="space-y-1">
                                 <div className="flex justify-between items-center text-sm">
                                     <span className="font-semibold">Cancel Ratio</span>
                                     <span className="font-bold text-red-500">{cancelRatio.toFixed(1)}%</span>
                                 </div>
                                 <Progress value={cancelRatio} className="h-2 [&>div]:bg-red-500" />
                             </div>
                         </div>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1 grid auto-rows-max gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="space-y-2">
                            <p className="font-medium">Order Date</p>
                            <p className="text-muted-foreground">{format(new Date(order.date), "MMM d, yyyy")}</p>
                        </div>
                         <Separator />
                         <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Update Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {allStatuses.map(status => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                         <Button className='w-full' type="submit">Save Changes</Button>
                    </CardContent>
                </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Customer & Shipping</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {isEditing ? (
                        <>
                            <FormField name="customerName" control={form.control} render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name="customerPhone" control={form.control} render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name="customerEmail" control={form.control} render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name="shippingAddress" control={form.control} render={({ field }) => (<FormItem><FormLabel>Shipping Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="font-medium">{order.customerName}</div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" type="button"><Copy className="h-4 w-4" /><span className="sr-only">Copy</span></Button>
                            </div>
                            <div className="text-sm text-muted-foreground"><p>1 order</p></div>
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
                                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild><a href={`https://wa.me/${order.customerPhone.replace(/\+/g, '')}?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="h-4 w-4" /></a></Button>
                                </div>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid gap-2">
                                <div className="font-medium">Shipping Information</div>
                                <address className="not-italic text-muted-foreground">{order.shippingAddress.address}</address>
                            </div>
                        </>
                    )}
                </CardContent>
              </Card>
               <Card>
                    <CardHeader>
                        <CardTitle>Order Source</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="businessId" render={({ field }) => (
                            <FormItem><FormLabel>Business</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a business" /></SelectTrigger></FormControl>
                                    <SelectContent>{businesses.map(b => (<SelectItem key={b.id} value={b.id}><div className="flex items-center gap-2"><Store className="h-4 w-4 text-muted-foreground" /><span>{b.name}</span></div></SelectItem>))}</SelectContent>
                                </Select>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="platform" render={({ field }) => (
                            <FormItem><FormLabel>Platform</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a platform" /></SelectTrigger></FormControl>
                                    <SelectContent>{allPlatforms.map(p => (<SelectItem key={p} value={p}><div className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /><span>{p}</span></div></SelectItem>))}</SelectContent>
                                </Select>
                            </FormItem>
                        )}/>
                    </CardContent>
                </Card>
            </div>
          </div>
           <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mt-4">
              <OrderHistory logs={order.logs} />
              <Card>
                <CardHeader>
                    <CardTitle>Courier Management</CardTitle>
                    <CardDescription>Send this order to a courier service for delivery.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="courier">Courier Service</Label>
                            <Select value={selectedCourier} onValueChange={setSelectedCourier}>
                                <SelectTrigger id="courier">
                                    <SelectValue placeholder="Select a courier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courierServices.map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="include-customer-note" checked={includeCustomerNote} onCheckedChange={(checked) => setIncludeCustomerNote(!!checked)} />
                            <label
                                htmlFor="include-customer-note"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Include Customer Note
                            </label>
                        </div>
                        {selectedCourier && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button className="w-full" type="button">
                                        <Truck className="mr-2 h-4 w-4" /> Send to {selectedCourier}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirm Order Dispatch</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will send the order details for <strong>{order.id}</strong> to <strong>{selectedCourier}</strong> for delivery. Are you sure you want to proceed?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction>Confirm & Send</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="customerNote" render={({ field }) => (<FormItem><FormLabel>Customer Note</FormLabel><FormControl><Textarea placeholder="No customer note provided." {...field} readOnly={!isEditing}/></FormControl></FormItem>)} />
                    <FormField control={form.control} name="officeNote" render={({ field }) => (<FormItem><FormLabel>Office Note</FormLabel><FormControl><Textarea placeholder="Add an internal note..." {...field} readOnly={!isEditing}/></FormControl></FormItem>)} />
                </CardContent>
            </Card>
           </div>
        </div>
      </form>
    </Form>
  );
}
