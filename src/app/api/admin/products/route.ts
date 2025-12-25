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
      SELECT id, name, sku, price, description, stock, category, status
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
      SET name = $1, sku = $2, price = $3, description = $4, 
          category = $5, stock = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, name, sku, price, stock, category, status
    `, [name, sku, price, description, category, stock, id]);

    return NextResponse.json({
      success: true,
      product: result.rows[0]
    });

  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
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
      'UPDATE products SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
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