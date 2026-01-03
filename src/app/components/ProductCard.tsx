'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, FlaskRound as Flask, CheckCircle, Award, BarChart3, FileText, Zap, Star } from 'lucide-react';
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
  inStock = true,
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
    addItem({ id, name, price, quantity: 1, imageUrl: imageUrl });
    toast.success('Added to cart', {
      description: `${name} has been added to your cart.`,
      icon: '🛒',
    });
  };

  const getPurityColor = (purity: string) => {
    if (!purity) return 'from-amber-500 to-orange-400';
    const percent = parseFloat(purity.replace('%', '').replace(/[^0-9.]/g, ''));
    if (isNaN(percent)) return 'from-amber-500 to-orange-400';
    if (percent >= 99) return 'from-emerald-500 to-green-400';
    if (percent >= 98) return 'from-cyan-500 to-blue-400';
    return 'from-amber-500 to-orange-400';
  };

  return (
    <Link href={`/products/${sku}`} className="block cursor-pointer">
      <motion.div
        className={`group relative ${
          isFeatured 
            ? 'bg-gradient-to-br from-white to-[#FCF4FF] rounded-3xl shadow-xl hover:shadow-2xl ring-2 ring-[#FF6BCB]/20 ring-offset-2' 
            : 'bg-white rounded-2xl shadow-sm hover:shadow-xl'
        } border border-gray-200 transition-all duration-500 overflow-hidden`}
        whileHover={{ y: -6, scale: isFeatured ? 1.02 : 1.01 }}
        transition={{ duration: 0.3 }}
      >
        {/* Featured Badge */}
        {isFeatured && (
          <>
            {/* Glowing background effect */}
            <div className="absolute -top-4 -right-4 z-0">
              <div className="w-32 h-32 bg-gradient-to-r from-[#FF6BCB]/30 to-[#9575CD]/30 rounded-full blur-2xl"></div>
            </div>
            
            {/* Main featured badge */}
            <div className="absolute top-4 left-4 z-20">
              <div className="relative">
                {/* Animated border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6BCB] via-[#9575CD] to-[#FF6BCB] rounded-full blur-sm opacity-75 animate-pulse"></div>
                {/* Badge content */}
                <div className="relative bg-gradient-to-r from-[#FF6BCB] to-[#9575CD] text-white px-4 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-300 text-yellow-300 animate-pulse" />
                    <span className="text-white">FEATURED</span>
                    <Zap className="h-3 w-3 animate-bounce" />
                  </div>
                </div>
              </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#FF6BCB]/10 to-transparent rotate-45"></div>
            </div>
          </>
        )}

{/* Discount Badge - Position based on featured status */}
{hasDiscount && (
  <div className={`absolute ${isFeatured ? 'bottom-4 left-4' : 'top-4 right-4'} z-10`}>
    <div className="relative">
      {/* Glowing effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-lg blur-sm opacity-70 animate-pulse"></div>
      {/* Ribbon shape */}
      <div className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2.5 rounded-lg shadow-2xl">
        <div className="flex items-center justify-center gap-1.5">
          <div className="font-bold text-sm tracking-wide">SAVE {discountPercent}%</div>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </div>
        {/* Ribbon tail */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-600"></div>
      </div>
    </div>
  </div>
)}

        {/* Product Header */}
        <div className={`relative h-48 ${
          isFeatured 
            ? 'bg-gradient-to-br from-[#FFF0F7] via-white to-[#F3E5F5]' 
            : 'bg-gradient-to-br from-gray-50 to-gray-100'
        } overflow-hidden`}>
          {/* Scientific Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-16 h-16 border border-gray-300 rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border border-gray-300 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-gray-400 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Featured pattern overlay */}
          {isFeatured && (
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#FF6BCB]/5 to-transparent rounded-full"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#9575CD]/5 to-transparent rounded-full"></div>
            </div>
          )}

          {/* Product Image */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            {imageUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={imageUrl}
                  alt={name}
                  className={`max-w-full max-h-full object-contain rounded-lg ${
                    isFeatured ? 'drop-shadow-lg' : ''
                  }`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="relative">
                <div className={`w-24 h-24 rounded-2xl ${
                  isFeatured 
                    ? 'bg-gradient-to-br from-white to-[#FFF0F7] shadow-lg border-2 border-[#FFCCE1]' 
                    : 'bg-gradient-to-br from-white to-gray-50 shadow-inner border border-gray-100'
                } flex items-center justify-center`}>
                  <Flask className={`h-12 w-12 ${
                    isFeatured 
                      ? 'text-gradient bg-gradient-to-r from-[#FF6BCB] to-[#9575CD] bg-clip-text text-transparent' 
                      : 'text-gradient bg-gradient-to-r from-[#FF6BCB] to-[#4FC3F7] bg-clip-text text-transparent'
                  }`} />
                </div>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className={`absolute bottom-4 left-4 flex items-center gap-1.5 ${
            inStock ? 'text-emerald-600' : 'text-amber-600'
          } ${isFeatured ? 'bg-white/90 px-3 py-1.5 rounded-full shadow-sm' : ''}`}>
            <div className={`w-2 h-2 rounded-full ${
              inStock ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}></div>
            <span className="text-xs font-medium">
              {inStock ? 'In Stock' : 'Pre-order • 3-5 days'}
            </span>
          </div>
        </div>

        {/* Product Content */}
        <div className={`p-6 ${isFeatured ? 'pt-8' : ''}`}>
          {/* Category & Dosage */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              HPLC Tested Product
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <BarChart3 className="h-3 w-3" />
              <span>Pharma Grade</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className={`text-xl font-bold mb-2 group-hover:text-[#9575CD] transition-colors ${
            isFeatured ? 'text-gray-900' : 'text-gray-900'
          }`}>
            {name}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {description}
          </p>

         

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Purity */}
            <div className={`rounded-xl p-3 border ${
              isFeatured ? 'bg-white border-[#FFCCE1]' : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
            }`}>
              <div className="text-xs text-gray-500 mb-1">Purity</div>
              <div className={`text-sm font-bold bg-gradient-to-r ${getPurityColor(purity)} bg-clip-text text-transparent`}>
                {purity}
              </div>
            </div>

            {/* Molecular Weight */}
            {molecularWeight && (
              <div className={`rounded-xl p-3 border ${
                isFeatured ? 'bg-white border-[#FFCCE1]' : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
              }`}>
                <div className="text-xs text-gray-500 mb-1">Mol. Weight</div>
                <div className="text-sm font-bold text-gray-900">
                  {molecularWeight}
                </div>
              </div>
            )}

            {/* CAS Number */}
            {casNumber && (
              <div className={`rounded-xl p-3 border ${
                isFeatured ? 'bg-white border-[#FFCCE1]' : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
              }`}>
                <div className="text-xs text-gray-500 mb-1">CAS</div>
                <div className="text-sm font-mono text-gray-900">
                  {casNumber}
                </div>
              </div>
            )}
          </div>

          {/* Sequence Preview */}
          {sequence && (
            <div className="mb-6">
              <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Sequence
              </div>
              <div className="font-mono text-xs bg-gray-50 rounded-lg p-3 text-gray-700 overflow-x-auto">
                {sequence.length > 30 ? `${sequence.substring(0, 30)}...` : sequence}
              </div>
            </div>
          )}

          {/* Price & Action */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <div className="flex items-baseline gap-3">
  <div className="flex flex-col">
    <span className={`${
      isFeatured ? 'text-3xl' : 'text-2xl'
    } font-bold text-gray-900`}>
      ${(price || 0).toFixed(2)}
    </span>
    {hasDiscount && (
      <div className="flex items-center gap-2 mt-1">
        <span className="text-sm text-gray-500 line-through">
          ${(original_price || 0).toFixed(2)}
        </span>
        <span className="px-2 py-0.5 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 text-xs font-bold rounded-full">
          Save ${((original_price || 0) - price).toFixed(2)}
        </span>
      </div>
    )}
  </div>
</div>
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                Includes Certificate of Analysis
              </div>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg ${
                inStock 
                  ? `${
                      isFeatured 
                        ? 'bg-gradient-to-r from-[#FF6BCB] to-[#9575CD] text-white hover:from-[#FF5CBA] hover:to-[#8565BD]' 
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700'
                    }` 
                  : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              {inStock ? 'Add to Cart' : 'Notify When Available'}
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}