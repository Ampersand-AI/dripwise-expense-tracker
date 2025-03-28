import React, { useState } from 'react';
import { ArrowRight, Check, FileText, Info, Receipt } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import UploadZone from '@/components/ui-custom/UploadZone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { processReceiptWithOCR, OCRResult } from '@/services/ocrService';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/expense-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { addExpense } from '@/services/expenseService';

const UploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [showOcrResultDialog, setShowOcrResultDialog] = useState(false);
  const navigate = useNavigate();
  
  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    
    if (acceptedFiles.length > 0) {
      toast({
        title: "Files added",
        description: `${acceptedFiles.length} file(s) ready for processing`,
      });
    }
  };
  
  const handleProcessReceipts = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload a receipt to process",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process the first file with OCR
      const result = await processReceiptWithOCR(files[0]);
      setOcrResult(result);
      setShowOcrResultDialog(true);
    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Processing Failed",
        description: "We couldn't process your receipt. Please try again or upload a clearer image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleConfirmReceipt = () => {
    setShowOcrResultDialog(false);
    
    // Add the expense to our data
    if (ocrResult) {
      try {
        const newExpense = addExpense(ocrResult);
        toast({
          title: "Expense added",
          description: "Your receipt has been added to your expenses",
        });
        
        // Navigate to expenses page
        navigate('/expenses');
      } catch (error) {
        console.error('Error adding expense:', error);
        toast({
          title: "Error",
          description: "Failed to add the expense. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Upload Receipts</h1>
          <p className="text-muted-foreground max-w-3xl">
            Upload your receipts and our OCR technology will automatically extract the key information 
            such as vendor, date, amount, and tax details.
          </p>
        </header>
        
        <Tabs defaultValue="upload" className="mb-8">
          <TabsList>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="scan">Scan Receipt</TabsTrigger>
            <TabsTrigger value="email">Email Receipts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="pt-6">
            <Card>
              <CardContent className="p-6">
                <UploadZone onFilesAccepted={handleFilesAccepted} />
                
                {files.length > 0 && (
                  <div className="mt-4">
                    <Button 
                      onClick={handleProcessReceipts} 
                      disabled={isProcessing} 
                      className="w-full"
                    >
                      {isProcessing ? (
                        <>
                          <Skeleton className="h-4 w-4 rounded-full mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Process Receipt{files.length > 1 ? 's' : ''}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="flex items-center mt-8 gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <p>
                For best results, ensure your receipt images are clear and well-lit.
                We support JPG, PNG, and PDF formats.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="scan" className="pt-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Receipt className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Scan with Mobile Device</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Download our mobile app to scan receipts on the go. Your scanned receipts will automatically 
                  sync with your account.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline">App Store</Button>
                  <Button variant="outline">Google Play</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="email" className="pt-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Receipt className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Your Receipts</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Forward your email receipts to <span className="font-medium text-foreground">receipts@drip.example.com</span> to 
                  automatically process and add them to your account.
                </p>
                <Button variant="outline">Copy Email Address</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover-scale">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary text-xl">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Upload Receipt</h3>
              <p className="text-sm text-muted-foreground">
                Upload your receipt via image, PDF or forward it by email.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary text-xl">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Automatic Processing</h3>
              <p className="text-sm text-muted-foreground">
                Our OCR technology extracts vendor, date, amount, and tax details.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-scale">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary text-xl">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Review & Categorize</h3>
              <p className="text-sm text-muted-foreground">
                Verify the extracted information and assign appropriate categories.
              </p>
            </CardContent>
          </Card>
        </section>
        
        <div className="border rounded-lg p-5 bg-muted/20">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Tips for Better Results</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-primary flex-shrink-0" />
                  Ensure the receipt is well-lit and not blurry.
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-primary flex-shrink-0" />
                  Capture the entire receipt including the header and footer.
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-primary flex-shrink-0" />
                  For digital receipts, forward the original email rather than screenshots.
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-primary flex-shrink-0" />
                  Use the mobile app for the best scanning experience.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* OCR Result Dialog */}
      <Dialog open={showOcrResultDialog} onOpenChange={setShowOcrResultDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
            <DialogDescription>
              Review the information extracted from your receipt
            </DialogDescription>
          </DialogHeader>
          
          {ocrResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vendor</p>
                  <p className="font-medium">{ocrResult.vendor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{format(new Date(ocrResult.date), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium">{formatCurrency(ocrResult.total, ocrResult.currency)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax Amount</p>
                  <p className="font-medium">{formatCurrency(ocrResult.taxAmount, ocrResult.currency)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Items</p>
                <div className="space-y-2">
                  {ocrResult.items.map((item, index) => (
                    <div key={index} className="bg-accent/50 p-3 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{item.description}</span>
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.quantity} x {formatCurrency(item.unitPrice, ocrResult.currency)}
                          </div>
                        </div>
                        <span className="font-medium">{formatCurrency(item.totalPrice, ocrResult.currency)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Receipt Image</p>
                <div className="h-48 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                  {ocrResult.receiptImageUrl ? (
                    <img 
                      src={ocrResult.receiptImageUrl} 
                      alt="Receipt" 
                      className="object-contain h-full w-full" 
                    />
                  ) : (
                    <p className="text-muted-foreground">Receipt preview not available</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOcrResultDialog(false)}>
              Edit
            </Button>
            <Button onClick={handleConfirmReceipt}>
              <Check className="h-4 w-4 mr-2" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default UploadPage;
