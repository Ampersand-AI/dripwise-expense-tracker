
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus } from 'lucide-react';
import { generateSampleBudgetData } from '@/utils/expense-utils';
import ProgressCard from '@/components/ui-custom/ProgressCard';
import BudgetChart from '@/components/expense/BudgetChart';

const BudgetsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [budgetData, setBudgetData] = useState<any[]>([]);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setBudgetData(generateSampleBudgetData());
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
  const monthlySpendingData = [
    { name: 'Jan', amount: 4200 },
    { name: 'Feb', amount: 3800 },
    { name: 'Mar', amount: 5100 },
    { name: 'Apr', amount: 4500 },
    { name: 'May', amount: 3900 },
    { name: 'Jun', amount: 4800 },
    { name: 'Jul', amount: 5200 },
    { name: 'Aug', amount: 4920 },
    { name: 'Sep', amount: 0 },
    { name: 'Oct', amount: 0 },
    { name: 'Nov', amount: 0 },
    { name: 'Dec', amount: 0 },
  ];
  
  const monthlyBudget = 8000;
  
  const categoryNames = budgetData.map(item => item.name);
  const categoryValues = budgetData.map(item => item.spent);
  
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Budget Management</h1>
            <p className="text-muted-foreground">
              Set and track budgets across different expense categories
            </p>
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Budget
          </Button>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Monthly Spending</CardTitle>
              <CardDescription>Overview of your monthly expenses vs budget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySpendingData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip 
                      formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                      {monthlySpendingData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.amount > monthlyBudget ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
                          opacity={entry.amount === 0 ? 0.3 : 0.8}
                        />
                      ))}
                    </Bar>
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-1 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Budget</span>
                  <span className="font-medium">${monthlyBudget.toLocaleString()}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>August Spending</span>
                    <span className="font-medium">${monthlySpendingData[7].amount.toLocaleString()}</span>
                  </div>
                  <Progress value={Math.min(100, (monthlySpendingData[7].amount / monthlyBudget) * 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round((monthlySpendingData[7].amount / monthlyBudget) * 100)}% of monthly budget used
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Budget Summary</CardTitle>
              <CardDescription>Current status of your budgets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Budget</span>
                    <span className="font-medium">$8,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Spent</span>
                    <span className="font-medium">$4,920</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Remaining</span>
                    <span className="font-medium text-green-600">$3,080</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-4">Budget Health</h4>
                  <div className="bg-green-500/20 text-green-700 border border-green-500/30 rounded-md px-3 py-2 text-sm">
                    You're on track with your monthly budget!
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Categories Over Budget</h4>
                  {budgetData.filter(item => item.spent > item.value * 0.9).length > 0 ? (
                    <div className="space-y-2">
                      {budgetData
                        .filter(item => item.spent > item.value * 0.9)
                        .map((item, index) => (
                          <div key={index} className="bg-amber-500/20 text-amber-700 border border-amber-500/30 rounded-md px-3 py-2 text-sm">
                            {item.name}: ${item.spent.toLocaleString()} of ${item.value.toLocaleString()}
                            ({Math.round((item.spent / item.value) * 100)}%)
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No categories are over budget.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold">Category Budgets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-[100px] bg-muted rounded-md animate-pulse" />
                ))
              ) : (
                budgetData.map((budget, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ProgressCard
                      title={budget.name}
                      current={budget.spent}
                      total={budget.value}
                      unit="$"
                      description="Monthly budget"
                    />
                  </motion.div>
                ))
              )}
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Budget Allocation</CardTitle>
              <CardDescription>Distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetChart data={budgetData} />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Expense Trends</CardTitle>
              <CardDescription>Monthly trends by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" type="category" allowDuplicatedCategory={false} />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Legend />
                    <Line 
                      name="Food" 
                      data={[
                        { name: 'Jan', value: 820 },
                        { name: 'Feb', value: 750 },
                        { name: 'Mar', value: 900 },
                        { name: 'Apr', value: 800 },
                        { name: 'May', value: 780 },
                        { name: 'Jun', value: 820 },
                        { name: 'Jul', value: 880 },
                        { name: 'Aug', value: 850 }
                      ]} 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                    />
                    <Line 
                      name="Travel" 
                      data={[
                        { name: 'Jan', value: 2100 },
                        { name: 'Feb', value: 1800 },
                        { name: 'Mar', value: 2700 },
                        { name: 'Apr', value: 2200 },
                        { name: 'May', value: 1900 },
                        { name: 'Jun', value: 2400 },
                        { name: 'Jul', value: 2600 },
                        { name: 'Aug', value: 2100 }
                      ]} 
                      dataKey="value" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', r: 4 }}
                    />
                    <Line 
                      name="Office" 
                      data={[
                        { name: 'Jan', value: 450 },
                        { name: 'Feb', value: 420 },
                        { name: 'Mar', value: 500 },
                        { name: 'Apr', value: 480 },
                        { name: 'May', value: 460 },
                        { name: 'Jun', value: 520 },
                        { name: 'Jul', value: 610 },
                        { name: 'Aug', value: 650 }
                      ]} 
                      dataKey="value" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Budget Recommendations</CardTitle>
              <CardDescription>AI-powered budget suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md p-4 bg-primary/5">
                  <h4 className="font-medium mb-2 text-primary">Save 15% on Travel Expenses</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Based on your spending patterns, you could save approximately $315 per month by booking travel accommodations at least 3 weeks in advance.
                  </p>
                  <Button variant="outline" size="sm">Apply Recommendation</Button>
                </div>
                
                <div className="border rounded-md p-4 bg-primary/5">
                  <h4 className="font-medium mb-2 text-primary">Food Budget Adjustment</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your food expenses have been consistently under budget by about 10%. Consider reallocating $120 to other categories.
                  </p>
                  <Button variant="outline" size="sm">Adjust Budget</Button>
                </div>
                
                <div className="border rounded-md p-4 bg-primary/5">
                  <h4 className="font-medium mb-2 text-primary">Office Supplies Alert</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Office supplies spending is trending 15% higher month-over-month. Review recent purchases to identify potential savings.
                  </p>
                  <Button variant="outline" size="sm">Review Expenses</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default BudgetsPage;
