'use client';

import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/lib/cart';
import Link from 'next/link';

export default function CartPage() {
  const { items, total, addItem, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <ShoppingCart className="h-24 w-24 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some research peptides to get started</p>
        <Link 
          href="/"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)} each</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => addItem(item)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="text-right">
                  <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 text-sm hover:text-red-800 flex items-center gap-1 mt-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Entire Cart
          </button>
        </div>
        
        {/* Order Summary */}
        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <Link 
  	   href="/checkout"
           className="block w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 mb-4 text-center"
           >
  		Proceed to Checkout
	  </Link>
          
          <p className="text-sm text-gray-500 text-center">
            *For research purposes only
          </p>
        </div>
      </div>
    </div>
  );
}