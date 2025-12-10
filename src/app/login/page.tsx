'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
        console.log('🔐 Attempting login...');
        
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include' // REQUIRED for cookies
        });
        
        console.log('📡 Response status:', response.status);
        
        const data = await response.json();
        console.log('📦 Response data:', data);
        
        if (response.ok) {
            console.log('✅ Login successful! Redirecting...');
            
            // OPTION 1: Force full page reload (most reliable)
            window.location.href = '/dashboard';
            
            // OPTION 2: Use router (if above doesn't work)
            // router.push('/dashboard');
            // router.refresh();
            
        } else {
            console.log('❌ Login failed:', data.error);
            setError(data.error || 'Login failed');
        }
    } catch (err) {
        console.error('💥 Network error:', err);
        setError('Network error. Please try again.');
    } finally {
        setLoading(false);
    }
};
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Research Portal Login
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        For authorized research personnel only
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Research email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                    
                    <div className="text-sm text-center">
                        <Link
                            href="/register"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Create research account
                        </Link>
                        <span className="mx-2">•</span>
                        <Link
                            href="/forgot-password"
                            className="font-medium text-gray-600 hover:text-gray-500"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </form>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-md border">
                    <p className="text-xs text-gray-600 text-center">
                        <strong>Important:</strong> This portal is for research purposes only. 
                        All activities are logged and monitored. By accessing this portal, 
                        you confirm that you are authorized for research activities.
                    </p>
                </div>
            </div>
        </div>
    );
}