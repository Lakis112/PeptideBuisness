import { Beaker, Shield, Mail, Phone, MapPin, FileText, Award } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Beaker className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">MMN Pharmaceuticals</h3>
                <p className="text-sm text-gray-400">Pharma Grade Peptides</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              EU-GMP certified pharmaceutical peptides for research use. 
              Manufactured in Poland with full analytical validation and 
              regulatory documentation.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Award className="h-4 w-4" />
                <span>EU-GMP Certified</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="text-blue-400">Products</span>
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span>All Products</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=Weight+Loss" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span>Weight Loss Peptides</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=Recovery" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span>Recovery & Healing</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=Growth+Hormone" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span>Growth Hormone</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="text-blue-400">Resources</span>
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/quality" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span>Quality Assurance</span>
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <span>Research Database</span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <span>Documentation</span>
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="text-blue-400">Contact</span>
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-300 text-sm">contact@mmn-pharma.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-300 text-sm">Boston, MA, USA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MMN Pharmaceuticals. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Pharmaceutical-grade peptides for research use only. Not for human consumption.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Disclaimer
            </a>
          </div>
        </div>

        {/* Regulatory Notice */}
        <div className="mt-8 p-4 bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-800/30 rounded-lg text-center">
          <p className="text-sm text-red-300 font-medium">
            ⚠️ WARNING: For laboratory research use only. Not for human or veterinary use. 
            Not for consumption. Keep out of reach of children. Only for use by qualified professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}