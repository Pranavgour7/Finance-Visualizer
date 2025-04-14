import mongoose from 'mongoose';
import { Category } from './types';

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: Object.values(Category),
    default: Category.OTHER,
  },
});

// Budget Schema
const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: Object.values(Category),
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
    min: 0,
    max: 11,
  },
  year: {
    type: Number,
    required: true,
  },
});

// Income Schema
const incomeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  source: {
    type: String,
    required: true,
  },
  month: {
    type: Number,
    required: true,
    min: 0,
    max: 11,
  },
  year: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  recurring: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    default: '',
  }
});

// Models
export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
export const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
export const Income = mongoose.models.Income || mongoose.model('Income', incomeSchema); 