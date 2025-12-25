'use client';

import { useState, useEffect, useRef } from 'react';
import { User, LogOut, Settings, Package, ChevronDown, CreditCard, FileText } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { clearCartStorage } from '@/lib/cart';

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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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
      
      // Clear cart
      clearCartStorage();
      
      window.location.href = '/';
    }
  } catch (error) {
    toast.error('Logout failed');
  }
};

  if (isLoading) {
    return (
      <div className="h-9 w-9 bg-gray-100 rounded-full animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition font-medium"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-sm"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2.5 p-1.5 hover:bg-gray-50 rounded-lg transition-colors group"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium text-sm shadow-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-all ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1.5 z-50">
          {/* User info header */}
          <div className="px-3 py-2.5 mb-1 border-b border-gray-100">
            <p className="font-semibold text-sm truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            {user.organization && (
              <p className="text-xs text-gray-400 mt-0.5 truncate">{user.organization}</p>
            )}
          </div>
          
          {/* Menu items */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Package className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
          
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Orders</span>
          </Link>
          
          <Link
            href="/dashboard/documents"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Documents</span>
          </Link>
          
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Settings</span>
          </Link>
          
          {/* Admin section */}
          {user.email.includes('admin') && (
            <>
              <div className="border-t border-gray-100 my-1"></div>
              <Link
                href="/admin"
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="h-3.5 w-3.5 rounded bg-red-500 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">A</span>
                </div>
                <span>Admin Panel</span>
              </Link>
            </>
          )}
          
          {/* Logout */}
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}