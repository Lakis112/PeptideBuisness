// /api/products/[slug]/route.ts - UPDATED
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
        p.id::text as id,
        p.name,
        p.sku,
        p.price::float as price,
        p.description,
        c.name as category,
        COALESCE(parent.name, c.name) as maincategory,
        c.name as subcategory,
        p.stock,
        p.status,
        p.created_at,
        p.updated_at,
        p.image_url as "imageUrl",
        p.featured,
        p.purity,
        p.chemical_formula,
        p.molecular_weight,
        p.cas,
        p.synonym,
        p.dosage,
        p.quantity,
        p.halfLife,
        p.storage,
        (p.stock > 0) as "inStock",
        -- Add originalPrice for potential discounts
        CASE 
          WHEN p.price > 200 THEN (p.price * 1.15)::float
          ELSE NULL::float
        END as "originalPrice"
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN categories parent ON c.parent_id = parent.id
      WHERE p.sku = $1 AND p.status = 'active'`,
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