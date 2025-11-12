

'use client';

import Image from "next/image";
import { MoreHorizontal, PlusCircle, UploadCloud, X, ChevronsUpDown, Check } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as React from "react";

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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products, categories, Category } from "@/lib/placeholder-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const attributeSchema = z.object({
  name: z.string().min(1, "Attribute name is required."),
  options: z.string().min(1, "Attribute options are required."),
});

const variationSchema = z.object({
    id: z.string(),
    attributes: z.record(z.string()),
    sku: z.string().optional(),
    regularPrice: z.coerce.number().optional(),
    salePrice: z.coerce.number().optional(),
    image: z.string().optional(),
})

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters."),
  slug: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  productType: z.enum(['simple', 'variable', 'combo']).default('simple'),
  
  // Simple Product Fields
  regularPrice: z.coerce.number().optional(),
  salePrice: z.coerce.number().optional(),
  sku: z.string().optional(),
  
  weight: z.coerce.number().optional(),
  length: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  
  // Category
  categoryId: z.string().optional(),
  tags: z.string().optional(),

  // Fabric Consumption
  ornaFabric: z.coerce.number().optional(),
  jamaFabric: z.coerce.number().optional(),
  selowarFabric: z.coerce.number().optional(),

  // Variable Product Fields
  attributes: z.array(attributeSchema).optional(),
  variations: z.array(variationSchema).optional(),

  // Combo Product Fields
  comboProducts: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductsPage() {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [categoryFilter, setCategoryFilter] = React.useState("all");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      productType: "simple",
      attributes: [{ name: "", options: "" }],
      variations: [],
      comboProducts: [],
    },
  });

  const { fields: attributeFields, append: appendAttribute, remove: removeAttribute } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const { fields: variationFields, replace: replaceVariations } = useFieldArray({
      control: form.control,
      name: "variations",
  });

  const productType = form.watch("productType");
  const selectedCategoryId = form.watch("categoryId");

  const isThreePieceCategory = React.useMemo(() => {
    if (!selectedCategoryId) return false;
    let currentCategory = categories.find(c => c.id === selectedCategoryId);
    while (currentCategory) {
        if (currentCategory.name === 'Three-Piece') {
            return true;
        }
        currentCategory = categories.find(c => c.id === currentCategory?.parentId);
    }
    return false;
  }, [selectedCategoryId]);

  const filteredProducts = React.useMemo(() => {
    if (categoryFilter === 'all') return products;
    return products.filter(p => {
        let currentCategory = categories.find(c => c.id === p.categoryId);
        while(currentCategory) {
            if (currentCategory.id === categoryFilter) return true;
            currentCategory = categories.find(c => c.id === currentCategory?.parentId);
        }
        return false;
    });
  }, [categoryFilter]);

  function generateVariations() {
    const attributes = form.getValues("attributes");
    if (!attributes || attributes.length === 0) return;

    const validAttributes = attributes.filter(attr => attr.name && attr.options);
    if(validAttributes.length === 0) return;

    const combinations = validAttributes.reduce((acc, attr) => {
        const options = attr.options.split(',').map(o => o.trim());
        if (acc.length === 0) {
            return options.map(o => ({ [attr.name]: o }));
        }
        return acc.flatMap(combo => options.map(o => ({ ...combo, [attr.name]: o })));
    }, [] as Record<string, string>[]);

    const newVariations = combinations.map((combo, index) => ({
        id: `var_${Date.now()}_${index}`,
        attributes: combo,
        sku: "",
        regularPrice: undefined,
        salePrice: undefined,
        image: "",
    }));
    
    replaceVariations(newVariations);
  }

  function onSubmit(values: ProductFormValues) {
    console.log(values);
    // Here you would typically handle form submission, e.g., send data to your API
  }

  const selectedComboProducts = form.watch('comboProducts') || [];
  const comboProductDetails = products.filter(p => selectedComboProducts.includes(p.id));

  const mainCategories = categories.filter(c => !c.parentId);
  const subCategories = (parentId: string) => categories.filter(c => c.parentId === parentId);


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
            <h1 className="font-headline text-2xl font-bold hidden sm:block">Products</h1>
            <p className="text-muted-foreground hidden sm:block">Manage your products and view their status.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {mainCategories.map(cat => (
                        <React.Fragment key={cat.id}>
                            <SelectItem value={cat.id}>{cat.name}</SelectItem>
                            {subCategories(cat.id).map(subCat => (
                                <SelectItem key={subCat.id} value={subCat.id} className="pl-8">
                                    {subCat.name}
                                </SelectItem>
                            ))}
                        </React.Fragment>
                    ))}
                </SelectContent>
            </Select>
          <Button size="sm" variant="outline">
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details below. The product will be saved as a draft.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto pr-6 -mr-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                <Input placeholder="e.g. Organic Cotton T-Shirt" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                <Input placeholder="e.g. organic-cotton-t-shirt" {...field} />
                                </FormControl>
                                <FormDescription>This is the URL-friendly version of the name.</FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Provide a detailed description of the product." rows={8} {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <Card>
                            <CardHeader>
                                <CardTitle>Product Images</CardTitle>
                                <CardDescription>Upload images for your product.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                                    <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                    <p className="mt-4 text-sm text-muted-foreground">Drag and drop files here, or click to browse.</p>
                                    <Button variant="outline" className="mt-4">Browse Files</Button>
                                </div>
                            </CardContent>
                        </Card>
                        {productType === 'variable' && (
                            <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Attributes</CardTitle>
                                    <CardDescription>Define attributes like size or color.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                {attributeFields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-10 gap-2 items-start">
                                        <FormField
                                            control={form.control}
                                            name={`attributes.${index}.name`}
                                            render={({ field }) => (
                                            <FormItem className="col-span-4">
                                                <FormLabel className={index !== 0 ? "sr-only" : ""}>Name</FormLabel>
                                                <FormControl>
                                                <Input placeholder="e.g. Color" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`attributes.${index}.options`}
                                            render={({ field }) => (
                                            <FormItem className="col-span-5">
                                                <FormLabel className={index !== 0 ? "sr-only" : ""}>Values</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Red, Blue, Green" {...field} />
                                                </FormControl>
                                                <FormDescription className="sr-only">Comma-separated values.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <div className={cn("col-span-1 flex items-end h-10", index === 0 && "pt-8")}>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeAttribute(index)} className="text-muted-foreground hover:text-destructive">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => appendAttribute({ name: '', options: '' })}>Add Attribute</Button>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Variations</CardTitle>
                                        <CardDescription>Manage product variations.</CardDescription>
                                    </div>
                                    <Button type="button" variant="outline" size="sm" onClick={generateVariations}>Create variations from all attributes</Button>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="multiple" className="w-full">
                                        {variationFields.map((field, index) => (
                                            <AccordionItem value={field.id} key={field.id}>
                                                <AccordionTrigger>{Object.values(field.attributes).join(' / ')}</AccordionTrigger>
                                                <AccordionContent>
                                                     <div className="grid grid-cols-2 gap-4">
                                                        <div className="col-span-2 flex items-center gap-4">
                                                            <div className="border-2 border-dashed border-muted-foreground/50 rounded-md p-4 flex flex-col items-center justify-center text-center w-24 h-24">
                                                                <UploadCloud className="w-6 h-6 text-muted-foreground" />
                                                                <span className="text-xs mt-1">Image</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4 flex-1">
                                                                <FormField
                                                                    control={form.control}
                                                                    name={`variations.${index}.regularPrice`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                        <FormLabel>Regular price</FormLabel>
                                                                        <FormControl>
                                                                            <Input type="number" placeholder="25.00" {...field} />
                                                                        </FormControl>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                 <FormField
                                                                    control={form.control}
                                                                    name={`variations.${index}.salePrice`}
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                        <FormLabel>Sale price</FormLabel>
                                                                        <FormControl>
                                                                            <Input type="number" placeholder="19.99" {...field} />
                                                                        </FormControl>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                        <FormField
                                                            control={form.control}
                                                            name={`variations.${index}.sku`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                <FormLabel>SKU</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="TSHIRT-BLK-L" {...field} />
                                                                </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                     </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardContent>
                            </Card>
                            </>
                        )}
                        {productType === 'combo' && (
                           <Card>
                                <CardHeader>
                                    <CardTitle>Combo Products</CardTitle>
                                    <CardDescription>Select products to include in this combo.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                     <FormField
                                        control={form.control}
                                        name="comboProducts"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                            <FormLabel>Select Products</FormLabel>
                                            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                                <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value?.length && "text-muted-foreground"
                                                    )}
                                                    >
                                                    {field.value?.length ? `${field.value.length} selected` : "Select products"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search product..." />
                                                        <CommandList>
                                                        <CommandEmpty>No product found.</CommandEmpty>
                                                        <CommandGroup>
                                                        {products.map((product) => (
                                                            <CommandItem
                                                                key={product.id}
                                                                value={product.name}
                                                                onSelect={() => {
                                                                    const currentValue = field.value || [];
                                                                    const newValue = currentValue.includes(product.id)
                                                                        ? currentValue.filter((id) => id !== product.id)
                                                                        : [...currentValue, product.id];
                                                                    field.onChange(newValue);
                                                                }}
                                                            >
                                                                <div className={cn(
                                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                                    field.value?.includes(product.id)
                                                                    ? "bg-primary text-primary-foreground"
                                                                    : "opacity-50 [&_svg]:invisible"
                                                                )}>
                                                                    <Check className="h-4 w-4" />
                                                                </div>
                                                                {product.name}
                                                            </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                These products will be bundled together.
                                            </FormDescription>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                        <div className="mt-4 space-y-2">
                                            <Label>Selected Products</Label>
                                            {comboProductDetails.length > 0 ? (
                                                <div className="rounded-md border">
                                                    <Table>
                                                        <TableBody>
                                                        {comboProductDetails.map(product => (
                                                            <TableRow key={product.id}>
                                                                <TableCell>
                                                                    <Image src={product.image.imageUrl} alt={product.name} width={40} height={40} className="rounded-md" />
                                                                </TableCell>
                                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                                <TableCell className="text-right">৳{product.price.toFixed(2)}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-muted-foreground text-center py-4">No products selected.</div>
                                            )}
                                        </div>
                                </CardContent>
                           </Card>
                        )}
                         <FormField
                            control={form.control}
                            name="shortDescription"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Product short description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="A short and catchy description." rows={3} {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="md:col-span-1 space-y-6">
                        <Card>
                             <CardHeader>
                                <CardTitle>Product Data</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="productType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a product type" />
                                                </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="simple">Simple product</SelectItem>
                                                    <SelectItem value="variable">Variable product</SelectItem>
                                                    <SelectItem value="combo">Combo product</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {(productType === 'simple' || productType === 'combo') && (
                            <Tabs defaultValue="general">
                                <TabsList className="w-full">
                                    <TabsTrigger value="general">General</TabsTrigger>
                                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                                    {(productType === 'simple') && <TabsTrigger value="shipping">Shipping</TabsTrigger>}
                                </TabsList>
                                <TabsContent value="general" className="mt-6">
                                    <Card>
                                        <CardContent className="pt-6 space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="regularPrice"
                                                render={({ field }) => (
                                                    <FormItem>
                                                    <FormLabel>Regular price (৳)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="25.00" {...field} disabled={productType === 'combo'} />
                                                    </FormControl>
                                                    {productType === 'combo' && <FormDescription>Auto-calculated from selected products.</FormDescription>}
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="salePrice"
                                                render={({ field }) => (
                                                    <FormItem>
                                                    <FormLabel>Sale price (৳)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="19.99" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Leave blank to not have a sale.</FormDescription>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="inventory" className="mt-6">
                                    <Card>
                                        <CardContent className="pt-6 space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="sku"
                                                render={({ field }) => (
                                                    <FormItem>
                                                    <FormLabel>SKU</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="COMBO-001" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                              {productType === 'combo' && (
                                                <div className="text-sm text-muted-foreground p-4 border rounded-md bg-muted/50">
                                                    <p className="font-medium">Stock Management</p>
                                                    <p>The stock for a combo product is managed by the inventory of its component products. You do not need to set stock manually.</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                {productType === 'simple' && (
                                    <TabsContent value="shipping" className="mt-6">
                                        <Card>
                                            <CardContent className="pt-6 space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="weight"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                        <FormLabel>Weight (kg)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="0.5" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div>
                                                    <Label>Dimensions (cm)</Label>
                                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                                        <FormField control={form.control} name="length" render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="L" {...field} /></FormControl></FormItem>)} />
                                                        <FormField control={form.control} name="width" render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="W" {...field} /></FormControl></FormItem>)} />
                                                        <FormField control={form.control} name="height" render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="H" {...field} /></FormControl></FormItem>)} />
                                                    </div>
                                                </div>
                                                {isThreePieceCategory && (
                                                    <div className="pt-4">
                                                        <Label>Fabric Consumption (yards)</Label>
                                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                                            <FormField control={form.control} name="ornaFabric" render={({ field }) => (<FormItem><FormLabel className="text-xs font-light">Orna</FormLabel><FormControl><Input type="number" placeholder="2.5" {...field} /></FormControl></FormItem>)} />
                                                            <FormField control={form.control} name="jamaFabric" render={({ field }) => (<FormItem><FormLabel className="text-xs font-light">Jama</FormLabel><FormControl><Input type="number" placeholder="3.0" {...field} /></FormControl></FormItem>)} />
                                                            <FormField control={form.control} name="selowarFabric" render={({ field }) => (<FormItem><FormLabel className="text-xs font-light">Selowar</FormLabel><FormControl><Input type="number" placeholder="2.0" {...field} /></FormControl></FormItem>)} />
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                )}
                            </Tabs>
                        )}


                         <Card>
                            <CardHeader>
                                <CardTitle>Organization</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {mainCategories.map(cat => (
                                                    <React.Fragment key={cat.id}>
                                                        <SelectItem value={cat.id}>{cat.name}</SelectItem>
                                                        {subCategories(cat.id).map(subCat => (
                                                            <SelectItem key={subCat.id} value={subCat.id} className="pl-8">
                                                                {subCat.name}
                                                            </SelectItem>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cotton, Eco-friendly" {...field} />
                                        </FormControl>
                                        <FormDescription>Comma-separated values.</FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                    </div>
                  </div>
                </form>
              </Form>
              <DialogFooter className="border-t pt-4 mt-auto">
                <Button variant="outline">Save Draft</Button>
                <Button type="submit" form="add-product-form">Publish Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  Inventory
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={product.image.imageUrl}
                      width="64"
                      data-ai-hint={product.image.imageHint}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>৳{product.price.toFixed(2)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.inventory}
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
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
            Showing <strong>1-{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

    
