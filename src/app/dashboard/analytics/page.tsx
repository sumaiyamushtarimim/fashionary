'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';
import {
  BarChart,
  DollarSign,
  MinusCircle,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Bar, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ComposedChart, Line, Legend } from 'recharts';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { getAnalyticsData } from '@/services/analytics';
import { businesses } from '@/lib/placeholder-data';
import { Skeleton } from '@/components/ui/skeleton';

type AnalyticsData = {
    summary: {
        totalRevenue: number;
        cogs: number;
        grossProfit: number;
        expenses: number;
        netProfit: number;
    };
    monthlyBreakdown: { month: string; revenue: number; cogs: number; expenses: number; profit: number; }[];
    expenseBreakdown: { category: string; amount: number; fill: string; }[];
}

const chartConfig: ChartConfig = {
    revenue: { label: 'Revenue', color: 'hsl(var(--chart-2))' },
    profit: { label: 'Net Profit', color: 'hsl(var(--chart-1))' },
    expenses: { label: 'Expenses', color: 'hsl(var(--chart-5))' },
};


export default function AnalyticsPage() {
    const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData | null>(null);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
    const [isLoading, setIsLoading] = React.useState(true);

     React.useEffect(() => {
        setIsLoading(true);
        getAnalyticsData().then(data => {
            setAnalyticsData(data);
            setIsLoading(false);
        });
    }, []);

    const expenseChartConfig: ChartConfig = React.useMemo(() => {
        if (!analyticsData) return {};
        return analyticsData.expenseBreakdown.reduce((acc, item) => {
            acc[item.category] = { label: item.category, color: item.fill };
            return acc;
        }, {} as ChartConfig);
    }, [analyticsData]);

    if (isLoading || !analyticsData) {
        return (
             <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <Skeleton className="h-12 w-1/3" />
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-[126px]" />)}
                </div>
                 <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                    <Skeleton className="lg:col-span-3 h-[400px]" />
                    <Skeleton className="lg:col-span-2 h-[400px]" />
                </div>
                 <Skeleton className="h-[300px]" />
            </div>
        )
    }


    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                    <h1 className="font-headline text-2xl font-bold">Business Analytics</h1>
                    <p className="text-muted-foreground hidden sm:block">An overview of your business&apos;s financial performance.</p>
                </div>
                 <div className="flex flex-col sm:flex-row items-center gap-2">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by business" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Businesses</SelectItem>
                            {businesses.map(business => (
                                <SelectItem key={business.id} value={business.id}>{business.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">৳{analyticsData.summary.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">COGS</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">৳{analyticsData.summary.cogs.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Cost of Goods Sold</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">৳{analyticsData.summary.grossProfit.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Revenue - COGS</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <MinusCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">৳{analyticsData.summary.expenses.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Operational costs</p>
                    </CardContent>
                </Card>
                <Card className="bg-primary/10 border-primary md:col-span-3 lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">৳{analyticsData.summary.netProfit.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">The bottom line</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Performance Over Time</CardTitle>
                        <CardDescription>Monthly revenue, expenses, and profit.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                            <ComposedChart data={analyticsData.monthlyBreakdown}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis tickFormatter={(value) => `৳${Number(value) / 1000}k`} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend />
                                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                                <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} dot={false} />
                            </ComposedChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Expense Breakdown</CardTitle>
                        <CardDescription>How your operational costs are distributed.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={expenseChartConfig} className="mx-auto aspect-square max-h-[300px]">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="amount" hideLabel />} />
                                <Pie data={analyticsData.expenseBreakdown} dataKey="amount" nameKey="category" innerRadius={60} />
                                <ChartLegend content={<ChartLegendContent nameKey="category" />} className="-translate-y-2 flex-wrap gap-2" />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Profit & Loss Statement</CardTitle>
                    <CardDescription>Detailed monthly financial breakdown.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* For larger screens */}
                    <div className="hidden sm:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Month</TableHead>
                                    <TableHead className="text-right">Revenue</TableHead>
                                    <TableHead className="text-right">COGS</TableHead>
                                    <TableHead className="text-right">Gross Profit</TableHead>
                                    <TableHead className="text-right">Expenses</TableHead>
                                    <TableHead className="text-right">Net Profit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analyticsData.monthlyBreakdown.map((row) => (
                                    <TableRow key={row.month}>
                                        <TableCell className="font-medium">{row.month}</TableCell>
                                        <TableCell className="text-right font-mono">৳{row.revenue.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono text-red-500">৳{row.cogs.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono">৳{(row.revenue - row.cogs).toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono text-red-500">৳{row.expenses.toLocaleString()}</TableCell>
                                        <TableCell className={cn("text-right font-mono font-bold", row.profit >= 0 ? 'text-green-600' : 'text-red-600')}>
                                            ৳{row.profit.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* For smaller screens */}
                    <div className="sm:hidden space-y-4">
                        {analyticsData.monthlyBreakdown.map((row) => (
                            <Card key={row.month}>
                                <CardHeader>
                                    <CardTitle>{row.month}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className='flex justify-between items-center'>
                                        <span className='text-muted-foreground'>Revenue</span>
                                        <span className='font-mono'>৳{row.revenue.toLocaleString()}</span>
                                    </div>
                                    <div className='flex justify-between items-center text-red-500'>
                                        <span className='text-muted-foreground'>COGS</span>
                                        <span className='font-mono'>৳{row.cogs.toLocaleString()}</span>
                                    </div>
                                     <div className='flex justify-between items-center'>
                                        <span className='text-muted-foreground'>Gross Profit</span>
                                        <span className='font-mono'>৳{(row.revenue - row.cogs).toLocaleString()}</span>
                                    </div>
                                     <div className='flex justify-between items-center text-red-500'>
                                        <span className='text-muted-foreground'>Expenses</span>
                                        <span className='font-mono'>৳{row.expenses.toLocaleString()}</span>
                                    </div>
                                    <Separator />
                                     <div className={cn("flex justify-between items-center font-bold", row.profit >= 0 ? 'text-green-600' : 'text-red-600')}>
                                        <span>Net Profit</span>
                                        <span className='font-mono'>৳{row.profit.toLocaleString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}

    