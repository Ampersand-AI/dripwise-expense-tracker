// Interfaces for AI insights
export interface SpendingInsightRequest {
  expenses: any[];
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  categories?: string[];
}

export interface SpendingInsightResponse {
  insights: {
    id: string;
    title: string;
    description: string;
    type: 'spending' | 'savings' | 'trend';
    confidence: number;
  }[];
  summary: string;
}

// Types for suspicious activity detection
export interface SuspiciousActivityRequest {
  expenses: any[];
  timeframe: 'week' | 'month';
}

export interface SuspiciousActivityResponse {
  activities: {
    id: string;
    title: string;
    description: string;
    amount: number;
    merchant: string;
    date: Date;
    type: 'duplicate' | 'unusual_amount' | 'unusual_merchant' | 'unusual_time';
    confidence: number;
  }[];
} 