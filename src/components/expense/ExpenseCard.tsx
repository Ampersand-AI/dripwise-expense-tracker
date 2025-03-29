import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from '@/components/ui/card';
import {
  CreditCard,
  ExternalLink,
  MoreHorizontal,
  Receipt,
  Tag,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: Date;
  category: string;
  vendor: string;
  status?: 'pending' | 'processed' | 'reimbursed';
  receiptUrl?: string;
  currency?: string;
}

interface ExpenseCardProps {
  expense: Expense;
  onClick?: (expense: Expense) => void;
  className?: string;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onClick,
  className,
}) => {
  const { 
    title, 
    amount, 
    date, 
    category, 
    vendor, 
    status = 'processed',
    currency = 'USD'
  } = expense;
  
  const getCategoryIcon = () => {
    switch (category.toLowerCase()) {
      case 'food':
        return '🍕';
      case 'travel':
        return '✈️';
      case 'accommodation':
        return '🏨';
      case 'transport':
        return '🚕';
      case 'entertainment':
        return '🎭';
      case 'supplies':
        return '📦';
      default:
        return '📝';
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-700 border-amber-500/30';
      case 'processed':
        return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'reimbursed':
        return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  const handleCardClick = () => {
    if (onClick) {
      onClick(expense);
    }
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md cursor-pointer",
        className
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-accent/40">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getCategoryIcon()}</span>
          <div>
            <h3 className="font-medium text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground">{vendor}</p>
          </div>
        </div>
        
        <Badge variant="outline" className={cn("text-xs px-2 py-0 h-5", getStatusColor())}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">
            {amount.toLocaleString('en-US', { style: 'currency', currency })}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        </div>
        
        <div className="flex mt-3 space-x-2">
          <Badge variant="secondary" className="text-xs">
            <Tag className="h-3 w-3 mr-1" />
            {category}
          </Badge>
          
          <Badge variant="secondary" className="text-xs">
            <CreditCard className="h-3 w-3 mr-1" />
            Business
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t border-border/5 flex justify-between items-center bg-card">
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          <Receipt className="h-3.5 w-3.5 mr-1" />
          View Receipt
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Expense Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Expense</DropdownMenuItem>
            <DropdownMenuItem>Add to Report</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default ExpenseCard;
