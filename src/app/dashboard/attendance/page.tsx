
'use client';

import * as React from 'react';
import {
  Clock,
  LogIn,
  LogOut,
  Coffee,
  CalendarDays,
  FileDown,
  User,
  Check,
  X,
  Minus,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAttendance } from '@/services/attendance';
import type { AttendanceRecord } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format, differenceInMinutes, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useIsMobile } from '@/hooks/use-mobile';


const statusConfig = {
    Present: { color: 'bg-green-500/20 text-green-700', icon: Check },
    Absent: { color: 'bg-red-500/20 text-red-700', icon: X },
    'On Leave': { color: 'bg-yellow-500/20 text-yellow-700', icon: Minus },
};

function formatDuration(minutes: number): string {
    if (minutes < 0) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
}


export default function AttendancePage() {
    const [allAttendanceRecords, setAllAttendanceRecords] = React.useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const isMobile = useIsMobile();
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: startOfDay(new Date()),
        to: endOfDay(new Date()),
    });

    React.useEffect(() => {
        setIsLoading(true);
        getAttendance(dateRange).then((data) => {
            setAllAttendanceRecords(data);
            setIsLoading(false);
        });
    }, [dateRange]);

    const summaryStats = React.useMemo(() => {
        const totalManDays = allAttendanceRecords.filter(r => r.status === 'Present').length;
        const totalOnLeave = allAttendanceRecords.filter(r => r.status === 'On Leave').length;
        const totalAbsent = allAttendanceRecords.filter(r => r.status === 'Absent').length;

        const presentRecords = allAttendanceRecords.filter(r => r.status === 'Present' && r.totalWorkDuration);
        const totalWorkMinutes = presentRecords.reduce((acc, r) => acc + (r.totalWorkDuration || 0), 0);
        const avgWorkDuration = presentRecords.length > 0 ? totalWorkMinutes / presentRecords.length : 0;
        
        return { totalManDays, totalOnLeave, totalAbsent, avgWorkDuration };
    }, [allAttendanceRecords]);
    
    const groupedRecords = React.useMemo(() => {
        return allAttendanceRecords.reduce((acc, record) => {
            const date = format(new Date(record.date), 'yyyy-MM-dd');
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(record);
            return acc;
        }, {} as Record<string, AttendanceRecord[]>);
    }, [allAttendanceRecords]);

    const sortedDates = React.useMemo(() => Object.keys(groupedRecords).sort((a,b) => new Date(b).getTime() - new Date(a).getTime()), [groupedRecords]);

    const handleExport = () => {
        const headers = ["Date", "Staff Name", "Role", "Status", "Check-in", "Check-out", "Work Duration (min)", "Break Duration (min)"];
        const rows = allAttendanceRecords.map(record => [
            `"${format(new Date(record.date), 'yyyy-MM-dd')}"`,
            `"${record.staffName}"`,
            `"${record.staffRole}"`,
            record.status,
            record.checkInTime ? `"${format(new Date(record.checkInTime), 'h:mm a')}"` : 'N/A',
            record.checkOutTime ? `"${format(new Date(record.checkOutTime), 'h:mm a')}"` : 'N/A',
            record.totalWorkDuration || 0,
            record.totalBreakDuration || 0
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        const fromDate = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : 'start';
        const toDate = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : 'end';
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `attendance_report_${fromDate}_to_${toDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderTable = (records: AttendanceRecord[]) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Check-in</TableHead>
                    <TableHead className="hidden md:table-cell">Check-out</TableHead>
                    <TableHead className="hidden lg:table-cell">Break</TableHead>
                    <TableHead className="text-right">Work Duration</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {records.map(record => {
                    const StatusIcon = statusConfig[record.status].icon;
                    return (
                        <TableRow key={record.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        {record.staffAvatar && <AvatarImage src={record.staffAvatar} alt={record.staffName} />}
                                        <AvatarFallback>{record.staffName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{record.staffName}</p>
                                        <p className="text-xs text-muted-foreground">{record.staffRole}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={statusConfig[record.status].color}>
                                    <StatusIcon className="mr-1 h-3 w-3" />
                                    {record.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{record.checkInTime ? format(new Date(record.checkInTime), 'h:mm a') : '-'}</TableCell>
                            <TableCell className="hidden md:table-cell">{record.checkOutTime ? format(new Date(record.checkOutTime), 'h:mm a') : '-'}</TableCell>
                            <TableCell className="hidden lg:table-cell">{formatDuration(record.totalBreakDuration || 0)}</TableCell>
                            <TableCell className="text-right font-mono">{formatDuration(record.totalWorkDuration || 0)}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    );

    const renderCards = (records: AttendanceRecord[]) => (
         <div className="space-y-4">
            {records.map(record => {
                 const StatusIcon = statusConfig[record.status].icon;
                 return (
                    <Card key={record.id}>
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        {record.staffAvatar && <AvatarImage src={record.staffAvatar} alt={record.staffName} />}
                                        <AvatarFallback>{record.staffName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{record.staffName}</p>
                                        <p className="text-xs text-muted-foreground">{record.staffRole}</p>
                                    </div>
                                </div>
                                 <Badge variant="outline" className={statusConfig[record.status].color}>
                                    <StatusIcon className="mr-1 h-3 w-3" />
                                    {record.status}
                                </Badge>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div>
                                    <p className="text-muted-foreground">Check-in</p>
                                    <p className="font-medium">{record.checkInTime ? format(new Date(record.checkInTime), 'h:mm a') : '-'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Check-out</p>
                                    <p className="font-medium">{record.checkOutTime ? format(new Date(record.checkOutTime), 'h:mm a') : '-'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Work Duration</p>
                                    <p className="font-semibold font-mono text-sm">{formatDuration(record.totalWorkDuration || 0)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                 )
            })}
         </div>
    );

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <div className="flex-1">
                    <h1 className="font-headline text-2xl font-bold">Attendance Report</h1>
                    <p className="text-muted-foreground hidden sm:block">
                        View and export attendance reports for all staff members.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                    <Button variant="outline" onClick={handleExport}>
                        <FileDown className="mr-2 h-4 w-4"/> 
                        Export
                    </Button>
                </div>
            </div>

             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Man-days</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summaryStats.totalManDays}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Work Duration</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatDuration(summaryStats.avgWorkDuration)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Absent</CardTitle>
                        <X className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summaryStats.totalAbsent}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total On Leave</CardTitle>
                        <Minus className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summaryStats.totalOnLeave}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    <div className="h-48 flex items-center justify-center text-muted-foreground">Loading attendance records...</div>
                ) : sortedDates.length > 0 ? (
                    sortedDates.map(date => (
                        <Card key={date}>
                             <CardHeader>
                                <CardTitle>{format(new Date(date), 'EEEE, MMMM d, yyyy')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isMobile ? renderCards(groupedRecords[date]) : renderTable(groupedRecords[date])}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
                            No attendance records found for the selected date range.
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
