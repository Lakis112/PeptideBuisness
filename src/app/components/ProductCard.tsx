'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, FlaskRound as Flask, CheckCircle, Beaker, TrendingUp } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { toast } from 'sonner';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  dosage?: string;
  quantity?: string;
  purity?: string;
  molecularWeight?: string;
  casNumber?: string;
  sequence?: string;
  inStock?: boolean;
  stock?: number;
  productStatus?: 'in_stock' | 'out_of_stock' | 'coming_soon';
  isFeatured?: boolean;
  imageUrl?: string;
}

export default function ProductCard({ 
  id,
  sku,
  name, 
  price, 
  original_price,
  description, 
  dosage = 'Research',
  quantity = '1 vial',
  purity = '99%',
  molecularWeight,
  casNumber,
  sequence,
  inStock,
  stock,
  productStatus,
  isFeatured = false,
  imageUrl
}: ProductCardProps) {
  const { addItem } = useCart();
  const hasDiscount = original_price && original_price > price;
  const discountPercent = hasDiscount 
    ? Math.round(((original_price - price) / original_price) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (productStatus === 'out_of_stock') {
      toast.error('Out of stock', {
        description: 'This product is currently unavailable.',
      });
      return;
    }
    
    if (productStatus === 'coming_soon') {
      toast.info('Coming soon', {
        description: 'This product will be available soon. Check back later!',
      });
      return;
    }
    
    addItem({ id, name, price, quantity: 1, imageUrl: imageUrl });
    toast.success('Added to cart', {
      description: `${name} has been added to your cart.`,
      icon: '🛒',
    });
  };

  // Determine stock status based on productStatus field only
  const getStockStatus = () => {
    // Check productStatus - this is the source of truth
    if (productStatus === 'coming_soon') {
      return {
        label: 'Coming Soon',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        dotColor: 'bg-amber-500',
        buttonDisabled: true,
        buttonText: 'Notify Me'
      };
    }
    
    if (productStatus === 'out_of_stock') {
      return {
        label: 'Out of Stock',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        dotColor: 'bg-red-500',
        buttonDisabled: true,
        buttonText: 'Out of Stock'
      };
    }
    
    // Default to in stock
    return {
      label: 'In Stock',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      dotColor: 'bg-emerald-500',
      buttonDisabled: false,
      buttonText: 'Add'
    };
  };

  const stockStatus = getStockStatus();

  return (
    <Link href={`/products/${sku}`} className="block">
      <motion.div
        className={`group relative bg-white rounded-xl border transition-all duration-300 overflow-hidden h-full flex flex-col ${
          isFeatured 
            ? 'border-blue-200 shadow-md hover:shadow-2xl hover:border-blue-300 ring-1 ring-blue-100' 
            : 'border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300'
        }`}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {/* Professional Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg shadow-lg">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-xs font-bold tracking-wide">BESTSELLER</span>
            </div>
          </div>
        )}

        {/* Subtle Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-red-600 text-white px-2.5 py-1 rounded-md shadow-sm">
              <span className="text-xs font-bold">-{discountPercent}%</span>
            </div>
          </div>
        )}

        {/* Product Image Section */}
        <div className="relative h-44 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.15) 1px, transparent 0)',
              backgroundSize: '16px 16px'
            }}></div>
          </div>

          {/* Product Image */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            {imageUrl ? (
              <img 
                src={imageUrl}
                alt={name}
                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-blue-100">
                <Beaker className="h-10 w-10 text-blue-600" />
              </div>
            )}
          </div>

          {/* Stock Badge with Color Coding */}
          <div className="absolute bottom-3 left-3">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${stockStatus.bgColor} ${stockStatus.textColor} ${stockStatus.borderColor} border`}>
              <div className={`w-1.5 h-1.5 rounded-full ${stockStatus.dotColor} ${productStatus === 'in_stock' && stock && stock > 0 ? 'animate-pulse' : ''}`}></div>
              {stockStatus.label}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-1">
          {/* Product Name */}
          <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>

          {/* Technical Specs Grid - Purity and CAS Number */}
          <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-gray-100">
            {/* Purity */}
            <div>
              <div className="text-xs text-gray-500 mb-1">Purity</div>
              <div className={`text-sm font-semibold ${
                parseFloat(purity.replace('%', '')) >= 99 ? 'text-emerald-600' : 'text-gray-900'
              }`}>
                {purity}
              </div>
            </div>
            
            {/* CAS Number */}
            {casNumber && (
              <div>
                <div className="text-xs text-gray-500 mb-1">CAS Number</div>
                <div className="text-sm text-gray-900">{casNumber}</div>
              </div>
            )}
          </div>

          {/* Price & CTA */}
          <div className="flex items-end justify-between mt-auto">
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-gray-900">
                  ${(price || 0).toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-500 line-through">
                    ${(original_price || 0).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <span>COA Included</span>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={stockStatus.buttonDisabled}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                !stockStatus.buttonDisabled
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">{stockStatus.buttonText}</span>
            </button>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-xl border-2 border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </motion.div>
    </Link>
  );
}
