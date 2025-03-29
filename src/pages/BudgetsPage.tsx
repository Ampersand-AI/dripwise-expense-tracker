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
import ProgressCard from '@/components/ui-custom/ProgressCard';
import BudgetChart from '@/components/expense/BudgetChart';
import { Link } from 'react-router-dom';

const BudgetsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [budgetData, setBudgetData] = useState<any[]>([
    { name: 'Food', budget: 0, spent: 0, value: 0 },
    { name: 'Travel', budget: 0, spent: 0, value: 0 },
    { name: 'Office', budget: 0, spent: 0, value: 0 },
    { name: 'Entertainment', budget: 0, spent: 0, value: 0 },
    { name: 'Utilities', budget: 0, spent: 0, value: 0 },
    { name: 'Miscellaneous', budget: 0, spent: 0, value: 0 }
  ]);
  
  // Empty monthly spending data
  const monthlySpendingData = [
    { name: 'Jan', amount: 0 },
    { name: 'Feb', amount: 0 },
    { name: 'Mar', amount: 0 },
    { name: 'Apr', amount: 0 },
    { name: 'May', amount: 0 },
    { name: 'Jun', amount: 0 },
    { name: 'Jul', amount: 0 },
    { name: 'Aug', amount: 0 },
    { name: 'Sep', amount: 0 },
    { name: 'Oct', amount: 0 },
    { name: 'Nov', amount: 0 },
    { name: 'Dec', amount: 0 },
  ];
  
  const monthlyBudget = 0;
  
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
                    <span>Current Month Spending</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    0% of monthly budget used
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
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Spent</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Remaining</span>
                    <span className="font-medium text-green-600">$0</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-4">Budget Health</h4>
                  <div className="bg-green-500/20 text-green-700 border border-green-500/30 rounded-md px-3 py-2 text-sm">
                    No budget data available yet.
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Categories Over Budget</h4>
                  <p className="text-sm text-muted-foreground">No categories are over budget.</p>
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
                        { name: 'Jan', value: 0 },
                        { name: 'Feb', value: 0 },
                        { name: 'Mar', value: 0 },
                        { name: 'Apr', value: 0 },
                        { name: 'May', value: 0 },
                        { name: 'Jun', value: 0 },
                        { name: 'Jul', value: 0 },
                        { name: 'Aug', value: 0 }
                      ]} 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                    />
                    <Line 
                      name="Travel" 
                      data={[
                        { name: 'Jan', value: 0 },
                        { name: 'Feb', value: 0 },
                        { name: 'Mar', value: 0 },
                        { name: 'Apr', value: 0 },
                        { name: 'May', value: 0 },
                        { name: 'Jun', value: 0 },
                        { name: 'Jul', value: 0 },
                        { name: 'Aug', value: 0 }
                      ]} 
                      dataKey="value" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', r: 4 }}
                    />
                    <Line 
                      name="Office" 
                      data={[
                        { name: 'Jan', value: 0 },
                        { name: 'Feb', value: 0 },
                        { name: 'Mar', value: 0 },
                        { name: 'Apr', value: 0 },
                        { name: 'May', value: 0 },
                        { name: 'Jun', value: 0 },
                        { name: 'Jul', value: 0 },
                        { name: 'Aug', value: 0 }
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
                  <h4 className="font-medium mb-2 text-primary">No Recommendations Available</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Budget recommendations will appear here once you have sufficient expense data.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/upload">Upload Expenses</Link>
                  </Button>
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
