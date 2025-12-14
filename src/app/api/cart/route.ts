import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

// Helper to get user ID from token
async function getUserIdFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    return decoded.id;
  } catch {
    return null;
  }
}

// GET cart items
export async function GET() {
  const userId = await getUserIdFromToken();
  
  if (!userId) {
    return NextResponse.json({ items: [] });
  }

  const cartItems = await pool.query(
    `SELECT product_id as id, product_name as name, price, quantity
     FROM cart_items 
     WHERE user_id = $1`,
    [userId]
  );

  return NextResponse.json({ items: cartItems.rows });
}

// POST add/update item
export async function POST(request: NextRequest) {
  const userId = await getUserIdFromToken();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  const { id, name, price, quantity = 1 } = await request.json();

  try {
    // Upsert cart item
    await pool.query(`
      INSERT INTO cart_items (user_id, product_id, product_name, price, quantity)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, product_id) 
      DO UPDATE SET quantity = cart_items.quantity + $5
    `, [userId, id, name, price, quantity]);

    // Get updated cart
    const cartItems = await pool.query(
      `SELECT product_id as id, product_name as name, price, quantity
       FROM cart_items 
       WHERE user_id = $1`,
      [userId]
    );

    return NextResponse.json({ items: cartItems.rows });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE remove item
export async function DELETE(request: NextRequest) {
  const userId = await getUserIdFromToken();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json(
      { error: 'Product ID required' },
      { status: 400 }
    );
  }

  await pool.query(
    'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );

  return NextResponse.json({ success: true });
}

// Clear cart
export async function PATCH() {
  const userId = await getUserIdFromToken();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  await pool.query(
    'DELETE FROM cart_items WHERE user_id = $1',
    [userId]
  );

  return NextResponse.json({ success: true });
}