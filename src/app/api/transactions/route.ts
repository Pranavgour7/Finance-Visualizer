import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Category } from '@/shared/types';
import * as transactionService from '@/backend/services/transactionService';

// Schema for transaction validation
const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  date: z.string().transform(str => new Date(str)),
  description: z.string().min(1, "Description is required"),
  category: z.nativeEnum(Category).default(Category.OTHER),
});

/**
 * GET all transactions
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let transactions;
    if (month !== null && year !== null) {
      transactions = await transactionService.getTransactionsByMonth(
        parseInt(month), 
        parseInt(year)
      );
    } else {
      transactions = await transactionService.getAllTransactions();
    }

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

/**
 * POST new transaction
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received transaction data:", body);
    
    const validatedData = transactionSchema.parse(body);
    console.log("Validated transaction data:", validatedData);
    
    const transaction = await transactionService.createTransaction(validatedData);
    
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
} 