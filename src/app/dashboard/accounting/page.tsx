
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { getChartOfAccounts, getLedgerEntries, getBalanceSheet } from '@/services/accounting';
import type { Account, LedgerEntry, BalanceSheet } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

function LedgerView() {
    const [accounts, setAccounts] = React.useState<Account[]>([]);
    const [ledgerEntries, setLedgerEntries] = React.useState<LedgerEntry[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedAccount, setSelectedAccount] = React.useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
    
    React.useEffect(() => {
        setIsLoading(true);
        Promise.all([
            getChartOfAccounts(),
            getLedgerEntries(selectedAccount, dateRange)
        ]).then(([accountsData, entriesData]) => {
            setAccounts(accountsData);
            setLedgerEntries(entriesData);
            if (!selectedAccount) {
                setSelectedAccount(accountsData[0]?.id);
            }
            setIsLoading(false);
        });
    }, [selectedAccount, dateRange]);

    const runningBalance = React.useMemo(() => {
        let balance = 0;
        return ledgerEntries.map(entry => {
            balance += (entry.debit || 0) - (entry.credit || 0);
            return { ...entry, balance };
        });
    }, [ledgerEntries]);
    
    const currentAccount = accounts.find(a => a.id === selectedAccount);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger className="sm:w-[250px]">
                        <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent>
                        {accounts.map(acc => (
                            <SelectItem key={acc.id} value={acc.id}>{acc.name} ({acc.type})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <DateRangePicker date={dateRange} onDateChange={setDateRange} />
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>General Ledger: {currentAccount?.name || 'N/A'}</CardTitle>
                    <CardDescription>
                        Detailed transaction history for the selected account and date range.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead className="text-right">Debit</TableHead>
                                <TableHead className="text-right">Credit</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6}><Skeleton className="h-6 w-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : runningBalance.length > 0 ? (
                                runningBalance.map(entry => (
                                    <TableRow key={entry.id}>
                                        <TableCell>{format(new Date(entry.date), 'PP')}</TableCell>
                                        <TableCell>{entry.description}</TableCell>
                                        <TableCell>{entry.sourceTransactionId}</TableCell>
                                        <TableCell className="text-right font-mono">{entry.debit ? `৳${entry.debit.toFixed(2)}` : '-'}</TableCell>
                                        <TableCell className="text-right font-mono text-red-500">{entry.credit ? `৳${entry.credit.toFixed(2)}` : '-'}</TableCell>
                                        <TableCell className={cn("text-right font-mono", entry.balance < 0 ? "text-red-500" : "")}>
                                            ৳{entry.balance.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No entries found for the selected criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function BalanceSheetView() {
    const [balanceSheet, setBalanceSheet] = React.useState<BalanceSheet | null>(null);
    const [date, setDate] = React.useState<Date>(new Date());
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        getBalanceSheet(date).then(data => {
            setBalanceSheet(data);
            setIsLoading(false);
        });
    }, [date]);

    if (isLoading || !balanceSheet) {
        return (
            <div className="space-y-4">
                 <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    const { assets, liabilities, equity } = balanceSheet;

    return (
         <Card>
            <CardHeader>
                <CardTitle>Balance Sheet</CardTitle>
                <CardDescription>As of {format(date, 'MMMM d, yyyy')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Assets */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Assets</h3>
                        {assets.accounts.map(acc => (
                            <div key={acc.id} className="flex justify-between text-sm">
                                <span>{acc.name}</span>
                                <span className="font-mono">৳{acc.balance.toFixed(2)}</span>
                            </div>
                        ))}
                         <Separator />
                         <div className="flex justify-between font-bold">
                            <span>Total Assets</span>
                            <span className="font-mono">৳{assets.total.toFixed(2)}</span>
                        </div>
                    </div>
                    {/* Liabilities and Equity */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Liabilities & Equity</h3>
                        <h4 className="font-medium text-muted-foreground">Liabilities</h4>
                         {liabilities.accounts.map(acc => (
                            <div key={acc.id} className="flex justify-between text-sm">
                                <span>{acc.name}</span>
                                <span className="font-mono">৳{acc.balance.toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-semibold">
                            <span>Total Liabilities</span>
                            <span className="font-mono">৳{liabilities.total.toFixed(2)}</span>
                        </div>
                        
                        <Separator className="my-4" />

                        <h4 className="font-medium text-muted-foreground">Equity</h4>
                          {equity.accounts.map(acc => (
                            <div key={acc.id} className="flex justify-between text-sm">
                                <span>{acc.name}</span>
                                <span className="font-mono">৳{acc.balance.toFixed(2)}</span>
                            </div>
                        ))}
                         <div className="flex justify-between font-semibold">
                            <span>Total Equity</span>
                            <span className="font-mono">৳{equity.total.toFixed(2)}</span>
                        </div>
                        <Separator />
                         <div className="flex justify-between font-bold">
                            <span>Total Liabilities & Equity</span>
                            <span className="font-mono">৳{(liabilities.total + equity.total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AccountingPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">Accounting</h1>
                <p className="text-muted-foreground">View your general ledger and balance sheet.</p>
            </div>
             <Tabs defaultValue="ledger">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ledger">General Ledger</TabsTrigger>
                    <TabsTrigger value="sheet">Balance Sheet</TabsTrigger>
                </TabsList>
                <TabsContent value="ledger">
                    <LedgerView />
                </TabsContent>
                <TabsContent value="sheet">
                    <BalanceSheetView />
                </TabsContent>
            </Tabs>
        </div>
    );
}
