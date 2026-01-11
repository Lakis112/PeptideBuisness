// app/api/categories/hierarchy/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      WITH RECURSIVE category_tree AS (
        -- Main categories
        SELECT 
          id, 
          name, 
          parent_id,
          name as path,
          1 as level
        FROM categories 
        WHERE parent_id IS NULL
        
        UNION ALL
        
        -- Subcategories
        SELECT 
          c.id, 
          c.name, 
          c.parent_id,
          ct.path || ' > ' || c.name as path,
          ct.level + 1 as level
        FROM categories c
        INNER JOIN category_tree ct ON c.parent_id = ct.id
      )
      SELECT 
        ct.*,
        COALESCE(
          (SELECT COUNT(*) FROM products p WHERE p.category_id = ct.id),
          0
        ) as product_count
      FROM category_tree ct
      ORDER BY 
        CASE 
          WHEN ct.name = 'Peptides' THEN 1
          WHEN ct.name = 'AAS' THEN 2
          WHEN ct.name = 'Non Peptide Products' THEN 3
          WHEN ct.name = 'Ancillaries' THEN 4
          ELSE 5
        END,
        ct.level,
        ct.name
    `);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching category hierarchy:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}