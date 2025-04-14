import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Income } from '@/lib/models';
import { z } from 'zod';

// Schema for income validation
const incomeSchema = z.object({
  amount: z.number().nonnegative("Amount must be zero or positive"),
  source: z.string().min(1, "Source is required"),
  month: z.number().min(0).max(11),
  year: z.number().min(2000),
  date: z.string().transform(str => new Date(str)),
  recurring: z.boolean().default(false),
  notes: z.string().optional(),
});

// GET income by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const income = await Income.findById(params.id);
    
    if (!income) {
      return NextResponse.json({ error: "Income record not found" }, { status: 404 });
    }
    
    return NextResponse.json(income);
  } catch (error) {
    console.error("Error fetching income record:", error);
    return NextResponse.json({ error: "Failed to fetch income record" }, { status: 500 });
  }
}

// PUT (update) income by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const validatedData = incomeSchema.parse(body);
    
    await dbConnect();
    const income = await Income.findByIdAndUpdate(params.id, validatedData, {
      new: true,
      runValidators: true,
    });
    
    if (!income) {
      return NextResponse.json({ error: "Income record not found" }, { status: 404 });
    }
    
    return NextResponse.json(income);
  } catch (error) {
    console.error("Error updating income record:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update income record" }, { status: 500 });
  }
}

// DELETE income by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const income = await Income.findByIdAndDelete(params.id);
    
    if (!income) {
      return NextResponse.json({ error: "Income record not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Income record deleted successfully" });
  } catch (error) {
    console.error("Error deleting income record:", error);
    return NextResponse.json({ error: "Failed to delete income record" }, { status: 500 });
  }
} 