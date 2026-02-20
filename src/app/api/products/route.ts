// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
  SELECT 
    p.id::text as id,
    p.name,
    p.sku as slug,
    p.price::float as price,
    p.old_price::float as original_price,
    p.description,
    c.name as category,
    c.name as subcategory,
    parent.name as maincategory,
    p.stock,
    p.product_status as "productStatus",
    p.status,
    p.created_at,
    p.updated_at,
    p.image_url as "imageUrl",
    p.featured,
    p.dosage,
    p.quantity,
    p.purity || '%' as purity,
    p.molecular_weight as "molecularWeight",
    p.cas as "casNumber",
    p.storage,
    (p.stock > 0) as "inStock"
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN categories parent ON c.parent_id = parent.id
  WHERE p.status = 'active'
  ORDER BY p.created_at DESC
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