

'use client';

import Image from "next/image";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import * as React from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
import { products, categories } from "@/lib/placeholder-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);

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

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  React.useEffect(() => {
      setCurrentPage(1);
  }, [categoryFilter]);


  const mainCategories = categories.filter(c => !c.parentId);
  const subCategories = (parentId: string) => categories.filter(c => c.parentId === parentId);


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-4">
        <div className="hidden sm:block flex-1">
            <h1 className="font-headline text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground hidden sm:block">Manage your products and view their status.</p>
        </div>
        <div className="w-full flex items-center justify-between sm:justify-start gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px] sm:w-[180px]">
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
            <Button size="sm" asChild>
                <Link href="/dashboard/products/new/edit">
                    <PlusCircle className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Product</span>
                    <span className="sm:hidden sr-only">Add Product</span>
                </Link>
            </Button>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          {/* For larger screens */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
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
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Link href={`/dashboard/products/${product.id}`}>
                        <Image
                          alt={product.name}
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={product.image.imageUrl}
                          width="64"
                          data-ai-hint={product.image.imageHint}
                        />
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/products/${product.id}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </TableCell>
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
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/products/${product.id}/edit`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* For smaller screens */}
          <div className="sm:hidden grid grid-cols-2 gap-4">
              {paginatedProducts.map((product) => (
                <Link href={`/dashboard/products/${product.id}`} key={product.id} className="block">
                  <Card className="overflow-hidden h-full">
                      <CardContent className="p-0">
                           <Image
                              alt={product.name}
                              className="aspect-square w-full object-cover"
                              height="150"
                              src={product.image.imageUrl}
                              width="150"
                              data-ai-hint={product.image.imageHint}
                            />
                            <div className="p-3">
                                <h3 className="font-medium truncate">{product.name}</h3>
                                <p className="text-sm text-muted-foreground">৳{product.price.toFixed(2)}</p>
                            </div>
                      </CardContent>
                  </Card>
                </Link>
              ))}
          </div>

        </CardContent>
        <CardFooter>
            <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                <div>
                    Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                    </strong> of <strong>{filteredProducts.length}</strong> products
                </div>
                {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1))}} 
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1))}}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} 
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
