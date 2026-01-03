'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { 
  ShoppingCart, 
  Check, 
  Thermometer, 
  Shield, 
  FileText,
  Beaker,
  Truck
} from 'lucide-react';
import { useCart } from '@/lib/cart';

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    subcategory?: string;
    dosage: string;
    quantity: string;
    purity: string;
    molecularWeight?: string;
    sequence?: string;
    halfLife?: string;
    storage: string;
    inStock: boolean;
    featured?: boolean; 
    imageUrl?: string;
    chemical_formula?: string;
    synonym?: string;
    cas?: string;
  };
  sku?: string;
  imageUrl?: string;
}

export default function ProductDetail({ product, sku ,imageUrl }: ProductDetailProps) {
  const { addItem } = useCart();
  const [selectedTab, setSelectedTab] = useState('specifications');
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  
  // Ensure product has safe values
  const safeProduct = {
    ...product,
    price: product.price || 0,
    originalPrice: product.originalPrice || product.price || 0,
    name: product.name || 'Unnamed Product',
    description: product.description || '',
    category: product.category || 'Uncategorized',
    dosage: product.dosage || '',
    quantity: product.quantity || '',
    purity: product.purity || '',
    storage: product.storage || '',
    inStock: product.inStock !== undefined ? product.inStock : true
  };

const [quantity, setQuantity] = useState(1);

// Update handleAddToCart
const handleAddToCart = () => {
  console.log('Adding to cart:', { 
    id: safeProduct.id, 
    imageUrl: safeProduct.imageUrl,
    product: safeProduct 
  });

  addItem({ 
    id: safeProduct.id, 
    name: safeProduct.name, 
    price: safeProduct.price,
    quantity: quantity, // Add quantity
    imageUrl: safeProduct.imageUrl
  });
  toast.success('Added to cart', {
    description: `${quantity}x ${safeProduct.name} added to cart.`,
    icon: '🛒',
  });
};
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-6">
        
        <a href={`/products?category=${safeProduct.category}`} className="hover:text-blue-600">
          {safeProduct.category}
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{safeProduct.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column */}
        <div>
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 flex items-center justify-center min-h-[400px] overflow-hidden">
  {/* Featured Badge */}
  {product.featured && (
    <div className="absolute top-6 left-6 z-20">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6BCB] via-[#9575CD] to-[#FF6BCB] rounded-full blur-sm opacity-75 animate-pulse"></div>
        <div className="relative bg-gradient-to-r from-[#FF6BCB] to-[#9575CD] text-white px-4 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-2xl">
          <span className="text-white">⭐ FEATURED</span>
        </div>
      </div>
    </div>
  )}
  
  {/* Image Container */}
  <div className="relative w-full h-full flex items-center justify-center p-4">
    {imageUrl ? (
      <div className="relative group">
        {/* Glow effect on hover */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        {/* Image */}
        <img 
          src={imageUrl}
          alt={product.name}
          className="relative max-w-full max-h-80 object-contain rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
        />
        {/* Watermark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-xl"></div>
      </div>
    ) : (
      <div className="relative">
        <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-inner flex items-center justify-center border-2 border-gray-100">
          <div className="text-8xl">🧪</div>
        </div>
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-lg"></div>
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-lg"></div>
      </div>
    )}
  </div>
  
  {/* Corner accents */}
  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/20 to-transparent"></div>
  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-100/20 to-transparent"></div>
</div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-bold">Purity</span>
              </div>
              <div className="text-2xl font-bold text-green-700">{safeProduct.purity}</div>
              <div className="text-sm text-gray-600">HPLC-MS verified</div>
            </div>
            <div className="bg-white p-4 rounded-xl border">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="h-5 w-5 text-blue-600" />
                <span className="font-bold">Storage</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">{safeProduct.storage}</div>
              <div className="text-sm text-gray-600">Temperature</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping & Handling
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-600" />
                <span>Temperature controlled shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-600" />
                <span>Ships within 48 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-600" />
                <span>Discreet packaging</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-600" />
                <span>Tracking number provided</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {safeProduct.category}
              </span>
              {safeProduct.subcategory && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {safeProduct.subcategory}
                </span>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${safeProduct.inStock ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {safeProduct.inStock ? 'In Stock ✓' : 'Pre-order'}
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">{safeProduct.name}</h1>
          
          <p className="text-gray-700 text-lg mb-6">{safeProduct.description}</p>

          {/* Price Section - Fixed */}
          <div className="mb-8">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-5xl font-bold">${(safeProduct.price).toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    ${(safeProduct.originalPrice).toFixed(2)}
                  </span>
                  <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                    Save ${(safeProduct.originalPrice - safeProduct.price).toFixed(0)}
                  </span>
                </>
              )}
            </div>
            <div className="text-gray-600">
              {safeProduct.dosage} • {safeProduct.quantity}
            </div>
          </div>

<div className="mb-12">
  {/* Quantity Selector */}
  <div className="flex items-center gap-4 mb-4">
    <span className="font-medium">Quantity:</span>
    <div className="flex items-center border rounded-lg">
      <button 
        onClick={() => setQuantity(q => Math.max(1, q - 1))}
        className="px-4 py-2 text-gray-600 hover:bg-gray-50"
      >
        −
      </button>
      <span className="px-4 py-2 font-bold w-12 text-center">{quantity}</span>
      <button 
        onClick={() => setQuantity(q => q + 1)}
        className="px-4 py-2 text-gray-600 hover:bg-gray-50"
      >
        +
      </button>
    </div>
    <span className="text-gray-600">
      Total: <span className="font-bold">${(safeProduct.price * quantity).toFixed(2)}</span>
    </span>
  </div>

  {/* Add to Cart Button */}
  <button 
    onClick={handleAddToCart}
    disabled={!safeProduct.inStock}
    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
  >
    <ShoppingCart className="h-6 w-6" />
    {safeProduct.inStock ? `Add ${quantity} to Cart` : 'Notify When Available'}
  </button>
</div>

          <div className="mb-12">
            
            <div className="text-center mt-4 text-sm text-gray-600">
              🔒 Secure checkout • Discreet billing
            </div>
          </div>

          <div className="border-b mb-6">
            <div className="flex space-x-8">
              {['specifications', 'coa'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`pb-3 px-1 font-medium capitalize ${selectedTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab === 'coa' ? 'Certificate of Analysis' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="prose max-w-none">
            

      {selectedTab === 'specifications' && (
  <div className="space-y-6">
    <h3 className="text-xl font-bold">Specifications</h3>
    <div className="grid grid-cols-2 gap-4">
      {safeProduct.chemical_formula && (
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-gray-600 text-sm">Chemical Formula</p>
          <p className="font-bold text-lg">{safeProduct.chemical_formula}</p>
        </div>
      )}
      {safeProduct.molecularWeight && (
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-gray-600 text-sm">Molecular Weight</p>
          <p className="font-bold text-lg">{safeProduct.molecularWeight}</p>
        </div>
      )}
      {safeProduct.cas && (
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-gray-600 text-sm">CAS No</p>
          <p className="font-bold text-lg">{safeProduct.cas}</p>
        </div>
      )}
      {safeProduct.synonym && (
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-gray-600 text-sm">Synonyms</p>
          <p className="font-bold text-lg">{safeProduct.synonym}</p>
        </div>
      )}
    </div>
  </div>
)}

            {selectedTab === 'coa' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Certificate of Analysis</h3>
                <div className="bg-gray-50 p-8 rounded-xl border text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="font-bold mb-2">Batch-Specific COA Available</h4>
                  <p className="text-gray-600 mb-6">
                    Certificate of Analysis with full HPLC-MS chromatogram is provided 
                    with each order.
                  </p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Request COA for Batch {safeProduct.id.toUpperCase()}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}