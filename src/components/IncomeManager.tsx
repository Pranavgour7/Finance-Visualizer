"use client";

import { useState, useEffect } from "react";
import { Income, MonthYear } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusIcon, Pencil, Trash2 } from "lucide-react";
import IncomeForm from "./IncomeForm";
import { useToast } from "@/components/ui/use-toast";

interface IncomeManagerProps {
  currentMonthYear: MonthYear;
}

export default function IncomeManager({ currentMonthYear }: IncomeManagerProps) {
  const { toast } = useToast();
  const [incomeRecords, setIncomeRecords] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [currentIncome, setCurrentIncome] = useState<Income | null>(null);
  const [totalIncome, setTotalIncome] = useState(0);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Fetch income records when month/year changes
  useEffect(() => {
    fetchIncomeRecords();
  }, [currentMonthYear]);

  const fetchIncomeRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/income?month=${currentMonthYear.month}&year=${currentMonthYear.year}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch income records");
      }
      const data = await response.json();
      setIncomeRecords(data);
      
      // Calculate total income
      const total = data.reduce((sum: number, income: Income) => sum + income.amount, 0);
      setTotalIncome(total);
    } catch (error) {
      console.error("Error fetching income records:", error);
      toast({
        title: "Error",
        description: "Failed to load income records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIncome = async (data: any) => {
    try {
      const response = await fetch("/api/income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add income");
      }

      toast({
        title: "Success",
        description: "Income added successfully",
      });

      fetchIncomeRecords();
    } catch (error) {
      console.error("Error adding income:", error);
      toast({
        title: "Error",
        description: "Failed to add income",
        variant: "destructive",
      });
    }
  };

  const handleEditIncome = async (data: any) => {
    if (!currentIncome?._id) return;

    try {
      const response = await fetch(`/api/income/${currentIncome._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update income");
      }

      toast({
        title: "Success",
        description: "Income updated successfully",
      });

      fetchIncomeRecords();
    } catch (error) {
      console.error("Error updating income:", error);
      toast({
        title: "Error",
        description: "Failed to update income",
        variant: "destructive",
      });
    }
  };

  const handleDeleteIncome = async (id: string) => {
    if (!confirm("Are you sure you want to delete this income record?")) return;

    try {
      const response = await fetch(`/api/income/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete income");
      }

      toast({
        title: "Success",
        description: "Income deleted successfully",
      });

      fetchIncomeRecords();
    } catch (error) {
      console.error("Error deleting income:", error);
      toast({
        title: "Error",
        description: "Failed to delete income",
        variant: "destructive",
      });
    }
  };

  const editIncome = (income: Income) => {
    setCurrentIncome(income);
    setIsEditFormOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Income - {months[currentMonthYear.month]} {currentMonthYear.year}
        </h2>
        <Button onClick={() => setIsAddFormOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Income
        </Button>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Total Monthly Income</CardTitle>
          <CardDescription>
            All income sources for {months[currentMonthYear.month]} {currentMonthYear.year}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(totalIncome)}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : incomeRecords.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted">
          <p className="text-muted-foreground">No income records found for this month.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setIsAddFormOpen(true)}
          >
            Add Your First Income
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {incomeRecords.map((income) => (
            <Card key={income._id} className="overflow-hidden">
              <div className="p-4 flex justify-between items-start">
                <div>
                  <div className="font-medium flex items-center">
                    {income.source}
                    {income.recurring && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Recurring
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-green-600 mt-1">
                    {formatCurrency(income.amount)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Received: {formatDate(income.date)}
                  </div>
                  {income.notes && (
                    <div className="mt-2 text-sm bg-muted p-2 rounded-md">
                      {income.notes}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => editIncome(income)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteIncome(income._id as string)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Income Form */}
      <IncomeForm
        open={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSubmit={handleAddIncome}
        title="Add Income"
        initialData={{
          month: currentMonthYear.month,
          year: currentMonthYear.year,
        }}
      />

      {/* Edit Income Form */}
      {currentIncome && (
        <IncomeForm
          open={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          onSubmit={handleEditIncome}
          title="Edit Income"
          initialData={currentIncome}
        />
      )}
    </div>
  );
} 