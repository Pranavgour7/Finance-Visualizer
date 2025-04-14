"use client";

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getMonthName, formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyTotal } from '@/lib/types';

interface MonthlyExpensesChartProps {
  data: MonthlyTotal[];
}

export default function MonthlyExpensesChart({ data }: MonthlyExpensesChartProps) {
  // Format data for the chart
  const chartData = data.map((item) => ({
    name: getMonthName(item.month).substring(0, 3),
    amount: item.total,
    month: item.month,
  }));

  // Custom tooltip to display formatted values
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded shadow">
          <p className="font-medium">{getMonthName(payload[0].payload.month)}</p>
          <p className="text-primary">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => formatCurrency(value).replace(/[^0-9.]/g, '')}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#6419E6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 