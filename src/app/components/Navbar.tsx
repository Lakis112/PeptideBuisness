'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/cart';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu'; // <-- ADD THIS IMPORT

export default function Navbar() {
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center mr-auto pr-8">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Logo Container */}
              <div className="w-20 h-20 shrink-0">
                <img 
                  src="/logo.jpg" 
                  alt="MMN Pharmaceuticals" 
                  className="h-full w-full object-contain p-1.5"
                />
              </div>
              
              {/* Brand Name */}
              <div className="hidden sm:block">
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold leading-tight whitespace-nowrap">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9575CD] via-[#9575CD] to-[#4FC3F7]">
                      MMN Pharmaceuticals
                    </span>
                  </h1>
                  <p className="text-xs text-gray-600 font-medium tracking-wide">
                    Pharma Grade
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              href="/" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Home
            </Link>
            
            {/* Products Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Products
                <ChevronDown className={`w-4 h-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isProductsOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  <Link 
                    href="/products" 
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsProductsOpen(false)}
                  >
                    <div className="font-medium">All Products</div>
                    <div className="text-xs text-gray-500 mt-1">Complete pharmaceutical catalog</div>
                  </Link>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link 
                    href="/products?category=Weight+Loss" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsProductsOpen(false)}
                  >
                    GLP-1 Analogs
                  </Link>
                  <Link 
                    href="/products?category=Recovery" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsProductsOpen(false)}
                  >
                    Therapeutic Peptides
                  </Link>
                  <Link 
                    href="/products?category=Growth+Hormone" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsProductsOpen(false)}
                  >
                    Research Compounds
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/quality" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Quality
            </Link>
            
            <Link 
              href="/research" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Research
            </Link>
            
            <Link 
              href="/contact" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Section: Search, User, Cart */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <SearchBar variant="navbar" placeholder="Search peptides..." />
            
            {/* User Menu */}
            <div className="hidden lg:block">
              <UserMenu />
            </div>
            
            {/* Cart Button */}
            <Link 
              href="/cart"
              className="relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all group"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link 
                href="/products" 
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              
              <Link 
                href="/quality" 
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Quality
              </Link>
              
              <Link 
                href="/research" 
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Research
              </Link>
              
              <Link 
                href="/contact" 
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile User Menu & Auth */}
              <div className="px-4 pt-2 border-t border-gray-100">
                <div className="lg:hidden">
                  <UserMenu />
                </div>
              </div>
              
              {/* Mobile Search */}
              <div className="px-4 pt-2">
                <SearchBar variant="navbar" placeholder="Search products..." />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}