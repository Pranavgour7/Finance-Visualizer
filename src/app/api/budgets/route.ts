import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Budget } from '@/lib/models';
import { z } from 'zod';
import { Category } from '@/lib/types';

// Schema for budget validation
const budgetSchema = z.object({
  category: z.nativeEnum(Category),
  amount: z.number().positive("Budget amount must be positive"),
  month: z.number().min(0).max(11),
  year: z.number().min(2000),
});

// GET all budgets or filter by month and year
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : null;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : null;
    
    const query: any = {};
    
    if (month !== null && !isNaN(month)) {
      query.month = month;
    }
    
    if (year !== null && !isNaN(year)) {
      query.year = year;
    }
    
    await dbConnect();
    const budgets = await Budget.find(query);
    
    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

// POST new budget
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = budgetSchema.parse(body);
    
    await dbConnect();
    
    // Check if a budget for this category, month, and year already exists
    const existingBudget = await Budget.findOne({
      category: validatedData.category,
      month: validatedData.month,
      year: validatedData.year,
    });
    
    if (existingBudget) {
      // Update existing budget
      existingBudget.amount = validatedData.amount;
      await existingBudget.save();
      return NextResponse.json(existingBudget);
    } else {
      // Create new budget
      const budget = await Budget.create(validatedData);
      return NextResponse.json(budget, { status: 201 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 });
  }
} 