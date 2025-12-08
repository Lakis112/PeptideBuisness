import { CheckCircle, Package, Mail } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
      <div className="max-w-md text-center">
        <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold mb-4">Order Confirmed! 🎉</h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for your order. Your research peptides will be processed 
          and shipped within 24 hours.
        </p>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <Package className="h-5 w-5 text-blue-600" />
            <div className="text-left">
              <div className="font-bold">Cold-shipped peptides</div>
              <div className="text-sm text-gray-600">Temperature-controlled packaging</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Mail className="h-5 w-5 text-green-600" />
            <div className="text-left">
              <div className="font-bold">Order confirmation sent</div>
              <div className="text-sm text-gray-600">Check your email for details</div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <h3 className="font-bold text-yellow-800 mb-2">📋 Research Protocol Included</h3>
          <p className="text-sm text-yellow-700">
            Your order includes detailed research protocols and storage instructions.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
          <Link 
            href="/research"
            className="border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50"
          >
            View Research
          </Link>
        </div>
        
        <p className="mt-8 text-sm text-gray-500">
          For research purposes only. Not for human consumption.
        </p>
      </div>
    </div>
  );
}