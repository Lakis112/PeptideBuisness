'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, Calendar, Shield, Search, UserCheck, UserX } from 'lucide-react';

interface User {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  organization: string | null;
  account_type: string;
  created_at: string;
  last_login: string | null;
  status: string;
  is_admin: boolean;
  order_count: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    (user.first_name && user.first_name.toLowerCase().includes(search.toLowerCase())) ||
    (user.organization && user.organization.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage researcher accounts and permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-2xl font-bold">{users.length}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-2xl font-bold">
            {users.filter(u => u.account_type === 'researcher').length}
          </div>
          <div className="text-sm text-gray-600">Researchers</div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-2xl font-bold">
            {users.filter(u => u.is_admin).length}
          </div>
          <div className="text-sm text-gray-600">Admins</div>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-2xl font-bold">
            {users.filter(u => u.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users by email, name, or organization..."
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Organization</th>
              <th className="px-6 py-3">Account Type</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium">{user.email}</div>
                  <div className="text-sm text-gray-500">
                    {user.first_name} {user.last_name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">{user.organization || '—'}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {user.account_type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.is_admin ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                      <Shield className="h-3 w-3" />
                      Admin
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                      User
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      onClick={() => {
                        if (confirm(`Make ${user.is_admin ? 'user' : 'admin'}?`)) {
                          // Toggle admin status
                        }
                      }}
                    >
                      {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                    <button 
                      className="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                      onClick={() => {
                        if (confirm(`View details for ${user.email}?`)) {
                          // View user details
                        }
                      }}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}