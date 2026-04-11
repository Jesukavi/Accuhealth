import React, { useState, useEffect } from 'react';
import {
  X, User, Mail, Lock, Eye, EyeOff, Shield, CheckSquare, Square,
  ChevronDown, ChevronRight, UserPlus, Save, AlertCircle
} from 'lucide-react';
import { ALL_PAGES, PAGE_GROUPS, getPagesByGroup } from '../constants/pages';
import { API_BASE_URL } from '../config';

interface Role {
  id: number;
  name: string;
  allowedPages: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editUser?: {
    id: string;
    name: string;
    email: string;
    description?: string;
    allowedPages: string[];
  } | null;
}

const CreateUserModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, editUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(PAGE_GROUPS));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | ''>('');

  const isEditMode = !!editUser;

  useEffect(() => {
    if (isOpen) {
      // Fetch roles for dropdown
      const token = localStorage.getItem('token');
      fetch(`${API_BASE_URL}/roles`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : [])
        .then(data => setRoles(data.filter((r: Role) => r.isActive)))
        .catch(() => setRoles([]));

      if (editUser) {
        setName(editUser.name);
        setEmail(editUser.email);
        setDescription(editUser.description || '');
        setSelectedPages(new Set(editUser.allowedPages));
        setPassword('');
      } else {
        setName('');
        setEmail('');
        setPassword('');
        setDescription('');
        setSelectedPages(new Set());
      }
      setSelectedRoleId('');
      setError('');
    }
  }, [isOpen, editUser]);

  const togglePage = (key: string) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleGroup = (group: string) => {
    const groupPages = getPagesByGroup(group).map((p) => p.key);
    const allSelected = groupPages.every((k) => selectedPages.has(k));
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (allSelected) groupPages.forEach((k) => next.delete(k));
      else groupPages.forEach((k) => next.add(k));
      return next;
    });
  };

  const selectAll = () => setSelectedPages(new Set(ALL_PAGES.map((p) => p.key)));
  const clearAll = () => setSelectedPages(new Set());

  const isGroupFull = (group: string) =>
    getPagesByGroup(group).every((p) => selectedPages.has(p.key));
  const isGroupPartial = (group: string) =>
    getPagesByGroup(group).some((p) => selectedPages.has(p.key));

  const toggleGroupExpand = (group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  // When a role is selected, auto-fill its page access
  const handleRoleChange = (roleId: number | '') => {
    setSelectedRoleId(roleId);
    if (roleId !== '') {
      const role = roles.find(r => r.id === roleId);
      if (role?.allowedPages?.length) {
        setSelectedPages(new Set(role.allowedPages));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (!isEditMode && !password.trim()) {
      setError('Password is required for new users.');
      return;
    }
    if (selectedPages.size === 0) {
      setError('Please select at least one page to grant access.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const selectedRole = roles.find(r => r.id === selectedRoleId);
      const body: Record<string, unknown> = {
        name,
        email,
        description,
        allowedPages: [...selectedPages],
        roleId: selectedRole?.id || null,
        roleName: selectedRole?.name || null,
      };
      if (password) body.password = password;

      const url = isEditMode
        ? `${API_BASE_URL}/users/${editUser!.id}`
        : `${API_BASE_URL}/users`;

      const res = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save user.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditMode ? 'Edit User' : 'Create New User'}
              </h2>
              <p className="text-blue-100 text-xs">
                {isEditMode ? 'Update credentials and page access' : 'Set credentials and select accessible pages'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Error */}
          {error && (
            <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* User Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Password {isEditMode ? '(leave blank to keep)' : '*'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEditMode ? '••••••••' : 'Set password'}
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional note"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>

          {/* Role Selector */}
          {roles.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Assign Role <span className="text-gray-400 font-normal normal-case">(auto-fills page access)</span>
              </label>
              <select
                value={selectedRoleId}
                onChange={(e) => handleRoleChange(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="">— Select a role (optional) —</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Page Permissions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-bold text-gray-800">Page Access Permissions</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {selectedPages.size} selected
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-gray-500 hover:text-gray-700 font-medium px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Groups */}
            <div className="space-y-2 border border-gray-200 rounded-xl overflow-hidden">
              {PAGE_GROUPS.map((group, gIdx) => {
                const pages = getPagesByGroup(group);
                const full = isGroupFull(group);
                const partial = isGroupPartial(group) && !full;
                const expanded = expandedGroups.has(group);

                return (
                  <div key={group} className={gIdx > 0 ? 'border-t border-gray-100' : ''}>
                    {/* Group header */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <button
                        type="button"
                        className="flex items-center space-x-2 flex-1"
                        onClick={() => toggleGroupExpand(group)}
                      >
                        {expanded
                          ? <ChevronDown className="h-4 w-4 text-gray-500" />
                          : <ChevronRight className="h-4 w-4 text-gray-500" />}
                        <span className="text-sm font-semibold text-gray-700">{group}</span>
                        <span className="text-xs text-gray-400 ml-1">
                          ({pages.filter((p) => selectedPages.has(p.key)).length}/{pages.length})
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleGroup(group)}
                        className="flex items-center space-x-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {full ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : partial ? (
                          <div className="h-4 w-4 border-2 border-blue-400 rounded bg-blue-100 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 bg-blue-400 rounded-sm" />
                          </div>
                        ) : (
                          <Square className="h-4 w-4 text-gray-400" />
                        )}
                        <span>{full ? 'Deselect' : 'Select'} All</span>
                      </button>
                    </div>

                    {/* Pages in group */}
                    {expanded && (
                      <div className="divide-y divide-gray-50">
                        {pages.map((page) => (
                          <label
                            key={page.key}
                            className="flex items-center space-x-3 px-5 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                          >
                            <div
                              className={`h-4 w-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                selectedPages.has(page.key)
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'border-gray-300 bg-white'
                              }`}
                              onClick={() => togglePage(page.key)}
                            >
                              {selectedPages.has(page.key) && (
                                <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span
                              className={`text-sm transition-colors ${
                                selectedPages.has(page.key) ? 'text-blue-700 font-medium' : 'text-gray-600'
                              }`}
                              onClick={() => togglePage(page.key)}
                            >
                              {page.label}
                            </span>
                            <span className="text-xs text-gray-300 font-mono ml-auto">{page.key}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end space-x-3 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all shadow-lg shadow-blue-500/25"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{loading ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
