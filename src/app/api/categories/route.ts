import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // Your existing connection

// In /app/api/categories/route.ts - Add console.log
export async function GET() {
  try {
    // In /app/api/categories/route.ts
const result = await pool.query(`
  SELECT id, name, parent_id 
  FROM categories 
  ORDER BY 
    CASE 
      WHEN name = 'Peptides' THEN 1
      WHEN name = 'AAS' THEN 2
      WHEN name = 'Non Peptide Products' THEN 3
      WHEN name = 'Ancillaries' THEN 4
      ELSE 5
    END,
    CASE WHEN parent_id IS NULL THEN 0 ELSE 1 END,
    name
`);
    
    console.log('API returning categories:', result.rows);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}