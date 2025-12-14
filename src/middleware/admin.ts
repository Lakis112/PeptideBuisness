import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function isAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) return false;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };
    
    // Check if user is admin in database
    const userResult = await pool.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [decoded.id]
    );
    
    return userResult.rows[0]?.is_admin === true;
  } catch {
    return false;
  }
}