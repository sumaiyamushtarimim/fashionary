
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ChevronLeft,
  X,
  PlusCircle,
  Save,
  Trash2,
  Loader2,
  Store,
  Globe,
  PackageSearch,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { getOrderById, getStatuses } from '@/services/orders';
import { getProducts } from '@/services/products';
import { getBusinesses } from '@/services/partners';
import { getStaff } from '@/services/staff';
import { getDeliveryReport, type DeliveryReport } from '@/services/delivery-score';
import type { Product, Order, OrderStatus, Business, OrderPlatform, StaffMember } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

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
  status: z.string(),
  businessId: z.string().optional(),
  platform: z.string().optional(),
  assignedToId: z.string().optional(),
  customerNote: z.string().optional(),
  officeNote: z.string().optional(),
});
type OrderFormValues = z.infer<typeof orderFormSchema>;

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
                    <CardTitle>Courier Delivery Report</CardTitle>
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
                    <CardTitle>Courier Delivery Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-4 flex flex-col items-center gap-2">
                        <PackageSearch className="w-8 h-8" />
                        <span>Enter a valid phone number to see the report.</span>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Courier Delivery Report</CardTitle>
                <CardDescription>
                    Parcel history for the entered phone number.
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

export default function EditOrderPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.id as string;
  
  const [order, setOrder] = React.useState<Order | undefined>(undefined);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [allStatuses, setAllStatuses] = React.useState<OrderStatus[]>([]);
  const [allBusinesses, setAllBusinesses] = React.useState<Business[]>([]);
  const [allStaff, setAllStaff] = React.useState<StaffMember[]>([]);
  const [allPlatforms, setAllPlatforms] = React.useState<OrderPlatform[]>(['TikTok', 'Messenger', 'Facebook', 'Instagram', 'Website']);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  
  const [deliveryReport, setDeliveryReport] = React.useState<DeliveryReport | null>(null);
  const [isReportLoading, setIsReportLoading] = React.useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      shippingAddress: '',
      products: [],
      shipping: 0,
      status: 'New',
      businessId: '',
      platform: 'Website',
      assignedToId: undefined,
      customerNote: '',
      officeNote: '',
    },
  });
  
  const customerPhoneWatcher = form.watch('customerPhone');

  React.useEffect(() => {
      setIsLoading(true);
      Promise.all([
          getOrderById(orderId),
          getProducts(),
          getStatuses(),
          getBusinesses(),
          getStaff(),
      ]).then(([orderData, productsData, statusesData, businessesData, staffData]) => {
          setOrder(orderData);
          setAllProducts(productsData);
          setAllStatuses(statusesData);
          setAllBusinesses(businessesData);
          setAllStaff(staffData);

          if (orderData) {
            form.reset({
              customerName: orderData.customerName || '',
              customerPhone: orderData.customerPhone || '',
              customerEmail: orderData.customerEmail || '',
              shippingAddress: orderData.shippingAddress?.address || '',
              products: orderData.products || [],
              shipping: orderData.shipping || 0,
              status: orderData.status || 'New',
              businessId: orderData.businessId || '',
              platform: orderData.platform || undefined,
              assignedToId: orderData.assignedToId || undefined,
              customerNote: orderData.customerNote || '',
              officeNote: orderData.officeNote || '',
            });
          }
          setIsLoading(false);
      })
  }, [orderId, form]);
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
        if (customerPhoneWatcher && customerPhoneWatcher.length >= 11) {
            setIsReportLoading(true);
            getDeliveryReport(customerPhoneWatcher)
                .then(report => {
                    setDeliveryReport(report);
                })
                .finally(() => {
                    setIsReportLoading(false);
                });
        } else {
            setDeliveryReport(null);
        }
    }, 500); // Debounce API call

    return () => {
        clearTimeout(handler);
    };
}, [customerPhoneWatcher]);

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
  const total = subtotal + (shippingWatcher || 0);

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

  function onSubmit(values: OrderFormValues) {
    setIsSaving(true);
    console.log("Saving order changes:", values);
    setTimeout(() => {
      setIsSaving(false);
      toast({
          title: "Order Updated",
          description: `Changes for order ${orderId} have been successfully saved.`
      });
      router.push(`/dashboard/orders/${orderId}`);
    }, 1500);
  }

  if (isLoading) {
    return <div className="p-6">Loading order...</div>
  }
  
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                        <Link href={orderId.startsWith('INC') ? `/dashboard/orders/incomplete` : `/dashboard/orders/${orderId}`}>
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="font-headline text-xl font-semibold sm:text-2xl">
                           {orderId.startsWith('INC') ? `Convert Order ${orderId}` : `Edit Order ${orderId}`}
                        </h1>
                    </div>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer & Shipping</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField name="customerName" control={form.control} render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="customerPhone" control={form.control} render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="customerEmail" control={form.control} render={({ field }) => (<FormItem className="sm:col-span-2"><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="shippingAddress" control={form.control} render={({ field }) => (<FormItem className="sm:col-span-2"><FormLabel>Shipping Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </CardContent>
                        </Card>
                         <CourierReport report={deliveryReport} isLoading={isReportLoading} />
                         <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-center w-[120px]">Qty</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {fields.map((product, index) => (
                                    <TableRow key={product.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        <Image alt={product.name} className="aspect-square rounded-md object-cover" height="64" src={product.image.imageUrl} width="64"/>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                         <FormField
                                            control={form.control}
                                            name={`products.${index}.quantity`}
                                            render={({ field }) => (
                                                <Input type="number" {...field} className="h-8 w-20 text-center mx-auto"/>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right font-mono">৳{product.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono">৳{(product.price * product.quantity).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="text-destructive float-right" type="button" onClick={() => remove(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4">
                                <Button variant="outline" size="sm" type="button" onClick={handleAddProduct}><PlusCircle className="mr-2 h-4 w-4" />Add Product</Button>
                            </div>
                            </CardContent>
                        </Card>
                        
                         <Card>
                            <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="customerNote" render={({ field }) => (<FormItem><FormLabel>Customer Note</FormLabel><FormControl><Textarea placeholder="No customer note provided." {...field} /></FormControl></FormItem>)} />
                                <FormField control={form.control} name="officeNote" render={({ field }) => (<FormItem><FormLabel>Office Note</FormLabel><FormControl><Textarea placeholder="Add an internal note..." {...field} /></FormControl></FormItem>)} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Order Actions</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Order Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                                                <SelectContent>{allStatuses.map(status => (<SelectItem key={status} value={status}>{status}</SelectItem>))}</SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField control={form.control} name="businessId" render={({ field }) => (
                                    <FormItem><FormLabel>Business</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><div className="flex items-center gap-2"><Store className="h-4 w-4 text-muted-foreground" /><span><SelectValue placeholder="Select a business" /></span></div></SelectTrigger></FormControl>
                                            <SelectContent>{allBusinesses.map(b => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}</SelectContent>
                                        </Select>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="platform" render={({ field }) => (
                                    <FormItem><FormLabel>Platform</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><div className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /><span><SelectValue placeholder="Select a platform" /></span></div></SelectTrigger></FormControl>
                                            <SelectContent>{allPlatforms.map(p => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent>
                                        </Select>
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="assignedToId" render={({ field }) => (
                                    <FormItem><FormLabel>Assign To</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><span><SelectValue placeholder="Assign to a staff member" /></span></div></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="unassigned">Unassigned</SelectItem>{allStaff.map(s => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}</SelectContent>
                                        </Select>
                                    </FormItem>
                                )}/>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Summary</CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4 text-sm'>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-mono">৳{subtotal.toFixed(2)}</dd></div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-muted-foreground">Shipping</dt>
                                        <FormField
                                            control={form.control}
                                            name="shipping"
                                            render={({ field }) => (<Input type="number" {...field} className="h-8 w-24 text-right font-mono" />)}
                                        />
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between font-semibold text-lg"><dt>Total</dt><dd className="font-mono">৳{total.toFixed(2)}</dd></div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    </div>
  );
}

    