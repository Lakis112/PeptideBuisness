'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Shield, Truck, Lock, AlertCircle, Tag, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '@/lib/cart';
import Link from 'next/link';

export default function CartPage() {
  const { items, total, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  
  // Shipping fee
  const shippingFee = 50;
  const subtotal = total;
  const discount = appliedDiscount;
  const cartTotal = subtotal - discount + shippingFee;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      setIsAuthenticated(!!data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyDiscount = () => {
    // Simple discount logic - you can replace with API call
    if (discountCode.toUpperCase() === 'SAVE10') {
      setAppliedDiscount(total * 0.1);
    } else if (discountCode.toUpperCase() === 'SAVE20') {
      setAppliedDiscount(total * 0.2);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingCart className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="relative mb-8">
          <ShoppingCart className="h-28 w-28 text-gray-300" />
          <div className="absolute -inset-4 bg-blue-50 rounded-full blur-xl opacity-50"></div>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          Your Cart is Empty
        </h2>
        <p className="text-gray-600 mb-8 text-lg max-w-md text-center">
          Begin your research with our pharmaceutical-grade products
        </p>
        <Link 
          href="/products"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg"
        >
          Browse Products
          <ArrowLeft className="h-5 w-5 rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li><Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">Shopping Cart</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        {/* Guest Warning */}
        {!isAuthenticated && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-amber-800">
                  <Link href="/login" className="font-semibold hover:underline">Login</Link> or <Link href="/register" className="font-semibold hover:underline">create an account</Link> to save your cart and access order history.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Product Image - FIXED */}
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-200 p-2">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-10 w-10 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500">Pharmaceutical Grade • HPLC Verified ≥99%</p>
                        
                        {/* Stock Status */}
                        <div className="flex items-center gap-2 mt-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm text-emerald-600 font-medium">In Stock</span>
                        </div>
                      </div>
                      
                      {/* Remove Button */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 -mr-2"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-white rounded transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4 text-gray-700" />
                        </button>
                        <span className="font-semibold text-gray-900 w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded transition-colors"
                        >
                          <Plus className="h-4 w-4 text-gray-700" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          ${((item.price || 0) * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${(item.price || 0).toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mt-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Summary Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Discount Code */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Discount Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={applyDiscount}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedDiscount > 0 && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Discount applied!
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">-${appliedDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">${shippingFee.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500">Estimated delivery: 2-3 business days</p>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</div>
                    <p className="text-xs text-gray-500">VAT calculated at checkout</p>
                  </div>
                </div>

                {/* Checkout Buttons */}
                {isAuthenticated ? (
                  <Link 
                    href="/checkout"
                    className="block w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-green-700 transition-colors mb-3"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/checkout"
                      className="block w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-green-700 transition-colors mb-3"
                    >
                      Checkout as Guest
                    </Link>
                    <Link
                      href="/login"
                      className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-blue-700 transition-colors"
                    >
                      Login for Faster Checkout
                    </Link>
                  </>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <Shield className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">GMP Grade</span>
                  </div>
                  <div className="text-center">
                    <Lock className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Secure</span>
                  </div>
                  <div className="text-center">
                    <Truck className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">Fast Shipping</span>
                  </div>
                </div>

                {/* Legal */}
                <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
                  *For research use only. Not for human or veterinary use.
                </p>
              </div>

              {/* Clear Cart */}
              <button 
                onClick={clearCart}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-medium transition-colors border border-red-200"
              >
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
