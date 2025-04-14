export enum Category {
  FOOD = "Food",
  HOUSING = "Housing",
  TRANSPORTATION = "Transportation",
  ENTERTAINMENT = "Entertainment",
  SHOPPING = "Shopping",
  UTILITIES = "Utilities",
  HEALTHCARE = "Healthcare",
  EDUCATION = "Education",
  INVESTMENTS = "Investments",
  INCOME = "Income",
  OTHER = "Other"
}

export interface Transaction {
  _id?: string;
  amount: number;
  date: Date;
  description: string;
  category: Category;
}

export interface Budget {
  _id?: string;
  category: Category;
  amount: number;
  month: number;
  year: number;
}

export interface Income {
  _id?: string;
  amount: number;
  source: string;
  month: number;
  year: number;
  date: Date;
  recurring: boolean;
  notes?: string;
}

export interface CategoryTotal {
  category: Category;
  total: number;
}

export interface MonthlyTotal {
  month: number;
  year: number;
  total: number;
}

export type MonthYear = {
  month: number;
  year: number;
} 