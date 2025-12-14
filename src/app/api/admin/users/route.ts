import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/middleware/admin';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const users = await pool.query(`
      SELECT id, email, first_name, last_name, organization, 
             is_admin, status, created_at, last_login
      FROM users 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      users: users.rows
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}