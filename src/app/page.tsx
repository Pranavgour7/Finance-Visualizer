"use client";

import { useState, useEffect } from "react";
import { Category, Transaction, MonthlyTotal, CategoryTotal, Income } from "@/lib/types";
import { getCurrentMonthYear, getMonthName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TransactionForm from "@/components/TransactionForm";
import MonthlyExpensesChart from "@/components/charts/MonthlyExpensesChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import SummaryCards from "@/components/dashboard/SummaryCards";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeRecords, setIncomeRecords] = useState<Income[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyTotal[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryTotal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { month, year } = getCurrentMonthYear();

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      if (!response.ok) throw new Error("Failed to fetch transactions");
      
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    }
  };

  // Fetch income records
  const fetchIncomeRecords = async () => {
    try {
      const response = await fetch(`/api/income?month=${month}&year=${year}`);
      if (!response.ok) throw new Error("Failed to fetch income records");
      
      const data = await response.json();
      setIncomeRecords(data);
    } catch (error) {
      console.error("Error fetching income records:", error);
      toast({
        title: "Error",
        description: "Failed to load income records",
        variant: "destructive",
      });
    }
  };

  // Fetch monthly stats
  const fetchMonthlyStats = async () => {
    try {
      const response = await fetch(`/api/stats/monthly?year=${year}`);
      if (!response.ok) throw new Error("Failed to fetch monthly stats");
      
      const data = await response.json();
      setMonthlyStats(data);
    } catch (error) {
      console.error("Error fetching monthly stats:", error);
      toast({
        title: "Error",
        description: "Failed to load monthly statistics",
        variant: "destructive",
      });
    }
  };

  // Fetch category stats
  const fetchCategoryStats = async () => {
    try {
      const response = await fetch(`/api/stats/category?month=${month}&year=${year}`);
      if (!response.ok) throw new Error("Failed to fetch category stats");
      
      const data = await response.json();
      setCategoryStats(data);
    } catch (error) {
      console.error("Error fetching category stats:", error);
      toast({
        title: "Error",
        description: "Failed to load category statistics",
        variant: "destructive",
      });
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchTransactions(),
      fetchIncomeRecords(),
      fetchMonthlyStats(),
      fetchCategoryStats(),
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Add transaction handler
  const handleAddTransaction = async (data: any) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add transaction");
      }

      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
      // Refresh data
      fetchAllData();
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };

  // Filter transactions for the current month
  const currentMonthTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === month && txDate.getFullYear() === year;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">
          Dashboard - {getMonthName(month)} {year}
        </h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Transaction</Button>
      </div>

      {isLoading ? (
        <div className="grid place-items-center h-32">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <SummaryCards
            transactions={currentMonthTransactions}
            incomeRecords={incomeRecords}
            month={month}
            year={year}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyExpensesChart data={monthlyStats} />
            {categoryStats.length > 0 ? (
              <CategoryPieChart data={categoryStats} />
            ) : (
              <div className="bg-background rounded-lg border p-8 grid place-items-center">
                <p className="text-center text-muted-foreground">
                  No expense data available for the selected period
                </p>
              </div>
            )}
          </div>

          <RecentTransactions transactions={transactions} />
        </>
      )}

      <TransactionForm
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTransaction}
        title="Add Transaction"
      />
    </div>
  );
}
