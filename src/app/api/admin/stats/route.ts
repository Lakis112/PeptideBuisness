import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/middleware/admin';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Check if admin
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get statistics
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      todayOrders
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM orders'),
      pool.query('SELECT COALESCE(SUM(total), 0) FROM orders'),
      pool.query('SELECT COUNT(*) FROM products'),
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query("SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE")
    ]);

    return NextResponse.json({
      totalOrders: parseInt(totalOrders.rows[0].count),
      totalRevenue: parseFloat(totalRevenue.rows[0].coalesce),
      totalProducts: parseInt(totalProducts.rows[0].count),
      totalUsers: parseInt(totalUsers.rows[0].count),
      todayOrders: parseInt(todayOrders.rows[0].count),
      revenueChange: 12.5 // Example - calculate from previous period
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}