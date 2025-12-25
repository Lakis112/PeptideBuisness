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
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const [selectedTab, setSelectedTab] = useState('overview');
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

  const handleAddToCart = () => {
    addItem({ 
      id: safeProduct.id, 
      name: safeProduct.name, 
      price: safeProduct.price 
    });
    toast.success('Added to cart', {
      description: `${safeProduct.name} has been added to your cart.`,
      icon: '🛒',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-6">
        <a href="/" className="hover:text-blue-600">Home</a>
        <span className="mx-2">/</span>
        <a href="/" className="hover:text-blue-600">Peptides</a>
        <span className="mx-2">/</span>
        <a href={`/products?category=${safeProduct.category}`} className="hover:text-blue-600">
          {safeProduct.category}
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{safeProduct.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column */}
        <div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 mb-8 flex items-center justify-center">
            <div className="text-9xl">🧪</div>
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
                <span>Cold-chain shipping included</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-600" />
                <span>Ships within 24 hours</span>
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
            <button 
              onClick={handleAddToCart}
              disabled={!safeProduct.inStock}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <ShoppingCart className="h-6 w-6" />
              {safeProduct.inStock ? 'Add to Cart' : 'Notify When Available'}
            </button>
            <div className="text-center mt-4 text-sm text-gray-600">
              🔒 Secure checkout • Discreet billing
            </div>
          </div>

          <div className="border-b mb-6">
            <div className="flex space-x-8">
              {['overview', 'specifications', 'protocols', 'coa'].map((tab) => (
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
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Product Overview</h3>
                <p>
                  {safeProduct.name} is a research-grade peptide provided in lyophilized form. 
                  Each batch undergoes rigorous third-party testing to verify purity and identity.
                </p>
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <Beaker className="h-5 w-5" />
                    Research Applications
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Laboratory research and development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>In vitro and ex vivo studies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Mechanism of action research</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {selectedTab === 'specifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Specifications</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 font-medium">Molecular Weight</td>
                        <td className="py-3 text-gray-700">{safeProduct.molecularWeight || 'Available in COA'}</td>
                      </tr>
                      {safeProduct.sequence && (
                        <tr className="border-b">
                          <td className="py-3 font-medium">Amino Acid Sequence</td>
                          <td className="py-3 text-gray-700 font-mono text-sm">{safeProduct.sequence}</td>
                        </tr>
                      )}
                      {safeProduct.halfLife && (
                        <tr className="border-b">
                          <td className="py-3 font-medium">Half-life</td>
                          <td className="py-3 text-gray-700">{safeProduct.halfLife}</td>
                        </tr>
                      )}
                      <tr className="border-b">
                        <td className="py-3 font-medium">Purity</td>
                        <td className="py-3 text-gray-700">{safeProduct.purity} (HPLC-MS)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 font-medium">Storage</td>
                        <td className="py-3 text-gray-700">{safeProduct.storage}</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium">Form</td>
                        <td className="py-3 text-gray-700">Lyophilized powder</td>
                      </tr>
                    </tbody>
                  </table>
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