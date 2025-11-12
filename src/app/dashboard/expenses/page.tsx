

'use client';

import { useState, useMemo } from "react";
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
import { expenses, businesses, expenseCategories, Expense, OrderPlatform } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const socialPlatforms: OrderPlatform[] = ['Facebook', 'Instagram', 'TikTok', 'Website'];


export default function ExpensesPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdExpense, setIsAdExpense] = useState(false);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const dateMatch = !dateRange?.from || (dateRange?.from && dateRange?.to 
        ? isWithinInterval(expenseDate, { start: dateRange.from, end: dateRange.to })
        : true);

      return dateMatch;
    });
  }, [dateRange]);

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
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                    <DialogDescription>
                        Record a new expense for your business.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
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
                <DialogFooter>
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
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id} className="relative sm:table-row flex flex-col sm:flex-row p-4 sm:p-0 mb-4 sm:mb-0 border rounded-lg sm:border-b">
                   <TableCell className="font-medium p-0 sm:p-4 border-b sm:border-none pb-4 sm:pb-4">
                     <div className="font-bold">{format(new Date(expense.date), "MMM d, yyyy")}</div>
                     <div className="text-sm text-muted-foreground">{expense.category}</div>
                   </TableCell>
                   <TableCell className="p-0 sm:p-4 pt-4 sm:pt-4">
                     <div className="flex justify-between items-start w-full">
                        <div>
                            {expense.isAdExpense && expense.business ? (
                                <div className="flex flex-col">
                                    <Badge variant="secondary" className="w-fit mb-1">{expense.business}</Badge>
                                    <Badge variant="outline" className="w-fit">{expense.platform}</Badge>
                                </div>
                            ) : <span className="text-muted-foreground text-sm">-</span>}
                        </div>
                        <div className="sm:hidden text-right font-bold text-lg font-mono">
                            ৳{expense.amount.toFixed(2)}
                        </div>
                     </div>
                     <p className="text-sm text-muted-foreground mt-2 sm:hidden">{expense.notes}</p>
                   </TableCell>
                  <td className="hidden sm:table-cell p-4">{format(new Date(expense.date), "MMM d, yyyy")}</td>
                  <td className="hidden sm:table-cell p-4">{expense.category}</td>
                  <td className="hidden sm:table-cell p-4">
                     {expense.isAdExpense && expense.business ? (
                        <div className="flex flex-col">
                            <Badge variant="secondary" className="w-fit mb-1">{expense.business}</Badge>
                            <Badge variant="outline" className="w-fit">{expense.platform}</Badge>
                        </div>
                    ) : <span className="text-muted-foreground">-</span>}
                  </td>
                   <td className="hidden sm:table-cell p-4 text-sm text-muted-foreground">{expense.notes}</td>
                  <td className="hidden text-right sm:table-cell p-4 font-mono font-semibold">
                    ৳{expense.amount.toFixed(2)}
                  </td>
                  <TableCell className="p-0 sm:p-4">
                     <div className="absolute sm:relative top-2 right-2">
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
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{filteredExpenses.length}</strong> of <strong>{expenses.length}</strong> expenses
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

