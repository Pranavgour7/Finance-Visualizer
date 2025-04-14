"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, getMonthName } from "@/lib/utils";
import { Transaction, Income } from "@/lib/types";

interface SummaryCardsProps {
  transactions: Transaction[];
  incomeRecords: Income[];
  month: number;
  year: number;
}

export default function SummaryCards({ transactions, incomeRecords, month, year }: SummaryCardsProps) {
  // Calculate total expenses (excluding income)
  const totalExpenses = transactions
    .filter((tx) => tx.category !== "Income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate total income from transactions
  const transactionIncome = transactions
    .filter((tx) => tx.category === "Income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  // Calculate total income from income records
  const recordsIncome = incomeRecords.reduce((sum, income) => sum + income.amount, 0);
  
  // Combined total income
  const totalIncome = transactionIncome + recordsIncome;

  // Calculate balance
  const balance = totalIncome - totalExpenses;

  // Find most expensive category
  const categoryTotals = transactions
    .filter((tx) => tx.category !== "Income")
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

  const mostExpensiveCategory =
    Object.keys(categoryTotals).length > 0
      ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]
      : "None";

  const monthYearDisplay = `${getMonthName(month)} ${year}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            for {monthYearDisplay}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            for {monthYearDisplay} ({incomeRecords.length} income sources)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            for {monthYearDisplay}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Highest Expense Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mostExpensiveCategory}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {Object.keys(categoryTotals).length > 0
              ? formatCurrency(categoryTotals[mostExpensiveCategory])
              : "$0.00"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 