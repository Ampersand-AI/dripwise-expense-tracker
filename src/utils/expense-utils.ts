import { Expense } from '@/components/expense/ExpenseCard';

export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const formatCurrency = (
  amount: number, 
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const getExpensesByCategory = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);
};

export const getRecentExpenses = (expenses: Expense[], count: number = 5): Expense[] => {
  return [...expenses]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, count);
};

// Empty placeholder functions to replace the mock data generators
export const generateSampleExpenses = (count: number = 0): Expense[] => {
  return [];
};

export const generateSampleBudgetData = () => [
  { name: 'Food', value: 0, color: '#3b82f6', spent: 0 },
  { name: 'Travel', value: 0, color: '#8b5cf6', spent: 0 },
  { name: 'Office', value: 0, color: '#10b981', spent: 0 }
];
