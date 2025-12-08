'use client';

import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart';  // ADD THIS

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  purity: string;
  inStock: boolean;
}

export default function ProductCard({ 
  id,
  name, 
  price, 
  description, 
  purity,
  inStock 
}: ProductCardProps) {
  const { addItem } = useCart();  // ADD THIS

  const handleAddToCart = () => {
    addItem({ id, name, price });  // UPDATE THIS
    alert(`Added ${name} to cart!`);
  };

  return (
    <motion.div
      className="border rounded-xl p-6 hover:shadow-xl transition-shadow cursor-pointer"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg mb-4 flex items-center justify-center">
        <div className="text-5xl">🧪</div>
      </div>
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold">{name}</h3>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
          {purity}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">${price.toFixed(2)}</div>
          <div className="text-sm text-gray-500">per 5mg vial</div>
        </div>
        <button 
          onClick={handleAddToCart}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={!inStock}
        >
          <ShoppingCart className="h-4 w-4" />
          {inStock ? 'Add' : 'Out of Stock'}
        </button>
      </div>
    </motion.div>
  );
}