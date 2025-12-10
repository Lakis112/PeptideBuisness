import { NextResponse } from 'next/server';

export async function GET() {
    console.log('🧪 Testing cookie setting...');
    
    const response = NextResponse.json({ 
        message: 'Cookie test successful',
        timestamp: new Date().toISOString()
    });
    
    // Set a simple test cookie
    response.cookies.set({
        name: 'test_cookie',
        value: 'hello_world_' + Date.now(),
        httpOnly: false, // Make it visible in browser
        secure: false,
        sameSite: 'lax',
        path: '/'
    });
    
    console.log('Cookie headers:', response.headers.get('Set-Cookie'));
    
    return response;
}