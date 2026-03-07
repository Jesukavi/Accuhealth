import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, ArrowLeft, Loader2, Thermometer, CheckCircle, Clock, Pencil, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface FeverRashRecord {
  id?: number;
  _id?: string;
  notificationId?: string;
  patientId?: string;
  firstName?: string;
  secondName?: string;
  thirdName?: string;
  civilId?: string;
  reportingDate?: string;
  dateOfOnset?: string;
  classification?: string;
  finalOutcome?: string;
  governorate?: string;
  institution?: string;
  gender?: string;
  age?: string | number;
  status?: string;
}

const FeverRashNotificationListing: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<FeverRashRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, pending: 0, recovered: 0, measles: 0 });

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async (searchTerm = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = searchTerm
        ? `${API_BASE_URL}/fever-rash?search=${encodeURIComponent(searchTerm)}`
        : `${API_BASE_URL}/fever-rash`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        const notifications: FeverRashRecord[] = data.notifications || data.rows || data || [];
        setRecords(notifications);
        setStats({
          total: notifications.length,
          pending: notifications.filter(n => !n.finalOutcome || n.finalOutcome === 'Pending').length,
          recovered: notifications.filter(n => n.finalOutcome === 'Recovered').length,
          measles: notifications.filter(n => n.classification === 'measles').length,
        });
      } else {
        console.error('Failed to fetch Fever & Rash notifications');
      }
    } catch (error) {
      console.error('Error fetching Fever & Rash notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchRecords(search); };

  const handleDelete = async (id: number | string | undefined) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/fever-rash/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchRecords(search);
      else alert('Failed to delete notification');
    } catch { alert('Error deleting record'); }
  };

  const getStatusCls = (record: FeverRashRecord) => {
    const outcome = record.finalOutcome || record.status || '';
    if (outcome === 'Recovered') return 'bg-green-100 text-green-800';
    if (outcome === 'Died') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getClassCls = (c?: string) => {
    if (!c) return 'bg-slate-100 text-slate-600';
    if (c === 'measles') return 'bg-orange-100 text-orange-700';
    if (c === 'rubella') return 'bg-pink-100 text-pink-700';
    return 'bg-slate-100 text-slate-600';
  };

  const formatName = (r: FeverRashRecord) =>
    [r.firstName, r.secondName, r.thirdName].filter(Boolean).join(' ') || '—';

  const statCards = [
    { label: 'Total',     value: stats.total,     icon: FileText,    bg: 'bg-blue-100',   ic: 'text-blue-600',   val: 'text-blue-700' },
    { label: 'Pending',   value: stats.pending,   icon: Clock,       bg: 'bg-yellow-100', ic: 'text-yellow-600', val: 'text-yellow-700' },
    { label: 'Recovered', value: stats.recovered, icon: CheckCircle, bg: 'bg-green-100',  ic: 'text-green-600',  val: 'text-green-700' },
    { label: 'Measles',   value: stats.measles,   icon: Thermometer, bg: 'bg-orange-100', ic: 'text-orange-600', val: 'text-orange-700' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <ArrowLeft
                className="w-4 h-4 cursor-pointer hover:text-slate-800 flex-shrink-0"
                onClick={() => navigate('/dashboard')}
              />
              <span>Notifications</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Fever &amp; Rash Notifications
            </h1>
            <p className="text-slate-500 text-sm">Manage and track Fever &amp; Rash notification entries</p>
          </div>
          <button
            onClick={() => navigate('/fever-rash-entry/new')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow-blue-300 active:scale-95 whitespace-nowrap flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>

        {/* ── Stats Cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map(({ label, value, icon: Icon, bg, ic, val }) => (
            <div key={label} className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">{label}</p>
                  <p className={`text-2xl sm:text-3xl font-bold mt-1 ${val}`}>{value}</p>
                </div>
                <div className={`w-10 h-10 sm:w-11 sm:h-11 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${ic}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search bar ──────────────────────────────────────── */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-2 sm:gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, patient ID or civil ID…"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-4 sm:px-5 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors text-sm whitespace-nowrap"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); fetchRecords(); }}
                className="px-3 sm:px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* ── Table (desktop) / Cards (mobile) ────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          {/* Desktop table — hidden on small screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">#</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient ID / Civil ID</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Institution / Governorate</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Report Date / Onset</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Classification</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Outcome</th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-14 text-center text-slate-500">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                      Loading…
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-14 text-center text-slate-400 text-sm">
                      No Fever &amp; Rash notifications found.{' '}
                      <button
                        onClick={() => navigate('/fever-rash-entry/new')}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Add a new entry.
                      </button>
                    </td>
                  </tr>
                ) : (
                  records.map((r, idx) => (
                    <tr
                      key={r.id ?? r._id ?? r.notificationId ?? idx}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {/* # */}
                      <td className="px-4 py-4 text-sm text-slate-400">{idx + 1}</td>

                      {/* Patient */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs shrink-0">
                            {(r.firstName?.[0] ?? '?').toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 text-sm truncate max-w-[160px]">{formatName(r)}</div>
                            <div className="text-xs text-slate-400">{r.gender || '—'} · Age {r.age ?? '—'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Patient ID / Civil ID */}
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-slate-700 font-mono">{r.patientId || '—'}</div>
                        <div className="text-xs text-slate-400">{r.civilId || '—'}</div>
                      </td>

                      {/* Institution / Governorate */}
                      <td className="px-4 py-4">
                        <div className="text-sm text-slate-700">{r.institution || '—'}</div>
                        <div className="text-xs text-slate-400">{r.governorate || '—'}</div>
                      </td>

                      {/* Dates */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600">
                          {r.reportingDate ? new Date(r.reportingDate).toLocaleDateString() : '—'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {r.dateOfOnset ? `Onset: ${new Date(r.dateOfOnset).toLocaleDateString()}` : '—'}
                        </div>
                      </td>

                      {/* Classification */}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getClassCls(r.classification)}`}>
                          {r.classification || 'Unclassified'}
                        </span>
                      </td>

                      {/* Outcome */}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusCls(r)}`}>
                          {r.finalOutcome || r.status || 'Pending'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/fever-rash-view/${r.id ?? r._id}`)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View / Download"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/fever-rash-entry/new?id=${r.id ?? r._id}`)}
                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id ?? r._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards — shown only on small screens */}
          <div className="md:hidden divide-y divide-slate-100">
            {loading ? (
              <div className="py-14 text-center text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                Loading…
              </div>
            ) : records.length === 0 ? (
              <div className="py-14 text-center text-slate-400 text-sm px-4">
                No Fever &amp; Rash notifications found.{' '}
                <button
                  onClick={() => navigate('/fever-rash-entry/new')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Add a new entry.
                </button>
              </div>
            ) : (
              records.map((r, idx) => (
                <div key={r.id ?? r._id ?? idx} className="p-4 space-y-3">
                  {/* Top row: avatar + name + actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                        {(r.firstName?.[0] ?? '?').toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 text-sm truncate">{formatName(r)}</div>
                        <div className="text-xs text-slate-500">{r.gender || '—'} · Age {r.age ?? '—'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => navigate(`/fever-rash-view/${r.id ?? r._id}`)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View / Download"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/fever-rash-entry/new?id=${r.id ?? r._id}`)}
                        className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id ?? r._id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Detail rows */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <span className="text-slate-400 block mb-0.5">Civil ID</span>
                      <span className="text-slate-700 font-medium">{r.civilId || '—'}</span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <span className="text-slate-400 block mb-0.5">Location</span>
                      <span className="text-slate-700 font-medium">{r.governorate ?? r.institution ?? '—'}</span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <span className="text-slate-400 block mb-0.5">Reporting Date</span>
                      <span className="text-slate-700 font-medium">
                        {r.reportingDate ? new Date(r.reportingDate).toLocaleDateString() : '—'}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <span className="text-slate-400 block mb-0.5">Onset Date</span>
                      <span className="text-slate-700 font-medium">
                        {r.dateOfOnset ? new Date(r.dateOfOnset).toLocaleDateString() : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getClassCls(r.classification)}`}>
                      {r.classification || 'Unclassified'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusCls(r)}`}>
                      {r.finalOutcome || r.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer count */}
          {records.length > 0 && (
            <div className="px-4 sm:px-6 py-3 border-t border-slate-100 text-xs sm:text-sm text-slate-500">
              Showing {records.length} record{records.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FeverRashNotificationListing;
