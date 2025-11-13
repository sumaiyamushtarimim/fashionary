

'use client';

import { MoreHorizontal, PlusCircle, DollarSign, TrendingUp } from "lucide-react";
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
import { staff, StaffMember, allStatuses } from "@/lib/placeholder-data";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const ITEMS_PER_PAGE = 10;

type PaymentType = 'Salary' | 'Commission' | 'Both';
type StaffRole = 'Admin' | 'Manager' | 'Sales' | 'Warehouse';

const paymentTypes: PaymentType[] = ['Salary', 'Commission', 'Both'];
const staffRoles: StaffRole[] = ['Admin', 'Manager', 'Sales', 'Warehouse'];

export default function StaffPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isClient, setIsClient] = React.useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [paymentType, setPaymentType] = useState<PaymentType | undefined>();

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const handleEditClick = (member: StaffMember) => {
        setSelectedStaff(member);
        setPaymentType(member.paymentType);
        setIsEditDialogOpen(true);
    };

    const handleAddClick = () => {
        setSelectedStaff(null);
        setPaymentType(undefined);
        setIsAddDialogOpen(true);
    };

    const totals = React.useMemo(() => {
        return staff.reduce((acc, member) => {
            acc.totalDue += member.financials.dueAmount;
            acc.totalEarned += member.financials.totalEarned;
            return acc;
        }, { totalDue: 0, totalEarned: 0 });
    }, []);

    const totalPages = Math.ceil(staff.length / ITEMS_PER_PAGE);
    const paginatedStaff = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return staff.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage]);

    const StaffForm = ({ staffMember, isEdit = false }: { staffMember?: StaffMember | null, isEdit?: boolean }) => {
        const currentPaymentType = paymentType || staffMember?.paymentType;
        
        return (
            <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto px-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter name" defaultValue={staffMember?.name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter email" defaultValue={staffMember?.email} />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select defaultValue={staffMember?.role}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {staffRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="payment-type">Payment Type</Label>
                        <Select value={currentPaymentType} onValueChange={(value: PaymentType) => setPaymentType(value)}>
                            <SelectTrigger id="payment-type">
                                <SelectValue placeholder="Select a payment type" />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                {(currentPaymentType === 'Salary' || currentPaymentType === 'Both') && (
                    <Card>
                        <CardHeader className="p-4"><CardTitle className="text-base">Salary Details</CardTitle></CardHeader>
                        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="salary-amount">Amount</Label>
                                <Input id="salary-amount" type="number" placeholder="e.g., 25000" defaultValue={staffMember?.salaryDetails?.amount}/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="salary-frequency">Frequency</Label>
                                <Select defaultValue={staffMember?.salaryDetails?.frequency}>
                                    <SelectTrigger id="salary-frequency">
                                        <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                        <SelectItem value="Daily">Daily</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {(currentPaymentType === 'Commission' || currentPaymentType === 'Both') && (
                    <Card>
                        <CardHeader className="p-4"><CardTitle className="text-base">Commission Details</CardTitle></CardHeader>
                        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="commission-create">On Order Create</Label>
                                <Input id="commission-create" type="number" placeholder="e.g., 50" defaultValue={staffMember?.commissionDetails?.onOrderCreate}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="commission-confirm">On Order Confirm</Label>
                                <Input id="commission-confirm" type="number" placeholder="e.g., 100" defaultValue={staffMember?.commissionDetails?.onOrderConfirm}/>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {!isEdit && (
                     <div className="items-top flex space-x-3">
                        <Checkbox id="send-invite" defaultChecked/>
                        <div className="grid gap-1.5 leading-none">
                            <label
                            htmlFor="send-invite"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                            Send Invitation Email
                            </label>
                            <p className="text-sm text-muted-foreground">
                            An email will be sent to the user to set their password.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <div className="flex-1">
            <h1 className="font-headline text-2xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground hidden sm:block">Manage staff access and roles.</p>
        </div>
        <div className="flex items-center gap-2">
           <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" onClick={handleAddClick}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Invite Staff
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Invite New Staff</DialogTitle>
                        <DialogDescription>
                            Fill in the details to add a new staff member to your team.
                        </DialogDescription>
                    </DialogHeader>
                    <StaffForm />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => setIsAddDialogOpen(false)}>Send Invitation</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Due to Staff</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={cn("text-2xl font-bold", totals.totalDue > 0 && "text-destructive")}>
                        ৳{totals.totalDue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Total outstanding amount to be paid</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Earned by Staff</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">৳{totals.totalEarned.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total income generated by all staff</p>
                </CardContent>
            </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Table for larger screens */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                  <TableHead className="text-right">Total Due</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/staff/${member.id}`} className="hover:underline">
                        {member.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{member.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {isClient ? formatDistanceToNow(new Date(member.lastLogin), { addSuffix: true }) : '...'}
                    </TableCell>
                    <TableCell className={cn("text-right font-mono", member.financials.dueAmount > 0 ? "text-destructive" : "")}>
                        ৳{member.financials.dueAmount.toFixed(2)}
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
                            <Link href={`/dashboard/staff/${member.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClick(member)}>Edit Role</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Deactivate Account</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Card list for smaller screens */}
          <div className="sm:hidden space-y-4">
              {paginatedStaff.map((member) => (
                  <Card key={member.id} className="overflow-hidden">
                      <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                              <div>
                                  <Link href={`/dashboard/staff/${member.id}`} className="font-semibold hover:underline">
                                      {member.name}
                                  </Link>
                                  <p className="text-sm text-muted-foreground">{member.email}</p>
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
                                      <DropdownMenuItem asChild><Link href={`/dashboard/staff/${member.id}`}>View Details</Link></DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleEditClick(member)}>Edit Role</DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-600">Deactivate Account</DropdownMenuItem>
                                  </DropdownMenuContent>
                              </DropdownMenu>
                          </div>
                          <Separator />
                          <div className="flex justify-between items-end">
                              <Badge variant="outline">{member.role}</Badge>
                              <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Total Due</p>
                                  <p className={cn("font-semibold font-mono", member.financials.dueAmount > 0 ? "text-destructive" : "")}>
                                      ৳{member.financials.dueAmount.toFixed(2)}
                                  </p>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
              ))}
          </div>

        </CardContent>
        <CardFooter>
            <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                <div>
                    Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, staff.length)}
                    </strong> of <strong>{staff.length}</strong> staff members
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

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edit Staff: {selectedStaff?.name}</DialogTitle>
                    <DialogDescription>
                        Update the details for this staff member.
                    </DialogDescription>
                </DialogHeader>
                <StaffForm staffMember={selectedStaff} isEdit={true} />
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
