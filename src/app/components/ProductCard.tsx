'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, FlaskRound as Flask, CheckCircle, Award, BarChart3, FileText } from 'lucide-react';
import { useCart } from '@/lib/cart';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  dosage: string;
  quantity: string;
  purity: string;
  molecularWeight?: string;
  casNumber?: string;
  sequence?: string;
  inStock: boolean;
  isFeatured?: boolean;
}

export default function ProductCard({ 
  id,
  name, 
  price, 
  originalPrice,
  description, 
  dosage,
  quantity,
  purity,
  molecularWeight,
  casNumber,
  sequence,
  inStock,
  isFeatured = false
}: ProductCardProps) {
  const { addItem } = useCart();
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    addItem({ id, name, price });
    alert(`Added ${name} to cart!`);
  };

  // Calculate purity color based on percentage
  const getPurityColor = (purity: string) => {
    const percent = parseFloat(purity.replace('%', ''));
    if (percent >= 99) return 'from-emerald-500 to-green-400';
    if (percent >= 98) return 'from-cyan-500 to-blue-400';
    return 'from-amber-500 to-orange-400';
  };

  return (
    <motion.div
      className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-r from-[#FF6BCB] to-[#9575CD] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Award className="h-3 w-3" />
            FEATURED
          </div>
        </div>
      )}

      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -{discountPercent}%
          </div>
        </div>
      )}

      {/* Product Header with Gradient */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
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

        {/* Product Icon/Image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-inner flex items-center justify-center border border-gray-100">
              <Flask className="h-12 w-12 text-gradient bg-gradient-to-r from-[#FF6BCB] to-[#4FC3F7] bg-clip-text text-transparent" />
            </div>
            
          </div>
        </div>

        {/* Stock Status */}
        <div className={`absolute bottom-4 left-4 flex items-center gap-1.5 ${inStock ? 'text-emerald-600' : 'text-amber-600'}`}>
          <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
          <span className="text-xs font-medium">
            {inStock ? 'In Stock • Ships in 24h' : 'Pre-order • 3-5 days'}
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-6">
        {/* Category & Dosage */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {dosage}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <BarChart3 className="h-3 w-3" />
            <span>Research Grade</span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#9575CD] transition-colors">
          {name}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-gray-600 mb-5 line-clamp-2">
          {description}
        </p>

        {/* Technical Specifications Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Purity - Highlighted */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">Purity</div>
            <div className={`text-sm font-bold bg-gradient-to-r ${getPurityColor(purity)} bg-clip-text text-transparent`}>
              {purity}
            </div>
          </div>

          {/* Molecular Weight */}
          {molecularWeight && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Mol. Weight</div>
              <div className="text-sm font-bold text-gray-900">
                {molecularWeight}
              </div>
            </div>
          )}

          {/* CAS Number */}
          {casNumber && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 border border-gray-100">
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
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ${price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  ${originalPrice?.toFixed(2)}
                </span>
              )}
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
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700' 
                : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            {inStock ? 'Add to Cart' : 'Notify When Available'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}