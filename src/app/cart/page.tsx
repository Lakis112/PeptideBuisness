'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Shield, Truck, Lock, AlertCircle } from 'lucide-react';
import { useCart } from '@/lib/cart';
import Link from 'next/link';

export default function CartPage() {
  const { items, total, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <ShoppingCart className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your research cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="relative mb-8">
          <ShoppingCart className="h-28 w-28 text-gray-300" />
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full blur-xl opacity-50"></div>
        </div>
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Your Research Cart is Empty
        </h2>
        <p className="text-gray-600 mb-8 text-lg max-w-md text-center">
          Begin your scientific inquiry with our pharmaceutical-grade peptides
        </p>
        <Link 
          href="/products"
          className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-blue-800 hover:to-indigo-900 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
        >
          <span>Browse GMP Catalog</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Research Cart
          </h1>
          <p className="text-gray-600 text-lg">
            Review your selected pharmaceutical-grade peptides
          </p>
        </div>

        {/* Guest Warning */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-yellow-800 text-lg mb-1">Guest Research Session</p>
                <p className="text-yellow-700 mb-3">
                  Your cart is saved locally to this device. 
                  <Link href="/login" className="font-semibold ml-1 hover:underline text-yellow-900">
                    Login or create a research account
                  </Link> 
                  {' '}to save your cart across devices and access order history.
                </p>
                <div className="flex gap-4 mt-4">
                  <Link 
                    href="/login"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all"
                  >
                    Login to Account
                  </Link>
                  <Link 
                    href="/register"
                    className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-5 py-2.5 rounded-lg font-medium hover:from-gray-900 hover:to-black transition-all"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="group bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image Placeholder */}
                <div className="relative w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center border border-gray-200 group-hover:border-blue-300 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-xl"></div>
                  <svg className="w-14 h-14 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    GMP
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm">Pharmaceutical Grade • HPLC Verified ≥99%</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded-lg transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4 text-gray-700" />
                        </button>
                        <span className="font-bold text-gray-900 w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded-lg transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4 text-gray-700" />
                        </button>
                      </div>
                      
                      <div className="text-gray-600">
                      <span className="font-medium">${(item.price || 0).toFixed(2)}</span>
  <span className="text-sm"> / unit</span>
</div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
  ${((item.price || 0) * item.quantity).toFixed(2)}
</div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove from study
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end pt-4">
              <button 
                onClick={clearCart}
                className="flex items-center gap-2 px-6 py-3 text-red-600 hover:text-red-800 font-medium hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Clear Entire Research Cart
              </button>
            </div>
          </div>

          {/* Order Summary - Right Column (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b">
                  Study Summary
                </h2>
                
                <div className="space-y-6 mb-8">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">EU GMP Compliance</span>
                    <span className="text-green-600 font-semibold">Included</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Analytical Documentation</span>
                    <span className="text-green-600 font-semibold">Included</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-t border-gray-200 pt-4">
                    <span className="text-gray-600">Priority Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">Total</span>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</div>
                        <p className="text-sm text-gray-500 text-right">VAT calculated at checkout</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mb-8">
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-xs text-gray-600">GMP Grade</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                        <Lock className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-xs text-gray-600">Secure</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                        <Truck className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="text-xs text-gray-600">Fast Shipping</span>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500">
                      🔒 256-bit SSL encrypted checkout
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                {isAuthenticated ? (
                  <Link 
                    href="/checkout"
                    className="block w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 text-center mb-6"
                  >
                    Proceed to Secure Checkout
                  </Link>
                ) : (
                  <div className="space-y-4 mb-6">
                    <Link 
                      href="/checkout"
                      className="block w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 text-center"
                    >
                      Checkout as Guest
                    </Link>
                    <Link
                      href="/login"
                      className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all text-center"
                    >
                      Login for Faster Checkout
                    </Link>
                  </div>
                )}

                {/* Continue Shopping */}
                <div className="text-center">
                  <Link 
                    href="/products"
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Continue Research Selection
                  </Link>
                </div>

                {/* Legal Disclaimer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    *All products are for research use only in laboratory settings. 
                    Not for human or veterinary diagnostic or therapeutic use. 
                    By proceeding, you confirm you are a qualified researcher 
                    and agree to our Terms of Service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}