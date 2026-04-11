import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface MalariaReportRecord {
  id: number;
  code?: string;
  patientName: string;
  testLevel: string;
  status: 'positive' | 'negative';
}

const TEST_LEVELS = [
  'Blood Smear Microscopy',
  'Rapid Diagnostic Tests (RDT)',
  'Polymerase Chain Reaction (PCR)',
  'Renal Function Test',
  'Liver Function Test',
  'Complete Blood Count',
];

const EMPTY_FORM = { code: '', name: '', testLevel: '', status: '' as '' | 'positive' | 'negative' };

export default function MalariaReport() {
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState<MalariaReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/malaria-reports`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      }
    } catch (err) {
      console.error('Error fetching malaria reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.testLevel || !form.status) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/malaria-reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: form.code,
          name: form.name,
          testLevel: form.testLevel,
          status: form.status,
        }),
      });

      if (response.ok) {
        await fetchReports(); // refresh from DB
        setForm(EMPTY_FORM);
        setShowForm(false);
        setError('');
      } else {
        const errData = await response.json();
        setError(errData.error || 'Failed to save report.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelCls = 'block text-sm font-medium text-slate-700 mb-1';

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 border-b-2 border-blue-600 inline-block pb-1">
        Malaria Report
      </h1>

      {/* Add Toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => { setShowForm(v => !v); setError(''); setForm(EMPTY_FORM); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {showForm ? <><X className="h-4 w-4" /> Close</> : <><Plus className="h-4 w-4" /> Add</>}
        </button>
      </div>

      {/* Entry Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-800">New Malaria Report Entry</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={labelCls}>Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={e => setForm(f => ({...f, code: e.target.value}))}
                  className={inputCls}
                  placeholder="Enter code"
                />
              </div>
              <div>
                <label className={labelCls}>Patient Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  className={inputCls}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className={labelCls}>Test Level <span className="text-red-500">*</span></label>
                <select
                  value={form.testLevel}
                  onChange={e => setForm(f => ({...f, testLevel: e.target.value}))}
                  className={`${inputCls} bg-white`}
                >
                  <option value="">Select Test Level</option>
                  {TEST_LEVELS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Status <span className="text-red-500">*</span></label>
                <div className="flex gap-6 mt-3">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="status"
                      value="positive"
                      checked={form.status === 'positive'}
                      onChange={() => setForm(f => ({...f, status: 'positive'}))}
                      className="text-blue-600"
                    />
                    <span className="text-green-700 font-medium">Positive</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="status"
                      value="negative"
                      checked={form.status === 'negative'}
                      onChange={() => setForm(f => ({...f, status: 'negative'}))}
                      className="text-blue-600"
                    />
                    <span className="text-slate-700 font-medium">Negative</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setError(''); }}
                className="px-5 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-60"
              >
                {submitting ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Records Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Malaria Report Records</h2>
          <span className="text-sm text-slate-500">{records.length} records</span>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center p-12 text-slate-500">Loading records...</div>
          ) : records.length === 0 ? (
            <div className="text-center p-12 text-slate-400">No records found. Click "+ Add" to create the first entry.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['S.No', 'Code', 'Patient Name', 'Test Level', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{r.code || '—'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{r.patientName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{r.testLevel}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        r.status === 'positive'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}