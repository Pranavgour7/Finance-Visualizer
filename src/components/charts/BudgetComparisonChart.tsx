"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface BudgetComparisonData {
  category: string;
  budgeted: number;
  actual: number;
  difference: number;
}

interface BudgetComparisonChartProps {
  data: BudgetComparisonData[];
}

export default function BudgetComparisonChart({ data }: BudgetComparisonChartProps) {
  // Format data for the chart
  const chartData = data.map((item) => ({
    name: item.category,
    budgeted: item.budgeted,
    actual: item.actual,
  }));

  // Custom tooltip to display formatted values
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded shadow">
          <p className="font-medium">{label}</p>
          <div className="space-y-1">
            <p>
              <span className="inline-block w-3 h-3 mr-2 bg-primary rounded-full"></span>
              Budgeted: {formatCurrency(payload[0].value)}
            </p>
            <p>
              <span className="inline-block w-3 h-3 mr-2 bg-destructive rounded-full"></span>
              Actual: {formatCurrency(payload[1].value)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Actual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                tickFormatter={(value) => formatCurrency(value).replace(/[^0-9.]/g, '')}
              />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="budgeted" name="Budgeted" fill="#6419E6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="actual" name="Actual" fill="#EF4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 