import React, { useState, useEffect } from 'react';
import CreateUserModal from '../components/CreateUserModal';
import {
  Plus,
  Edit,
  Search,
  UserCheck,
  UserX,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Key,
} from 'lucide-react';

interface UserRow {
  id: string;
  name: string;
  email: string;
  description?: string;
  is_active: boolean;
  isSuperAdmin: boolean;
  allowedPages: string[];
  roleId?: number | null;
  roleName?: string | null;
}

import { API_BASE_URL } from '../config';
const API_URL = API_BASE_URL;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    setUpdatingUser(userId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: isActive }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, is_active: isActive } : u))
        );
      } else {
        fetchUsers();
      }
    } catch {
      fetchUsers();
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleEditUser = (user: UserRow) => {
    setEditUser(user);
    setShowCreateModal(true);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditUser(null);
  };

  const handleModalSuccess = () => {
    fetchUsers();
    setShowCreateModal(false);
    setEditUser(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && u.is_active) ||
      (filterStatus === 'inactive' && !u.is_active);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-sm">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage system users and their page-level access permissions
          </p>
        </div>
        <button
          onClick={() => { setEditUser(null); setShowCreateModal(true); }}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Create User</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center space-x-4">
          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
            <UserCheck className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-slate-900">{users.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center space-x-4">
          <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active</p>
            <p className="text-2xl font-bold text-slate-900">{users.filter((u) => u.is_active).length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center space-x-4">
          <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center">
            <Shield className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Super Admins</p>
            <p className="text-2xl font-bold text-slate-900">{users.filter((u) => u.isSuperAdmin).length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All Users</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">User Directory</h2>
          <span className="text-xs text-slate-400">{filteredUsers.length} users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Access Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pages Allowed</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {/* User info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role label */}
                  <td className="px-6 py-4">
                    {user.isSuperAdmin ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        <Shield className="h-3 w-3" />
                        Super Admin
                      </span>
                    ) : user.roleName ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        <Shield className="h-3 w-3" />
                        {user.roleName}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No role</span>
                    )}
                  </td>

                  {/* Access Type */}
                  <td className="px-6 py-4">
                    {user.isSuperAdmin ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        <Shield className="h-3 w-3" />
                        Super Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                        <UserCheck className="h-3 w-3" />
                        User
                      </span>
                    )}
                  </td>

                  {/* Pages */}
                  <td className="px-6 py-4">
                    {user.isSuperAdmin ? (
                      <span className="text-xs text-green-600 font-medium">All Pages</span>
                    ) : (
                      <div className="flex items-center space-x-1.5">
                        <Key className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs text-slate-600 font-medium">
                          {user.allowedPages?.length ?? 0} page{(user.allowedPages?.length ?? 0) !== 1 ? 's' : ''}
                        </span>
                        {(user.allowedPages?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {user.allowedPages.slice(0, 3).map((p) => (
                              <span
                                key={p}
                                className="inline-block bg-slate-100 text-slate-600 text-xs px-1.5 py-0.5 rounded font-mono"
                              >
                                {p.replace('/', '')}
                              </span>
                            ))}
                            {user.allowedPages.length > 3 && (
                              <span className="text-xs text-slate-400">
                                +{user.allowedPages.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Status toggle */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={user.is_active}
                          onChange={(e) => updateUserStatus(user.id, e.target.checked)}
                          disabled={updatingUser === user.id || user.isSuperAdmin}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 ${
                            updatingUser === user.id ? 'opacity-50' : ''
                          }`}
                        />
                      </label>
                      {user.is_active ? (
                        <span className="text-xs font-medium text-green-600 flex items-center space-x-1">
                          <CheckCircle className="h-3.5 w-3.5" /><span>Active</span>
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-red-500 flex items-center space-x-1">
                          <XCircle className="h-3.5 w-3.5" /><span>Inactive</span>
                        </span>
                      )}
                      {updatingUser === user.id && (
                        <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    {!user.isSuperAdmin && (
                      <button
                        onClick={() => handleEditUser(user)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit Permissions</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1">No users found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Create / Edit User Modal */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editUser={editUser}
      />
    </div>
  );
};

export default UserManagement;