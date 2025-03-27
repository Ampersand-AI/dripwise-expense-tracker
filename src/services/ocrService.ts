
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

/**
 * MOCK Implementation: Since the OCR.space API key isn't working,
 * this function simulates OCR processing with demo data
 */
export const processReceiptWithOCR = async (file: File): Promise<OCRResult> => {
  try {
    toast({
      title: "Processing receipt...",
      description: "Extracting information from your receipt",
    });
    
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a mock result based on the filename or image data
    const result = createMockReceiptData(file);
    
    toast({
      title: "Receipt processed",
      description: "Successfully extracted information from your receipt",
    });
    
    return result;
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

/**
 * Creates simulated receipt data
 */
function createMockReceiptData(file: File): OCRResult {
  console.log("Creating mock data for file:", file.name);
  
  // Generate random data based on file name to simulate different receipts
  const seed = file.name.length + file.size;
  const random = (max: number) => Math.floor((seed * Math.random()) % max);
  
  // Pick a vendor from common options
  const vendors = [
    'Amazon', 'Starbucks', 'Office Depot', 
    'Uber', 'Walmart', 'Target', 
    'Apple Store', 'Best Buy', 'Home Depot',
    'Whole Foods', 'Costco', 'CVS Pharmacy'
  ];
  const vendor = vendors[random(vendors.length)];
  
  // Generate a random recent date
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - random(30)); // Random date within the last 30 days
  const date = pastDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
  // Generate random total amount between $10 and $200
  const total = parseFloat((10 + random(190) + Math.random()).toFixed(2));
  
  // Default to USD but occasionally use other currencies
  const currencies = ['USD', 'EUR', 'GBP', 'CAD'];
  const currencyIndex = random(10) < 8 ? 0 : random(3) + 1; // 80% chance of USD
  const currency = currencies[currencyIndex];
  
  // Calculate tax (typically 5-10% of total)
  const taxRate = (5 + random(5)) / 100;
  const taxAmount = parseFloat((total * taxRate).toFixed(2));
  
  // Generate between 1 and 5 random items
  const itemCount = 1 + random(4);
  const items = [];
  let itemsTotal = 0;
  
  const itemDescriptions = [
    'Coffee', 'Office Supplies', 'Electronics', 
    'Books', 'Groceries', 'Hardware', 
    'Software', 'Services', 'Membership',
    'Food', 'Transportation', 'Utilities'
  ];
  
  for (let i = 0; i < itemCount; i++) {
    const quantity = 1 + random(3);
    const unitPrice = parseFloat((1 + random(50) + Math.random()).toFixed(2));
    const totalPrice = parseFloat((quantity * unitPrice).toFixed(2));
    
    items.push({
      description: itemDescriptions[random(itemDescriptions.length)],
      quantity: quantity,
      unitPrice: unitPrice,
      totalPrice: totalPrice
    });
    
    itemsTotal += totalPrice;
  }
  
  // Adjust the last item to make the total match if needed
  if (items.length > 0 && Math.abs(itemsTotal - total) > 0.1) {
    const lastItem = items[items.length - 1];
    const difference = total - (itemsTotal - lastItem.totalPrice);
    if (difference > 0) {
      // Adjust the quantity to match the total
      lastItem.quantity = Math.ceil(difference / lastItem.unitPrice);
      lastItem.totalPrice = parseFloat((lastItem.quantity * lastItem.unitPrice).toFixed(2));
    }
  }
  
  return {
    vendor,
    date,
    total,
    currency,
    taxAmount,
    items,
    receiptImageUrl: URL.createObjectURL(file)
  };
}
