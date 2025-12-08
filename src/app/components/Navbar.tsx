'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '@/lib/cart';

export default function Navbar() {
  const { items } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search results page or filter on homepage
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 bg-white border-b z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">PS</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold leading-tight">
                Peptide<span className="text-blue-600">Science</span>
              </h1>
              <p className="text-xs text-gray-500">Research Compounds</p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search peptides (e.g., 'Tirzepatide', 'BPC-157')..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Navigation & Cart */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <Link href="/products" className="text-sm font-medium hover:text-blue-600">
                All Products
              </Link>
              <Link href="/research" className="text-sm font-medium hover:text-blue-600">
                Research
              </Link>
              <Link href="/protocols" className="text-sm font-medium hover:text-blue-600">
                Protocols
              </Link>
            </div>
            
            <Link 
              href="/cart"
              className="relative flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            <button className="md:hidden p-2 hover:bg-gray-100 rounded">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search peptides..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </form>
      </div>
    </header>
  );
}