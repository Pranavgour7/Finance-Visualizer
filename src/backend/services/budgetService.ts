/**
 * Budget Service
 * Handles all budget-related operations
 */

import dbConnect from '../db/connection';
import { Budget as BudgetModel } from '../models/models';
import { Budget, Category } from '../../shared/types';

/**
 * Get all budgets
 */
export async function getAllBudgets(): Promise<Budget[]> {
  await dbConnect();
  return BudgetModel.find({}).lean();
}

/**
 * Get budgets for a specific month and year
 */
export async function getBudgetsByMonth(month: number, year: number): Promise<Budget[]> {
  await dbConnect();
  return BudgetModel.find({ month, year }).lean();
}

/**
 * Get budget for a specific category, month, and year
 */
export async function getBudgetByCategory(category: Category, month: number, year: number): Promise<Budget | null> {
  await dbConnect();
  return BudgetModel.findOne({ category, month, year }).lean();
}

/**
 * Create a new budget
 */
export async function createBudget(budget: Omit<Budget, '_id'>): Promise<Budget> {
  await dbConnect();
  
  // Check if budget for this category/month/year already exists
  const existingBudget = await BudgetModel.findOne({
    category: budget.category,
    month: budget.month,
    year: budget.year
  });

  // Update if exists, otherwise create new
  if (existingBudget) {
    return BudgetModel.findByIdAndUpdate(
      existingBudget._id,
      { amount: budget.amount },
      { new: true }
    ).lean();
  }

  const newBudget = new BudgetModel(budget);
  return newBudget.save();
}

/**
 * Update an existing budget
 */
export async function updateBudget(id: string, budget: Partial<Budget>): Promise<Budget | null> {
  await dbConnect();
  return BudgetModel.findByIdAndUpdate(id, budget, { new: true }).lean();
}

/**
 * Delete a budget
 */
export async function deleteBudget(id: string): Promise<Budget | null> {
  await dbConnect();
  return BudgetModel.findByIdAndDelete(id).lean();
}

/**
 * Compare budget vs actual spending by category for a month and year
 */
export async function getBudgetVsActual(month: number, year: number): Promise<any[]> {
  await dbConnect();
  
  // This would typically be implemented with an aggregation pipeline
  // that joins budget and transaction collections
  // For simplicity, we'll need to combine this data on the API layer
  // by using both the budget and transaction services
  
  return BudgetModel.find({ month, year }).lean();
} 