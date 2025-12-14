import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };
    
    const userResult = await pool.query(
      `SELECT id, email, first_name, last_name, organization, is_admin
       FROM users 
       WHERE id = $1`,
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ user: null });
    }

    const user = userResult.rows[0];
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        organization: user.organization,
        isAdmin: user.is_admin
      }
    });

  } catch (error) {
    return NextResponse.json({ user: null });
  }
}