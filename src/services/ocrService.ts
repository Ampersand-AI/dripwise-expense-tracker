
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

// OCR.SPACE API key - in a real app, this should be stored securely
const OCR_SPACE_API_KEY = "458506aa1b70658e6467907b27f2ae49e15303d3c361553243f269f9dfddf5e5"; // This is a free API key - replace with your own

export const processReceiptWithOCR = async (file: File): Promise<OCRResult> => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'true');
    formData.append('iscreatesearchablepdf', 'false');
    formData.append('issearchablepdfhidetextlayer', 'false');
    formData.append('filetype', file.type.split('/')[1]); // Extract extension from file type
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2'); // More accurate OCR engine

    toast({
      title: "Processing receipt...",
      description: "Extracting information from your receipt",
    });
    
    // Make the API call to OCR.SPACE
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': OCR_SPACE_API_KEY,
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok || data.IsErroredOnProcessing) {
      throw new Error(data.ErrorMessage || 'OCR processing failed');
    }
    
    console.log("OCR.SPACE API Response:", data);
    
    // Extract the text from the OCR result
    const parsedText = data.ParsedResults[0]?.ParsedText || '';
    
    // Parse the OCR text to extract receipt information
    const result = parseReceiptText(parsedText, file);
    
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

// Helper function to parse the OCR text and extract relevant receipt information
function parseReceiptText(text: string, file: File): OCRResult {
  console.log("Parsing receipt text:", text);
  
  // Split the text into lines for easier processing
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  // Try to extract vendor name (usually in the first few lines)
  const vendorLine = lines.slice(0, 3).find(line => line.length > 3) || 'Unknown Vendor';
  const vendor = vendorLine.split(' ').slice(0, 3).join(' ');
  
  // Try to find date in the format MM/DD/YYYY or similar
  const dateRegex = /(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})|(\d{2,4}[\/\.-]\d{1,2}[\/\.-]\d{1,2})/;
  const dateMatch = text.match(dateRegex);
  const date = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];
  
  // Try to find the total amount
  const totalRegex = /(?:total|amount|sum)(?:\s*:|\s)\s*[$€£¥]?\s*(\d+[.,]\d+)/i;
  let totalMatch = text.match(totalRegex);
  let total = 0;
  
  if (totalMatch && totalMatch[1]) {
    total = parseFloat(totalMatch[1].replace(',', '.'));
  } else {
    // Fallback: look for numbers that might be the total
    const amountRegex = /[$€£¥]?\s*(\d+[.,]\d+)/g;
    const amounts = [];
    let match;
    while ((match = amountRegex.exec(text)) !== null) {
      amounts.push(parseFloat(match[1].replace(',', '.')));
    }
    // The largest amount might be the total
    total = amounts.length > 0 ? Math.max(...amounts) : 0;
  }
  
  // Try to determine currency
  const currencyRegex = /[$€£¥]/;
  const currencyMatch = text.match(currencyRegex);
  const currency = currencyMatch ? 
    (currencyMatch[0] === '$' ? 'USD' : 
     currencyMatch[0] === '€' ? 'EUR' : 
     currencyMatch[0] === '£' ? 'GBP' : 
     currencyMatch[0] === '¥' ? 'JPY' : 'USD') : 'USD';
  
  // Try to find tax amount
  const taxRegex = /(?:tax|vat|gst)(?:\s*:|\s)\s*[$€£¥]?\s*(\d+[.,]\d+)/i;
  const taxMatch = text.match(taxRegex);
  const taxAmount = taxMatch && taxMatch[1] ? parseFloat(taxMatch[1].replace(',', '.')) : total * 0.1; // Default to 10% if not found
  
  // Create mock item data based on text context
  // In a real app, you'd have more sophisticated parsing
  const itemsRegex = /(\d+)\s*x\s*[$€£¥]?\s*(\d+[.,]\d+)/g;
  const items = [];
  let itemMatch;
  
  while ((itemMatch = itemsRegex.exec(text)) !== null) {
    const quantity = parseInt(itemMatch[1], 10);
    const unitPrice = parseFloat(itemMatch[2].replace(',', '.'));
    
    items.push({
      description: `Item ${items.length + 1}`,
      quantity: quantity,
      unitPrice: unitPrice,
      totalPrice: quantity * unitPrice
    });
  }
  
  // If no items were found, create some default items
  if (items.length === 0) {
    const itemAmount = total * 0.8; // Assuming items are 80% of total
    items.push({
      description: 'Item 1',
      quantity: 1,
      unitPrice: itemAmount,
      totalPrice: itemAmount
    });
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

// Helper function to generate random vendor names (used as fallback)
function generateRandomVendor() {
  const vendors = [
    'Amazon', 'Starbucks', 'Office Depot', 
    'Uber', 'Walmart', 'Target', 
    'Apple Store', 'Best Buy', 'Home Depot',
    'Whole Foods', 'Costco', 'CVS Pharmacy'
  ];
  
  return vendors[Math.floor(Math.random() * vendors.length)];
}
