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

    const products = await pool.query(`
      SELECT id, name, sku, price, stock, category, status
      FROM products 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      products: products.rows
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { name, sku, price, description, category, stock } = data;

    const result = await pool.query(`
      INSERT INTO products (name, sku, price, description, category, stock)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, sku, price, stock, category, status
    `, [name, sku, price, description, category, stock]);

    return NextResponse.json({
      success: true,
      product: result.rows[0]
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}