
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ChevronLeft,
  UploadCloud,
  X,
  ChevronsUpDown,
  Check,
  PlusCircle,
  Save,
  Trash2,
  Loader2
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getOrderById, getStatuses } from '@/services/orders';
import { getProducts } from '@/services/products';
import { getBusinesses } from '@/services/partners';
import type { Product, Order, OrderStatus, Business, OrderPlatform } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

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
  customerNote: z.string().optional(),
  officeNote: z.string().optional(),
});
type OrderFormValues = z.infer<typeof orderFormSchema>;

export default function EditOrderPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.id as string;
  
  const [order, setOrder] = React.useState<Order | undefined>(undefined);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [allStatuses, setAllStatuses] = React.useState<OrderStatus[]>([]);
  const [allBusinesses, setAllBusinesses] = React.useState<Business[]>([]);
  const [allPlatforms, setAllPlatforms] = React.useState<OrderPlatform[]>(['TikTok', 'Messenger', 'Facebook', 'Instagram', 'Website']);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

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
      customerNote: '',
      officeNote: '',
    },
  });

  React.useEffect(() => {
      setIsLoading(true);
      Promise.all([
          getOrderById(orderId),
          getProducts(),
          getStatuses(),
          getBusinesses(),
      ]).then(([orderData, productsData, statusesData, businessesData]) => {
          setOrder(orderData);
          setAllProducts(productsData);
          setAllStatuses(statusesData);
          setAllBusinesses(businessesData);

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
              customerNote: orderData.customerNote || '',
              officeNote: orderData.officeNote || '',
            });
          }
          setIsLoading(false);
      })
  }, [orderId, form]);

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
                        <Link href={orderId.startsWith('INC') ? `/dashboard/orders/incomplete` : `/dashboard/orders`}>
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
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Image</TableHead>
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
                                    <TableCell>
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
                                    <TableCell className="text-right">৳{product.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">৳{(product.price * product.quantity).toFixed(2)}</TableCell>
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
                            <CardHeader>
                                <CardTitle>Payment Summary</CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>৳{subtotal.toFixed(2)}</dd></div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-muted-foreground">Shipping</dt>
                                        <FormField
                                            control={form.control}
                                            name="shipping"
                                            render={({ field }) => (<Input type="number" {...field} className="h-8 w-24 text-right" />)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between"><dt className="text-muted-foreground">Tax (8%)</dt><dd>৳{tax.toFixed(2)}</dd></div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between font-semibold text-lg"><dt>Total</dt><dd>৳{total.toFixed(2)}</dd></div>
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
                            <CardHeader><CardTitle>Order Status</CardTitle></CardHeader>
                            <CardContent>
                                 <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                                                <SelectContent>{allStatuses.map(status => (<SelectItem key={status} value={status}>{status}</SelectItem>))}</SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Customer & Shipping</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField name="customerName" control={form.control} render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="customerPhone" control={form.control} render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="customerEmail" control={form.control} render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="shippingAddress" control={form.control} render={({ field }) => (<FormItem><FormLabel>Shipping Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Order Source</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="businessId" render={({ field }) => (
                                    <FormItem><FormLabel>Business</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a business" /></SelectTrigger></FormControl>
                                            <SelectContent>{allBusinesses.map(b => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}</SelectContent>
                                        </Select>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="platform" render={({ field }) => (
                                    <FormItem><FormLabel>Platform</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a platform" /></SelectTrigger></FormControl>
                                            <SelectContent>{allPlatforms.map(p => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent>
                                        </Select>
                                    </FormItem>
                                )}/>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    </div>
  );
}

