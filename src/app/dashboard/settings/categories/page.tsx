

'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categories, Category, expenseCategories, ExpenseCategory } from "@/lib/placeholder-data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CategoriesPage() {
    const [isProductCatDialogOpen, setIsProductCatDialogOpen] = React.useState(false);
    const [isExpenseCatDialogOpen, setIsExpenseCatDialogOpen] = React.useState(false);

    const categoryMap = React.useMemo(() => new Map(categories.map(c => [c.id, c.name])), []);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <div className="flex-1">
                    <h1 className="font-headline text-2xl font-bold">Category Management</h1>
                    <p className="text-muted-foreground hidden sm:block">Organize your products and expenses by creating and managing categories.</p>
                </div>
            </div>
            
            <Tabs defaultValue="product" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="product">Product Categories</TabsTrigger>
                    <TabsTrigger value="expense">Expense Categories</TabsTrigger>
                </TabsList>
                
                <TabsContent value="product">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                           <div>
                                <CardTitle>Product Categories</CardTitle>
                                <CardDescription>Manage categories for your products.</CardDescription>
                           </div>
                            <Dialog open={isProductCatDialogOpen} onOpenChange={setIsProductCatDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Product Category
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Add New Product Category</DialogTitle>
                                        <DialogDescription>
                                            Create a new category or sub-category for your products.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Category Name</Label>
                                            <Input id="name" placeholder="e.g., Menswear" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="parent">Parent Category</Label>
                                            <Select>
                                                <SelectTrigger id="parent">
                                                    <SelectValue placeholder="Select a parent category (optional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">None</SelectItem>
                                                    {categories.filter(c => !c.parentId).map(cat => (
                                                        <React.Fragment key={cat.id}>
                                                            <SelectItem value={cat.id}>{cat.name}</SelectItem>
                                                            {categories.filter(sub => sub.parentId === cat.id).map(subCat => (
                                                                <SelectItem key={subCat.id} value={subCat.id} className="pl-8">
                                                                    {subCat.name}
                                                                </SelectItem>
                                                            ))}
                                                        </React.Fragment>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsProductCatDialogOpen(false)}>Cancel</Button>
                                        <Button type="submit">Save Category</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category Name</TableHead>
                                        <TableHead>Parent Category</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell>
                                                {category.parentId ? categoryMap.get(category.parentId) : '—'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="expense">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Expense Categories</CardTitle>
                                <CardDescription>Manage categories for your business expenses.</CardDescription>
                            </div>
                            <Dialog open={isExpenseCatDialogOpen} onOpenChange={setIsExpenseCatDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Expense Category
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Add New Expense Category</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="exp-name">Category Name</Label>
                                            <Input id="exp-name" placeholder="e.g., Office Supplies" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsExpenseCatDialogOpen(false)}>Cancel</Button>
                                        <Button type="submit">Save Category</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category Name</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {expenseCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
