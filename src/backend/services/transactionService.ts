/**
 * Transaction Service
 * Handles all transaction-related operations
 */

import dbConnect from '../db/connection';
import { Transaction as TransactionModel } from '../models/models';
import { Transaction, Category, MonthlyTotal, CategoryTotal } from '../../shared/types';

/**
 * Get all transactions
 */
export async function getAllTransactions(): Promise<Transaction[]> {
  await dbConnect();
  return TransactionModel.find({}).sort({ date: -1 }).lean();
}

/**
 * Get a single transaction by ID
 */
export async function getTransactionById(id: string): Promise<Transaction | null> {
  await dbConnect();
  return TransactionModel.findById(id).lean();
}

/**
 * Get transactions for a specific month and year
 */
export async function getTransactionsByMonth(month: number, year: number): Promise<Transaction[]> {
  await dbConnect();

  // Create date range for the month
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  return TransactionModel.find({
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: -1 }).lean();
}

/**
 * Create a new transaction
 */
export async function createTransaction(transaction: Omit<Transaction, '_id'>): Promise<Transaction> {
  await dbConnect();
  const newTransaction = new TransactionModel(transaction);
  return newTransaction.save();
}

/**
 * Update an existing transaction
 */
export async function updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction | null> {
  await dbConnect();
  return TransactionModel.findByIdAndUpdate(id, transaction, { new: true }).lean();
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(id: string): Promise<Transaction | null> {
  await dbConnect();
  return TransactionModel.findByIdAndDelete(id).lean();
}

/**
 * Get spending by category for a specific month and year
 */
export async function getSpendingByCategory(month: number, year: number): Promise<CategoryTotal[]> {
  await dbConnect();
  
  // Create date range for the month
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  const results = await TransactionModel.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" }
      }
    }
  ]);

  return results.map(item => ({
    category: item._id as Category,
    total: item.total
  }));
}

/**
 * Get monthly spending totals
 */
export async function getMonthlyTotals(year: number): Promise<MonthlyTotal[]> {
  await dbConnect();
  
  const results = await TransactionModel.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(year, 0, 1),
          $lte: new Date(year, 11, 31)
        }
      }
    },
    {
      $group: {
        _id: { month: { $month: "$date" }, year: { $year: "$date" } },
        total: { $sum: "$amount" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);

  return results.map(item => ({
    month: item._id.month - 1, // Adjust month to be 0-indexed
    year: item._id.year,
    total: item.total
  }));
} 