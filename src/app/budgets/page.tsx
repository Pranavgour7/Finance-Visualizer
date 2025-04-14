"use client";

import { useState, useEffect } from "react";
import { Budget } from "@/lib/types";
import { getCurrentMonthYear, getMonthName } from "@/lib/utils";
import BudgetForm from "@/components/BudgetForm";
import BudgetComparisonChart from "@/components/charts/BudgetComparisonChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { month, year } = getCurrentMonthYear();

  // Fetch budgets
  const fetchBudgets = async () => {
    try {
      const response = await fetch(`/api/budgets?month=${month}&year=${year}`);
      if (!response.ok) throw new Error("Failed to fetch budgets");
      
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast.error("Failed to load budgets");
    }
  };

  // Fetch budget comparison data
  const fetchComparisonData = async () => {
    try {
      const response = await fetch(`/api/stats/budget-comparison?month=${month}&year=${year}`);
      if (!response.ok) throw new Error("Failed to fetch budget comparison data");
      
      const data = await response.json();
      setComparisonData(data);
    } catch (error) {
      console.error("Error fetching budget comparison data:", error);
      toast.error("Failed to load budget comparison data");
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchBudgets(),
      fetchComparisonData(),
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Add/Update budget handler
  const handleSubmitBudget = async (data: any) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save budget");
      }

      toast.success("Budget saved successfully");
      fetchAllData();
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error("Failed to save budget");
    }
  };

  // Calculate total budget vs actual spending
  const totalBudgeted = budgets.reduce((total, budget) => total + budget.amount, 0);
  const totalActual = comparisonData.reduce((total, item) => total + item.actual, 0);
  const totalDifference = totalBudgeted - totalActual;
  const isOverBudget = totalDifference < 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Budgets - {getMonthName(month)} {year}
      </h1>

      {isLoading ? (
        <div className="grid place-items-center h-32">
          <p>Loading budget data...</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Budgeted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalBudgeted.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Actual Spending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalActual.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isOverBudget ? "Over Budget" : "Under Budget"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    isOverBudget ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {isOverBudget ? "-" : ""}${Math.abs(totalDifference).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget Form */}
            <BudgetForm
              onSubmit={handleSubmitBudget}
              month={month}
              year={year}
              existingBudgets={budgets}
            />

            {/* Budget Comparison Chart */}
            {comparisonData.length > 0 ? (
              <BudgetComparisonChart data={comparisonData} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Budget vs. Actual</CardTitle>
                </CardHeader>
                <CardContent className="h-80 grid place-items-center">
                  <p className="text-center text-muted-foreground">
                    No budget comparison data available for the selected period
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
} 