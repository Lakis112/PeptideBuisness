'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { 
  ShoppingCart, 
  Shield, 
  FileText,
  CheckCircle,
  TrendingUp,
  Package,
  Clock,
  Truck,
  Lock,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { useCart } from '@/lib/cart';
import Link from 'next/link';

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    original_price?: number;
    category: string;
    maincategory?: string;
    subcategory?: string;
    dosage: string;
    quantity: string;
    purity: string;
    molecularWeight?: string;
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
  
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;
  
  const safeProduct = {
    ...product,
    price: product.price || 0,
    original_price: product.original_price || 0,
    name: product.name || 'Unnamed Product',
    description: product.description || '',
    category: product.category || 'Uncategorized',
    maincategory: product.maincategory || product.category,
    dosage: product.dosage || '',
    quantity: product.quantity || '',
    purity: product.purity || '',
    storage: product.storage || '',
    inStock: product.inStock !== undefined ? product.inStock : true,
    molecularWeight: product.molecularWeight,
    halflife: product.halflife,
    cas: product.cas,
    chemical_formula: product.chemical_formula,
    synonym: product.synonym
  };

  const handleAddToCart = () => {
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
    <div className="bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <ChevronRight className="h-4 w-4" />
            {safeProduct.maincategory && (
              <>
                <Link 
                  href={`/products?category=${safeProduct.maincategory}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {safeProduct.maincategory}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            {safeProduct.category && safeProduct.category !== safeProduct.maincategory && (
              <>
                <Link 
                  href={`/products?category=${safeProduct.maincategory}&subcategory=${safeProduct.category}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {safeProduct.category}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-gray-900 font-medium">{safeProduct.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Image */}
          <div className="space-y-6">
            <div className="relative bg-white rounded-2xl border border-gray-200 p-8 overflow-hidden">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.featured && (
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg shadow-lg">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="text-xs font-bold tracking-wide">BESTSELLER</span>
                  </div>
                )}
                {hasDiscount && (
                  <div className="bg-red-600 text-white px-3 py-1.5 rounded-lg shadow-md">
                    <span className="text-xs font-bold">-{discountPercent}%</span>
                  </div>
                )}
              </div>

              {/* Image */}
              <div className="flex items-center justify-center min-h-[400px]">
                {imageUrl ? (
                  <img 
                    src={imageUrl}
                    alt={product.name}
                    className="max-w-full max-h-96 object-contain"
                  />
                ) : (
                  <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border border-gray-200">
                    <Package className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xs font-semibold text-gray-900">EU-GMP</div>
                <div className="text-xs text-gray-500">Certified</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <Award className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-xs font-semibold text-gray-900">{safeProduct.purity}</div>
                <div className="text-xs text-gray-500">HPLC Tested</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xs font-semibold text-gray-900">COA</div>
                <div className="text-xs text-gray-500">Included</div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            {/* Categories & Discount Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200">
                {safeProduct.maincategory}
              </span>
              {safeProduct.category && safeProduct.category !== safeProduct.maincategory && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-200">
                  {safeProduct.category}
                </span>
              )}
              {hasDiscount && (
                <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-lg shadow-md">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{safeProduct.name}</h1>
            
            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`w-2 h-2 rounded-full ${safeProduct.inStock ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {safeProduct.inStock ? 'In Stock - Ships within 24 hours' : 'Pre-order - Ships in 3-5 days'}
              </span>
            </div>

            {/* Dosage and Quantity Box */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Dosage</div>
                  <div className="text-sm font-semibold text-gray-900">{safeProduct.dosage}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Quantity</div>
                  <div className="text-sm font-semibold text-gray-900">{safeProduct.quantity}</div>
                </div>
              </div>
            </div>

            {/* Price - Outside box, more prominent */}
            <div className="mb-8">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-bold text-gray-900">
                  ${(safeProduct.price).toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-2xl text-gray-500 line-through">
                    ${(safeProduct.original_price).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                Price per unit • Tax and shipping calculated at checkout
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 font-bold transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-2.5 font-bold text-gray-900 border-x-2 border-gray-200">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Total: <span className="font-bold text-gray-900">${(safeProduct.price * quantity).toFixed(2)}</span>
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={!safeProduct.inStock}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-4"
            >
              <ShoppingCart className="h-5 w-5" />
              {safeProduct.inStock ? `Add ${quantity} to Cart` : 'Notify When Available'}
            </button>

            {/* Security & Shipping Info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Lock className="h-4 w-4 text-green-600" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Truck className="h-4 w-4 text-blue-600" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>Discreet Packaging</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setSelectedTab('specifications')}
                className={`flex-1 py-4 px-6 font-semibold transition-all ${
                  selectedTab === 'specifications'
                    ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Technical Specifications
              </button>
              
              <button
                onClick={() => setSelectedTab('coa')}
                className={`flex-1 py-4 px-6 font-semibold transition-all ${
                  selectedTab === 'coa'
                    ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Certificate of Analysis
              </button>

              <button
                onClick={() => setSelectedTab('usage')}
                className={`flex-1 py-4 px-6 font-semibold transition-all ${
                  selectedTab === 'usage'
                    ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Storage & Handling
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-8">
              {selectedTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Purity */}
                  <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-emerald-50">
                    <div className="text-sm text-gray-500 mb-2">Purity (HPLC)</div>
                    <div className="text-2xl font-bold text-emerald-600">{safeProduct.purity}</div>
                    <div className="text-xs text-gray-500 mt-1">Verified by HPLC-MS</div>
                  </div>

                  {/* Molecular Weight */}
                  {safeProduct.molecularWeight && (
                    <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-blue-50">
                      <div className="text-sm text-gray-500 mb-2">Molecular Weight</div>
                      <div className="text-2xl font-bold text-blue-600">{safeProduct.molecularWeight}</div>
                      <div className="text-xs text-gray-500 mt-1">g/mol</div>
                    </div>
                  )}

                  {/* Half-Life */}
                  {safeProduct.halflife && (
                    <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-orange-50">
                      <div className="text-sm text-gray-500 mb-2">Half-Life</div>
                      <div className="text-2xl font-bold text-orange-600">{safeProduct.halflife}</div>
                      <div className="text-xs text-gray-500 mt-1">Biological half-life</div>
                    </div>
                  )}

                  {/* CAS Number */}
                  {safeProduct.cas && (
                    <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-purple-50">
                      <div className="text-sm text-gray-500 mb-2">CAS Number</div>
                      <div className="text-lg font-mono font-bold text-purple-600">{safeProduct.cas}</div>
                      <div className="text-xs text-gray-500 mt-1">Chemical registry</div>
                    </div>
                  )}

                  {/* Chemical Formula */}
                  {safeProduct.chemical_formula && (
                    <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-indigo-50">
                      <div className="text-sm text-gray-500 mb-2">Chemical Formula</div>
                      <div className="text-lg font-mono font-bold text-indigo-600">{safeProduct.chemical_formula}</div>
                      <div className="text-xs text-gray-500 mt-1">Molecular structure</div>
                    </div>
                  )}

                  {/* Synonyms */}
                  {safeProduct.synonym && (
                    <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-gray-50 md:col-span-2 lg:col-span-3">
                      <div className="text-sm text-gray-500 mb-2">Also Known As</div>
                      <div className="text-lg font-semibold text-gray-900">{safeProduct.synonym}</div>
                      <div className="text-xs text-gray-500 mt-1">Common names and abbreviations</div>
                    </div>
                  )}
                </div>
              )}

              {selectedTab === 'coa' && (
                <div className="text-center py-12">
                  <FileText className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Certificate of Analysis Available</h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Each batch includes a complete Certificate of Analysis with HPLC chromatogram, 
                    purity verification, and full quality control documentation.
                  </p>
                  <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg">
                    Request COA for This Batch
                  </button>
                </div>
              )}

              {selectedTab === 'usage' && (
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      Storage Conditions
                    </h4>
                    <p className="text-gray-700">{safeProduct.storage}</p>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-3">Handling Guidelines</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>For research purposes only</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Handle in controlled laboratory environment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Follow institutional biosafety protocols</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
