'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    organization: string;
}

interface DashboardLayoutProps {
    children: ReactNode;
    user?: User | null;
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
        { name: 'Orders', href: '/dashboard/orders', icon: '📦' },
        { name: 'Documents', href: '/dashboard/documents', icon: '📄' },
        { name: 'Support', href: '/dashboard/support', icon: '🆘' },
        { name: 'Account', href: '/dashboard/account', icon: '⚙️' },
    ];
    
    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow pt-5 bg-white border-r overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-4 mb-8">
                        <div className="text-xl font-bold text-blue-600">MMN Research</div>
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            Portal
                        </span>
                    </div>
                    
                    {/* User Info */}
                    {user && (
                        <div className="px-4 mb-6">
                            <div className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">{user.email}</div>
                            <div className="text-xs text-gray-400 mt-1">{user.organization}</div>
                        </div>
                    )}
                    
                    {/* Navigation */}
                    <nav className="flex-1 px-2 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                    
                    {/* Logout Button */}
                    <div className="p-4 border-t">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
            
            {/* Mobile Header */}
            <header className="md:hidden bg-white border-b">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-gray-500"
                    >
                        <span className="text-2xl">☰</span>
                    </button>
                    <div className="text-lg font-bold text-blue-600">Dashboard</div>
                    <div className="w-8"></div> {/* Spacer */}
                </div>
                
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </header>
            
            {/* Main Content */}
            <main className="md:pl-64">
                <div className="py-6">
                    {children}
                </div>
            </main>
        </div>
    );
}