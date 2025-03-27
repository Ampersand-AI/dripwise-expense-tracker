
import React, { useState } from 'react';
import { ArrowRight, Info, Receipt } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import UploadZone from '@/components/ui-custom/UploadZone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

const UploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  
  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    
    if (acceptedFiles.length > 0) {
      toast({
        title: "Files added",
        description: `${acceptedFiles.length} file(s) ready for processing`,
      });
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
    </MainLayout>
  );
};

export default UploadPage;
