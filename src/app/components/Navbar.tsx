'use client';  // ADD THIS AT TOP

import { useCart } from '@/lib/cart';  // ADD THIS
import Link from 'next/link';

export default function Navbar() {
  const { items } = useCart();  // ADD THIS
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 bg-white border-b px-8 py-4 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold">
          Peptide<span className="text-blue-600">Science</span>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex gap-8">
          <a href="#" className="hover:text-blue-600 font-medium">Products</a>
          <a href="#" className="hover:text-blue-600 font-medium">Research</a>
          <a href="#" className="hover:text-blue-600 font-medium">Protocols</a>
          <a href="#" className="hover:text-blue-600 font-medium">Blog</a>
          <a href="#" className="hover:text-blue-600 font-medium">Contact</a>
        </div>
        
        {/* Cart Button */}
        <Link 
  href="/cart"
  className="relative bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
>
  Cart
  {itemCount > 0 && (
    <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
      {itemCount}
    </span>
  )}
</Link>
      </div>
    </nav>
  );
}