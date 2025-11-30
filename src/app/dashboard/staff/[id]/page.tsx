
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MoreVertical, User, Briefcase, DollarSign, BarChart2, CheckCircle, PlusCircle, Activity, TrendingUp, KeyRound, Clock, UserCheck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { Separator } from '@/components/ui/separator';
import { getStaffMemberById, makePayment } from '@/services/staff';
import { getStaffAttendanceHistory } from '@/services/attendance';
import type { StaffMember, OrderStatus, StaffIncome, Permission, AttendanceRecord } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow, format } from 'date-fns';

const statusColors: Record<OrderStatus, string> = {
    'New': 'bg-blue-500/20 text-blue-700',
    'Confirmed': 'bg-sky-500/20 text-sky-700',
    'Canceled': 'bg-red-500/20 text-red-700',
    'Hold': 'bg-yellow-500/20 text-yellow-700',
    'In-Courier': 'bg-orange-500/20 text-orange-700',
    'RTS (Ready to Ship)': 'bg-purple-500/20 text-purple-700',
    'Shipped': 'bg-cyan-500/20 text-cyan-700',
    'Delivered': 'bg-green-500/20 text-green-700',
    'Returned': 'bg-gray-500/20 text-gray-700',
    'Return Pending': 'bg-pink-500/20 text-pink-700',
    'Partial': 'bg-fuchsia-500/20 text-fuchsia-700',
    'Packing Hold': 'bg-amber-500/20 text-amber-700',
    'Incomplete': 'bg-gray-500/20 text-gray-700',
    'Incomplete-Cancelled': 'bg-red-500/20 text-red-700',
};

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

const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];

export default function StaffDetailsPage() {
    const params = useParams();
    const staffId = params.id as string;
    const { toast } = useToast();
    const [staffMember, setStaffMember] = React.useState<StaffMember | undefined>(undefined);
    const [attendanceHistory, setAttendanceHistory] = React.useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
    const [paymentAmount, setPaymentAmount] = React.useState(0);
    const [paymentNotes, setPaymentNotes] = React.useState('');

    React.useEffect(() => {
        if (staffId) {
            setIsLoading(true);
            Promise.all([
                getStaffMemberById(staffId),
                getStaffAttendanceHistory(staffId)
            ]).then(([staffData, attendanceData]) => {
                setStaffMember(staffData);
                setAttendanceHistory(attendanceData);
                if (staffData) {
                    setPaymentAmount(staffData.financials.dueAmount);
                }
                setIsLoading(false);
            });
        }
    }, [staffId]);
    
    const handleClearDue = async () => {
        if (!staffMember || !paymentAmount) return;

        const updatedStaffMember = await makePayment(staffId, paymentAmount, paymentNotes);
        if (updatedStaffMember) {
            setStaffMember(updatedStaffMember);
            toast({
                title: "Payment Successful",
                description: `Paid ৳${paymentAmount} to ${staffMember.name}.`,
            });
        }
        setIsPaymentDialogOpen(false);
        setPaymentNotes('');
    };
    
    const todayAttendance = attendanceHistory.find(a => format(new Date(a.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'));

    if (isLoading) {
        return (
            <div className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
                <Skeleton className="h-10 w-1/2" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-48" />
                    <Skeleton className="h-48" />
                    <Skeleton className="h-48" />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
                <Skeleton className="h-80" />
            </div>
        );
    }

    if (!staffMember) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 lg:gap-6 lg:p-6">
                <p>Staff member not found.</p>
                <Button asChild variant="outline">
                    <Link href="/dashboard/staff">Back to Staff List</Link>
                </Button>
            </div>
        );
    }
    
    const performanceChartData = Object.entries(staffMember.performance.statusBreakdown)
        .filter(([, value]) => value > 0)
        .map(([status, value], index) => ({
            status: status as OrderStatus,
            value,
            fill: chartColors[index % chartColors.length]
        }));
    
    const chartConfig: ChartConfig = performanceChartData.reduce((acc, { status, fill }) => {
        acc[status] = { label: status, color: fill };
        return acc;
    }, {} as ChartConfig);

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                    <Link href="/dashboard/staff">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="font-headline text-xl font-semibold sm:text-2xl">{staffMember.name}</h1>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Badge variant="outline">{staffMember.role}</Badge>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <User className="w-6 h-6 text-muted-foreground" />
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Email</span>
                            <span>{staffMember.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Role</span>
                            <span>{staffMember.role}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Login</span>
                            <span>{new Date(staffMember.lastLogin).toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-1">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <Briefcase className="w-6 h-6 text-muted-foreground" />
                        <CardTitle>Payment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Type</span>
                            <Badge variant="secondary">{staffMember.paymentType}</Badge>
                        </div>
                        {(staffMember.paymentType === 'Salary' || staffMember.paymentType === 'Both') && staffMember.salaryDetails && (
                            <>
                                <Separator />
                                <p className='font-medium'>Salary</p>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span>৳{staffMember.salaryDetails.amount.toLocaleString()} / {staffMember.salaryDetails.frequency}</span>
                                </div>
                            </>
                        )}
                        {(staffMember.paymentType === 'Commission' || staffMember.paymentType === 'Both') && staffMember.commissionDetails && (
                             <>
                                <Separator />
                                <p className='font-medium'>Commission</p>
                                {staffMember.commissionDetails.targetEnabled && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Target</span>
                                        <span>{staffMember.commissionDetails.targetCount} orders / {staffMember.commissionDetails.targetPeriod}</span>
                                    </div>
                                )}
                                {staffMember.commissionDetails.onOrderCreate && <div className="flex justify-between">
                                    <span className="text-muted-foreground">On Order Create</span>
                                    <span>৳{staffMember.commissionDetails.onOrderCreate.toFixed(2)}</span>
                                </div>}
                                {staffMember.commissionDetails.onOrderConfirm && <div className="flex justify-between">
                                    <span className="text-muted-foreground">On Order Confirm</span>
                                    <span>৳{staffMember.commissionDetails.onOrderConfirm.toFixed(2)}</span>
                                </div>}
                                {staffMember.commissionDetails.onOrderPacked && <div className="flex justify-between">
                                    <span className="text-muted-foreground">On Order Packed</span>
                                    <span>৳{staffMember.commissionDetails.onOrderPacked.toFixed(2)}</span>
                                </div>}
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-1">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <DollarSign className="w-6 h-6 text-muted-foreground" />
                        <CardTitle>Financials</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg border bg-card p-4 space-y-2">
                             <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Earned</span>
                                <span className="font-medium">৳{staffMember.financials.totalEarned.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Paid</span>
                                <span className="font-medium text-green-600">৳{staffMember.financials.totalPaid.toLocaleString()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold text-lg">
                                <span className={cn(staffMember.financials.dueAmount > 0 && "text-destructive")}>Due Amount</span>
                                <span className={cn(staffMember.financials.dueAmount > 0 && "text-destructive")}>৳{staffMember.financials.dueAmount.toLocaleString()}</span>
                            </div>
                        </div>
                        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full" disabled={staffMember.financials.dueAmount <= 0}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Clear Due
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Make a Payment to {staffMember.name}</DialogTitle>
                                    <DialogDescription>
                                        Enter the amount you want to pay. The current due is ৳{staffMember.financials.dueAmount.toLocaleString()}.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="payment-amount">Payment Amount</Label>
                                        <Input
                                            id="payment-amount"
                                            type="number"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                                            max={staffMember.financials.dueAmount}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="payment-notes">Notes (Optional)</Label>
                                        <Textarea
                                            id="payment-notes"
                                            placeholder="e.g., May salary advance"
                                            value={paymentNotes}
                                            onChange={(e) => setPaymentNotes(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleClearDue}>Confirm Payment</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <Clock className="w-6 h-6 text-muted-foreground" />
                        <CardTitle>Attendance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Today's Status</span>
                            {todayAttendance ? <Badge variant="outline">{todayAttendance.status}</Badge> : <Badge variant="secondary">N/A</Badge>}
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Work (Today)</span>
                            <span>{todayAttendance?.totalWorkDuration ? `${Math.floor(todayAttendance.totalWorkDuration / 60)}h ${todayAttendance.totalWorkDuration % 60}m` : 'N/A'}</span>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <KeyRound className="w-6 h-6 text-muted-foreground" />
                        <CardTitle>Permissions</CardTitle>
                    </CardHeader>
                     <CardContent className="pt-4">
                        {staffMember.role === 'Custom' ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Module</TableHead>
                                        <TableHead className="text-center">Create</TableHead>
                                        <TableHead className="text-center">Read</TableHead>
                                        <TableHead className="text-center">Update</TableHead>
                                        <TableHead className="text-center">Delete</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissionModules.map(module => (
                                        <TableRow key={module}>
                                            <TableCell className="font-medium capitalize">{module.replace(/([A-Z])/g, ' $1')}</TableCell>
                                            {permissionActions.map(action => (
                                                <TableCell key={action} className="text-center">
                                                    {(staffMember.permissions[module] as Permission)?.[action] ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto"/> : <XCircle className="w-5 h-5 text-red-500 mx-auto"/>}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-sm text-muted-foreground p-4 text-center">Permissions are managed by the <Badge variant="secondary">{staffMember.role}</Badge> role.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
            
            <div className='grid gap-6 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle>Payment History</CardTitle>
                        <CardDescription>A record of all payments made to this staff member.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staffMember.paymentHistory.map((payment, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{payment.date}</TableCell>
                                        <TableCell>{payment.notes}</TableCell>
                                        <TableCell className="text-right font-mono">৳{payment.amount.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {staffMember.paymentHistory.length === 0 && (
                            <div className="text-center text-muted-foreground py-8">No payment history found.</div>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Income History (Commission)</CardTitle>
                        <CardDescription>A record of all commission earned from orders.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Table for larger screens */}
                        <div className="hidden sm:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Action</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {staffMember.incomeHistory.map((income, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{income.date}</TableCell>
                                            <TableCell>
                                                <Button variant="link" asChild className="p-0 h-auto">
                                                    <Link href={`/dashboard/orders/${income.orderId}`}>{income.orderId}</Link>
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={income.action === 'Created' ? 'secondary' : 'outline'}>{income.action}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-mono">+৳{income.amount.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {/* Card list for smaller screens */}
                        <div className="sm:hidden space-y-4">
                            {staffMember.incomeHistory.map((income, index) => (
                                <Card key={index}>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold">
                                                     <Link href={`/dashboard/orders/${income.orderId}`} className="hover:underline">{income.orderId}</Link>
                                                </p>
                                                <p className="text-sm text-muted-foreground">{income.date}</p>
                                            </div>
                                            <Badge variant={income.action === 'Created' ? 'secondary' : 'outline'}>{income.action}</Badge>
                                        </div>
                                        <Separator className="my-3" />
                                        <div className="flex justify-end items-center">
                                            <p className="font-semibold font-mono text-lg">+৳{income.amount.toLocaleString()}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {(staffMember.incomeHistory.length === 0) && (
                            <div className="text-center text-muted-foreground py-8">No income history found.</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart2 className="w-6 h-6" /> Performance Overview</CardTitle>
                    <CardDescription>An overview of the staff member's order-related activities.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                     <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg border bg-card p-4 flex flex-col items-center justify-center">
                                <p className="text-xs text-muted-foreground">Orders Created</p>
                                <p className="text-3xl font-bold">{staffMember.performance.ordersCreated}</p>
                            </div>
                            <div className="rounded-lg border bg-card p-4 flex flex-col items-center justify-center">
                                <p className="text-xs text-muted-foreground">Orders Confirmed</p>
                                <p className="text-3xl font-bold">{staffMember.performance.ordersConfirmed}</p>
                            </div>
                        </div>
                        <div>
                             <h4 className="text-sm font-medium mb-2">Order Status Breakdown</h4>
                            <div className="space-y-2">
                                {Object.entries(staffMember.performance.statusBreakdown).map(([status, count]) => {
                                    if(count === 0) return null;
                                    return (
                                        <div key={status} className="flex justify-between items-center text-sm">
                                            <Badge variant="outline" className={cn(statusColors[status as OrderStatus])}>
                                                {status}
                                            </Badge>
                                            <span className="font-mono font-medium">{count} {count === 1 ? 'order' : 'orders'}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                     </div>
                     <div>
                        {performanceChartData.length > 0 ? (
                             <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
                                    <Pie data={performanceChartData} dataKey="value" nameKey="status" innerRadius={60}>
                                        {performanceChartData.map((entry) => (
                                            <Cell key={entry.status} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8 border rounded-lg">
                                <Activity className="w-10 h-10 mb-4" />
                                <p className='font-medium'>No Performance Data</p>
                                <p className="text-sm">This staff member has no order activities yet.</p>
                            </div>
                        )}
                     </div>
                </CardContent>
            </Card>

        </div>
    );
}
