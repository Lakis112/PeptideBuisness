// src/app/api/products/[slug]/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

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
        p.purity,
        p.molecular_weight as "molecularWeight",
        p.halflife,
        p.cas,
        p.synonym,
        p.storage,
        p.coa,
        p.chemical_formula,
        (p.stock > 0) as "inStock"
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN categories parent ON c.parent_id = parent.id
      WHERE p.sku = $1 AND p.status = 'active'
    `, [slug]);

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