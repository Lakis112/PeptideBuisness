import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/middleware/admin';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const orders = await pool.query(`
      SELECT o.id, o.order_number, o.status, o.total, o.created_at,
             u.email, u.first_name, u.last_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 50
    `);

    return NextResponse.json({
      orders: orders.rows
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { orderId, status } = await request.json();

    await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2',
      [status, orderId]
    );

    return NextResponse.json({
      success: true,
      message: 'Order updated'
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}