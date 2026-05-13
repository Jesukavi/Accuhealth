import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface MasterRecord {
  id: number;
  code?: string;
  name: string;
  isActive: boolean;
}

interface Props {
  categoryId: string;   // e.g. "education", "governorate"
  title: string;        // e.g. "Education"
  namePlaceholder?: string;
}

const MasterDetailPage: React.FC<Props> = ({ categoryId, title, namePlaceholder }) => {
  const [records, setRecords] = useState<MasterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', isActive: true });
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const token = () => localStorage.getItem('token');

  useEffect(() => {
    fetchRecords();
  }, [categoryId]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/masters/${categoryId}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (res.ok) setRecords(await res.json());
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ code: '', name: '', isActive: true });
    setError('');
    setShowForm(true);
  };

  const openEdit = (r: MasterRecord) => {
    setEditId(r.id);
    setForm({ code: r.code || '', name: r.name, isActive: r.isActive });
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required.'); return; }
    setSubmitting(true);
    try {
      const isEdit = editId !== null;
      const url = isEdit
        ? `${API_BASE_URL}/masters/${categoryId}/${editId}`
        : `${API_BASE_URL}/masters/${categoryId}`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setEditId(null);
        fetchRecords();
      } else {
        const d = await res.json();
        setError(d.error || 'Failed to save.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await fetch(`${API_BASE_URL}/masters/${categoryId}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      fetchRecords();
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const inputCls = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                title="Back"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            </div>
            <button
              onClick={openAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>

          {/* Inline Add/Edit Form */}
          {showForm && (
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
              <h2 className="text-sm font-semibold text-blue-800 mb-3">
                {editId ? `Edit ${title}` : `New ${title}`}
              </h2>
              {error && (
                <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Code</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                    placeholder="Code (optional)"
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder={namePlaceholder || `Enter ${title} name`}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Active</label>
                  <select
                    value={form.isActive ? 'true' : 'false'}
                    onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'true' }))}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-60"
                  >
                    <Check className="h-4 w-4" />
                    {submitting ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setError(''); }}
                    className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12 text-slate-500">Loading...</div>
            ) : records.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No records found. Click "+ Add" to create the first entry.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-6 py-3 text-left text-sm font-medium border-r border-blue-500">S.No</th>
                    <th className="px-6 py-3 text-left text-sm font-medium border-r border-blue-500">Code</th>
                    <th className="px-6 py-3 text-left text-sm font-medium border-r border-blue-500">{title}</th>
                    <th className="px-6 py-3 text-left text-sm font-medium border-r border-blue-500">Active</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {records.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 text-sm text-gray-600 border-r border-gray-100">{idx + 1}</td>
                      <td className="px-6 py-3 text-sm text-gray-500 border-r border-gray-100">{r.code || '—'}</td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-800 border-r border-gray-100">{r.name}</td>
                      <td className="px-6 py-3 text-sm border-r border-gray-100">
                        <span className={`font-medium ${r.isActive ? 'text-green-600' : 'text-red-500'}`}>
                          {r.isActive ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEdit(r)}
                            className="text-amber-500 hover:text-amber-700 flex items-center gap-1"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="text-red-400 hover:text-red-600 flex items-center gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterDetailPage;
