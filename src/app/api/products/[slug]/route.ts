// /api/products/[slug]/route.ts - SIMPLIFIED VERSION
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const result = await pool.query(
      `SELECT 
        id::text as id,
        name,
        sku,
        price::float as price,
        description,
        category,
        stock,
        status,
        created_at,
        updated_at,
        -- Add all required fields for ProductDetail
        'Research' as dosage,
        '1 vial' as quantity,
        '99%' as purity,
        '' as molecularWeight,
        '' as sequence,
        '' as halfLife,
        '-20°C' as storage,
        (stock > 0) as "inStock",
        -- Add originalPrice for potential discounts
        CASE 
          WHEN price > 200 THEN (price * 1.15)::float
          ELSE NULL::float
        END as "originalPrice"
      FROM products 
      WHERE sku = $1 AND status = 'active'`,  // ← Only match by sku
      [slug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}