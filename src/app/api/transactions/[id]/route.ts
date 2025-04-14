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

// GET transaction by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const transaction = await Transaction.findById(params.id);
    
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }
    
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 });
  }
}

// PUT (update) transaction by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    console.log("Update request for transaction:", params.id, body);
    
    const validatedData = transactionSchema.parse(body);
    
    await dbConnect();
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      params.id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!updatedTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}

// DELETE transaction by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Delete request for transaction:", params.id);
    await dbConnect();
    const deletedTransaction = await Transaction.findByIdAndDelete(params.id);
    
    if (!deletedTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
} 