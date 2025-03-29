import React, { useState, useEffect } from 'react';
import { ArrowRight, BarChart4, CreditCard, DollarSign, Upload, Sparkles, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import CardStats from '@/components/ui-custom/CardStats';
import ProgressCard from '@/components/ui-custom/ProgressCard';
import BudgetChart from '@/components/expense/BudgetChart';
import ExpenseCard, { Expense } from '@/components/expense/ExpenseCard';
import AnimatedNumber from '@/components/ui-custom/AnimatedNumber';
import { Link } from 'react-router-dom';
import { 
  generateSampleExpenses, 
  getRecentExpenses
} from '@/utils/expense-utils';
import AIInsightsSection from '@/components/ai/AIInsightsSection';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

const HomePage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // In a real implementation, this would fetch expenses from an API
    setIsLoading(false);
  }, []);
  
  const recentExpenses = getRecentExpenses(expenses, 3);
  const budgetData = [
    { name: 'Food', budget: 0, spent: 0, value: 0, color: '#3b82f6' },
    { name: 'Travel', budget: 0, spent: 0, value: 0, color: '#8b5cf6' },
    { name: 'Office', budget: 0, spent: 0, value: 0, color: '#10b981' }
  ];
  const totalExpensesThisMonth = 0;
  const totalBudget = 0;
  
  // Helper function to create auth URLs with redirect parameters
  const getAuthUrl = (path: string) => {
    const currentUrl = encodeURIComponent(window.location.href);
    return `${path}?redirect_url=${currentUrl}`;
  };
  
  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <div className="text-sm text-muted-foreground">
              <time dateTime={new Date().toISOString()}>
                {new Date().toLocaleDateString('en-US', { 
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            </div>
          </div>
          
          <SignedOut>
            <div className="bg-primary/10 rounded-xl p-6 mb-8 border border-border/5">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-3">Sign in to manage your expenses</h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Track expenses, manage budgets, and get AI-powered insights to optimize your spending.
                </p>
                <div className="flex justify-center gap-4">
                  <Button size="lg" asChild>
                    <Link to={getAuthUrl('/sign-in')}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to={getAuthUrl('/sign-up')}>
                      Create Account
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </SignedOut>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <CardStats
              title="Total Expenses"
              value="$0"
              description="This month"
              icon={<DollarSign className="h-4 w-4" />}
              trend={0}
            />
            
            <CardStats
              title="Pending Receipts"
              value="0"
              description="Awaiting processing"
              icon={<CreditCard className="h-4 w-4" />}
              trend={0}
            />
            
            <CardStats
              title="Budget Utilization"
              value="0%"
              description="Monthly budget"
              icon={<BarChart4 className="h-4 w-4" />}
              trend={0}
            />
            
            <CardStats
              title="Tax Refund Estimate"
              value="$0"
              description="Based on current expenses"
              icon={<DollarSign className="h-4 w-4" />}
              trend={0}
            />
          </div>
        </section>
        
        {/* AI Insights Section */}
        <AIInsightsSection />
        
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Expenses</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/expenses" className="text-sm flex items-center gap-1">
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="h-[150px] bg-muted rounded-md animate-pulse opacity-70"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentExpenses.map((expense, index) => (
                  <motion.div
                    key={expense.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ExpenseCard expense={expense} />
                  </motion.div>
                ))}
                
                {recentExpenses.length === 0 && (
                  <div className="text-center py-8 border border-border/5 rounded-lg bg-muted/30">
                    <p className="text-muted-foreground">No recent expenses to show</p>
                    <Button variant="outline" size="sm" className="mt-4" asChild>
                      <Link to="/upload">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Receipt
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="col-span-1 space-y-6">
            <BudgetChart data={budgetData} />
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Category Budgets</h3>
              <div className="space-y-3">
                <ProgressCard
                  title="Food & Dining"
                  current={0}
                  total={0}
                  unit="$"
                  description="Monthly budget"
                />
                
                <ProgressCard
                  title="Travel"
                  current={0}
                  total={0}
                  unit="$"
                  description="Monthly budget"
                />
                
                <ProgressCard
                  title="Office Supplies"
                  current={0}
                  total={0}
                  unit="$"
                  description="Monthly budget"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="col-span-full bg-primary/5 rounded-xl p-6 border border-border/5"
          >
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Ready to simplify your expense tracking?</h2>
                <p className="text-muted-foreground max-w-lg">
                  Upload your receipts and let Drip handle the rest. Our smart OCR technology extracts and categorizes your expenses automatically.
                </p>
              </div>
              
              <Button size="lg" className="min-w-[140px]" asChild>
                <Link to="/upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Now
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </MainLayout>
  );
};

export default HomePage;
