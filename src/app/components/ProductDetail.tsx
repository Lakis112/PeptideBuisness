'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { 
  ShoppingCart, 
  Thermometer, 
  Shield, 
  FileText,
  Beaker
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
    maincategory?: string;
    subcategory?: string;
    dosage: string;
    quantity: string;
    purity: string;
    molecular_weight?: string;
    sequence?: string;
    halflife?: string;
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

export default function ProductDetail({ product, sku, imageUrl }: ProductDetailProps) {
  const { addItem } = useCart();
  const [selectedTab, setSelectedTab] = useState('specifications');
  const [quantity, setQuantity] = useState(1);
  
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  
  const safeProduct = {
    ...product,
    price: product.price || 0,
    originalPrice: product.originalPrice || product.price || 0,
    name: product.name || 'Unnamed Product',
    description: product.description || '',
    category: product.category || 'Uncategorized',
    maincategory: product.maincategory || product.category,
    dosage: product.dosage || '',
    quantity: product.quantity || '',
    purity: product.purity || '',
    storage: product.storage || '',
    inStock: product.inStock !== undefined ? product.inStock : true,
    molecular_weight: product.molecular_weight,
    halflife: product.halflife
  };

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
      quantity: quantity,
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
        {/* Left Column - Image */}
        <div>
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 flex items-center justify-center min-h-[400px] overflow-hidden">
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
            
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {imageUrl ? (
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <img 
                    src={imageUrl}
                    alt={product.name}
                    className="relative max-w-full max-h-80 object-contain rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                  />
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
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-100/20 to-transparent"></div>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {safeProduct.maincategory}
            </span>
            {safeProduct.category && safeProduct.category !== safeProduct.maincategory && (
              <>
                <span className="text-gray-400">/</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {safeProduct.category}
                </span>
              </>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-4">{safeProduct.name}</h1>
          
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-3 h-3 rounded-full ${safeProduct.inStock ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-gray-700 font-medium">
              {safeProduct.inStock ? 'In Stock' : 'Pre-order'}
            </span>
          </div>
          
          <p className="text-gray-700 text-lg mb-6">{safeProduct.description}</p>

          {/* Price Section */}
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

          {/* Quantity and Add to Cart */}
          <div className="mb-12">
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

            <button 
              onClick={handleAddToCart}
              disabled={!safeProduct.inStock}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <ShoppingCart className="h-6 w-6" />
              {safeProduct.inStock ? `Add ${quantity} to Cart` : 'Notify When Available'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 mb-8">
            🔒 Secure checkout • Discreet billing
          </div>
        </div>
      </div>

      {/* Specifications & COA Tabs */}
      <div className="mt-16">
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-lg">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('specifications')}
              className={`flex-1 py-5 px-6 text-lg font-semibold transition-colors ${
                selectedTab === 'specifications'
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <Beaker className="h-5 w-5" />
                Specifications
              </div>
            </button>
            
            <button
              onClick={() => setSelectedTab('coa')}
              className={`flex-1 py-5 px-6 text-lg font-semibold transition-colors ${
                selectedTab === 'coa'
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-5 w-5" />
                Certificate of Analysis
              </div>
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-8">
            {selectedTab === 'specifications' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900">Technical Specifications</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Purity Card */}
                  <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-700">Purity</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-700">{safeProduct.purity}</div>
                    <div className="text-sm text-gray-500 mt-2">HPLC-MS verified</div>
                  </div>

                  {/* Storage Card */}
                  <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Thermometer className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="font-semibold text-gray-700">Storage</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-700">{safeProduct.storage}</div>
                    <div className="text-sm text-gray-500 mt-2">Recommended temperature</div>
                  </div>

                  {/* Other specifications */}
                  {safeProduct.chemical_formula && (
                    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-500 mb-2">Chemical Formula</div>
                      <div className="text-xl font-bold text-gray-900 font-mono">{safeProduct.chemical_formula}</div>
                    </div>
                  )}

                  {safeProduct.molecular_weight && (
                    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-500 mb-2">Molecular Weight</div>
                      <div className="text-xl font-bold text-gray-900">{safeProduct.molecular_weight} g/mol</div>
                    </div>
                  )}

    
                  {/* Half-Life Card */}
                  {safeProduct.halflife && (
                    <div className="bg-gradient-to-br from-white to-orange-50 border border-orange-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-500 mb-2">Half-Life</div>
                      <div className="text-2xl font-bold text-orange-700">{safeProduct.halflife}</div>
                    </div>
                  )}

                  {safeProduct.cas && (
                    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-500 mb-2">CAS Number</div>
                      <div className="text-xl font-bold text-gray-900 font-mono">{safeProduct.cas}</div>
                    </div>
                  )}

                  {safeProduct.synonym && (
                    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-3">
                      <div className="text-sm text-gray-500 mb-2">Also Known As</div>
                      <div className="text-xl font-bold text-gray-900">{safeProduct.synonym}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === 'coa' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900">Certificate of Analysis</h3>
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-8 text-center">
                  <FileText className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Batch-Specific COA Available</h4>
                  <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                    Each batch includes a Certificate of Analysis with full HPLC-MS chromatogram, 
                    purity verification, and quality control documentation.
                  </p>
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl">
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