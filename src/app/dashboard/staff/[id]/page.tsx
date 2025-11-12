
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MoreVertical, User, Briefcase, DollarSign, BarChart2, CheckCircle, PlusCircle, Activity } from 'lucide-react';
import { staff, orders, StaffMember, OrderStatus } from '@/lib/placeholder-data';
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

const statusColors: Record<OrderStatus, string> = {
    'New': 'bg-blue-500/20 text-blue-700',
    'Confirmed': 'bg-sky-500/20 text-sky-700',
    'Canceled': 'bg-red-500/20 text-red-700',
    'Hold': 'bg-yellow-500/20 text-yellow-700',
    'Packing': 'bg-indigo-500/20 text-indigo-700',
    'Packing Hold': 'bg-orange-500/20 text-orange-700',
    'RTS (Ready to Ship)': 'bg-purple-500/20 text-purple-700',
    'Shipped': 'bg-cyan-500/20 text-cyan-700',
    'Delivered': 'bg-green-500/20 text-green-700',
    'Returned': 'bg-gray-500/20 text-gray-700',
    'Partially Delivered': 'bg-teal-500/20 text-teal-700',
    'Partially Returned': 'bg-amber-500/20 text-amber-700',
};

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
    const [staffMember, setStaffMember] = React.useState<StaffMember | undefined>(undefined);

    React.useEffect(() => {
        const member = staff.find((s) => s.id === staffId);
        if (member) {
            // In a real app, this data would come from an API.
            // For now, we'll calculate it based on placeholder orders.
            const createdOrders = orders.filter(o => o.createdBy === member.name);
            const confirmedOrders = orders.filter(o => o.confirmedBy === member.name);

            const statusBreakdown = { ...member.performance.statusBreakdown };
            for (const key in statusBreakdown) {
                statusBreakdown[key as OrderStatus] = 0;
            }

            [...createdOrders, ...confirmedOrders].forEach(order => {
                if (statusBreakdown[order.status] !== undefined) {
                    statusBreakdown[order.status]++;
                }
            });

            const updatedMember = {
                ...member,
                performance: {
                    ...member.performance,
                    ordersCreated: createdOrders.length,
                    ordersConfirmed: confirmedOrders.length,
                    statusBreakdown: statusBreakdown,
                }
            };
            setStaffMember(updatedMember);
        }
    }, [staffId]);
    
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
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Badge variant="outline">{staffMember.role}</Badge>
                    </p>
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
                        {staffMember.salaryDetails && (
                            <>
                                <Separator />
                                <p className='font-medium'>Salary</p>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span>${staffMember.salaryDetails.amount.toLocaleString()} / {staffMember.salaryDetails.frequency}</span>
                                </div>
                            </>
                        )}
                        {staffMember.commissionDetails && (
                             <>
                                <Separator />
                                <p className='font-medium'>Commission</p>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">On Order Create</span>
                                    <span>${staffMember.commissionDetails.onOrderCreate.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">On Order Confirm</span>
                                    <span>${staffMember.commissionDetails.onOrderConfirm.toFixed(2)}</span>
                                </div>
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
                                <span className="font-medium">${staffMember.financials.totalEarned.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Paid</span>
                                <span className="font-medium text-green-600">${staffMember.financials.totalPaid.toLocaleString()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold text-lg">
                                <span className={cn(staffMember.financials.dueAmount > 0 && "text-destructive")}>Due Amount</span>
                                <span className={cn(staffMember.financials.dueAmount > 0 && "text-destructive")}>${staffMember.financials.dueAmount.toLocaleString()}</span>
                            </div>
                        </div>
                         <Button className="w-full">
                            <CheckCircle className="mr-2 h-4 w-4" /> Clear Due
                        </Button>
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

