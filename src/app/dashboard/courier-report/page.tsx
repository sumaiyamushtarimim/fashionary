'use client';

import * as React from 'react';
import { Search, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { getDeliveryReport, type DeliveryReport, type CourierSummary } from '@/services/delivery-score';

function ReportSkeleton() {
    return (
        <div className="space-y-4 mt-6">
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    );
}

function ReportDisplay({ report }: { report: DeliveryReport }) {
    const courierStatsData = React.useMemo(() => {
        if (!report || !report.Summaries) return [];
        return Object.entries(report.Summaries).map(([name, data]) => ({
            name,
            total: data["Total Parcels"] || data["Total Delivery"] || 0,
            delivered: data["Delivered Parcels"] || data["Successful Delivery"] || 0,
            canceled: data["Canceled Parcels"] || data["Canceled Delivery"] || 0,
        })).filter(item => item.total > 0);
    }, [report]);

    const totalParcels = report?.totalSummary["Total Parcels"] || 0;
    const totalDelivered = report?.totalSummary["Delivered Parcels"] || 0;
    const totalCanceled = report?.totalSummary["Canceled Parcels"] || 0;
    const deliveryRatio = totalParcels > 0 ? (totalDelivered / totalParcels) * 100 : 0;
    const cancelRatio = totalParcels > 0 ? (totalCanceled / totalParcels) * 100 : 0;

    return (
        <div className="mt-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Courier Delivery Report</CardTitle>
                    <CardDescription>
                        A summary of parcel delivery history across different courier services.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                     <div className="grid grid-cols-4 gap-x-4 border-b pb-2 text-xs font-medium text-muted-foreground">
                        <div className="col-span-1">Courier</div>
                        <div className="col-span-1 text-center">Total</div>
                        <div className="col-span-1 text-center">Delivered</div>
                        <div className="col-span-1 text-center">Canceled</div>
                    </div>
                    {courierStatsData.map(courier => (
                        <div key={courier.name} className="grid grid-cols-4 gap-x-4 items-center text-sm">
                            <div className="col-span-1 font-semibold">{courier.name}</div>
                            <div className="col-span-1 text-center font-medium">{courier.total}</div>
                            <div className="col-span-1 text-center font-medium text-green-600">{courier.delivered}</div>
                            <div className="col-span-1 text-center font-medium text-red-500">{courier.canceled}</div>
                        </div>
                    ))}
                    <Separator />
                    <div className="grid grid-cols-4 gap-x-4 items-center text-sm font-bold">
                        <div className="col-span-1">Total</div>
                        <div className="col-span-1 text-center">{totalParcels}</div>
                        <div className="col-span-1 text-center text-green-600">{totalDelivered}</div>
                        <div className="col-span-1 text-center text-red-500">{totalCanceled}</div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Delivery & Cancellation Ratios</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-semibold">Delivery Ratio</span>
                            <span className="font-bold text-green-600">{deliveryRatio.toFixed(1)}%</span>
                        </div>
                        <Progress value={deliveryRatio} className="h-2 [&>div]:bg-green-500" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-semibold">Cancel Ratio</span>
                            <span className="font-bold text-red-500">{cancelRatio.toFixed(1)}%</span>
                        </div>
                        <Progress value={cancelRatio} className="h-2 [&>div]:bg-red-500" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function CourierReportPage() {
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [report, setReport] = React.useState<DeliveryReport | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [searched, setSearched] = React.useState(false);

    const handleSearch = async () => {
        if (!phoneNumber) {
            setError('Please enter a phone number.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setReport(null);
        setSearched(true);
        try {
            const data = await getDeliveryReport(phoneNumber);
            if (data) {
                setReport(data);
            } else {
                setError('Could not fetch report. The API may be down or the phone number is invalid.');
            }
        } catch (e) {
            setError('An unexpected error occurred.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <div className="flex-1">
                    <h1 className="font-headline text-2xl font-bold">Courier Report Search</h1>
                    <p className="text-muted-foreground">
                        Enter a phone number to get a delivery report across all couriers.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Search by Phone Number</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full max-w-lg items-center space-x-2">
                        <Input
                            type="tel"
                            placeholder="e.g., 01xxxxxxxxx"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button onClick={handleSearch} disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Search className="mr-2 h-4 w-4" />
                            )}
                            Search
                        </Button>
                    </div>
                    {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                </CardContent>
            </Card>

            {isLoading && <ReportSkeleton />}

            {!isLoading && report && <ReportDisplay report={report} />}
            
            {!isLoading && !report && searched && (
                <div className="text-center text-muted-foreground mt-8">
                    <p>No report found for this phone number.</p>
                </div>
            )}
        </div>
    );
}
