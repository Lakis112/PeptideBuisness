'use client';

import { useState } from 'react';
import { 
  ShoppingCart, 
  Check, 
  Thermometer, 
  Shield, 
  FileText,
  Beaker,
  Package,
  Truck,
  CreditCard
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

  const handleAddToCart = () => {
    addItem({ 
      id: product.id, 
      name: product.name, 
      price: product.price 
    });
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-6">
        <a href="/" className="hover:text-blue-600">Home</a>
        <span className="mx-2">/</span>
        <a href="/" className="hover:text-blue-600">Peptides</a>
        <span className="mx-2">/</span>
        <a href={`/products?category=${product.category}`} className="hover:text-blue-600">
          {product.category}
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column - Product Visual & Info */}
        <div>
          {/* Product Image/Icon */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 mb-8 flex items-center justify-center">
            <div className="text-9xl">🧪</div>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-bold">Purity</span>
              </div>
              <div className="text-2xl font-bold text-green-700">{product.purity}</div>
              <div className="text-sm text-gray-600">HPLC-MS verified</div>
            </div>
            <div className="bg-white p-4 rounded-xl border">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="h-5 w-5 text-blue-600" />
                <span className="font-bold">Storage</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">{product.storage}</div>
              <div className="text-sm text-gray-600">Temperature</div>
            </div>
          </div>

          {/* Shipping Info */}
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

        {/* Right Column - Product Details */}
        <div>
          {/* Category & Stock */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {product.category}
              </span>
              {product.subcategory && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {product.subcategory}
                </span>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {product.inStock ? 'In Stock ✓' : 'Pre-order'}
            </div>
          </div>

          {/* Product Name */}
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          {/* Description */}
          <p className="text-gray-700 text-lg mb-6">{product.description}</p>

          {/* Price */}
          <div className="mb-8">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-5xl font-bold">${product.price.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    ${product.originalPrice?.toFixed(2)}
                  </span>
                  <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                    Save ${(product.originalPrice! - product.price).toFixed(0)}
                  </span>
                </>
              )}
            </div>
            <div className="text-gray-600">
              {product.dosage} • {product.quantity}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mb-12">
            <button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <ShoppingCart className="h-6 w-6" />
              {product.inStock ? 'Add to Cart' : 'Notify When Available'}
            </button>
            <div className="text-center mt-4 text-sm text-gray-600">
              🔒 Secure checkout • Discreet billing
            </div>
          </div>

          {/* Tabs */}
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

          {/* Tab Content */}
          <div className="prose max-w-none">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Product Overview</h3>
                <p>
                  {product.name} is a research-grade peptide provided in lyophilized form. 
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
                        <td className="py-3 text-gray-700">{product.molecularWeight || 'Available in COA'}</td>
                      </tr>
                      {product.sequence && (
                        <tr className="border-b">
                          <td className="py-3 font-medium">Amino Acid Sequence</td>
                          <td className="py-3 text-gray-700 font-mono text-sm">{product.sequence}</td>
                        </tr>
                      )}
                      {product.halfLife && (
                        <tr className="border-b">
                          <td className="py-3 font-medium">Half-life</td>
                          <td className="py-3 text-gray-700">{product.halfLife}</td>
                        </tr>
                      )}
                      <tr className="border-b">
                        <td className="py-3 font-medium">Purity</td>
                        <td className="py-3 text-gray-700">{product.purity} (HPLC-MS)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 font-medium">Storage</td>
                        <td className="py-3 text-gray-700">{product.storage}</td>
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

            {selectedTab === 'protocols' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Research Protocols</h3>
                <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ <strong>Disclaimer:</strong> The following information is for research reference only. 
                    Always consult with qualified professionals and follow institutional guidelines.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold mb-2">Reconstitution</h4>
                    <p className="text-gray-700">
                      Reconstitute with bacteriostatic water to desired concentration. 
                      Typical concentrations range from 1-5 mg/mL depending on research requirements.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Storage After Reconstitution</h4>
                    <p className="text-gray-700">
                      Store reconstituted peptide at {product.storage}. Use within 30 days of reconstitution 
                      for optimal stability.
                    </p>
                  </div>
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
                    Request COA for Batch {product.id.toUpperCase()}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            brand: {
              '@type': 'Brand',
              name: 'PeptideScience',
            },
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'USD',
              availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: '24',
            },
          }),
        }}
      />
    </div>
  );
}