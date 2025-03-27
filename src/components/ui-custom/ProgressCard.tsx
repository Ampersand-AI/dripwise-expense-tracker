
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  unit?: string;
  className?: string;
  description?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  current,
  total,
  unit = "",
  className,
  description,
}) => {
  // Calculate percentage with boundaries
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  const percentageText = `${percentage.toFixed(0)}%`;
  
  // Color logic based on percentage
  const getColorClass = () => {
    if (percentage < 30) return "bg-green-500";
    if (percentage < 70) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <span className="text-xs font-medium">
            {current.toLocaleString()}{unit} / {total.toLocaleString()}{unit}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="progress-bar">
            <div
              className={cn("progress-bar-fill", getColorClass())}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium">{percentageText}</span>
            {description && <span className="text-muted-foreground">{description}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
