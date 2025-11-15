import { orders, expenses } from '@/lib/placeholder-data';
import { Order, Expense } from '@/types';

// In a real app, you'd fetch this from your API
// e.g. export async function getAnalyticsData() { const res = await fetch('/api/analytics'); return res.json(); }

export async function getAnalyticsData(): Promise<{
    summary: {
        totalRevenue: number;
        cogs: number;
        grossProfit: number;
        expenses: number;
        netProfit: number;
    };
    monthlyBreakdown: { month: string; revenue: number; cogs: number; expenses: number; profit: number; }[];
    expenseBreakdown: { category: string; amount: number; fill: string; }[];
}> {
    // This is a mock implementation.
    // In a real backend, you would calculate this based on orders and expenses from your database.
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const analyticsData = {
        summary: {
            totalRevenue: 450000,
            cogs: 210000,
            grossProfit: 240000,
            expenses: 85000,
            netProfit: 155000,
        },
        monthlyBreakdown: [
            { month: 'Jan', revenue: 120000, cogs: 55000, expenses: 20000, profit: 45000 },
            { month: 'Feb', revenue: 150000, cogs: 70000, expenses: 25000, profit: 55000 },
            { month: 'Mar', revenue: 180000, cogs: 85000, expenses: 40000, profit: 55000 },
        ],
        expenseBreakdown: [
            { category: 'Marketing & Advertising', amount: 25000, fill: 'hsl(var(--chart-1))' },
            { category: 'Salaries & Wages', amount: 45000, fill: 'hsl(var(--chart-2))'  },
            { category: 'Office Rent', amount: 10000, fill: 'hsl(var(--chart-3))'  },
            { category: 'Utilities', amount: 5000, fill: 'hsl(var(--chart-4))'  },
        ],
    };

    return Promise.resolve(analyticsData);
}
