import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    const startTime = Date.now();
    
    try {
        // Test the database connection using the pool
        const result = await pool.query('SELECT NOW() as time, version() as version');
        
        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            responseTime: `${Date.now() - startTime}ms`,
            database: {
                connected: true,
                time: result.rows[0].time,
                version: result.rows[0].version
            },
            environment: process.env.NODE_ENV
        });
        
    } catch (error: any) {
        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            responseTime: `${Date.now() - startTime}ms`,
            database: {
                connected: false,
                error: error.message,
                errorCode: error.code,
                errorDetail: error.detail
            },
            environment: process.env.NODE_ENV
        }, { status: 500 });
    }
}