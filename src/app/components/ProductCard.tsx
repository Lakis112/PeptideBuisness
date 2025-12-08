'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Tag } from 'lucide-react';
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
  inStock: boolean;
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
  inStock 
}: ProductCardProps) {
  const { addItem } = useCart();
  const hasDiscount = originalPrice && originalPrice > price;

  const handleAddToCart = () => {
    addItem({ id, name, price });
    alert(`Added ${name} to cart!`);
  };

  return (
    <motion.div
      className="border rounded-2xl p-5 hover:shadow-xl transition-shadow cursor-pointer bg-white relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
          <Tag className="h-3 w-3" />
          SAVE ${(originalPrice! - price).toFixed(0)}
        </div>
      )}

      {/* Product Icon */}
      <div className="h-40 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl mb-4 flex items-center justify-center">
        <div className="text-5xl">🧪</div>
      </div>

      {/* Category & Dosage */}
      <div className="text-xs text-blue-600 font-medium mb-1">{dosage}</div>
      
      {/* Product Name */}
      <h3 className="text-lg font-bold mb-2 line-clamp-1">{name}</h3>
      
      {/* Description */}
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

      {/* Specifications */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          {purity}
        </span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {quantity}
        </span>
        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
          {inStock ? 'In Stock' : 'Pre-order'}
        </span>
      </div>

      {/* Price & Add to Cart */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold">${price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">${originalPrice?.toFixed(2)}</span>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">per vial</div>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium whitespace-nowrap min-w-[100px]"
          disabled={!inStock}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{inStock ? 'Add' : 'Notify'}</span>
        </button>
      </div>
    </motion.div>
  );
}