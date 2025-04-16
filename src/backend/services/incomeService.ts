/**
 * Income Service
 * Handles all income-related operations
 */

import dbConnect from '../db/connection';
import { Income as IncomeModel } from '../models/models';
import { Income } from '../../shared/types';

/**
 * Get all income records
 */
export async function getAllIncome(): Promise<Income[]> {
  await dbConnect();
  return IncomeModel.find({}).sort({ date: -1 }).lean();
}

/**
 * Get income for a specific month and year
 */
export async function getIncomeByMonth(month: number, year: number): Promise<Income[]> {
  await dbConnect();
  return IncomeModel.find({ month, year }).sort({ date: -1 }).lean();
}

/**
 * Create a new income record
 */
export async function createIncome(income: Omit<Income, '_id'>): Promise<Income> {
  await dbConnect();
  const newIncome = new IncomeModel(income);
  return newIncome.save();
}

/**
 * Update an existing income record
 */
export async function updateIncome(id: string, income: Partial<Income>): Promise<Income | null> {
  await dbConnect();
  return IncomeModel.findByIdAndUpdate(id, income, { new: true }).lean();
}

/**
 * Delete an income record
 */
export async function deleteIncome(id: string): Promise<Income | null> {
  await dbConnect();
  return IncomeModel.findByIdAndDelete(id).lean();
}

/**
 * Get total income for a specific month and year
 */
export async function getTotalIncomeByMonth(month: number, year: number): Promise<number> {
  await dbConnect();
  
  const result = await IncomeModel.aggregate([
    {
      $match: { month, year }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ]);

  return result.length > 0 ? result[0].total : 0;
}

/**
 * Get income records with source-based grouping for a specific month and year
 */
export async function getIncomeBySource(month: number, year: number): Promise<any[]> {
  await dbConnect();
  
  return IncomeModel.aggregate([
    {
      $match: { month, year }
    },
    {
      $group: {
        _id: "$source",
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { total: -1 }
    }
  ]);
} 