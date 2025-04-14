"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Category, Budget } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMonthName } from "@/lib/utils";

const formSchema = z.object({
  category: z.nativeEnum(Category),
  amount: z.number().positive("Budget amount must be positive"),
  month: z.number().min(0).max(11),
  year: z.number().min(2000),
});

type FormValues = z.infer<typeof formSchema>;

interface BudgetFormProps {
  onSubmit: (data: FormValues) => Promise<void>;
  month: number;
  year: number;
  existingBudgets: Budget[];
}

export default function BudgetForm({ onSubmit, month, year, existingBudgets }: BudgetFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: Category.FOOD,
      amount: 0,
      month,
      year,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    await onSubmit(values);
    form.reset({
      ...form.getValues(),
      category: Category.FOOD,
      amount: 0,
    });
  };

  const currentMonth = getMonthName(month);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Budget for {currentMonth} {year}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select
                      className="w-full p-2 border rounded"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      {Object.values(Category)
                        .filter(category => category !== Category.INCOME) // Exclude income category for budgeting
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : 0);
                      }}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit">Save Budget</Button>
          </form>
        </Form>

        {/* Display existing budgets */}
        {existingBudgets.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Current Budgets</h3>
            <div className="space-y-2">
              {existingBudgets.map((budget) => (
                <div key={budget.category} className="flex justify-between items-center p-2 border rounded">
                  <span>{budget.category}</span>
                  <span className="font-medium">
                    ${budget.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 