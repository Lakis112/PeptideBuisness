// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
  SELECT 
    id::text as id,
    name,
    sku as slug,
    price::float as price,
    original_price,
    description,
    category,
    stock,
    status,
    created_at,
    updated_at,
    image_url as "imageUrl",
    featured, -- Your actual featured column
    -- Add default values for missing fields
    '' as dosage,
    '1 vial' as quantity,
    '99%' as purity,
    '' as molecularWeight,
    '' as sequence,
    '-20°C' as storage,
    (stock > 0) as "inStock"
    -- REMOVED: (price > 100) as "isFeatured" -- This was overriding your real featured column
  FROM products 
  WHERE status = 'active'
  ORDER BY created_at DESC
`);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}