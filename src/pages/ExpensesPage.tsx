import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Download, 
  Filter, 
  Search, 
  Upload,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ExpenseCard, { Expense } from '@/components/expense/ExpenseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getExpenses } from '@/services/expenseService';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    // Load expenses from our service
    const loadExpenses = () => {
      try {
        const loadedExpenses = getExpenses();
        setExpenses(loadedExpenses);
      } catch (error) {
        console.error('Error loading expenses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExpenses();
  }, []);
  
  const handleExpenseClick = (expense: Expense) => {
    setSelectedExpense(expense);
  };
  
  const filteredExpenses = expenses.filter(expense => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesFilter = filter === 'all' || expense.status === filter;
    
    return matchesSearch && matchesFilter;
  });
  
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Expenses</h1>
            <p className="text-muted-foreground">
              Track, manage, and categorize all your business expenses
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button size="sm" asChild variant="outline" className="h-9">
              <Link to="/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Link>
            </Button>
            <Button size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </header>
        
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search expenses..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="reimbursed">Reimbursed</SelectItem>
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter Expenses</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Date</DropdownMenuLabel>
                  <DropdownMenuItem>This Month</DropdownMenuItem>
                  <DropdownMenuItem>Last Month</DropdownMenuItem>
                  <DropdownMenuItem>Last 3 Months</DropdownMenuItem>
                  <DropdownMenuItem>Custom Range</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Category</DropdownMenuLabel>
                  <DropdownMenuItem>Food</DropdownMenuItem>
                  <DropdownMenuItem>Travel</DropdownMenuItem>
                  <DropdownMenuItem>Accommodation</DropdownMenuItem>
                  <DropdownMenuItem>Transport</DropdownMenuItem>
                  <DropdownMenuItem>All Categories</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Advanced Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[200px] bg-muted rounded-md animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {filteredExpenses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExpenses.map((expense, index) => (
                  <motion.div
                    key={expense.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                  >
                    <ExpenseCard 
                      expense={expense} 
                      onClick={handleExpenseClick} 
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border rounded-lg bg-muted/30">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">No expenses found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchQuery 
                    ? `No expenses matching "${searchQuery}". Try another search term.`
                    : "You don't have any expenses yet. Upload your first receipt to get started."}
                </p>
                <Button asChild>
                  <Link to="/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Receipt
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
        
        <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Expense Details</DialogTitle>
              <DialogDescription>
                View detailed information about this expense
              </DialogDescription>
            </DialogHeader>
            
            {selectedExpense && (
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Vendor</p>
                    <p className="font-medium">{selectedExpense.vendor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {selectedExpense.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">
                      {selectedExpense.amount.toLocaleString('en-US', { 
                        style: 'currency', 
                        currency: selectedExpense.currency || 'USD' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{selectedExpense.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{selectedExpense.status}</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-2">Receipt Image</p>
                  <div className="h-40 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {selectedExpense.receiptUrl ? (
                      <img 
                        src={selectedExpense.receiptUrl} 
                        alt="Receipt" 
                        className="object-contain h-full w-full" 
                      />
                    ) : (
                      <p className="text-muted-foreground">Receipt preview not available</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline">Edit</Button>
                  <Button>Download Receipt</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ExpensesPage;
