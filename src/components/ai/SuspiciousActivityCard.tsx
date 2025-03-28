
import React from 'react';
import { AlertCircle, Shield, Info } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SuspiciousActivity {
  id: string;
  title: string;
  description: string;
  amount: number;
  merchant: string;
  date: Date;
  type: 'duplicate' | 'unusual_amount' | 'unusual_merchant' | 'unusual_time';
  confidence: number;
}

interface SuspiciousActivityCardProps {
  activity: SuspiciousActivity;
  className?: string;
  onConfirm?: () => void;
  onDismiss?: () => void;
}

const SuspiciousActivityCard: React.FC<SuspiciousActivityCardProps> = ({
  activity,
  className,
  onConfirm,
  onDismiss,
}) => {
  const { title, description, type, confidence } = activity;

  const getActivityIcon = () => {
    switch (type) {
      case 'duplicate':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'unusual_amount':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'unusual_merchant':
        return <Info className="h-5 w-5 text-purple-500" />;
      case 'unusual_time':
        return <Info className="h-5 w-5 text-teal-500" />;
      default:
        return <Shield className="h-5 w-5 text-primary" />;
    }
  };

  const getConfidenceLabel = () => {
    if (confidence > 0.9) return "I'm pretty confident about this";
    if (confidence > 0.7) return "This might be worth checking";
    return "Just a gentle heads-up";
  };

  return (
    <Card className={cn("overflow-hidden border-l-4 border-l-blue-400 transition-all hover:shadow-md", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
            {getActivityIcon()}
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground italic mt-1">{getConfidenceLabel()}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-2 bg-secondary/10">
        <Button variant="ghost" size="sm" className="text-xs" onClick={onDismiss}>
          Dismiss
        </Button>
        <Button variant="outline" size="sm" className="text-xs" onClick={onConfirm}>
          Yes, this looks wrong
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuspiciousActivityCard;
