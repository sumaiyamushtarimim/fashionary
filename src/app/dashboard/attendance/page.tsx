
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getDailyAttendance } from '@/services/attendance';
import type { AttendanceRecord } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format, differenceInMinutes } from 'date-fns';
import { Separator } from '@/components/ui/separator';

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
    const [attendanceRecords, setAttendanceRecords] = React.useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isClient, setIsClient] = React.useState(false);
    const today = new Date();

    React.useEffect(() => {
        setIsClient(true);
        setIsLoading(true);
        getDailyAttendance(today.toISOString()).then((data) => {
            setAttendanceRecords(data);
            setIsLoading(false);
        });
    }, []);

    const summaryStats = React.useMemo(() => {
        const totalStaff = attendanceRecords.length;
        const present = attendanceRecords.filter(r => r.status === 'Present').length;
        const onLeave = attendanceRecords.filter(r => r.status === 'On Leave').length;
        const absent = totalStaff - present - onLeave;
        return { totalStaff, present, onLeave, absent };
    }, [attendanceRecords]);

    const renderTable = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check-in Time</TableHead>
                    <TableHead>Check-out Time</TableHead>
                    <TableHead>Total Break</TableHead>
                    <TableHead className="text-right">Work Duration</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {attendanceRecords.map(record => {
                    const StatusIcon = statusConfig[record.status].icon;
                    return (
                        <TableRow key={record.staffId}>
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
                            <TableCell>{record.checkInTime ? format(new Date(record.checkInTime), 'h:mm a') : '-'}</TableCell>
                            <TableCell>{record.checkOutTime ? format(new Date(record.checkOutTime), 'h:mm a') : '-'}</TableCell>
                            <TableCell>{formatDuration(record.totalBreakDuration || 0)}</TableCell>
                            <TableCell className="text-right font-mono">{formatDuration(record.totalWorkDuration || 0)}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    );

    const renderCards = () => (
         <div className="space-y-4">
            {attendanceRecords.map(record => {
                 const StatusIcon = statusConfig[record.status].icon;
                 return (
                    <Card key={record.staffId}>
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
                    <h1 className="font-headline text-2xl font-bold">Daily Attendance</h1>
                    <p className="text-muted-foreground hidden sm:block">
                        Today's attendance report for all staff members.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline"><CalendarDays className="mr-2 h-4 w-4"/> {format(today, 'MMMM d, yyyy')}</Button>
                    <Button variant="outline"><FileDown className="mr-2 h-4 w-4"/> Export</Button>
                </div>
            </div>

             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summaryStats.totalStaff}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Present</CardTitle>
                        <Check className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summaryStats.present}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Absent</CardTitle>
                        <X className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summaryStats.absent}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                        <Minus className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summaryStats.onLeave}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="pt-6">
                    {isLoading ? (
                        <div className="h-48 flex items-center justify-center text-muted-foreground">Loading attendance records...</div>
                    ) : (
                        isClient && (
                            <>
                                <div className="hidden sm:block">{renderTable()}</div>
                                <div className="sm:hidden">{renderCards()}</div>
                            </>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

