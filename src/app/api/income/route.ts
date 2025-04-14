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

// GET all income records or filtered by month/year
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const month = searchParams.has('month') ? parseInt(searchParams.get('month') as string) : null;
    const year = searchParams.has('year') ? parseInt(searchParams.get('year') as string) : null;
    
    let query = {};
    
    if (month !== null && year !== null) {
      query = { month, year };
    } else if (year !== null) {
      query = { year };
    }
    
    const incomeRecords = await Income.find(query).sort({ date: -1 });
    return NextResponse.json(incomeRecords);
  } catch (error) {
    console.error("Error fetching income records:", error);
    return NextResponse.json({ error: "Failed to fetch income records" }, { status: 500 });
  }
}

// POST new income record
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received income data:", body);
    
    const validatedData = incomeSchema.parse(body);
    console.log("Validated income data:", validatedData);
    
    await dbConnect();
    const income = await Income.create(validatedData);
    
    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    console.error("Error creating income record:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create income record" }, { status: 500 });
  }
} 