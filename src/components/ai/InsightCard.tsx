
import React from 'react';
import { Bot, Lightbulb, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'spending' | 'savings' | 'trend';
  date: Date;
}

interface InsightCardProps {
  insight: AIInsight;
  className?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, className }) => {
  const { title, description, type } = insight;

  const getInsightIcon = () => {
    switch (type) {
      case 'spending':
        return <TrendingUp className="h-5 w-5 text-amber-500" />;
      case 'savings':
        return <Lightbulb className="h-5 w-5 text-emerald-500" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      default:
        return <Bot className="h-5 w-5 text-indigo-500" />;
    }
  };

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            {getInsightIcon()}
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end p-2 bg-secondary/10">
        <Button variant="ghost" size="sm" className="text-xs">
          Tell me more
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InsightCard;
