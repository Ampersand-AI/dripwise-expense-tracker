
import React, { useState } from 'react';
import { Download, FileText, CalendarIcon, Calculator, Info, CheckCircle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateSampleExpenses, formatCurrency } from '@/utils/expense-utils';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TaxPage = () => {
  const [expenses] = useState(generateSampleExpenses(30));
  const [taxYear, setTaxYear] = useState("2023");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Calculate tax-related metrics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const taxDeductibleExpenses = totalExpenses * 0.7; // Simulating that 70% are tax deductible
  const taxableAmount = totalExpenses - taxDeductibleExpenses;
  const estimatedTaxSavings = taxDeductibleExpenses * 0.25; // Assuming 25% tax rate
  
  const handleGenerateTaxReport = () => {
    toast({
      title: "Tax Report Generated",
      description: "Your tax report for the selected period has been generated.",
    });
  };
  
  // Tax categories
  const taxCategories = [
    { 
      name: "Business Travel", 
      amount: totalExpenses * 0.25, 
      deductible: true,
      description: "Expenses for business trips including accommodation, transport and meals."
    },
    { 
      name: "Office Supplies", 
      amount: totalExpenses * 0.15, 
      deductible: true,
      description: "Items purchased for office use including stationery, furniture and equipment."
    },
    { 
      name: "Client Meals", 
      amount: totalExpenses * 0.1, 
      deductible: true,
      description: "50% of expenses for business meals with clients can be deducted."
    },
    { 
      name: "Software Subscriptions", 
      amount: totalExpenses * 0.2, 
      deductible: true,
      description: "Software and digital services used for business purposes."
    },
    { 
      name: "Personal Expenses", 
      amount: totalExpenses * 0.3, 
      deductible: false,
      description: "Personal items and expenses that are not tax deductible."
    },
  ];
  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Tax Management</h1>
            <p className="text-muted-foreground">
              Track tax-deductible expenses and prepare for tax season
            </p>
          </div>
          
          <Button onClick={handleGenerateTaxReport}>
            <Download className="h-4 w-4 mr-2" />
            Generate Tax Report
          </Button>
        </header>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select value={taxYear} onValueChange={setTaxYear}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Tax Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023 Tax Year</SelectItem>
              <SelectItem value="2022">2022 Tax Year</SelectItem>
              <SelectItem value="2021">2021 Tax Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-[240px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
              <p className="text-xs text-muted-foreground mt-1">For {taxYear} tax year</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Tax Deductible</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(taxDeductibleExpenses)}</div>
              <div className="flex items-center gap-1 mt-1">
                <Progress value={70} className="h-1.5" />
                <span className="text-xs text-muted-foreground">70%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Estimated Tax Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(estimatedTaxSavings)}</div>
              <p className="text-xs text-muted-foreground mt-1">Based on 25% tax rate</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Tax Preparation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                <span className="font-medium">In Progress</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                4 months until deadline
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="deductions">Deductions</TabsTrigger>
            <TabsTrigger value="documents">Tax Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Categories</CardTitle>
                <CardDescription>
                  Breakdown of expenses by tax category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taxCategories.map((category, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{category.name}</span>
                          {category.deductible && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                              Deductible
                            </span>
                          )}
                        </div>
                        <span className="font-medium">{formatCurrency(category.amount)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                      <Progress 
                        value={(category.amount / totalExpenses) * 100} 
                        className="h-1.5 mt-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="deductions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Tax Deductions</CardTitle>
                <CardDescription>
                  Potential deductions based on your expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-green-50">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Home Office Deduction</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          If you use part of your home exclusively for business, you may be eligible to deduct home office expenses.
                        </p>
                        <Button size="sm" variant="link" className="p-0 h-auto mt-2">
                          Learn more
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-green-50">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Business Travel Expenses</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Travel expenses for business purposes including airfare, hotels, and 50% of meal costs may be deductible.
                        </p>
                        <Button size="sm" variant="link" className="p-0 h-auto mt-2">
                          Learn more
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-green-50">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Self-Employment Tax Deduction</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Self-employed individuals can deduct the employer-equivalent portion of their self-employment tax.
                        </p>
                        <Button size="sm" variant="link" className="p-0 h-auto mt-2">
                          Learn more
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Documents</CardTitle>
                <CardDescription>
                  Important documents for tax filing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-medium">Quarterly Tax Summary</h3>
                          <p className="text-xs text-muted-foreground">Generated on May 1, 2023</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-medium">Annual Expense Report</h3>
                          <p className="text-xs text-muted-foreground">Generated on January 15, 2023</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-medium">Tax Deduction Worksheet</h3>
                          <p className="text-xs text-muted-foreground">Generated on March 10, 2023</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 border rounded-lg p-5 bg-muted/20">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Tax Filing Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Calculator className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    Keep detailed records of all business expenses throughout the year.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Calculator className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    Save receipts for all potential tax-deductible expenses.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Calculator className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    Consider making quarterly estimated tax payments to avoid penalties.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Calculator className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    Consult with a tax professional for advice specific to your situation.
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

export default TaxPage;
