'use client';

import { CreditCard, Lock, Shield, Truck, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type CheckoutStep = 'shipping' | 'payment' | 'review';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    organization: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    phone: '',
    notes: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    // Use formData.email instead of email
    if (!formData.email || !formData.firstName || !formData.address) {
      alert('Please fill in all required shipping information');
      return;
    }
    
    if (!agreeToTerms) {
      alert('You must agree to the terms and conditions');
      return;
    }
    localStorage.setItem('lastOrderEmail', formData.email);

    setLoading(true);

    localStorage.setItem('lastOrderEmail', formData.email);  
    try {
      // Prepare order data - use formData.email
      const orderData = {
        cartItems: items,
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,  // ← Changed from email to formData.email
          organization: formData.organization,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
          phone: formData.phone
        },
        shippingMethod: 'standard',
        notes: formData.notes
      };

      // Call your orders API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (response.ok) {
        // Use formData.email in success message too
        alert(`Order confirmed! Order #${result.order.orderNumber}. Confirmation sent to ${formData.email}`);
        clearCart();
        router.push(`/order-success?order=${result.order.orderNumber}`);
      } else {
        alert(`Order failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Step Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center">
            {(['shipping', 'payment', 'review'] as CheckoutStep[]).map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  currentStep === step 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : index < ['shipping', 'payment', 'review'].indexOf(currentStep)
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {index < ['shipping', 'payment', 'review'].indexOf(currentStep) ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className={`ml-3 text-sm font-medium ${
                  currentStep === step ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </div>
                {index < 2 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    index < ['shipping', 'payment', 'review'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Lock className="h-10 w-10 text-green-600" />
            Secure Checkout
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your research material order with confidence
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Shipping Information */}
            {currentStep === 'shipping' && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <Truck className="h-6 w-6 text-blue-600" />
                  Shipping & Research Information
                </h2>
                <p className="text-gray-600 mb-8">Enter your laboratory or institution details</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="John"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Smith"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Research Institution / Organization *
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="University Research Laboratory"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Shipping Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="123 Research Drive, Lab Building"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Boston"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="United States"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Research Protocol Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-32"
                      placeholder="Reference numbers, special handling instructions, or study details..."
                    />
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentStep('payment')}
                    className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-800 hover:to-indigo-900 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}
            
            {/* Payment Information */}
            {currentStep === 'payment' && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                  Payment Method
                </h2>
                <p className="text-gray-600 mb-8">Select your preferred payment method</p>
                
                <div className="space-y-6">
                  {/* Payment Method Selection */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {['credit_card', 'bank_transfer', 'purchase_order'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-6 border-2 rounded-xl text-left transition-all ${
                          paymentMethod === method
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-gray-900">
                            {method === 'credit_card' && 'Credit Card'}
                            {method === 'bank_transfer' && 'Bank Transfer'}
                            {method === 'purchase_order' && 'Purchase Order'}
                          </div>
                          {paymentMethod === method && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {method === 'credit_card' && 'Secure instant payment'}
                          {method === 'bank_transfer' && 'For institutional orders'}
                          {method === 'purchase_order' && 'For academic institutions'}
                        </p>
                      </button>
                    ))}
                  </div>
                  
                  {/* Credit Card Form */}
                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="4242 4242 4242 4242"
                          defaultValue="4242 4242 4242 4242"
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="MM/YY"
                            defaultValue="12/34"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CVC
                          </label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="123"
                            defaultValue="123"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="John Smith"
                            defaultValue="John Smith"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Terms Agreement */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="mt-1 h-5 w-5 text-blue-600 rounded"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        I confirm that I am a qualified researcher and understand that all products are for 
                        <span className="font-semibold"> research use only in laboratory settings</span>. 
                        I agree to the Terms of Service and confirm this material will not be used for human or 
                        veterinary diagnostic or therapeutic purposes.
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:border-gray-400 transition"
                    >
                      Back to Shipping
                    </button>
                    <button
                      onClick={() => setCurrentStep('review')}
                      className="flex-1 bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-800 hover:to-indigo-900 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Review Order */}
            {currentStep === 'review' && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-green-600" />
                  Review Your Order
                </h2>
                <p className="text-gray-600 mb-8">Confirm all details before submission</p>
                
                {/* Order Summary */}
                <div className="space-y-6 mb-8">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4">Research Materials</h3>
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                        </div>
                        <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Shipping Info */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4">Shipping Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Name</div>
                        <div className="font-medium">{formData.firstName} {formData.lastName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Organization</div>
                        <div className="font-medium">{formData.organization}</div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-sm text-gray-600">Email</div>
                        <div className="font-medium">{formData.email}</div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-sm text-gray-600">Address</div>
                        <div className="font-medium">{formData.address}, {formData.city}, {formData.country}</div>
                      </div>
                      {formData.phone && (
                        <div>
                          <div className="text-sm text-gray-600">Phone</div>
                          <div className="font-medium">{formData.phone}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Payment Info */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4">Payment Method</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {paymentMethod === 'credit_card' && 'Credit Card (ending in 4242)'}
                          {paymentMethod === 'bank_transfer' && 'Bank Transfer'}
                          {paymentMethod === 'purchase_order' && 'Purchase Order'}
                        </div>
                        <div className="text-sm text-gray-600">Billing address same as shipping</div>
                      </div>
                      <div className="text-blue-600 font-semibold">Secure</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep('payment')}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:border-gray-400 transition"
                  >
                    Back to Payment
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={loading || !agreeToTerms}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing Order...
                      </span>
                    ) : (
                      `Complete Order - $${total.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GMP Documentation</span>
                    <span className="text-green-600 font-semibold">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <div>
                        <div className="text-2xl">${total.toFixed(2)}</div>
                        <p className="text-sm text-gray-500 font-normal">VAT calculated at checkout</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Trust Badges */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-wrap justify-center gap-4 mb-4">
                    <div className="flex flex-col items-center">
                      <Shield className="h-8 w-8 text-blue-600 mb-1" />
                      <span className="text-xs text-gray-600">GMP Grade</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Lock className="h-8 w-8 text-green-600 mb-1" />
                      <span className="text-xs text-gray-600">256-bit SSL</span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500">
                    Your payment is secure and encrypted
                  </p>
                </div>
              </div>
              
              {/* Need Help Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-blue-900 mb-3">Need Assistance?</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Our scientific support team is available for research protocol questions.
                </p>
                <div className="space-y-3">
                  <a href="mailto:support@mmn-pharma.com" className="block text-blue-600 hover:text-blue-800 text-sm font-medium">
                    📧 support@mmn-pharma.com
                  </a>
                  <a href="tel:+1234567890" className="block text-blue-600 hover:text-blue-800 text-sm font-medium">
                    📞 +1 (234) 567-890
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}