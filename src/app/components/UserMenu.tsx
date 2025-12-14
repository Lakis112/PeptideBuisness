'use client';

import { useState, useEffect } from 'react';
import { User, LogOut, Settings, Package, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface UserData {
  id: number;
  email: string;
  name: string;
  organization?: string;
}

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setUser(null);
        toast.success('Logged out successfully');
        window.location.href = '/';
      }
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (isLoading) {
    return (
      <div className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
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
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:block text-left">
          <div className="font-medium text-sm">{user.name}</div>
          <div className="text-xs text-gray-500">Account</div>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
            {user.organization && (
              <p className="text-xs text-gray-500 mt-1">{user.organization}</p>
            )}
          </div>
          
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
            onClick={() => setIsOpen(false)}
          >
            <Package className="h-4 w-4" />
            Dashboard
          </Link>
          
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
            onClick={() => setIsOpen(false)}
          >
            <Package className="h-4 w-4" />
            My Orders
          </Link>
          
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          
          {user.email.includes('admin') && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition border-t border-gray-100 mt-2 pt-2"
              onClick={() => setIsOpen(false)}
            >
              <div className="h-4 w-4 bg-red-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              Admin Panel
            </Link>
          )}
          
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition border-t border-gray-100 mt-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}