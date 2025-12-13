// app/order-success/page.tsx
'use client';

import { CheckCircle, Download, Mail, Home } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // In a real app, you might fetch order details here
    const storedEmail = localStorage.getItem('lastOrderEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 text-lg">
              Thank you for your research materials order
            </p>
            
            {orderNumber && (
              <div className="mt-6 inline-block bg-blue-50 border border-blue-200 rounded-xl px-6 py-3">
                <span className="text-gray-700">Order Number:</span>
                <span className="ml-2 font-bold text-blue-700 text-xl">{orderNumber}</span>
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="space-y-8 mb-10">
            <div className="border border-gray-200 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What happens next?</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Order Processing</h3>
                    <p className="text-gray-600">
                      Our lab team is preparing your materials with GMP-grade quality control.
                      You'll receive a tracking number within 24-48 hours.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Documentation & Certificates</h3>
                    <p className="text-gray-600">
                      GMP documentation, Certificates of Analysis, and research protocols will be 
                      emailed to {email || 'your registered email address'}.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-purple-600">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Scientific Support</h3>
                    <p className="text-gray-600">
                      Need assistance with your research protocol? Contact our scientific support team.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Support */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-bold text-xl text-blue-900 mb-4">Need immediate assistance?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <a 
                  href="mailto:support@mmn-pharma.com" 
                  className="flex items-center gap-3 text-blue-700 hover:text-blue-900 p-4 bg-white rounded-xl border border-blue-100 transition-all hover:shadow-md"
                >
                  <Mail className="h-5 w-5" />
                  <div>
                    <div className="font-semibold">Email Support</div>
                    <div className="text-sm">support@mmn-pharma.com</div>
                  </div>
                </a>
                <a 
                  href="tel:+1234567890" 
                  className="flex items-center gap-3 text-blue-700 hover:text-blue-900 p-4 bg-white rounded-xl border border-blue-100 transition-all hover:shadow-md"
                >
                  <div className="h-5 w-5 text-center">📞</div>
                  <div>
                    <div className="font-semibold">Phone Support</div>
                    <div className="text-sm">+1 (234) 567-890</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/"
              className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:border-gray-400 transition"
            >
              <Home className="h-5 w-5" />
              Return to Home
            </Link>
            
            <button
              onClick={() => alert('In a real app, this would download order confirmation')}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-800 hover:to-indigo-900 transition-all shadow-xl hover:shadow-2xl"
            >
              <Download className="h-5 w-5" />
              Download Order Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}