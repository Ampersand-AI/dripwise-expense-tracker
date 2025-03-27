
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardStatsProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  className?: string;
  valueClassName?: string;
}

const CardStats: React.FC<CardStatsProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
  valueClassName,
}) => {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-5 w-5 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>
          {value}
        </div>
        <div className="flex items-center mt-1">
          {trend !== undefined && (
            <span 
              className={cn(
                "text-xs mr-1", 
                trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-muted-foreground"
              )}
            >
              {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"} {Math.abs(trend)}%
            </span>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardStats;
