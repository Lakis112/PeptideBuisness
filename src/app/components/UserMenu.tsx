'use client';

import { useState } from 'react';
import { User, LogOut, Settings, Package } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function UserMenu() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="h-4 w-4 text-blue-600" />
        </div>
        <span className="font-medium">{user?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
          
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
            onClick={() => setIsOpen(false)}
          >
            <Package className="h-4 w-4" />
            My Orders
          </Link>
          
          <Link
            href="/account"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4" />
            Account Settings
          </Link>
          
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}