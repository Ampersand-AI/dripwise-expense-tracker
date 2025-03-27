
import React, { useState, useEffect } from 'react';
import { ArrowRight, BarChart4, CreditCard, DollarSign, Upload } from 'lucide-react';
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
  generateSampleBudgetData,
  getRecentExpenses
} from '@/utils/expense-utils';

const HomePage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setExpenses(generateSampleExpenses(15));
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
  const recentExpenses = getRecentExpenses(expenses, 3);
  const budgetData = generateSampleBudgetData();
  const totalExpensesThisMonth = 4920;
  const totalBudget = 8000;
  
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
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <CardStats
              title="Total Expenses"
              value={<AnimatedNumber value={totalExpensesThisMonth} className="text-2xl font-bold" />}
              description="This month"
              icon={<DollarSign className="h-4 w-4" />}
              trend={8.2}
            />
            
            <CardStats
              title="Pending Receipts"
              value="4"
              description="Awaiting processing"
              icon={<CreditCard className="h-4 w-4" />}
              trend={-2.1}
            />
            
            <CardStats
              title="Budget Utilization"
              value={`${Math.round((totalExpensesThisMonth / totalBudget) * 100)}%`}
              description="Monthly budget"
              icon={<BarChart4 className="h-4 w-4" />}
              trend={5.3}
            />
            
            <CardStats
              title="Tax Refund Estimate"
              value="$1,245"
              description="Based on current expenses"
              icon={<DollarSign className="h-4 w-4" />}
              trend={12.7}
            />
          </div>
        </section>
        
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
                  <div className="text-center py-8 border rounded-lg bg-muted/30">
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
                  current={850}
                  total={1200}
                  unit="$"
                  description="Monthly budget"
                />
                
                <ProgressCard
                  title="Travel"
                  current={2100}
                  total={3000}
                  unit="$"
                  description="Monthly budget"
                />
                
                <ProgressCard
                  title="Office Supplies"
                  current={650}
                  total={800}
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
            className="col-span-full bg-primary/5 rounded-xl p-6 border border-primary/10"
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
