

'use client';

import { useState, useMemo, useEffect } from "react";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, isWithinInterval } from "date-fns";

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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
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
import { expenses, businesses, expenseCategories, Expense, OrderPlatform } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const ITEMS_PER_PAGE = 10;
const socialPlatforms: OrderPlatform[] = ['Facebook', 'Instagram', 'TikTok', 'Website'];


export default function ExpensesPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdExpense, setIsAdExpense] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const dateMatch = !dateRange?.from || (dateRange?.from && dateRange?.to 
        ? isWithinInterval(expenseDate, { start: dateRange.from, end: dateRange.to })
        : true);

      return dateMatch;
    });
  }, [dateRange]);

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredExpenses, currentPage]);

  useEffect(() => {
      setCurrentPage(1);
  }, [dateRange]);

  const renderTable = () => (
     <Table>
            <TableHeader className="hidden sm:table-header-group">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Business/Platform</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExpenses.map((expense) => (
                <TableRow key={expense.id} className="hidden sm:table-row">
                  <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>
                     {expense.isAdExpense && expense.business ? (
                        <div className="flex flex-col">
                            <Badge variant="secondary" className="w-fit mb-1">{expense.business}</Badge>
                            <Badge variant="outline" className="w-fit">{expense.platform}</Badge>
                        </div>
                    ) : <span className="text-muted-foreground">-</span>}
                  </TableCell>
                   <TableCell className="text-sm text-muted-foreground">{expense.notes}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    ৳{expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                     <div>
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
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
  );

  const renderCardList = () => (
    <div className="space-y-4">
        {paginatedExpenses.map((expense) => (
            <Card key={expense.id}>
                <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold">{expense.category}</p>
                            <p className="text-sm text-muted-foreground">{format(new Date(expense.date), "MMM d, yyyy")}</p>
                        </div>
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
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                     <p className="text-sm text-muted-foreground">{expense.notes}</p>
                    <Separator />
                     <div className="flex justify-between items-center">
                        <div>
                            {expense.isAdExpense && expense.business ? (
                                <div className="flex flex-col">
                                    <Badge variant="secondary" className="w-fit mb-1">{expense.business}</Badge>
                                    <Badge variant="outline" className="w-fit">{expense.platform}</Badge>
                                </div>
                            ) : <span className="text-muted-foreground text-sm">-</span>}
                        </div>
                        <p className="font-bold text-lg font-mono">
                            ৳{expense.amount.toFixed(2)}
                        </p>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex-grow">
            <h1 className="font-headline text-2xl font-bold">Expenses</h1>
            <p className="text-muted-foreground hidden sm:block">Track and manage all business expenses.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <PlusCircle className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add Expense</span>
                    <span className="sm:hidden sr-only">Add Expense</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                    <DialogDescription>
                        Record a new expense for your business.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4 overflow-y-auto px-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Expense Category</Label>
                            <Select>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {expenseCategories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" placeholder="Add any relevant notes..." />
                    </div>
                    <Separator />
                    <div className="items-top flex space-x-2">
                        <Checkbox id="is-ad-expense" checked={isAdExpense} onCheckedChange={(checked) => setIsAdExpense(!!checked)} />
                        <div className="grid gap-1.5 leading-none">
                            <label
                            htmlFor="is-ad-expense"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                            Ad Expense
                            </label>
                            <p className="text-sm text-muted-foreground">
                            Mark this as a social media advertising expense.
                            </p>
                        </div>
                    </div>
                    {isAdExpense && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                            <div className="space-y-2">
                                <Label htmlFor="business">Business</Label>
                                <Select>
                                    <SelectTrigger id="business">
                                        <SelectValue placeholder="Select a business" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {businesses.map(b => (
                                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="platform">Social Media Platform</Label>
                                <Select>
                                    <SelectTrigger id="platform">
                                        <SelectValue placeholder="Select a platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {socialPlatforms.map(p => (
                                            <SelectItem key={p} value={p}>{p}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter className="mt-auto pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Save Expense</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Expense List</CardTitle>
          <CardDescription>
            A list of all recorded business expenses.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isClient ? (
                <>
                    <div className="hidden sm:block">{renderTable()}</div>
                    <div className="sm:hidden">{renderCardList()}</div>
                </>
            ) : (
                 <div className="h-48 flex items-center justify-center text-muted-foreground">Loading expenses...</div>
            )}
        </CardContent>
        <CardFooter>
          <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                <div>
                    Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredExpenses.length)}
                    </strong> of <strong>{filteredExpenses.length}</strong> expenses
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
