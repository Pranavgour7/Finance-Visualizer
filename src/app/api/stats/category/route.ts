import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Transaction } from '@/lib/models';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : new Date().getMonth();
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : new Date().getFullYear();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    await dbConnect();

    // Aggregate transactions by category for the given month/year
    const categoryData = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
          // Exclude income category for expense calculations
          category: { $ne: 'Income' },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          _id: 0,
        },
      },
    ]);

    return NextResponse.json(categoryData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category statistics' }, { status: 500 });
  }
} 