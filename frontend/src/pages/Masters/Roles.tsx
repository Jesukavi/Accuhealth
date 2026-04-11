import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, X, Save, Shield, ChevronDown, ChevronRight,
  CheckSquare, Square, ArrowLeft, AlertCircle, Check,
} from 'lucide-react';
import { ALL_PAGES, PAGE_GROUPS, getPagesByGroup } from '../../constants/pages';
import { API_BASE_URL } from '../../config';

interface Role {
  id: number;
  name: string;
  description: string;
  allowedPages: string[];
  isActive: boolean;
}

const EMPTY_FORM = { name: '', description: '', allowedPages: [] as string[], isActive: true };

// ─── Page access selector sub-component ──────────────────────────────────────
const PageAccessSelector: React.FC<{
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
}> = ({ selected, onChange }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(PAGE_GROUPS));

  const togglePage = (key: string) => {
    const next = new Set(selected);
    next.has(key) ? next.delete(key) : next.add(key);
    onChange(next);
  };

  const toggleGroup = (group: string) => {
    const keys = getPagesByGroup(group).map((p) => p.key);
    const allOn = keys.every((k) => selected.has(k));
    const next = new Set(selected);
    if (allOn) keys.forEach((k) => next.delete(k));
    else keys.forEach((k) => next.add(k));
    onChange(next);
  };

  const toggleExpand = (g: string) => {
    const s = new Set(expanded);
    s.has(g) ? s.delete(g) : s.add(g);
    setExpanded(s);
  };

  const selectAll = () => onChange(new Set(ALL_PAGES.map((p) => p.key)));
  const clearAll = () => onChange(new Set());

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-bold text-gray-800">Page Access</span>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {selected.size} selected
          </span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={selectAll}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
            Select All
          </button>
          <button type="button" onClick={clearAll}
            className="text-xs text-slate-500 hover:text-slate-700 font-medium px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors">
            Clear All
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {PAGE_GROUPS.map((group, gIdx) => {
          const pages = getPagesByGroup(group);
          const allOn = pages.every((p) => selected.has(p.key));
          const partial = pages.some((p) => selected.has(p.key)) && !allOn;
          const open = expanded.has(group);
          return (
            <div key={group} className={gIdx > 0 ? 'border-t border-gray-100' : ''}>
              <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors">
                <button type="button" className="flex items-center gap-2 flex-1" onClick={() => toggleExpand(group)}>
                  {open ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  <span className="text-sm font-semibold text-gray-700">{group}</span>
                  <span className="text-xs text-gray-400">({pages.filter(p => selected.has(p.key)).length}/{pages.length})</span>
                </button>
                <button type="button" onClick={() => toggleGroup(group)}
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium">
                  {allOn ? <CheckSquare className="h-4 w-4 text-blue-600" />
                    : partial ? <div className="h-4 w-4 border-2 border-blue-400 rounded bg-blue-100 flex items-center justify-center"><div className="h-1.5 w-1.5 bg-blue-400 rounded-sm" /></div>
                    : <Square className="h-4 w-4 text-gray-400" />}
                  <span>{allOn ? 'Deselect' : 'Select'} All</span>
                </button>
              </div>
              {open && (
                <div className="divide-y divide-gray-50">
                  {pages.map((page) => (
                    <label key={page.key}
                      className="flex items-center gap-3 px-5 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors">
                      <div
                        className={`h-4 w-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selected.has(page.key) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'
                        }`}
                        onClick={() => togglePage(page.key)}
                      >
                        {selected.has(page.key) && (
                          <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-sm ${selected.has(page.key) ? 'text-blue-700 font-medium' : 'text-gray-600'}`}
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
  );
};

// ─── Role Form Modal ──────────────────────────────────────────────────────────
const RoleModal: React.FC<{
  isOpen: boolean;
  role: Role | null;
  onClose: () => void;
  onSave: () => void;
}> = ({ isOpen, role, onClose, onSave }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (role) {
        setForm({ name: role.name, description: role.description || '', allowedPages: role.allowedPages, isActive: role.isActive });
        setSelectedPages(new Set(role.allowedPages));
      } else {
        setForm(EMPTY_FORM);
        setSelectedPages(new Set());
      }
      setError('');
    }
  }, [isOpen, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Role name is required.'); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const body = { ...form, allowedPages: [...selectedPages] };
      const url = role ? `${API_BASE_URL}/roles/${role.id}` : `${API_BASE_URL}/roles`;
      const res = await fetch(url, {
        method: role ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (res.ok) { onSave(); onClose(); }
      else { const d = await res.json(); setError(d.error || 'Failed to save role.'); }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{role ? 'Edit Role' : 'Create New Role'}</h2>
              <p className="text-blue-100 text-xs">Set role name and page access permissions</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Name + Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Role Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Data Entry Operator"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Optional description"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.isActive}
                onChange={(e) => setForm(f => ({ ...f, isActive: e.target.checked }))}
                className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
            </label>
            <span className="text-sm font-medium text-gray-700">Active</span>
          </div>

          {/* Page Access */}
          <PageAccessSelector selected={selectedPages} onChange={setSelectedPages} />
        </form>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all shadow-lg shadow-blue-500/25">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{loading ? 'Saving...' : role ? 'Update Role' : 'Create Role'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Roles Page ──────────────────────────────────────────────────────────
const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setRoles(await res.json());
    } catch { showToast('Failed to load roles', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/roles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { showToast('Role deleted'); fetchRoles(); }
      else showToast('Failed to delete role', 'error');
    } catch { showToast('Network error', 'error'); }
    finally { setDeleteId(null); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => window.history.back()} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-6 w-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Role Management
              </h1>
              <p className="text-sm text-slate-500">Define roles with specific page access permissions</p>
            </div>
          </div>
          <button
            onClick={() => { setEditRole(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Role
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Loading roles...</p>
            </div>
          ) : roles.length === 0 ? (
            <div className="py-20 text-center">
              <Shield className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-slate-600 font-semibold mb-1">No roles defined yet</h3>
              <p className="text-slate-400 text-sm">Click "Add Role" to create your first role.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold">#</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold">Role Name</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold">Description</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold">Pages Access</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roles.map((role, idx) => (
                    <tr key={role.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 text-sm text-slate-500">{idx + 1}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5">
                          <Shield className="h-3.5 w-3.5 text-blue-500" />
                          <span className="text-sm font-semibold text-slate-800">{role.name}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">{role.description || '—'}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(role.allowedPages || []).length === 0 ? (
                            <span className="text-xs text-slate-400 italic">No pages</span>
                          ) : (role.allowedPages || []).slice(0, 4).map((p) => (
                            <span key={p} className="inline-block bg-blue-50 text-blue-700 text-xs px-1.5 py-0.5 rounded font-mono">
                              {p.replace('/', '')}
                            </span>
                          ))}
                          {(role.allowedPages || []).length > 4 && (
                            <span className="text-xs text-slate-400">+{(role.allowedPages || []).length - 4} more</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          role.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {role.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setEditRole(role); setShowModal(true); }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          {deleteId === role.id ? (
                            <span className="flex items-center gap-1 text-xs">
                              <button onClick={() => handleDelete(role.id)}
                                className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">Yes</button>
                              <button onClick={() => setDeleteId(null)}
                                className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs hover:bg-slate-300">No</button>
                            </span>
                          ) : (
                            <button onClick={() => setDeleteId(role.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <RoleModal
        isOpen={showModal}
        role={editRole}
        onClose={() => { setShowModal(false); setEditRole(null); }}
        onSave={() => { fetchRoles(); showToast(editRole ? 'Role updated' : 'Role created'); }}
      />
    </div>
  );
};

export default Roles;