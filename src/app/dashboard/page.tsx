import DashboardLayout from '@/app/components/DashboardLayout';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export default async function DashboardPage() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        
        let user = null;
        let orders = [];
        let activeOrderCount = 0;
        let documentCount = 24; // Default value
        let activeSupportTickets = 0;
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
                
                // Fetch user data
                const userResult = await pool.query(
                    'SELECT id, email, first_name, last_name, organization, created_at FROM users WHERE id = $1',
                    [decoded.id]
                );
                user = userResult.rows[0];
                
                // Fetch recent orders - CORRECTED QUERY
                const ordersResult = await pool.query(
    `SELECT 
        o.id, 
        o.order_number, 
        o.status, 
        o.total, 
        o.created_at,
        -- Get order items as JSON array
        COALESCE(
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'name', oi.product_name,
                    'quantity', oi.quantity,
                    'price', oi.unit_price
                )
            ) FILTER (WHERE oi.id IS NOT NULL),
            '[]'::json
        ) as items
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     WHERE o.user_id = $1 
     GROUP BY o.id, o.order_number, o.status, o.total, o.created_at
     ORDER BY o.created_at DESC 
     LIMIT 5`,
    [decoded.id]
);
                orders = ordersResult.rows;
                
                // Count active orders (pending + processing)
                const activeOrdersResult = await pool.query(
                    `SELECT COUNT(*) as count FROM orders 
                     WHERE user_id = $1 AND status IN ('pending', 'processing')`,
                    [decoded.id]
                );
                activeOrderCount = parseInt(activeOrdersResult.rows[0]?.count || '0');
                
                // Try to count documents
                try {
                    const documentsResult = await pool.query(
                        `SELECT COUNT(*) as count FROM user_documents WHERE user_id = $1`,
                        [decoded.id]
                    );
                    documentCount = parseInt(documentsResult.rows[0]?.count || '24');
                } catch (docError) {
                    console.log('Using default document count');
                }
                
                // Try to count support tickets
                try {
                    const ticketsResult = await pool.query(
                        `SELECT COUNT(*) as count FROM support_tickets 
                         WHERE user_id = $1 AND status = 'open'`,
                        [decoded.id]
                    );
                    activeSupportTickets = parseInt(ticketsResult.rows[0]?.count || '0');
                } catch (ticketError) {
                    console.log('Using default ticket count');
                }
                
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        } else {
            console.log('No auth_token found in cookies');
        }
        
        return (
            <DashboardLayout user={user}>
                <div className="p-6">
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Welcome back, {user?.first_name || 'Researcher'}
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Access your research materials, orders, and analytical documentation.
                            {user?.organization && (
                                <span className="font-medium text-blue-700"> • {user.organization}</span>
                            )}
                        </p>
                    </div>
                    
                    {/* Quick Stats - Now shows real activeOrderCount */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Active Orders</h3>
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                    </svg>
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-blue-700 mb-2">
                                {activeOrderCount}
                            </p>
                            <p className="text-sm text-gray-600 mb-3">
                                Orders pending or processing
                            </p>
                            <a href="/dashboard/orders" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2 text-sm">
                                View all orders
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </a>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Available Documents</h3>
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-green-700 mb-2">
                                {documentCount}
                            </p>
                            <p className="text-sm text-gray-600 mb-3">
                                COAs, HPLC reports, MSDS
                            </p>
                            <a href="/dashboard/documents" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center gap-2 text-sm">
                                Browse documentation
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </a>
                        </div>
                        
                        <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                    </svg>
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-amber-700 mb-2">
                                {activeSupportTickets}
                            </p>
                            <p className="text-sm text-gray-600 mb-3">
                                Open support requests
                            </p>
                            <a href="/dashboard/support" className="text-amber-600 hover:text-amber-800 font-medium inline-flex items-center gap-2 text-sm">
                                View support
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                    
                    {/* Recent Orders Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Recent Research Orders</h2>
                                <p className="text-gray-600 mt-1">Your latest pharmaceutical-grade peptide orders</p>
                            </div>
                            <a href="/dashboard/orders" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all inline-flex items-center gap-2">
                                View All Orders
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </a>
                        </div>
                        
                        {orders.length > 0 ? (
                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Order #
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Items
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-semibold text-gray-900">{order.order_number}</div>
                                                    <div className="text-sm text-gray-500">GMP Grade</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {order.items && order.items.length > 0 ? (
                                                            <div>
                                                                {order.items[0].name}
                                                                {order.items.length > 1 && (
                                                                    <span className="text-gray-600"> + {order.items.length - 1} more</span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500">No items</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                                        order.status === 'shipped' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : order.status === 'processing'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : order.status === 'delivered'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {order.status?.charAt(0)?.toUpperCase() + order.status?.slice(1) || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-lg font-bold text-gray-900">${order.total}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(order.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(order.created_at).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <button className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 hover:bg-blue-50 rounded-lg transition-colors">
                                                            Track
                                                        </button>
                                                        <button className="text-gray-600 hover:text-gray-800 font-medium px-3 py-1 hover:bg-gray-50 rounded-lg transition-colors">
                                                            Invoice
                                                        </button>
                                                        <button className="text-green-600 hover:text-green-800 font-medium px-3 py-1 hover:bg-green-50 rounded-lg transition-colors">
                                                            COA
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mb-6">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                    Begin your research with our pharmaceutical-grade peptides. Each batch includes full analytical documentation.
                                </p>
                                <a href="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all">
                                    Browse Research Catalog
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                    </svg>
                                </a>
                            </div>
                        )}
                    </div>
                    
                    {/* Quick Actions - Same as before */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ... rest of your dashboard code ... */}
                    </div>
                </div>
            </DashboardLayout>
        );
    } catch (error) {
        console.error('Dashboard page error:', error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 max-w-md">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Dashboard</h1>
                        <p className="text-gray-600">
                            We encountered an issue loading your dashboard data. Please try again or contact our scientific support team.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                            Refresh Dashboard
                        </button>
                        <a 
                            href="mailto:support@mmn-pharma.com" 
                            className="block border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}