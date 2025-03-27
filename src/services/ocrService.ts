
import { toast } from "@/hooks/use-toast";

export interface OCRResult {
  vendor: string;
  date: string;
  total: number;
  currency: string;
  taxAmount: number;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  receiptImageUrl: string;
}

export interface OCRRequest {
  file: File;
}

export const processReceiptWithOCR = async (file: File): Promise<OCRResult> => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', 'eng');
    formData.append('documentType', 'receipt');

    // In a real implementation, you would send this to the SPACE OCR API
    // const response = await fetch('https://api.space.com/v1/ocr/receipt', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${API_KEY}`,
    //   },
    //   body: formData,
    // });
    // if (!response.ok) throw new Error('OCR processing failed');
    // const data = await response.json();
    
    // For demonstration, we'll simulate a response
    // Later, replace this with the actual API call
    
    toast({
      title: "Processing receipt...",
      description: "Extracting information from your receipt",
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock OCR result
    const mockResult: OCRResult = {
      vendor: generateRandomVendor(),
      date: new Date().toISOString().split('T')[0],
      total: parseFloat((Math.random() * 200 + 10).toFixed(2)),
      currency: 'USD',
      taxAmount: parseFloat((Math.random() * 20).toFixed(2)),
      items: [
        {
          description: 'Item 1',
          quantity: 1,
          unitPrice: parseFloat((Math.random() * 50 + 5).toFixed(2)),
          totalPrice: parseFloat((Math.random() * 50 + 5).toFixed(2)),
        },
        {
          description: 'Item 2',
          quantity: 2,
          unitPrice: parseFloat((Math.random() * 30 + 5).toFixed(2)),
          totalPrice: parseFloat((Math.random() * 60 + 10).toFixed(2)),
        }
      ],
      receiptImageUrl: URL.createObjectURL(file)
    };
    
    return mockResult;
  } catch (error) {
    console.error('OCR processing error:', error);
    toast({
      title: "OCR Processing Failed",
      description: "Could not extract information from your receipt",
      variant: "destructive",
    });
    throw error;
  }
};

// Helper function to generate random vendor names
function generateRandomVendor() {
  const vendors = [
    'Amazon', 'Starbucks', 'Office Depot', 
    'Uber', 'Walmart', 'Target', 
    'Apple Store', 'Best Buy', 'Home Depot',
    'Whole Foods', 'Costco', 'CVS Pharmacy'
  ];
  
  return vendors[Math.floor(Math.random() * vendors.length)];
}
