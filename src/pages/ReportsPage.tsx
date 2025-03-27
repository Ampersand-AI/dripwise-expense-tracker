
import React, { useState } from 'react';
import { CalendarIcon, Download, BarChart4, FileText, Filter } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { generateSampleExpenses, formatCurrency } from '@/utils/expense-utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const ReportsPage = () => {
  const [expenses] = useState(generateSampleExpenses(30));
  const [reportType, setReportType] = useState("expense");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(new Date().setDate(1)), // First day of current month
    to: new Date(), // Today
  });
  
  // Generate category data for charts
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const chartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));
  
  const COLORS = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', 
    '#ef4444', '#6366f1', '#ec4899', '#14b8a6'
  ];
  
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (new Date().getMonth() - i + 12) % 12;
    const monthName = new Date(0, monthIndex).toLocaleString('default', { month: 'short' });
    return {
      name: monthName,
      amount: Math.floor(Math.random() * 5000 + 1000),
    };
  }).reverse();
  
  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Your report has been generated and is ready to download.",
    });
  };
  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Reports</h1>
            <p className="text-muted-foreground">
              Generate and analyze expense reports across different time periods
            </p>
          </div>
          
          <Button onClick={handleGenerateReport}>
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </header>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense Report</SelectItem>
              <SelectItem value="tax">Tax Report</SelectItem>
              <SelectItem value="category">Category Analysis</SelectItem>
              <SelectItem value="vendor">Vendor Analysis</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-[300px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange as any}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" className="w-full md:w-auto gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
        
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(expenses.reduce((sum, expense) => sum + expense.amount, 0))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    For selected period
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">Average per Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      expenses.reduce((sum, expense) => sum + expense.amount, 0) / 
                      Math.max(1, monthlyData.length)
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last {monthlyData.length} months
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">Tax Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(expenses.reduce((sum, expense) => sum + expense.amount, 0) * 0.08)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estimated tax
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-medium">Report Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="font-medium">Ready to Generate</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last updated: Today
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Expense by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Bar dataKey="amount" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="amount" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Expense Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Vendor</th>
                        <th className="text-left py-3 px-4 font-medium">Category</th>
                        <th className="text-left py-3 px-4 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.slice(0, 10).map((expense, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{expense.date.toLocaleDateString()}</td>
                          <td className="py-3 px-4">{expense.vendor}</td>
                          <td className="py-3 px-4">{expense.category}</td>
                          <td className="py-3 px-4">{formatCurrency(expense.amount)}</td>
                          <td className="py-3 px-4">
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              expense.status === "processed" ? "bg-green-500/20 text-green-700" :
                              expense.status === "pending" ? "bg-amber-500/20 text-amber-700" :
                              "bg-blue-500/20 text-blue-700"
                            )}>
                              {expense.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 border rounded-lg p-5 bg-muted/20">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Available Report Types</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <BarChart4 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-foreground">Expense Report</span> - 
                    Detailed breakdown of all expenses for a specified time period.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <BarChart4 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-foreground">Tax Report</span> - 
                    Summary of tax-deductible expenses and calculated tax amounts.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <BarChart4 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-foreground">Category Analysis</span> - 
                    Visual breakdown of expenses by category.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <BarChart4 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-foreground">Vendor Analysis</span> - 
                    Expenses grouped by vendor to track spending patterns.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportsPage;
