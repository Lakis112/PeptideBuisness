import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { isAdmin } from '@/middleware/admin';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: { id: number; email: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // 2. Parse request data
    const { cartItems, shippingAddress, shippingMethod, notes } = await request.json();
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.fullName) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // 3. Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = shippingMethod === 'express' ? 15.00 : 5.00; // Example shipping logic
    const tax = subtotal * 0.08; // Example 8% tax
    const total = subtotal + shipping + tax;

    // 4. Generate order number
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    // 5. Start database transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Insert order
      const orderResult = await client.query(
        `INSERT INTO orders (
          user_id, order_number, status, subtotal, shipping, tax, total,
          shipping_method, notes, shipping_address
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, order_number`,
        [
          decoded.id,
          orderNumber,
          'pending',
          subtotal,
          shipping,
          tax,
          total,
          shippingMethod || 'standard',
          notes || '',
          JSON.stringify(shippingAddress)
        ]
      );

      const orderId = orderResult.rows[0].id;

      // Insert order items
      for (const item of cartItems) {
        await client.query(
          `INSERT INTO order_items (
            order_id, product_id, product_name, quantity, unit_price, total_price
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            orderId,
            String(item.id),  // Convert to string
            item.name,
            item.quantity,
            item.price,
            item.price * item.quantity
          ]
        );
      }

      await client.query('COMMIT');

      // 6. Return success response
      return NextResponse.json({
        success: true,
        order: {
          id: orderId,
          orderNumber: orderResult.rows[0].order_number,
          total: total,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error: any) {
    console.error('❌ Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch user's orders for dashboard
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    
    // Fetch orders
    const ordersResult = await pool.query(
      `SELECT id, order_number, status, total, created_at 
       FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [decoded.id]
    );

    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await pool.query(
          `SELECT product_name as name, quantity, unit_price as price 
           FROM order_items 
           WHERE order_id = $1`,
          [order.id]
        );
        return {
          ...order,
          items: itemsResult.rows || []
        };
      })
    );

    return NextResponse.json({
      success: true,
      orders: ordersWithItems
    });

  } catch (error: any) {
    console.error('❌ Fetch orders error:', error);
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

    const data = await request.json();
    const { id, name, sku, price, description, category, stock } = data;

    const result = await pool.query(`
      UPDATE products 
      SET name = $1, sku = $2, price = $3, description = $4, category = $5, stock = $6
      WHERE id = $7
      RETURNING id, name, sku, price, stock, category, status
    `, [name, sku, price, description, category, stock, id]);

    return NextResponse.json({
      success: true,
      product: result.rows[0]
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await pool.query('DELETE FROM products WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      message: 'Product deleted'
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');

    await pool.query(
      'UPDATE products SET status = $1 WHERE id = $2',
      [status, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Status updated'
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}