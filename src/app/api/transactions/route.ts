import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Transaction } from '@/lib/models';
import { z } from 'zod';
import { Category } from '@/lib/types';

// Schema for transaction validation
const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  date: z.string().transform(str => new Date(str)),
  description: z.string().min(1, "Description is required"),
  category: z.nativeEnum(Category).default(Category.OTHER),
});

// GET all transactions
export async function GET() {
  try {
    await dbConnect();
    const transactions = await Transaction.find({}).sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

// POST new transaction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received transaction data:", body);
    
    const validatedData = transactionSchema.parse(body);
    console.log("Validated transaction data:", validatedData);
    
    await dbConnect();
    const transaction = await Transaction.create(validatedData);
    
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
} 