import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import pool from '@/lib/db'; // Your PostgreSQL connection

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 1. Validate required fields
    const { name, email, organization, inquiryType, message } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    
    // 2. Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // 3. Get client info for logging
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // 4. Store in database (optional but recommended)
    try {
      await pool.query(
        `INSERT INTO contact_submissions 
         (name, email, organization, inquiry_type, message, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [name, email, organization || '', inquiryType || 'general', message, ip, userAgent]
      );
    } catch (dbError) {
      console.log('Database logging failed, continuing with email:', dbError);
      // Continue even if database fails
    }
    
    // 5. Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM!,
      to: [process.env.CONTACT_EMAIL_TO!],
      subject: `New Contact Form: ${inquiryType || 'General Inquiry'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>New Contact Form Submission</h2>
          <hr>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Organization:</strong> ${organization || 'Not provided'}</p>
          <p><strong>Inquiry Type:</strong> ${inquiryType || 'General'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <hr>
          <p><small>IP: ${ip} • Submitted at: ${new Date().toLocaleString()}</small></p>
        </div>
      `,
      text: `
        New Contact Form Submission
        ============================
        Name: ${name}
        Email: ${email}
        Organization: ${organization || 'Not provided'}
        Inquiry Type: ${inquiryType || 'General'}
        
        Message:
        ${message}
        
        ---
        IP: ${ip}
        Submitted at: ${new Date().toLocaleString()}
      `,
    });
    
    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
    
    // 6. Return success
    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact form submitted successfully',
        emailId: data?.id 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}