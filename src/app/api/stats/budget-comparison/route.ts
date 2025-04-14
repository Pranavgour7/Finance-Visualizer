import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Transaction, Budget } from '@/lib/models';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : new Date().getMonth();
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : new Date().getFullYear();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    await dbConnect();

    // Get all budgets for this month/year
    const budgets = await Budget.find({ month, year });

    // Get actual spending by category
    const actualSpending = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
          // Exclude income for expense calculations
          category: { $ne: 'Income' },
        },
      },
      {
        $group: {
          _id: '$category',
          actual: { $sum: '$amount' },
        },
      },
      {
        $project: {
          category: '$_id',
          actual: 1,
          _id: 0,
        },
      },
    ]);

    // Combine budgets with actual spending
    const budgetComparison = budgets.map((budget) => {
      const spending = actualSpending.find(
        (item) => item.category === budget.category
      );

      return {
        category: budget.category,
        budgeted: budget.amount,
        actual: spending ? spending.actual : 0,
        // Difference: positive means under budget, negative means over budget
        difference: budget.amount - (spending ? spending.actual : 0),
      };
    });

    // Add categories with spending but no budget
    actualSpending.forEach((spending) => {
      const hasBudget = budgets.some((b) => b.category === spending.category);
      if (!hasBudget) {
        budgetComparison.push({
          category: spending.category,
          budgeted: 0,
          actual: spending.actual,
          difference: -spending.actual, // Negative because it's over budget (which is 0)
        });
      }
    });

    return NextResponse.json(budgetComparison);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch budget comparison' }, { status: 500 });
  }
} 