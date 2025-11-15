'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Save, Edit, X, User, Briefcase, DollarSign, BarChart2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';
import { getStaffMemberById } from '@/services/staff';
import type { StaffMember, OrderStatus } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];

export default function AccountPage() {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = React.useState(false);
    const [loggedInStaff, setLoggedInStaff] = React.useState<StaffMember | undefined>(undefined);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);

    React.useEffect(() => {
        // In a real app, you would get the logged-in user's ID from your auth context
        const staffId = 'STAFF003'; 
        getStaffMemberById(staffId).then(data => {
            setLoggedInStaff(data);
            setIsLoading(false);
        });
    }, []);

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
    
    const handleSaveChanges = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsEditing(false);
            setIsSaving(false);
            toast({
                title: "Profile Updated",
                description: "Your account information has been successfully saved.",
            })
        }, 1500);
    };

    const handleUpdatePassword = () => {
        setIsUpdatingPassword(true);
        setTimeout(() => {
            setIsUpdatingPassword(false);
            toast({
                title: "Password Updated",
                description: "Your password has been changed successfully.",
            });
        }, 1500);
    }

    if (isLoading || !loggedInStaff) {
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

    return (
        <div className="flex-1 space-y-6 p-4 lg:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-headline">My Account</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and view your performance.
                    </p>
                </div>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                         <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button onClick={handleSaveChanges} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                ) : (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                )}
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
                                <Input id="name" defaultValue={loggedInStaff.name} disabled={!isEditing || isSaving} />
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

                    {isEditing && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>Update your login password.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input id="current-password" type="password" disabled={isUpdatingPassword} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input id="new-password" type="password" disabled={isUpdatingPassword} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input id="confirm-password" type="password" disabled={isUpdatingPassword} />
                                </div>
                            </CardContent>
                             <CardFooter>
                                <Button className="ml-auto" onClick={handleUpdatePassword} disabled={isUpdatingPassword}>
                                    {isUpdatingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                    
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart2 className="h-5 w-5 text-muted-foreground" />
                                Performance Overview
                            </CardTitle>
                            <CardDescription>A summary of your order-related activities.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="rounded-lg border bg-card p-4 flex flex-col items-center justify-center text-center">
                                    <p className="text-xs text-muted-foreground">Orders Created</p>
                                    <p className="text-3xl font-bold">{loggedInStaff.performance.ordersCreated}</p>
                                </div>
                                <div className="rounded-lg border bg-card p-4 flex flex-col items-center justify-center text-center">
                                    <p className="text-xs text-muted-foreground">Orders Confirmed</p>
                                    <p className="text-3xl font-bold">{loggedInStaff.performance.ordersConfirmed}</p>
                                </div>
                            </div>
                             <div>
                                {performanceChartData.length > 0 ? (
                                    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                                        <PieChart>
                                            <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
                                            <Pie data={performanceChartData} dataKey="value" nameKey="status" innerRadius={50} paddingAngle={5}>
                                                {performanceChartData.map((entry) => (
                                                    <Cell key={`cell-${entry.status}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">No performance data.</div>
                                )}
                             </div>
                        </CardContent>
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
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">On Order Create</span>
                                        <span>৳{loggedInStaff.commissionDetails.onOrderCreate.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">On Order Confirm</span>
                                        <span>৳{loggedInStaff.commissionDetails.onOrderConfirm.toFixed(2)}</span>
                                    </div>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
