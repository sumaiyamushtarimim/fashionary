

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
import type { Account, AccountType, LedgerEntry, BalanceSheet } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
            if (!selectedAccount && accountsData.length > 0) {
                setSelectedAccount(accountsData[0].id);
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

type JournalRow = {
    id: number;
    accountId: string;
    debit: number;
    credit: number;
};

function JournalEntryView() {
    const { toast } = useToast();
    const [accounts, setAccounts] = React.useState<Account[]>([]);
    const [date, setDate] = React.useState(format(new Date(), 'yyyy-MM-dd'));
    const [description, setDescription] = React.useState('');
    const [rows, setRows] = React.useState<JournalRow[]>([
        { id: Date.now(), accountId: '', debit: 0, credit: 0 },
        { id: Date.now() + 1, accountId: '', debit: 0, credit: 0 },
    ]);

    React.useEffect(() => {
        getChartOfAccounts().then(setAccounts);
    }, []);

    const handleRowChange = (id: number, field: keyof Omit<JournalRow, 'id'>, value: string | number) => {
        setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const addRow = () => {
        setRows([...rows, { id: Date.now(), accountId: '', debit: 0, credit: 0 }]);
    };
    
    const removeRow = (id: number) => {
        if (rows.length > 2) {
            setRows(rows.filter(row => row.id !== id));
        }
    };

    const totals = React.useMemo(() => {
        return rows.reduce((acc, row) => ({
            debit: acc.debit + Number(row.debit || 0),
            credit: acc.credit + Number(row.credit || 0),
        }), { debit: 0, credit: 0 });
    }, [rows]);

    const isBalanced = totals.debit === totals.credit && totals.debit > 0;
    
    const handlePostEntry = () => {
        if (!isBalanced) {
            toast({
                variant: 'destructive',
                title: "Unbalanced Entry",
                description: "Total debits must equal total credits and cannot be zero.",
            });
            return;
        }
        // In a real app, this would send data to the backend
        console.log({ date, description, entries: rows });
        toast({
            title: "Journal Entry Posted",
            description: "The transaction has been successfully recorded.",
        });
        // Reset form
        setDescription('');
        setRows([
            { id: Date.now(), accountId: '', debit: 0, credit: 0 },
            { id: Date.now() + 1, accountId: '', debit: 0, credit: 0 },
        ]);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manual Journal Entry</CardTitle>
                <CardDescription>
                    Record transactions that aren&apos;t automatically captured, like bank transfers or owner&apos;s drawings.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="entry-date">Date</Label>
                        <Input id="entry-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="entry-description">Description</Label>
                        <Input id="entry-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Owner's drawing for personal use" />
                    </div>
                </div>
                 <div className="w-full overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Account</TableHead>
                                <TableHead className="text-right">Debit</TableHead>
                                <TableHead className="text-right">Credit</TableHead>
                                <TableHead><span className="sr-only">Remove</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <Select value={row.accountId} onValueChange={(value) => handleRowChange(row.id, 'accountId', value)}>
                                            <SelectTrigger><SelectValue placeholder="Select Account" /></SelectTrigger>
                                            <SelectContent>
                                                {accounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" placeholder="0.00" className="text-right" value={row.debit || ''} onChange={e => handleRowChange(row.id, 'debit', e.target.valueAsNumber || 0)} disabled={!!row.credit}/>
                                    </TableCell>
                                     <TableCell>
                                        <Input type="number" placeholder="0.00" className="text-right" value={row.credit || ''} onChange={e => handleRowChange(row.id, 'credit', e.target.valueAsNumber || 0)} disabled={!!row.debit}/>
                                    </TableCell>
                                    <TableCell>
                                        {rows.length > 2 && <Button variant="ghost" size="icon" onClick={() => removeRow(row.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={addRow}><PlusCircle className="mr-2 h-4 w-4" /> Add Row</Button>
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <div className="text-right">
                            <p>Total Debits:</p>
                            <p className="font-mono">৳{totals.debit.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                             <p>Total Credits:</p>
                            <p className="font-mono">৳{totals.credit.toFixed(2)}</p>
                        </div>
                        <div className={cn("text-right", isBalanced ? 'text-green-600' : 'text-destructive')}>
                             <p>Difference:</p>
                            <p className="font-mono">৳{(totals.debit - totals.credit).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                 <Separator />
                 <div className="flex justify-end">
                    <Button onClick={handlePostEntry} disabled={!isBalanced}>Post Entry</Button>
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
                <p className="text-muted-foreground">Manage your chart of accounts, journal entries, and financial reports.</p>
            </div>
             <Tabs defaultValue="entry">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="entry">Journal Entry</TabsTrigger>
                    <TabsTrigger value="ledger">General Ledger</TabsTrigger>
                    <TabsTrigger value="sheet">Balance Sheet</TabsTrigger>
                </TabsList>
                 <TabsContent value="entry">
                    <JournalEntryView />
                </TabsContent>
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
