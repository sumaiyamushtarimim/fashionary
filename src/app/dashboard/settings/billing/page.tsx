
'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const invoices = [
    { id: 'INV-2024-005', date: 'June 1, 2024', amount: 49.00, status: 'Paid' },
    { id: 'INV-2024-004', date: 'May 1, 2024', amount: 49.00, status: 'Paid' },
    { id: 'INV-2024-003', date: 'April 1, 2024', amount: 49.00, status: 'Paid' },
    { id: 'INV-2024-002', date: 'March 1, 2024', amount: 49.00, status: 'Paid' },
];

export default function BillingPage() {

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="mx-auto grid w-full max-w-6xl gap-6">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold">Billing</h1>
                    <p className="text-muted-foreground">Manage your subscription, payment method, and view your billing history.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-5">
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Current Plan</CardTitle>
                            <CardDescription>You are currently on the Pro plan.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="space-y-2">
                                <p className="text-4xl font-bold">৳4,900 <span className="text-lg font-normal text-muted-foreground">/ month</span></p>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Unlimited Orders</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Up to 10 Staff Members</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Advanced Analytics</span>
                                    </li>
                                     <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>All Integrations</span>
                                    </li>
                                </ul>
                           </div>
                        </CardContent>
                        <CardFooter className="border-t pt-6">
                            <Button>Upgrade Plan</Button>
                        </CardFooter>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                            <CardDescription>The card that will be charged for your subscription.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                                <div className="font-mono text-sm">•••• •••• •••• 4242</div>
                                <Badge variant="secondary">Visa</Badge>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Billing Address</p>
                                <address className="mt-1 not-italic text-muted-foreground text-sm">
                                    123 Fashion Ave<br/>
                                    Dhaka 1212<br/>
                                    Bangladesh
                                </address>
                            </div>
                        </CardContent>
                         <CardFooter className="border-t pt-6">
                            <Button variant="outline">Update Payment Method</Button>
                        </CardFooter>
                    </Card>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Billing History</CardTitle>
                        <CardDescription>View and download your past invoices.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead><span className="sr-only">Download</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">{invoice.id}</TableCell>
                                        <TableCell>{invoice.date}</TableCell>
                                        <TableCell>
                                            <Badge variant={invoice.status === 'Paid' ? 'secondary' : 'default'} className="bg-green-500/20 text-green-700">{invoice.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">৳{invoice.amount.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <Download className="h-4 w-4" />
                                                <span className="sr-only">Download Invoice</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
