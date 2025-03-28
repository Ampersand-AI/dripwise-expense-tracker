
import React, { useState, useEffect } from 'react';
import { Bot, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import InsightCard, { AIInsight } from './InsightCard';
import SuspiciousActivityCard, { SuspiciousActivity } from './SuspiciousActivityCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { analyzeExpenses, detectAnomalies } from '@/services/aiService';

const AIInsightsSection: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [activities, setActivities] = useState<SuspiciousActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInsights();
    fetchSuspiciousActivities();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      // Mock expenses data - in a real app, you would get this from your expense store
      const mockExpenses = [
        { amount: 25.99, category: 'Food', merchant: 'Starbucks', date: new Date() },
        { amount: 45.50, category: 'Transportation', merchant: 'Uber', date: new Date() },
        { amount: 120.75, category: 'Shopping', merchant: 'Amazon', date: new Date() }
      ];
      
      const response = await analyzeExpenses(mockExpenses, 'month');
      const formattedInsights = response.insights.map(insight => ({
        ...insight,
        date: new Date()
      }));
      
      setInsights(formattedInsights);
    } catch (error) {
      console.error('Error fetching insights:', error);
      toast({
        title: "Couldn't load insights",
        description: "We had trouble analyzing your spending. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSuspiciousActivities = async () => {
    try {
      // Mock expenses data
      const mockExpenses = [
        { amount: 25.99, category: 'Food', merchant: 'Starbucks', date: new Date() },
        { amount: 25.99, category: 'Food', merchant: 'Starbucks', date: new Date() }, // Duplicate
        { amount: 145.50, category: 'Transportation', merchant: 'Uber', date: new Date() } // Unusual amount
      ];
      
      const response = await detectAnomalies(mockExpenses, 'week');
      setActivities(response.activities);
    } catch (error) {
      console.error('Error fetching suspicious activities:', error);
    }
  };

  const handleConfirmSuspiciousActivity = (id: string) => {
    toast({
      title: "Thanks for confirming",
      description: "We've flagged this transaction for review.",
    });
    setActivities(activities.filter(activity => activity.id !== id));
  };

  const handleDismissSuspiciousActivity = (id: string) => {
    toast({
      title: "Okay, no problem",
      description: "We'll remember this for next time.",
    });
    setActivities(activities.filter(activity => activity.id !== id));
  };

  const handleAskAI = () => {
    toast({
      title: "AI Assistant",
      description: "What would you like to know about your finances?",
    });
    // In a full implementation, this would open a chat dialog
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">AI Spending Insights</h2>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <Button variant="outline" size="sm" className="text-sm" onClick={handleAskAI}>
          Ask AI Assistant
          <Bot className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="insights">Spending Insights</TabsTrigger>
          <TabsTrigger value="alerts" className="relative">
            Alerts
            {activities.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {activities.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="mt-0">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-40 animate-pulse bg-secondary/50 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <InsightCard 
                    insight={insight} 
                    onAction={() => toast({
                      title: insight.title,
                      description: "We'll help you take action on this insight.",
                    })}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-0">
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <SuspiciousActivityCard 
                    activity={activity} 
                    onConfirm={() => handleConfirmSuspiciousActivity(activity.id)}
                    onDismiss={() => handleDismissSuspiciousActivity(activity.id)}
                  />
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Shield className="h-12 w-12 text-muted-foreground/40 mb-3" />
                <h3 className="text-lg font-medium mb-1">All clear!</h3>
                <p className="text-muted-foreground max-w-md">
                  I haven't detected any suspicious activity in your recent transactions.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AIInsightsSection;
