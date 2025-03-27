
import { Expense } from '@/components/expense/ExpenseCard';

// Sample data for the expenses
export const generateSampleExpenses = (count: number = 10): Expense[] => {
  const categories = ['Food', 'Travel', 'Accommodation', 'Transport', 'Entertainment', 'Supplies'];
  const vendors = ['Uber', 'Amazon', 'Starbucks', 'Apple', 'Marriott Hotel', 'Office Depot', 'Delta Airlines'];
  const statuses: ('pending' | 'processed' | 'reimbursed')[] = ['pending', 'processed', 'reimbursed'];
  
  return Array.from({ length: count }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const amount = Math.floor(Math.random() * 1000) + 10;
    
    // Date between now and 30 days ago
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    return {
      id: `exp-${i + 1}`,
      title: `${category} Expense`,
      amount,
      date,
      category,
      vendor: vendors[Math.floor(Math.random() * vendors.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      receiptUrl: '/placeholder.svg',
      currency: 'USD'
    };
  });
};

// Sample data for budgets
export const generateSampleBudgetData = () => [
  { name: 'Food', value: 1200, color: '#3b82f6', spent: 850 },
  { name: 'Travel', value: 3000, color: '#8b5cf6', spent: 2100 },
  { name: 'Office', value: 800, color: '#10b981', spent: 650 },
  { name: 'Entertainment', value: 500, color: '#f59e0b', spent: 320 },
  { name: 'Accommodation', value: 2000, color: '#ef4444', spent: 1800 },
  { name: 'Transport', value: 600, color: '#6366f1', spent: 450 },
];

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
