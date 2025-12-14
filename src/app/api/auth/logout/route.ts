import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });

  // Clear auth cookie
  response.cookies.delete('auth_token');
  
  // Also clear guest cart cookie (optional)
  response.cookies.delete('guest_cart');
  
  return response;
}