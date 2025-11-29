

import { Account, AccountType, LedgerEntry, BalanceSheet } from '@/types';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import type { DateRange } from 'react-day-picker';

// Mock Chart of Accounts
const chartOfAccounts: Account[] = [
    // Assets
    { id: 'acc_101', name: 'Cash', type: 'Asset' },
    { id: 'acc_102', name: 'Accounts Receivable', type: 'Asset' },
    { id: 'acc_103', name: 'Inventory', type: 'Asset' },
    // Liabilities
    { id: 'acc_201', name: 'Accounts Payable', type: 'Liability' },
    { id: 'acc_202', name: 'Salaries Payable', type: 'Liability' },
    // Equity
    { id: 'acc_301', name: 'Owner\'s Equity', type: 'Equity' },
    { id: 'acc_302', name: 'Retained Earnings', type: 'Equity' },
    // Revenue
    { id: 'acc_401', name: 'Sales Revenue', type: 'Revenue' },
    // Expenses
    { id: 'acc_501', name: 'Cost of Goods Sold (COGS)', type: 'Expense' },
    { id: 'acc_502', name: 'Marketing Expense', type: 'Expense' },
    { id: 'acc_503', name: 'Salary Expense', type: 'Expense' },
];

// Mock Ledger Entries
const ledgerEntries: LedgerEntry[] = [
    // Sale from ORD-2024-001
    { id: 'le_001', date: '2024-05-25', accountId: 'acc_102', description: 'Sale on credit', sourceTransactionId: 'ORD-2024-001', debit: 104.99, credit: 0 },
    { id: 'le_002', date: '2024-05-25', accountId: 'acc_401', description: 'Sale on credit', sourceTransactionId: 'ORD-2024-001', debit: 0, credit: 104.99 },
    // COGS for ORD-2024-001 (assuming 50% cost)
    { id: 'le_003', date: '2024-05-25', accountId: 'acc_501', description: 'COGS for sale', sourceTransactionId: 'ORD-2024-001', debit: 52.50, credit: 0 },
    { id: 'le_004', date: '2024-05-25', accountId: 'acc_103', description: 'COGS for sale', sourceTransactionId: 'ORD-2024-001', debit: 0, credit: 52.50 },
    // Payment received for ORD-2024-001
    { id: 'le_005', date: '2024-05-25', accountId: 'acc_101', description: 'Cash received from customer', sourceTransactionId: 'ORD-2024-001', debit: 104.99, credit: 0 },
    { id: 'le_006', date: '2024-05-25', accountId: 'acc_102', description: 'Cash received from customer', sourceTransactionId: 'ORD-2024-001', debit: 0, credit: 104.99 },
    // Marketing Expense
    { id: 'le_007', date: '2024-05-20', accountId: 'acc_502', description: 'Facebook boost for Eid campaign', sourceTransactionId: 'EXP001', debit: 5000, credit: 0 },
    { id: 'le_008', date: '2024-05-20', accountId: 'acc_101', description: 'Facebook boost for Eid campaign', sourceTransactionId: 'EXP001', debit: 0, credit: 5000 },
    // Salary Expense
    { id: 'le_009', date: '2024-05-15', accountId: 'acc_503', description: 'May 2024 Staff Salaries', sourceTransactionId: 'EXP003', debit: 150000, credit: 0 },
    { id: 'le_010', date: '2024-05-15', accountId: 'acc_101', description: 'May 2024 Staff Salaries', sourceTransactionId: 'EXP003', debit: 0, credit: 150000 },
];

export async function getChartOfAccounts(): Promise<Account[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return Promise.resolve(chartOfAccounts);
}

export async function getLedgerEntries(accountId?: string, dateRange?: DateRange): Promise<LedgerEntry[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredEntries = accountId
        ? ledgerEntries.filter(e => e.accountId === accountId)
        : ledgerEntries;

    if (dateRange?.from) {
        const toDate = dateRange.to || dateRange.from;
        filteredEntries = filteredEntries.filter(e => {
            const entryDate = parseISO(e.date);
            return isWithinInterval(entryDate, { start: startOfDay(dateRange.from!), end: endOfDay(toDate) });
        });
    }

    return Promise.resolve(filteredEntries.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
}

export async function getBalanceSheet(asOfDate: Date): Promise<BalanceSheet> {
    await new Promise(resolve => setTimeout(resolve, 700));

    const balances: Record<string, number> = {};
    chartOfAccounts.forEach(acc => balances[acc.id] = 0);

    ledgerEntries
        .filter(entry => new Date(entry.date) <= asOfDate)
        .forEach(entry => {
            balances[entry.accountId] += (entry.debit || 0) - (entry.credit || 0);
        });
    
    const createCategory = (type: AccountType) => {
        const accounts = chartOfAccounts
            .filter(acc => acc.type === type)
            .map(acc => ({ ...acc, balance: balances[acc.id] }))
            .filter(acc => acc.balance !== 0);

        return {
            accounts,
            total: accounts.reduce((sum, acc) => sum + acc.balance, 0),
        };
    };

    return Promise.resolve({
        asOf: asOfDate.toISOString(),
        assets: createCategory('Asset'),
        liabilities: createCategory('Liability'),
        equity: createCategory('Equity'),
    });
}
