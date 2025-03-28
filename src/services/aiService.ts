
import { detectSuspiciousActivities, generateSpendingInsights } from '@/utils/ai-utils';

// Gemini API key is now directly available in the ai-utils.ts file
const GEMINI_API_KEY = 'AIzaSyCTRdzlULGXlmC7qXlt-aimyNVFFkl1rw4';

// Function to analyze expenses and generate insights using Gemini API
export const analyzeExpenses = async (expenses: any[], timeframe: 'week' | 'month' | 'quarter' | 'year') => {
  try {
    // In a production environment, this would make an API call to a secure backend
    // that handles the Gemini API with proper authentication
    console.log('Using Gemini API with key:', GEMINI_API_KEY ? 'Available' : 'Not available');
    
    // For now, returning mock data from the utility function
    return generateSpendingInsights({ expenses, timeframe });
  } catch (error) {
    console.error('Error analyzing expenses:', error);
    throw new Error('Failed to analyze expenses');
  }
};

// Function to detect suspicious activities in transactions using Gemini API
export const detectAnomalies = async (expenses: any[], timeframe: 'week' | 'month') => {
  try {
    console.log('Using Gemini API with key:', GEMINI_API_KEY ? 'Available' : 'Not available');
    
    // For now, returning mock data from the utility function
    return detectSuspiciousActivities({ expenses, timeframe });
  } catch (error) {
    console.error('Error detecting anomalies:', error);
    throw new Error('Failed to detect anomalies');
  }
};
