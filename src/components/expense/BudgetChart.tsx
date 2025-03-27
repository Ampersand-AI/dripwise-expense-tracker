
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central" 
      className="text-xs"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentSpent = ((data.spent / data.value) * 100).toFixed(0);
    
    return (
      <div className="bg-background p-3 border shadow-sm rounded-md">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          Budget: <span className="font-medium">${data.value.toLocaleString()}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Spent: <span className="font-medium">${data.spent.toLocaleString()}</span> ({percentSpent}%)
        </p>
      </div>
    );
  }

  return null;
};

const BudgetChart: React.FC<BudgetChartProps> = ({ data, className }) => {
  const totalBudget = data.reduce((sum, item) => sum + item.value, 0);
  const totalSpent = data.reduce((sum, item) => sum + item.spent, 0);
  const percentSpent = ((totalSpent / totalBudget) * 100).toFixed(1);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Budget Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                animationDuration={600}
                animationBegin={200}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex justify-center items-center flex-col">
          <div className="text-sm font-medium text-center">
            Total Budget: ${totalBudget.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground text-center">
            ${totalSpent.toLocaleString()} spent ({percentSpent}%)
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center text-xs">
              <div 
                className="w-3 h-3 rounded-full mr-1.5" 
                style={{ backgroundColor: item.color }} 
              />
              <span className="truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetChart;
