// Updated orders API for consolidated items structure

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { isAdmin } from '@/middleware/admin';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user from cookie (OPTIONAL - allow guest checkout)
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    let userId = null;
    let userEmail = '';

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };
        userId = decoded.id;
        userEmail = decoded.email;
      } catch (error) {
        console.log('Invalid token, proceeding as guest');
      }
    }

    // 2. Parse request data
    const { 
      cartItems, 
      shippingAddress, 
      shippingMethod, 
      notes,
      paymentMethod,
      cryptocurrency,
      transactionId
    } = await request.json();
    
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

    // Validate crypto payment fields
    if (paymentMethod === 'crypto') {
      if (!cryptocurrency || !transactionId) {
        return NextResponse.json(
          { error: 'Cryptocurrency and transaction ID are required for crypto payments' },
          { status: 400 }
        );
      }
    }

    // 3. Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 50.00;
    const tax = 0;
    const total = subtotal + shipping + tax;

    // 4. Generate order number
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    // 5. Format items for JSON storage
    const itemsJson = cartItems.map(item => ({
      id: String(item.id),
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    }));

    // 6. Create order (single INSERT - no transaction needed!)
    const orderResult = await pool.query(
      `INSERT INTO orders (
        user_id, 
        order_number, 
        status, 
        items,
        subtotal, 
        shipping, 
        tax, 
        total,
        shipping_method, 
        notes, 
        shipping_address,
        payment_method,
        cryptocurrency,
        transaction_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id, order_number`,
      [
        userId,
        orderNumber,
        'pending',
        JSON.stringify(itemsJson),  // Store items as JSON!
        subtotal,
        shipping,
        tax,
        total,
        shippingMethod || 'standard',
        notes || '',
        JSON.stringify(shippingAddress),
        paymentMethod || 'crypto',
        cryptocurrency || null,
        transactionId || null
      ]
    );

    const orderId = orderResult.rows[0].id;

    // 7. Return success response
    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        orderNumber: orderResult.rows[0].order_number,
        total: total,
        paymentMethod: paymentMethod,
        cryptocurrency: cryptocurrency,
        transactionId: transactionId,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch user's orders
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
    
    // Fetch orders with items already included!
    const ordersResult = await pool.query(
      `SELECT 
        id, 
        order_number, 
        status, 
        items,
        total, 
        payment_method,
        cryptocurrency,
        transaction_id,
        created_at 
       FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [decoded.id]
    );

    // Items are already in the JSON - no need for separate query!
    const orders = ordersResult.rows.map(order => ({
      ...order,
      items: order.items || []  // Already parsed by PostgreSQL
    }));

    return NextResponse.json({
      success: true,
      orders: orders
    });

  } catch (error: any) {
    console.error('❌ Fetch orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// Admin endpoints (unchanged)
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