import DashboardLayout from '@/app/components/DashboardLayout';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export default async function DashboardPage() {
    try {
        const cookieStore = await cookies(); // ADDED 'await'
        const token = cookieStore.get('auth_token')?.value;
        
        let user = null;
        let orders = [];
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
                
                // Fetch user data
                const userResult = await pool.query(
                    'SELECT id, email, first_name, last_name, organization FROM users WHERE id = $1',
                    [decoded.id]
                );
                user = userResult.rows[0];
                
                // Fetch recent orders
                const ordersResult = await pool.query(
                    `SELECT id, order_number, status, total, created_at 
                     FROM orders 
                     WHERE user_id = $1 
                     ORDER BY created_at DESC 
                     LIMIT 5`,
                    [decoded.id]
                );
                orders = ordersResult.rows;
                
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        } else {
            // If no token, user will be null and layout will show appropriate message
            console.log('No auth_token found in cookies');
        }
        
        return (
            <DashboardLayout user={user}>
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.first_name || 'Researcher'}
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Access your research materials, orders, and support.
                    </p>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow border">
                            <h3 className="text-lg font-semibold text-gray-700">Active Orders</h3>
                            <p className="text-3xl font-bold text-blue-600 mt-2">2</p>
                            <a href="/dashboard/orders" className="text-blue-500 hover:text-blue-700 text-sm">
                                View all →
                            </a>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow border">
                            <h3 className="text-lg font-semibold text-gray-700">Available Documents</h3>
                            <p className="text-3xl font-bold text-green-600 mt-2">24</p>
                            <a href="/dashboard/documents" className="text-blue-500 hover:text-blue-700 text-sm">
                                Browse →
                            </a>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow border">
                            <h3 className="text-lg font-semibold text-gray-700">Support Tickets</h3>
                            <p className="text-3xl font-bold text-amber-600 mt-2">1</p>
                            <a href="/dashboard/support" className="text-blue-500 hover:text-blue-700 text-sm">
                                View →
                            </a>
                        </div>
                    </div>
                    
                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow border p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                            <a href="/dashboard/orders" className="text-blue-500 hover:text-blue-700">
                                View All
                            </a>
                        </div>
                        
                        {orders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Order #
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Total
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                    {order.order_number}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        order.status === 'shipped' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : order.status === 'processing'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    ${order.total}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <button className="text-blue-500 hover:text-blue-700 mr-3">
                                                        Track
                                                    </button>
                                                    <button className="text-gray-500 hover:text-gray-700">
                                                        Invoice
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                No orders yet. <a href="/products" className="text-blue-500">Browse products</a>
                            </p>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        );
    } catch (error) {
        console.error('Dashboard page error:', error);
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">Error Loading Dashboard</h1>
                <p className="text-gray-600 mt-2">Please try again or contact support.</p>
            </div>
        );
    }
}