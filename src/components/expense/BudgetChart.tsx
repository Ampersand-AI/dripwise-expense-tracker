
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Sector
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BudgetCategory {
  name: string;
  value: number;
  color: string;
  spent: number;
}

interface BudgetChartProps {
  data: BudgetCategory[];
  className?: string;
}

const BudgetChart: React.FC<BudgetChartProps> = ({ data, className }) => {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined);
  const totalBudget = data.reduce((sum, item) => sum + item.value, 0);
  const totalSpent = data.reduce((sum, item) => sum + item.spent, 0);
  const percentSpent = ((totalSpent / totalBudget) * 100).toFixed(1);

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className="drop-shadow-lg"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 3}
          outerRadius={outerRadius + 7}
          fill={fill}
          opacity={0.3}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentSpent = ((data.spent / data.value) * 100).toFixed(0);
      const remaining = data.value - data.spent;
      
      return (
        <div className="bg-background/90 backdrop-blur-sm p-3 border shadow-sm rounded-md">
          <p className="font-semibold">{data.name}</p>
          <div className="mt-1 space-y-1 text-sm">
            <p className="text-muted-foreground flex justify-between">
              <span>Budget:</span> <span className="font-medium">${data.value.toLocaleString()}</span>
            </p>
            <p className="text-muted-foreground flex justify-between">
              <span>Spent:</span> <span className="font-medium">${data.spent.toLocaleString()}</span>
            </p>
            <p className="text-muted-foreground flex justify-between">
              <span>Remaining:</span> <span className="font-medium">${remaining.toLocaleString()}</span>
            </p>
            <div className="w-full bg-secondary h-1.5 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${percentSpent}%`,
                  backgroundColor: data.color
                }} 
              />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Budget Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {data.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`colorGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                    <stop offset="100%" stopColor={entry.color} stopOpacity={1}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
                animationDuration={800}
                animationBegin={300}
                className="drop-shadow-md"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#colorGradient-${index})`} 
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm">
            <div className="font-semibold">Budget: ${totalBudget.toLocaleString()}</div>
            <div className="text-muted-foreground">Spent: ${totalSpent.toLocaleString()}</div>
          </div>
          <div className="text-sm font-medium">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary text-sm">
              {percentSpent}%
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ 
                  background: `linear-gradient(180deg, ${item.color}cc, ${item.color})`,
                  boxShadow: activeIndex === index ? `0 0 8px ${item.color}` : 'none'
                }} 
              />
              <span className="truncate text-xs">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetChart;
