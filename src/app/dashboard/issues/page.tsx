
'use client';

import * as React from 'react';
import { MoreHorizontal, AlertCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { DateRange } from "react-day-picker";
import { format, isWithinInterval } from "date-fns";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getIssues } from '@/services/issues';
import type { Issue, IssueStatus } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 10;

const statusColors: Record<IssueStatus, string> = {
    'Open': 'bg-blue-500/20 text-blue-700',
    'In Progress': 'bg-yellow-500/20 text-yellow-700',
    'Resolved': 'bg-green-500/20 text-green-700',
    'Closed': 'bg-gray-500/20 text-gray-700',
};

const allStatuses: IssueStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

export default function IssuesPage() {
    const [allIssues, setAllIssues] = React.useState<Issue[]>([]);
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        getIssues().then(data => {
            setAllIssues(data);
            setIsLoading(false);
        });
    }, []);

    const filteredIssues = React.useMemo(() => {
        if (statusFilter === 'all') return allIssues;
        return allIssues.filter(issue => issue.status === statusFilter);
    }, [statusFilter, allIssues]);
    
    const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);
    const paginatedIssues = React.useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredIssues.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredIssues, currentPage]);

    const renderTable = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Issue ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedIssues.map(issue => (
                    <TableRow key={issue.id}>
                        <TableCell className="font-medium">{issue.id}</TableCell>
                        <TableCell>
                            <Button variant="link" asChild className="p-0 h-auto">
                                <Link href={`/dashboard/orders/${issue.orderId}`}>{issue.orderId}</Link>
                            </Button>
                        </TableCell>
                        <TableCell>{issue.title}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={cn(statusColors[issue.status])}>{issue.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={issue.priority === 'High' ? 'destructive' : issue.priority === 'Medium' ? 'secondary' : 'outline'}>{issue.priority}</Badge>
                        </TableCell>
                        <TableCell>{format(new Date(issue.createdAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/issues/${issue.id}`}>View Details</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <div className="flex-1">
                    <h1 className="font-headline text-2xl font-bold">Issue Management</h1>
                    <p className="text-muted-foreground hidden sm:block">
                        Track and resolve customer and order-related issues.
                    </p>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>All Issues</CardTitle>
                    <CardDescription>A list of all reported issues.</CardDescription>
                    <div className="pt-4">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {allStatuses.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="h-48 flex items-center justify-center text-muted-foreground">Loading issues...</div>
                    ) : paginatedIssues.length > 0 ? (
                        renderTable()
                    ) : (
                        <div className="h-48 flex flex-col items-center justify-center text-center text-muted-foreground">
                            <AlertCircle className="w-12 h-12 mb-4" />
                            <h3 className="font-semibold">No Issues Found</h3>
                            <p className="text-sm">No issues match the current filter.</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                     <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
                        <div>
                            Showing <strong>{paginatedIssues.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-
                            {Math.min(currentPage * ITEMS_PER_PAGE, filteredIssues.length)}
                            </strong> of <strong>{filteredIssues.length}</strong> issues
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
        </div>
    );
}
