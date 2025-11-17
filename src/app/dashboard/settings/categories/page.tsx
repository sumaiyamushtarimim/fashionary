

'use client';

import * as React from 'react';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCategories, getExpenseCategories } from '@/services/products';
import type { Category, ExpenseCategory } from '@/types';

const CategoryRow = ({ category, allCategories, level = 0 }: { category: Category, allCategories: Category[], level?: number }) => {
  const subCategories = allCategories.filter((c) => c.parentId === category.id);

  return (
    <>
      <TableRow>
        <TableCell style={{ paddingLeft: `${1 + level * 1.5}rem` }}>
          {category.name}
        </TableCell>
        <TableCell>
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>
      {subCategories.map((sub) => (
        <CategoryRow key={sub.id} category={sub} allCategories={allCategories} level={level + 1} />
      ))}
    </>
  );
};

export default function CategoriesSettingsPage() {
    const [allCategories, setAllCategories] = React.useState<Category[]>([]);
    const [allExpenseCategories, setAllExpenseCategories] = React.useState<ExpenseCategory[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = React.useState(false);

    React.useEffect(() => {
        setIsLoading(true);
        Promise.all([
            getCategories(),
            getExpenseCategories()
        ]).then(([categoriesData, expenseCategoriesData]) => {
            setAllCategories(categoriesData);
            setAllExpenseCategories(expenseCategoriesData);
            setIsLoading(false);
        })
    }, []);

    if (isLoading) {
        return <div>Loading...</div>
    }

  const mainCategories = allCategories.filter((c) => !c.parentId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Category Settings</h2>
        <p className="text-muted-foreground">
          Organize your products and expenses into categories.
        </p>
      </div>

      <Tabs defaultValue="product">
          <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="product">Product Categories</TabsTrigger>
              <TabsTrigger value="expense">Expense Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="product">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Product Categories</CardTitle>
                    <CardDescription>
                      Manage your product category hierarchy.
                    </CardDescription>
                  </div>
                  <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Product Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Product Category</DialogTitle>
                         <DialogDescription>
                            Create a new category for your products.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="product-category-name">Category Name</Label>
                          <Input id="product-category-name" placeholder="e.g., T-Shirts" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parent-category">Parent Category</Label>
                          <Select>
                            <SelectTrigger id="parent-category">
                              <SelectValue placeholder="Select a parent category (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Parent</SelectItem>
                              {allCategories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => setIsProductDialogOpen(false)}>Save Category</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category Name</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mainCategories.map((category) => (
                        <CategoryRow key={category.id} category={category} allCategories={allCategories} />
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
                    <CardDescription>
                      Manage categories for tracking business expenses.
                    </CardDescription>
                  </div>
                  <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                    <DialogTrigger asChild>
                       <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Expense Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Expense Category</DialogTitle>
                        <DialogDescription>
                            Create a new category for your expenses.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="expense-category-name">Category Name</Label>
                          <Input id="expense-category-name" placeholder="e.g., Office Supplies" />
                        </div>
                      </div>
                      <DialogFooter>
                         <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => setIsExpenseDialogOpen(false)}>Save Category</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category Name</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allExpenseCategories.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell>{category.name}</TableCell>
                             <TableCell>
                                <div className="flex justify-end">
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
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
