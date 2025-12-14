import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ isAdmin: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    
    const userResult = await pool.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [decoded.id]
    );

    return NextResponse.json({ 
      isAdmin: userResult.rows[0]?.is_admin === true 
    });

  } catch (error) {
    return NextResponse.json({ isAdmin: false });
  }
}