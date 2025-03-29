import { toast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const processReceiptWithOCR = async (file: File): Promise<OCRResult> => {
  try {
    toast({
      title: "Processing receipt...",
      description: "Extracting information from your receipt",
    });
    
    console.log("OCR processing started for file:", file.name);
    
    // Convert file to base64
    const base64Image = await fileToBase64(file);
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Create the prompt for receipt analysis
    const prompt = `Analyze this receipt image and extract the following information in JSON format:
    {
      "vendor": "store/merchant name",
      "date": "YYYY-MM-DD format",
      "total": number,
      "currency": "currency code (USD, EUR, etc.)",
      "taxAmount": number,
      "items": [
        {
          "description": "item name",
          "quantity": number,
          "unitPrice": number,
          "totalPrice": number
        }
      ]
    }
    
    Important rules:
    1. Extract the exact vendor name from the receipt header
    2. Convert any date format to YYYY-MM-DD
    3. Extract the final total amount (not subtotal)
    4. Identify the currency from the receipt
    5. Extract tax amount if available, otherwise estimate 8% of total
    6. Extract all line items with their quantities and prices
    7. Ensure all amounts are numbers (not strings)
    8. If any field is missing or unclear, make a reasonable estimate
    9. Return ONLY the JSON object, no additional text
    10. Ensure the sum of all item totalPrices equals the total amount
    11. For items without quantity, assume quantity of 1
    12. For items without unitPrice, calculate it as totalPrice/quantity`;

    // Generate content from the image
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: file.type,
          data: base64Image
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Gemini response');
    }
    
    let receiptData;
    try {
      receiptData = JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      throw new Error('Invalid JSON response from Gemini');
    }
    
    // Validate and format the data
    const formattedResult: OCRResult = {
      vendor: receiptData.vendor || 'Unknown Vendor',
      date: receiptData.date || new Date().toISOString().split('T')[0],
      total: Number(receiptData.total) || 0,
      currency: receiptData.currency || 'USD',
      taxAmount: Number(receiptData.taxAmount) || 0,
      items: (receiptData.items || []).map((item: any) => {
        const quantity = Number(item.quantity) || 1;
        const totalPrice = Number(item.totalPrice) || 0;
        const unitPrice = Number(item.unitPrice) || (totalPrice / quantity);
        
        return {
          description: item.description || 'Unknown Item',
          quantity,
          unitPrice,
          totalPrice
        };
      }),
      receiptImageUrl: URL.createObjectURL(file)
    };
    
    // Validate the extracted data
    if (!formattedResult.vendor || !formattedResult.date || !formattedResult.total || formattedResult.items.length === 0) {
      throw new Error('Failed to extract essential receipt data');
    }
    
    // Ensure items total matches the total amount
    const itemsTotal = formattedResult.items.reduce((sum, item) => sum + item.totalPrice, 0);
    if (Math.abs(itemsTotal - formattedResult.total) > 0.01) {
      // Adjust the last item to match the total
      if (formattedResult.items.length > 0) {
        const lastItem = formattedResult.items[formattedResult.items.length - 1];
        const difference = formattedResult.total - (itemsTotal - lastItem.totalPrice);
        if (difference > 0) {
          lastItem.totalPrice = difference;
          lastItem.unitPrice = difference / lastItem.quantity;
        }
      }
    }
    
    toast({
      title: "Receipt processed",
      description: "Successfully extracted information from your receipt",
    });
    
    return formattedResult;
  } catch (error) {
    console.error('OCR processing error:', error);
    
    toast({
      title: "OCR Processing Failed",
      description: "Failed to extract data from receipt. Please try again with a clearer image.",
      variant: "destructive",
    });
    
    // Instead of mock data, throw an error that can be caught by the caller
    throw new Error('Failed to process receipt with OCR');
  }
};

/**
 * Convert a File object to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}
