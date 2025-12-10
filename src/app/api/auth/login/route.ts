import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        
        console.log('🔑 Login attempt for:', email);
        
        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }
        
        // Check if user exists
        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (userResult.rows.length === 0) {
            console.log('❌ User not found:', email);
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }
        
        const user = userResult.rows[0];
        console.log('✅ User found:', user.email);
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        console.log('🔐 Password match:', isMatch);
        
        if (!isMatch) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }
        
        // Update last login
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );
        
        // Create JWT token
        const { password_hash, ...userWithoutPassword } = user;
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        
       // AFTER creating the JWT token, create response:

        console.log('🎫 Setting cookie with token...');

        // METHOD 1: Using the new cookies.set() method (Next.js 14+)
        const response = NextResponse.json({
            success: true,
            user: userWithoutPassword,
            message: 'Login successful'
        });

        // Set cookie - THIS IS THE CRITICAL FIX
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        console.log('🍪 Cookie should be set. Check headers:');
        console.log('Set-Cookie header:', response.headers.get('Set-Cookie'));

        return response;
        
    } catch (error: any) {
        console.error('❌ Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}