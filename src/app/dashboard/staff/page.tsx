

'use client';

import { MoreHorizontal, PlusCircle, DollarSign, TrendingUp, KeyRound, ShieldCheck, User } from "lucide-react";
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
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import React, { useMemo, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getStaff } from "@/services/staff";
import { getBusinesses } from "@/services/partners";
import type { StaffMember, Permission, StaffRole, Business } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 10;

type PaymentType = 'Salary' | 'Commission' | 'Both';

const paymentTypes: PaymentType[] = ['Salary', 'Commission', 'Both'];
const staffRoles: StaffRole[] = [
    'Admin', 
    'Manager', 
    'Moderator',
    'Seller',
    'Packing Assistant', 
    'Call Assistant', 
    'Call Centre Manager', 
    'Courier Manager', 
    'Courier Call Assistant',
    'Vendor/Supplier',
    'Custom'
];
const permissionModules: (keyof StaffMember['permissions'])[] = [
    'orders', 'packingOrders',
    'products', 
    'inventory',
    'customers', 
    'purchases', 
    'expenses',
    'checkPassing',
    'partners',
    'courierReport',
    'analytics',
    'staff', 
    'settings',
    'issues',
    'attendance',
    'accounting',
];
const permissionActions: (keyof Permission)[] = ['create', 'read', 'update', 'delete'];

const StaffForm = ({ staffMember, isEdit = false, businesses }: { staffMember?: StaffMember | null, isEdit?: boolean, businesses: Business[] }) => {
    const [role, setRole] = useState<StaffRole | undefined>(staffMember?.role);
    const [paymentType, setPaymentType] = useState<PaymentType | undefined>(staffMember?.paymentType);
    const [targetEnabled, setTargetEnabled] = useState<boolean>(staffMember?.commissionDetails?.targetEnabled || false);
    const [accessibleBusinesses, setAccessibleBusinesses] = useState<string[]>(staffMember?.accessibleBusinessIds || []);
    const [permissions, setPermissions] = useState<StaffMember['permissions']>(
        staffMember?.permissions || {
            orders: { create: false, read: true, update: false, delete: false },
            packingOrders: { create: false, read: true, update: true, delete: false },
            products: { create: false, read: true, update: false, delete: false },
            inventory: { create: false, read: true, update: false, delete: false },
            customers: { create: false, read: true, update: false, delete: false },
            purchases: { create: false, read: true, update: false, delete: false },
            expenses: { create: false, read: true, update: false, delete: false },
            checkPassing: { create: false, read: true, update: true, delete: false },
            partners: { create: false, read: true, update: false, delete: false },
            courierReport: { create: false, read: true, update: false, delete: false },
            staff: { create: false, read: false, update: false, delete: false },
            settings: { create: false, read: false, update: false, delete: false },
            analytics: { create: false, read: true, update: false, delete: false },
            issues: { create: false, read: true, update: false, delete: false },
            attendance: { create: false, read: true, update: false, delete: false },
            accounting: { create: false, read: true, update: false, delete: false },
        }
    );
     useEffect(() => {
        if(staffMember){
            setRole(staffMember.role);
            setPaymentType(staffMember.paymentType);
            setPermissions(staffMember.permissions);
            setAccessibleBusinesses(staffMember.accessibleBusinessIds || []);
            setTargetEnabled(staffMember.commissionDetails?.targetEnabled || false);
        }
    }, [staffMember])

    const handlePermissionChange = (module: keyof StaffMember['permissions'], action: keyof Permission, value: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [module]: {
                ...(prev[module] as Permission),
                [action]: value,
            },
        }));
    };
    
    const handleBusinessAccessChange = (businessId: string, checked: boolean) => {
        setAccessibleBusinesses(prev => 
            checked ? [...prev, businessId] : prev.filter(id => id !== businessId)
        );
    }
        
        return (
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-2 -mr-2">
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
                
                <Card>
                    <CardHeader className="p-4 flex flex-row items-center gap-4">
                        <ShieldCheck className="w-6 h-6 text-muted-foreground"/>
                        <div>
                            <CardTitle className="text-base">Business Access</CardTitle>
                            <CardDescription className="text-xs">Control which business entities this staff can access.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 grid grid-cols-2 gap-4">
                         {businesses.map(business => (
                            <div key={business.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`biz-${business.id}`}
                                    checked={accessibleBusinesses.includes(business.id)}
                                    onCheckedChange={(checked) => handleBusinessAccessChange(business.id, !!checked)}
                                />
                                <label htmlFor={`biz-${business.id}`} className="text-sm font-medium leading-none">
                                    {business.name}
                                </label>
                            </div>
                        ))}
                    </CardContent>
                </Card>


                <Card>
                    <CardHeader className="p-4 flex flex-row items-center gap-4">
                        <KeyRound className="w-6 h-6 text-muted-foreground"/>
                        <div>
                            <CardTitle className="text-base">Role & Permissions</CardTitle>
                            <CardDescription className="text-xs">Define what this staff member can see and do.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={(value: StaffRole) => setRole(value)}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {staffRoles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        {role === 'Custom' && (
                             <Accordion type="multiple" className="w-full">
                                {permissionModules.map(module => (
                                    <AccordionItem value={module} key={module}>
                                        <AccordionTrigger className="capitalize">{module.replace(/([A-Z])/g, ' $1')}</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
                                                {permissionActions.map(action => (
                                                    <div key={action} className="flex items-center space-x-2">
                                                        <Checkbox 
                                                            id={`${module}-${action}`} 
                                                            checked={permissions[module]?.[action] || false}
                                                            onCheckedChange={(checked) => handlePermissionChange(module, action, !!checked)}
                                                        />
                                                        <label
                                                            htmlFor={`${module}-${action}`}
                                                            className="text-sm font-medium leading-none capitalize"
                                                        >
                                                            {action}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="p-4 flex flex-row items-center gap-4">
                         <DollarSign className="w-6 h-6 text-muted-foreground"/>
                        <div>
                            <CardTitle className="text-base">Payment Details</CardTitle>
                            <CardDescription className="text-xs">Configure how this staff member is paid.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 grid gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="payment-type">Payment Type</Label>
                            <Select value={paymentType} onValueChange={(value: PaymentType) => setPaymentType(value)}>
                                <SelectTrigger id="payment-type">
                                    <SelectValue placeholder="Select a payment type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {paymentTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                         {(paymentType === 'Salary' || paymentType === 'Both') && (
                             <div className="space-y-4 pt-4 border-t">
                                <Label className="font-semibold">Salary</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                </div>
                             </div>
                        )}

                        {(paymentType === 'Commission' || paymentType === 'Both') && (
                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="enable-target" checked={targetEnabled} onCheckedChange={(checked) => setTargetEnabled(!!checked)} />
                                    <Label htmlFor="enable-target" className="font-semibold">Enable Commission Target</Label>
                                </div>
                                {targetEnabled && (
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="target-period">Target Period</Label>
                                            <Select defaultValue={staffMember?.commissionDetails?.targetPeriod}>
                                                <SelectTrigger id="target-period"><SelectValue placeholder="Select period" /></SelectTrigger>
                                                <SelectContent><SelectItem value="Daily">Daily</SelectItem><SelectItem value="Weekly">Weekly</SelectItem><SelectItem value="Monthly">Monthly</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="target-count">Target Order Count</Label>
                                            <Input id="target-count" type="number" placeholder="e.g., 100" defaultValue={staffMember?.commissionDetails?.targetCount}/>
                                        </div>
                                    </div>
                                )}
                                <Separator />
                                <Label className="font-semibold">Commission Rates</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {role === 'Packing Assistant' ? (
                                         <div className="space-y-2">
                                            <Label htmlFor="commission-pack">On Order Packed</Label>
                                            <Input id="commission-pack" type="number" placeholder="e.g., 20" defaultValue={staffMember?.commissionDetails?.onOrderPacked}/>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="commission-create">On Order Create</Label>
                                                <Input id="commission-create" type="number" placeholder="e.g., 50" defaultValue={staffMember?.commissionDetails?.onOrderCreate}/>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="commission-confirm">On Order Confirm</Label>
                                                <Input id="commission-confirm" type="number" placeholder="e.g., 100" defaultValue={staffMember?.commissionDetails?.onOrderConfirm}/>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {!isEdit && (
                     <div className="items-top flex space-x-3 pt-4">
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

export default function StaffPage() {
    const [allStaff, setAllStaff] = useState<StaffMember[]>([]);
    const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            getStaff(),
            getBusinesses()
        ]).then(([staffData, businessData]) => {
            setAllStaff(staffData);
            setAllBusinesses(businessData);
            setIsLoading(false);
        });
    }, []);

    const filteredStaff = useMemo(() => {
        let staffList = allStaff;

        if (roleFilter !== 'all') {
            staffList = staffList.filter(s => s.role === roleFilter);
        }

        if (searchTerm) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            staffList = staffList.filter(s => 
                s.name.toLowerCase().includes(lowercasedSearchTerm) ||
                s.email.toLowerCase().includes(lowercasedSearchTerm)
            );
        }
        
        return staffList;
    }, [allStaff, roleFilter, searchTerm]);

    const handleEditClick = (member: StaffMember) => {
        setSelectedStaff(member);
        setIsEditDialogOpen(true);
    };

    const handleAddClick = () => {
        setSelectedStaff(null);
        setIsAddDialogOpen(true);
    };

    const totals = React.useMemo(() => {
        return allStaff.reduce((acc, member) => {
            acc.totalDue += member.financials.dueAmount;
            acc.totalEarned += member.financials.totalEarned;
            return acc;
        }, { totalDue: 0, totalEarned: 0 });
    }, [allStaff]);

    const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
    const paginatedStaff = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredStaff.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredStaff]);

     useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, roleFilter]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <div className="flex-1">
            <h1 className="font-headline text-2xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground hidden sm:block">Manage staff access, roles, and payments.</p>
        </div>
        <div className="flex items-center gap-2">
           <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" onClick={handleAddClick}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Invite Staff
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Invite New Staff</DialogTitle>
                        <DialogDescription>
                            Fill in the details to add a new staff member to your team.
                        </DialogDescription>
                    </DialogHeader>
                    <StaffForm businesses={allBusinesses} />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => setIsAddDialogOpen(false)}>Send Invitation</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>

       <div className="grid gap-4 grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Due to Staff</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={cn("text-xl md:text-2xl font-bold", totals.totalDue > 0 && "text-destructive")}>
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
                    <div className="text-xl md:text-2xl font-bold">৳{totals.totalEarned.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total income generated by all staff</p>
                </CardContent>
            </Card>
      </div>

      <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {staffRoles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground">Loading staff...</div>
          ) : (
          <>
          {/* Table for larger screens */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead>Business Access</TableHead>
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
                       <div className="flex items-center gap-2">
                           <div className={cn("w-2 h-2 rounded-full", new Date().getTime() - new Date(member.lastLogin).getTime() < 86400000 ? "bg-green-500" : "bg-gray-400" )}></div>
                           <Link href={`/dashboard/staff/${member.id}`} className="hover:underline">
                                {member.name}
                            </Link>
                       </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{member.role}</Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1">
                            {member.accessibleBusinessIds?.map(id => {
                                const business = allBusinesses.find(b => b.id === id);
                                return business ? <Badge key={id} variant="secondary">{business.name}</Badge> : null;
                            })}
                        </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatDistanceToNow(new Date(member.lastLogin), { addSuffix: true })}
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
                          <DropdownMenuItem onClick={() => handleEditClick(member)}>Edit Staff</DropdownMenuItem>
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
                              <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", new Date().getTime() - new Date(member.lastLogin).getTime() < 86400000 ? "bg-green-500" : "bg-gray-400" )}></div>
                                <div>
                                    <Link href={`/dashboard/staff/${member.id}`} className="font-semibold hover:underline">
                                        {member.name}
                                    </Link>
                                    <p className="text-sm text-muted-foreground">{member.email}</p>
                                </div>
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
                                      <DropdownMenuItem onClick={() => handleEditClick(member)}>Edit Staff</DropdownMenuItem>
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
          </>
          )}

        </CardContent>
        <CardFooter>
            <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                <div>
                    Showing <strong>{paginatedStaff.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredStaff.length)}
                    </strong> of <strong>{filteredStaff.length}</strong> staff members
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
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Staff: {selectedStaff?.name}</DialogTitle>
                    <DialogDescription>
                        Update the details for this staff member.
                    </DialogDescription>
                </DialogHeader>
                <StaffForm staffMember={selectedStaff} isEdit={true} businesses={allBusinesses}/>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
