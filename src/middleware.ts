import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;
    
    // Public paths - FIXED LOGIC
    const isPublicPath = pathname === '/' || 
                         pathname === '/login' || 
                         pathname === '/register' ||
                         pathname.startsWith('/login/') ||
                         pathname.startsWith('/register/');
    
    console.log('=== MIDDLEWARE ===');
    console.log('Path:', pathname);
    console.log('Has auth_token cookie:', !!token);
    console.log('Cookie value (first 10 chars):', token?.substring(0, 10) + '...');
    console.log('Is public path?', isPublicPath);
    
    // If trying to access dashboard without token
    if (!token && pathname.startsWith('/dashboard')) {
        console.log('❌ No token, redirecting to login');
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // If already logged in and trying to access login/register
    if (token && isPublicPath) {
        console.log('✅ Has token, redirecting to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    console.log('✅ Allowing request through');
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};