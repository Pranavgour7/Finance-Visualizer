"use client";

import { Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Link
          href="/transactions"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            No recent transactions found
          </p>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>{formatDate(transaction.date)}</span>
                    <span>•</span>
                    <span>{transaction.category}</span>
                  </div>
                </div>
                <span
                  className={
                    transaction.category === "Income"
                      ? "text-green-600 font-medium"
                      : "font-medium"
                  }
                >
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 