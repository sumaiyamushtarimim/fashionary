
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
import { categories, Category, expenseCategories } from '@/lib/placeholder-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const CategoryRow = ({ category, level = 0 }: { category: Category; level?: number }) => {
  const subCategories = categories.filter((c) => c.parentId === category.id);

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
        <CategoryRow key={sub.id} category={sub} level={level + 1} />
      ))}
    </>
  );
};

export default function CategoriesSettingsPage() {
  const mainCategories = categories.filter((c) => !c.parentId);

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
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product Category
                  </Button>
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
                        <CategoryRow key={category.id} category={category} />
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
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Expense Category
                  </Button>
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
                      {expenseCategories.map((category) => (
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
