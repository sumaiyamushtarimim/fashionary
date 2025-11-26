
'use client';

import * as React from 'react';
import { MoreHorizontal, AlertCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { getIssues, createIssue } from '@/services/issues';
import { getStaff } from '@/services/staff';
import type { Issue, IssueStatus, StaffMember, IssuePriority } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const ITEMS_PER_PAGE = 10;

const statusColors: Record<IssueStatus, string> = {
    'Open': 'bg-blue-500/20 text-blue-700',
    'In Progress': 'bg-yellow-500/20 text-yellow-700',
    'Resolved': 'bg-green-500/20 text-green-700',
    'Closed': 'bg-gray-500/20 text-gray-700',
};

const allStatuses: IssueStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

const issueFormSchema = z.object({
    orderId: z.string().optional(),
    title: z.string().min(5, "Title must be at least 5 characters."),
    description: z.string().min(10, "Please provide a detailed description."),
    priority: z.enum(['Low', 'Medium', 'High']),
});
type IssueFormValues = z.infer<typeof issueFormSchema>;

export default function IssuesPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [allIssues, setAllIssues] = React.useState<Issue[]>([]);
    const [allStaff, setAllStaff] = React.useState<StaffMember[]>([]);
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [assigneeFilter, setAssigneeFilter] = React.useState('all');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    // Mock current user
    const currentUserId = 'STAFF001'; 

    const issueForm = useForm<IssueFormValues>({
        resolver: zodResolver(issueFormSchema),
        defaultValues: {
            orderId: '',
            title: '',
            description: '',
            priority: 'Medium',
        },
    });

    React.useEffect(() => {
        setIsLoading(true);
        Promise.all([
            getIssues(),
            getStaff()
        ]).then(([issuesData, staffData]) => {
            setAllIssues(issuesData);
            setAllStaff(staffData);
            setIsLoading(false);
        });
    }, []);

    const filteredIssues = React.useMemo(() => {
        return allIssues.filter(issue => {
            const statusMatch = statusFilter === 'all' || issue.status === statusFilter;
            const assigneeMatch = assigneeFilter === 'all' || issue.assignedTo === assigneeFilter;
            return statusMatch && assigneeMatch;
        });
    }, [statusFilter, assigneeFilter, allIssues]);
    
    const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);
    const paginatedIssues = React.useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredIssues.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredIssues, currentPage]);

    const handleAssignToMe = () => {
        const currentUser = allStaff.find(s => s.id === currentUserId);
        if (currentUser) {
            setAssigneeFilter(currentUser.name);
        }
    }

    async function onIssueSubmit(data: IssueFormValues) {
        const newIssue = await createIssue(data.orderId, data.title, data.description, data.priority);
        setAllIssues(prev => [newIssue, ...prev]);
        toast({
            title: "Issue Created",
            description: `Issue #${newIssue.id} has been successfully created.`,
        });
        setIsDialogOpen(false);
        issueForm.reset();
        router.push(`/dashboard/issues/${newIssue.id}`);
    }

    const renderTable = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Issue ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedIssues.map(issue => (
                    <TableRow key={issue.id}>
                        <TableCell className="font-medium">{issue.id}</TableCell>
                        <TableCell>
                            {issue.orderId ? (
                                <Button variant="link" asChild className="p-0 h-auto">
                                    <Link href={`/dashboard/orders/${issue.orderId}`}>{issue.orderId}</Link>
                                </Button>
                            ) : (
                                <span className="text-muted-foreground">-</span>
                            )}
                        </TableCell>
                        <TableCell>{issue.title}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={cn(statusColors[issue.status])}>{issue.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={issue.priority === 'High' ? 'destructive' : issue.priority === 'Medium' ? 'secondary' : 'outline'}>{issue.priority}</Badge>
                        </TableCell>
                         <TableCell>{issue.assignedTo || 'Unassigned'}</TableCell>
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

    const renderCardList = () => (
        <div className="space-y-4">
            {paginatedIssues.map(issue => (
                <Card key={issue.id}>
                    <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <Link href={`/dashboard/issues/${issue.id}`} className="font-semibold hover:underline">{issue.id}</Link>
                                <p className="text-sm text-muted-foreground">
                                    {issue.orderId ? (
                                        <>
                                            Order: <Link href={`/dashboard/orders/${issue.orderId}`} className="text-primary hover:underline">{issue.orderId}</Link>
                                        </>
                                    ) : 'General Issue'}
                                </p>
                            </div>
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
                        </div>
                        <p className="font-medium text-sm">{issue.title}</p>
                        <Separator />
                        <div className="flex justify-between items-center text-xs">
                             <Badge variant="outline" className={cn(statusColors[issue.status])}>{issue.status}</Badge>
                             <Badge variant={issue.priority === 'High' ? 'destructive' : issue.priority === 'Medium' ? 'secondary' : 'outline'}>{issue.priority} Priority</Badge>
                        </div>
                         <div className="text-xs text-muted-foreground pt-2 border-t">
                            <p>Assigned to: <span className="font-medium">{issue.assignedTo || 'Unassigned'}</span></p>
                            <p>Created: {format(new Date(issue.createdAt), 'PP')}</p>
                         </div>
                    </CardContent>
                </Card>
            ))}
        </div>
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
                 <div className="flex items-center gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                                <PlusCircle className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">New Issue</span>
                                <span className="sr-only sm:hidden">New Issue</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Issue</DialogTitle>
                                <DialogDescription>
                                    Report a new problem or issue.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...issueForm}>
                                <form onSubmit={issueForm.handleSubmit(onIssueSubmit)} className="space-y-4">
                                    <FormField control={issueForm.control} name="orderId" render={({ field }) => (<FormItem><FormLabel>Order ID (Optional)</FormLabel><FormControl><Input placeholder="e.g., ORD-2024-001" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={issueForm.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Wrong product delivered" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={issueForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Provide a detailed description of the issue..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={issueForm.control} name="priority" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Priority</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger></FormControl>
                                                <SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem></SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                        <Button type="submit">Create Issue</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>All Issues</CardTitle>
                    <CardDescription>A list of all reported issues.</CardDescription>
                    <div className="pt-4 flex flex-col sm:flex-row gap-2">
                        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2">
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
                            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by assignee" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Staff</SelectItem>
                                    {allStaff.map(staff => (
                                        <SelectItem key={staff.id} value={staff.name}>{staff.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleAssignToMe}>Assigned to me</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="h-48 flex items-center justify-center text-muted-foreground">Loading issues...</div>
                    ) : paginatedIssues.length > 0 ? (
                        <>
                            <div className="hidden sm:block">{renderTable()}</div>
                            <div className="sm:hidden">{renderCardList()}</div>
                        </>
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
