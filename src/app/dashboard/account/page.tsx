
'use client';

import * as React from 'react';
import { useUser, UserProfile } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Save, Edit, User as UserIcon, Briefcase, DollarSign, BarChart2, Loader2, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';
import { getStaffMemberByClerkId } from '@/services/staff';
import type { StaffMember, OrderStatus, StaffIncome, StaffPayment } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];

const PerformanceStatCard = ({ title, value, icon: Icon, iconClass }: { title: string, value: string | number, icon?: React.ElementType, iconClass?: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {Icon && <Icon className={cn("h-4 w-4 text-muted-foreground", iconClass)} />}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

function HistoryDialog({ title, children, data }: { title: string, children: React.ReactNode, data: StaffIncome[] | StaffPayment[] }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                    {data && data.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    {'orderId' in data[0] && <TableHead>Order ID</TableHead>}
                                    {'action' in data[0] && <TableHead>Action</TableHead>}
                                    <TableHead>Notes</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{format(new Date(item.date), 'PP')}</TableCell>
                                        {'orderId' in item && item.orderId && <TableCell>{item.orderId}</TableCell>}
                                        {'action' in item && item.action && <TableCell><Badge variant="secondary">{item.action}</Badge></TableCell>}
                                        <TableCell>{'notes' in item ? item.notes : '-'}</TableCell>
                                        <TableCell className="text-right font-mono">৳{item.amount.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            No history found.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function AccountPage() {
    const { toast } = useToast();
    const { user: clerkUser, isLoaded } = useUser();
    const [loggedInStaff, setLoggedInStaff] = React.useState<StaffMember | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);

    React.useEffect(() => {
        if (isLoaded && clerkUser) {
            getStaffMemberByClerkId(clerkUser.id).then(data => {
                if (data) {
                    setLoggedInStaff(data);
                }
                setIsLoading(false);
            });
        } else if (isLoaded) {
            setIsLoading(false);
        }
    }, [isLoaded, clerkUser]);

    const performanceChartData = React.useMemo(() => {
        if (!loggedInStaff) return [];
        return Object.entries(loggedInStaff.performance.statusBreakdown)
            .filter(([, value]) => value > 0)
            .map(([status, value], index) => ({
                status: status as OrderStatus,
                value,
                fill: chartColors[index % chartColors.length]
            }));
    }, [loggedInStaff]);
    
    const chartConfig: ChartConfig = React.useMemo(() => {
        if (!performanceChartData) return {};
        return performanceChartData.reduce((acc, { status, fill }) => {
            acc[status] = { label: status, color: fill };
            return acc;
        }, {} as ChartConfig);
    }, [performanceChartData]);
    
    const { confirmationRate, cancellationRate, averageOrderValue } = React.useMemo(() => {
        if (!loggedInStaff) return { confirmationRate: 0, cancellationRate: 0, averageOrderValue: 0 };

        const { ordersCreated, ordersConfirmed } = loggedInStaff.performance;
        const canceledCount = loggedInStaff.performance.statusBreakdown['Canceled'] || 0;

        const confirmationRate = ordersCreated > 0 ? (ordersConfirmed / ordersCreated) * 100 : 0;
        const cancellationRate = ordersCreated > 0 ? (canceledCount / ordersCreated) * 100 : 0;
        
        const totalConfirmedValue = loggedInStaff.incomeHistory.reduce((acc, item) => {
            if(item.action === 'Confirmed' && loggedInStaff.commissionDetails?.onOrderConfirm) {
                return acc + item.amount / (loggedInStaff.commissionDetails.onOrderConfirm / 100);
            }
            return acc;
        }, 0);
        const averageOrderValue = ordersConfirmed > 0 ? totalConfirmedValue / ordersConfirmed : 0;


        return {
            confirmationRate,
            cancellationRate,
            averageOrderValue
        };
    }, [loggedInStaff]);

    if (isLoading || !isLoaded) {
        return (
             <div className="flex-1 space-y-6 p-4 lg:p-6">
                <Skeleton className="h-12 w-1/3" />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 grid gap-6">
                        <Skeleton className="h-56" />
                        <Skeleton className="h-64" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-48" />
                        <Skeleton className="h-40" />
                    </div>
                </div>
            </div>
        );
    }

    if (!loggedInStaff) {
        return (
            <div className="flex-1 space-y-6 p-4 lg:p-6 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">Staff Profile Not Found</h2>
                <p className="mt-2 text-muted-foreground">We couldn't find a staff profile associated with your account.</p>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-6 p-4 lg:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-headline">My Account</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and view your performance.
                    </p>
                </div>
                 <Dialog>
                    <DialogTrigger asChild>
                         <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-4xl p-0">
                       <UserProfile routing="hash" />
                    </DialogContent>
                </Dialog>
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 grid gap-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Your personal and role details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" defaultValue={loggedInStaff.name} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue={loggedInStaff.email} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input id="role" defaultValue={loggedInStaff.role} disabled />
                            </div>
                        </CardContent>
                    </Card>
                    
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart2 className="h-5 w-5 text-muted-foreground" />
                                Performance Overview
                            </CardTitle>
                            <CardDescription>A summary of your order-related activities.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <PerformanceStatCard title="Orders Created" value={loggedInStaff.performance.ordersCreated} icon={UserIcon} />
                                <PerformanceStatCard title="Orders Confirmed" value={loggedInStaff.performance.ordersConfirmed} icon={UserIcon} />
                                 <PerformanceStatCard 
                                    title="Avg. Order Value" 
                                    value={`৳${averageOrderValue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`}
                                    icon={DollarSign} 
                                />
                                <PerformanceStatCard title="Confirmation Rate" value={`${confirmationRate.toFixed(1)}%`} icon={TrendingUp} iconClass="text-green-500"/>
                                <PerformanceStatCard title="Cancellation Rate" value={`${cancellationRate.toFixed(1)}%`} icon={TrendingDown} iconClass="text-red-500"/>
                            </div>
                        </CardContent>
                        {performanceChartData.length > 0 && (
                            <CardFooter>
                                <ChartContainer
                                    config={chartConfig}
                                    className="mx-auto aspect-square h-[200px]"
                                >
                                    <PieChart>
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent hideLabel />}
                                        />
                                        <Pie data={performanceChartData} dataKey="value" nameKey="status" innerRadius={50} paddingAngle={5}>
                                            {performanceChartData.map((entry) => (
                                                <Cell key={entry.status} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <ChartLegend
                                            content={<ChartLegendContent nameKey="status" />}
                                            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                                        />
                                    </PieChart>
                                </ChartContainer>
                            </CardFooter>
                        )}
                    </Card>

                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-muted-foreground" />
                                Payment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Type</span>
                                <Badge variant="secondary">{loggedInStaff.paymentType}</Badge>
                            </div>
                            {(loggedInStaff.paymentType === 'Salary' || loggedInStaff.paymentType === 'Both') && loggedInStaff.salaryDetails && (
                                <>
                                    <Separator />
                                    <p className='font-medium'>Salary</p>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Amount</span>
                                        <span>৳{loggedInStaff.salaryDetails.amount.toLocaleString()} / {loggedInStaff.salaryDetails.frequency}</span>
                                    </div>
                                </>
                            )}
                            {(loggedInStaff.paymentType === 'Commission' || loggedInStaff.paymentType === 'Both') && loggedInStaff.commissionDetails && (
                                <>
                                    <Separator />
                                    <p className='font-medium'>Commission</p>
                                    {loggedInStaff.commissionDetails.onOrderCreate && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">On Order Create</span>
                                            <span>৳{loggedInStaff.commissionDetails.onOrderCreate.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {loggedInStaff.commissionDetails.onOrderConfirm && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">On Order Confirm</span>
                                            <span>৳{loggedInStaff.commissionDetails.onOrderConfirm.toFixed(2)}</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                             <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-muted-foreground" />
                                My Financials
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 rounded-lg border bg-card p-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Earned</span>
                                    <span className="font-medium">৳{loggedInStaff.financials.totalEarned.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Paid</span>
                                    <span className="font-medium text-green-600">৳{loggedInStaff.financials.totalPaid.toLocaleString()}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span className={cn(loggedInStaff.financials.dueAmount > 0 && "text-destructive")}>Due Amount</span>
                                    <span className={cn(loggedInStaff.financials.dueAmount > 0 && "text-destructive")}>৳{loggedInStaff.financials.dueAmount.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <HistoryDialog title="Income History" data={loggedInStaff.incomeHistory}>
                                    <Button variant="outline" className="w-full">View Income</Button>
                                </HistoryDialog>
                                <HistoryDialog title="Payment History" data={loggedInStaff.paymentHistory}>
                                    <Button variant="outline" className="w-full">View Payments</Button>
                                </HistoryDialog>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
