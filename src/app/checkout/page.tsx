'use client';

import { CreditCard, Lock } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }

    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      alert('Payment successful! Order confirmation sent to ' + email);
      clearCart();
      router.push('/order-success');
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4">No items in cart</h2>
        <button 
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Lock className="h-8 w-8 text-green-600" />
        Secure Checkout
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left - Order Info */}
        <div>
          <h2 className="text-xl font-bold mb-6">Order Details</h2>
          
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <h3 className="font-bold text-yellow-800 mb-2">⚠️ Important</h3>
            <p className="text-sm text-yellow-700">
              All products are for research purposes only. 
              Not for human consumption. By proceeding, you confirm 
              you are 18+ and understand these are research chemicals.
            </p>
          </div>
        </div>
        
        {/* Right - Payment Form */}
        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-3"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between mb-2">
                <span>Payment Method</span>
                <span className="font-bold">Credit Card</span>
              </div>
              <p className="text-sm text-gray-600">
                Test payment - No real charge. Enter any dummy card details.
              </p>
            </div>
            
            {/* Dummy Card Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3"
                  placeholder="4242 4242 4242 4242"
                  defaultValue="4242 4242 4242 4242"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3"
                    placeholder="12/34"
                    defaultValue="12/34"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVC</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3"
                    placeholder="123"
                    defaultValue="123"
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
            
            <p className="text-center text-sm text-gray-500">
              🔒 Secure encrypted payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}