import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, ArrowLeft, Loader2, Bug, Trash2, Pencil } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface MalariaRecord {
    id: number;
    notificationId: string;
    reportingDate: string;
    patientName: string;
    patientNo: string;
    age: number | string;
    sex: string;
    reportingInstitute: string;
    status: string;
    // raw fields available when fetching single record
    outcome?: string;
}

const statusColors: Record<string, string> = {
    Saved:     'bg-green-100 text-green-700',
    Rejected:  'bg-red-100 text-red-700',
    Pending:   'bg-yellow-100 text-yellow-700',
    Draft:     'bg-slate-100 text-slate-600',
};

const MalariaNotificationListing: React.FC = () => {
    const navigate = useNavigate();
    const [records, setRecords]   = useState<MalariaRecord[]>([]);
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState('');
    const [stats, setStats]       = useState({ total: 0, saved: 0, rejected: 0, institutes: 0 });

    useEffect(() => { fetchRecords(); }, []);

    const fetchRecords = async (searchTerm = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = searchTerm
                ? `${API_BASE_URL}/malaria-notifications?search=${encodeURIComponent(searchTerm)}`
                : `${API_BASE_URL}/malaria-notifications`;

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                const data = await res.json();
                const notifications: MalariaRecord[] = data.notifications || [];
                setRecords(notifications);
                setStats({
                    total:     notifications.length,
                    saved:     notifications.filter(n => n.status === 'Saved').length,
                    rejected:  notifications.filter(n => n.status === 'Rejected').length,
                    institutes: new Set(notifications.map(n => n.reportingInstitute)).size,
                });
            }
        } catch (err) {
            console.error('Error fetching malaria records:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchRecords(search);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this notification?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/malaria-notifications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) fetchRecords(search);
            else alert('Failed to delete notification');
        } catch {
            alert('Error deleting record');
        }
    };

    const statCards = [
        { label: 'Total',      value: stats.total,      textCls: 'text-slate-900',  bgCls: 'bg-blue-100',   iconCls: 'text-blue-600' },
        { label: 'Saved',      value: stats.saved,      textCls: 'text-green-700',  bgCls: 'bg-green-100',  iconCls: 'text-green-600' },
        { label: 'Rejected',   value: stats.rejected,   textCls: 'text-red-600',    bgCls: 'bg-red-100',    iconCls: 'text-red-600' },
        { label: 'Institutes', value: stats.institutes, textCls: 'text-orange-600', bgCls: 'bg-orange-100', iconCls: 'text-orange-600' },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                            <ArrowLeft className="w-4 h-4 cursor-pointer hover:text-slate-800" onClick={() => navigate('/dashboard')} />
                            <span>Notifications</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                <Bug className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Malaria Notifications</h1>
                                <p className="text-slate-500 text-sm">Manage and track malaria case notifications</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/malaria-entry')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Notification</span>
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {statCards.map(c => (
                        <div key={c.label} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500 font-medium">{c.label}</p>
                                    <p className={`text-3xl font-bold mt-1 ${c.textCls}`}>{c.value}</p>
                                </div>
                                <div className={`w-12 h-12 ${c.bgCls} rounded-lg flex items-center justify-center`}>
                                    <FileText className={`w-6 h-6 ${c.iconCls}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name or patient ID..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                            Search
                        </button>
                        {search && (
                            <button type="button" onClick={() => { setSearch(''); fetchRecords(); }}
                                className="px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 text-sm transition-colors">
                                Clear
                            </button>
                        )}
                    </form>
                </div>

                {/* Table — mirrors the original HTML columns exactly */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    {['S.No', 'Notification ID', 'Reporting Date', 'Patient Name', 'Patient No', 'Age', 'Sex', 'Reporting Institute', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={10} className="py-12 text-center text-slate-500">
                                            <div className="flex justify-center items-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Loading records...
                                            </div>
                                        </td>
                                    </tr>
                                ) : records.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="py-16 text-center">
                                            <Bug className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                            <p className="text-slate-500 font-medium">No malaria notifications found</p>
                                            <p className="text-slate-400 text-sm mt-1">Click "Add Notification" to create one</p>
                                        </td>
                                    </tr>
                                ) : (
                                    records.map((r, idx) => (
                                        <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-5 py-3.5 text-sm text-slate-500">{idx + 1}</td>
                                            <td className="px-5 py-3.5 text-sm font-mono text-blue-700">{r.notificationId || '-'}</td>
                                            <td className="px-5 py-3.5 text-sm text-slate-600">{r.reportingDate || '-'}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs flex-shrink-0">
                                                        {(r.patientName?.[0] || 'M').toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-900">{r.patientName || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-slate-600">{r.patientNo || '-'}</td>
                                            <td className="px-5 py-3.5 text-sm text-slate-600">{r.age ?? '-'}</td>
                                            <td className="px-5 py-3.5 text-sm text-slate-600">{r.sex || '-'}</td>
                                            <td className="px-5 py-3.5 text-sm text-slate-600 max-w-[160px] truncate">{r.reportingInstitute || '-'}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => navigate(`/malaria-view/${r.id}`)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View / Download"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/malaria-entry/${r.id}`)}
                                                        className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(r.id)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                    {records.length > 0 && (
                        <div className="px-6 py-3 border-t border-slate-100 text-sm text-slate-500">
                            Showing {records.length} record{records.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MalariaNotificationListing;
