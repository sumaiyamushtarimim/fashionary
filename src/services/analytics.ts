
import { orders, expenses, products } from '@/lib/placeholder-data';
import { Order, Expense, Product } from '@/types';
import { startOfMonth, subMonths, format, getMonth, getYear } from 'date-fns';

type AnalyticsData = {
    summary: {
        totalRevenue: number;
        cogs: number;
        grossProfit: number;
        expenses: number;
        adExpenses: number;
        netProfit: number;
    };
    monthlyBreakdown: { month: string; revenue: number; cogs: number; expenses: number; profit: number; }[];
    expenseBreakdown: { category: string; amount: number; fill: string; }[];
};

const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];

export async function getAnalyticsData(): Promise<AnalyticsData> {
    // Summary Calculations
    const revenueOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Paid Returned');
    const totalRevenue = revenueOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Assume COGS is 50% of product price for sold items.
    // In a real app, product cost should be a field in the product data.
    const totalCogs = revenueOrders.reduce((sum, order) => {
        const orderCogs = order.products.reduce((productSum, p) => {
            const product = products.find(prod => prod.id === p.productId);
            const productCost = product ? product.price * 0.5 : 0; // 50% margin assumption
            return productSum + (productCost * p.quantity);
        }, 0);
        return sum + orderCogs;
    }, 0);
    
    const grossProfit = totalRevenue - totalCogs;
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const adExpenses = expenses.filter(e => e.isAdExpense).reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = grossProfit - totalExpenses;

    const summary = {
        totalRevenue,
        cogs: totalCogs,
        grossProfit,
        expenses: totalExpenses,
        adExpenses,
        netProfit,
    };

    // Monthly Breakdown Calculation
    const monthlyData: Record<string, { revenue: number; cogs: number; expenses: number; }> = {};
    const now = new Date();

    // Initialize last 12 months
    for (let i = 0; i < 12; i++) {
        const monthDate = subMonths(now, i);
        const monthKey = format(monthDate, 'yyyy-MM');
        monthlyData[monthKey] = { revenue: 0, cogs: 0, expenses: 0 };
    }

    // Populate with order data
    orders.forEach(order => {
        const orderDate = new Date(order.date);
        const monthKey = format(orderDate, 'yyyy-MM');
        if (monthlyData[monthKey] && (order.status === 'Delivered' || order.status === 'Paid Returned')) {
            monthlyData[monthKey].revenue += order.total;
             const orderCogs = order.products.reduce((productSum, p) => {
                const product = products.find(prod => prod.id === p.productId);
                const productCost = product ? product.price * 0.5 : 0; // 50% margin assumption
                return productSum + (productCost * p.quantity);
            }, 0);
            monthlyData[monthKey].cogs += orderCogs;
        }
    });

    // Populate with expense data
    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        const monthKey = format(expenseDate, 'yyyy-MM');
        if (monthlyData[monthKey]) {
            monthlyData[monthKey].expenses += expense.amount;
        }
    });
    
    const monthlyBreakdown = Object.entries(monthlyData).map(([key, data]) => {
        const grossProfit = data.revenue - data.cogs;
        return {
            month: format(new Date(key), 'MMM'),
            revenue: data.revenue,
            cogs: data.cogs,
            expenses: data.expenses,
            profit: grossProfit - data.expenses,
        }
    }).reverse();


    // Expense Breakdown Calculation
    const expenseByCategory: Record<string, number> = {};
    expenses.forEach(expense => {
        expenseByCategory[expense.category] = (expenseByCategory[expense.category] || 0) + expense.amount;
    });

    const expenseBreakdown = Object.entries(expenseByCategory).map(([category, amount], index) => ({
        category,
        amount,
        fill: chartColors[index % chartColors.length],
    }));

    return Promise.resolve({
        summary,
        monthlyBreakdown,
        expenseBreakdown,
    });
}
