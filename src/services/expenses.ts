import { expenses, expenseCategories } from '@/lib/placeholder-data';
import { Expense, ExpenseCategory } from '@/types';

// In a real app, you'd fetch this from your API
// e.g. export async function getExpenses() { const res = await fetch('/api/expenses'); return res.json(); }

export async function getExpenses(): Promise<Expense[]> {
  return Promise.resolve(expenses);
}

export async function getExpenseCategories(): Promise<ExpenseCategory[]> {
    return Promise.resolve(expenseCategories);
}
