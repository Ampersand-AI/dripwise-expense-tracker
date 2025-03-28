
import { detectSuspiciousActivities, generateSpendingInsights } from '@/utils/ai-utils';

// Placeholder for Gemini API key integration - ideally this should be on the server-side
// For demonstration purposes, we're using it client-side
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Function to analyze expenses and generate insights using Gemini API
export const analyzeExpenses = async (expenses: any[], timeframe: 'week' | 'month' | 'quarter' | 'year') => {
  try {
    // In a production environment, this would make an API call to a secure backend
    // that handles the Gemini API with proper authentication
    console.log('Using Gemini API with key:', GEMINI_API_KEY ? 'Available' : 'Not available');
    
    if (!GEMINI_API_KEY) {
      console.warn('Gemini API key not found. Using mock data instead.');
      // Fallback to mock data if no API key is available
      return generateSpendingInsights({ expenses, timeframe });
    }
    
    // This is a placeholder for the actual Gemini API call
    // In production, this should be a server-side call to protect your API key
    
    // For now, returning mock data
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
    
    if (!GEMINI_API_KEY) {
      console.warn('Gemini API key not found. Using mock data instead.');
      // Fallback to mock data if no API key is available
      return detectSuspiciousActivities({ expenses, timeframe });
    }
    
    // Placeholder for actual Gemini API call
    
    // For now, returning mock data
    return detectSuspiciousActivities({ expenses, timeframe });
  } catch (error) {
    console.error('Error detecting anomalies:', error);
    throw new Error('Failed to detect anomalies');
  }
};
