import { Expense } from '@/components/expense/ExpenseCard';
import { OCRResult } from './ocrService';
import { compressImage } from '@/utils/image-utils';

// In a real app, this would be stored in a database
let expenses: Expense[] = [];

export const addExpense = async (ocrResult: OCRResult, file: File): Promise<Expense> => {
  // Generate a unique ID
  const id = `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Compress the receipt image
  const compressedImage = await compressImage(file);
  
  // Create a new expense from OCR result
  const newExpense: Expense = {
    id,
    title: `${ocrResult.vendor} Receipt`,
    amount: ocrResult.total,
    date: new Date(ocrResult.date),
    category: 'Uncategorized', // Default category
    vendor: ocrResult.vendor,
    status: 'pending',
    receiptUrl: compressedImage, // Store the compressed image
    currency: ocrResult.currency
  };
  
  // Add to expenses array
  expenses.push(newExpense);
  
  // In a real app, this would be saved to a database
  // For now, we'll just store in memory
  
  return newExpense;
};

export const getExpenses = (): Expense[] => {
  return expenses;
};

export const getExpenseById = (id: string): Expense | undefined => {
  return expenses.find(expense => expense.id === id);
};

export const updateExpense = (id: string, updates: Partial<Expense>): Expense | undefined => {
  const index = expenses.findIndex(expense => expense.id === id);
  if (index === -1) return undefined;
  
  expenses[index] = {
    ...expenses[index],
    ...updates
  };
  
  return expenses[index];
};

export const deleteExpense = (id: string): boolean => {
  const index = expenses.findIndex(expense => expense.id === id);
  if (index === -1) return false;
  
  expenses.splice(index, 1);
  return true;
}; 