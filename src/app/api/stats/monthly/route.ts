import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Transaction } from '@/lib/models';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : new Date().getFullYear();

    await dbConnect();

    // Aggregate transactions by month for the given year
    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
          // Exclude income category for expense calculations
          category: { $ne: 'Income' },
        },
      },
      {
        $group: {
          _id: { $month: '$date' },
          total: { $sum: '$amount' },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          month: '$_id',
          total: 1,
          _id: 0,
        },
      },
    ]);

    // Fill in missing months with zero
    const result = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const found = monthlyData.find((item) => item.month === month);
      return {
        month: month - 1, // Adjust to 0-based month for client-side
        year,
        total: found ? found.total : 0,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch monthly statistics' }, { status: 500 });
  }
} 