
"use client";

import Image from "next/image";
import { MoreHorizontal, PlusCircle, UploadCloud } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products } from "@/lib/placeholder-data";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters."),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  regularPrice: z.coerce.number().positive("Price must be a positive number."),
  salePrice: z.coerce.number().optional(),
  sku: z.string().optional(),
  weight: z.coerce.number().optional(),
  length: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  categories: z.string().optional(),
  tags: z.string().optional(),
});

export default function ProductsPage() {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof productSchema>) {
    console.log(values);
    // Here you would typically handle form submission, e.g., send data to your API
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <div className="flex-1">
            <h1 className="font-headline text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your products and view their status.</p>
        </div>
        <div className="flex items-center gap-2">
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
                        <Tabs defaultValue="general">
                            <TabsList className="w-full">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                            </TabsList>
                            <TabsContent value="general" className="mt-6">
                                <Card>
                                    <CardContent className="pt-6 space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="regularPrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Regular price ($)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="25.00" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="salePrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Sale price ($)</FormLabel>
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
                                                    <Input placeholder="TSHIRT-BLK-L" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>
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
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                         <Card>
                            <CardHeader>
                                <CardTitle>Organization</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <FormField
                                    control={form.control}
                                    name="categories"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Categories</FormLabel>
                                        <FormControl>
                                            <Input placeholder="T-Shirts, Apparel" {...field} />
                                        </FormControl>
                                        <FormDescription>Comma-separated values.</FormDescription>
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
              {products.map((product) => (
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
                  <TableCell>${product.price.toFixed(2)}</TableCell>
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
            Showing <strong>1-5</strong> of <strong>{products.length}</strong> products
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
