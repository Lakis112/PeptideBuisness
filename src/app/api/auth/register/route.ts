import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { email, password, firstName, lastName, organization } = await request.json();
        
        console.log('Registration attempt for:', email);
        
        // Validation
        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }
        
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }
        
        // Check if user exists
        const userCheck = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (userCheck.rows.length > 0) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            );
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        // Create user
        const newUser = await pool.query(
            `INSERT INTO users (email, password_hash, first_name, last_name, organization, status) 
             VALUES ($1, $2, $3, $4, $5, 'active') 
             RETURNING id, email, first_name, last_name, organization, created_at`,
            [email, passwordHash, firstName, lastName, organization || '']
        );
        
        // Create JWT token
        const token = jwt.sign(
            { 
                id: newUser.rows[0].id, 
                email: newUser.rows[0].email 
            },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        
        // Set HTTP-only cookie
        const response = NextResponse.json({
            success: true,
            user: newUser.rows[0],
            message: 'Account created successfully'
        });
        
        response.cookies.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: false, // FALSE for localhost
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
});
        
        return response;
        
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}