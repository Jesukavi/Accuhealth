import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface HEVRecord {
    _id: string; // Mongoose ID
    id?: number; 
    patientId: string;
    firstName: string;
    secondName: string;
    civilId: string;
    reportingDate: string; // ISO string from DB
    outcome: string;
    finalOutcome: string;
}

const HEVListing: React.FC = () => {
    // ...
    const navigate = useNavigate();
    const [records, setRecords] = useState<HEVRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    // ... stats logic? HEVListing in Step 631 didn't show stats state in displayed lines 1-200 except in code?
    // Wait, Step 631 lines 1-200. I didn't see stats state.
    // Line 23: const [search, setSearch] = useState('');
    // Line 24: useEffect...
    // The stats state is MISSING or I missed it.
    // Ah, lines 17-66.
    // records.map uses `record.firstName` etc.
    // I should check if HEVListing had stats. The viewer shows lines 1-200.
    // It seems HEVListing does NOT have stats logic in the state definition (lines 18-23).
    // BUT the JSX lines 108-153 DOES render stats!
    // `<p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>`
    // This implies `stats` exists.
    // Code in Step 631:
    // 18: const HEVListing: React.FC = () => {
    // 19:     const navigate = useNavigate();
    // 20:     const [records, setRecords] = useState<HEVRecord[]>([]);
    // 21:     const [loading, setLoading] = useState(true);
    // 22:     const [search, setSearch] = useState('');
    // 23:
    // 24:     useEffect(() => {
    //
    // Where is `stats`?
    // Maybe it's defined after?
    // It's not in lines 1-38.
    // This means `HEVListing.tsx` might be broken or I missed it?
    // Wait, I am replacing the whole file content implicitly if I effectively replace imports + logic + return.
    // I should add `stats` logic if it was missing or if I am overwriting it.
    // I'll add the stats logic to be safe, matching the UI expectation.

    const [stats, setStats] = useState({
        total: 0,
        saved: 0,
        rejected: 0,
        institutes: 0
    });

    useEffect(() => {
        const initAndFetch = async () => {
            const token = localStorage.getItem('token');
            try {
                await fetch(`${API_BASE_URL}/hev-notifications/init-table`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (e) {
                console.warn('Table init warning:', e);
            }
            fetchRecords();
        };
        initAndFetch();
    }, []);

    const fetchRecords = async (searchTerm = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = searchTerm
                ? `${API_BASE_URL}/hev-notifications?search=${encodeURIComponent(searchTerm)}`
                : `${API_BASE_URL}/hev-notifications`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const notifications = data.notifications || [];
                setRecords(notifications);
                
                // HEV uses camelCase and potentially different outcome values? 
                // Assuming standard Outcome values.
                setStats({
                    total: notifications.length,
                    saved: notifications.filter((n: HEVRecord) => n.outcome === 'Recovered').length,
                    rejected: notifications.filter((n: HEVRecord) => n.outcome === 'Died').length,
                    institutes: new Set(notifications.map((n: any) => n.institution)).size
                });
            } else {
                console.error('Failed to fetch records');
            }
        } catch (error) {
            console.error('Error fetching HEV records:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchRecords(search);
    };

    const handleDelete = async (id: number | string | undefined) => {
        if (!id) return;
        if (!window.confirm('Are you sure you want to delete this notification?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/hev-notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setRecords(records.filter(r => (r._id !== id && r.id !== id)));
                fetchRecords(search);
            } else {
                alert('Failed to delete notification');
            }
        } catch (error) {
            console.error('Error deleting record:', error);
            alert('Error deleting record');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                            <ArrowLeft className="w-4 h-4 cursor-pointer hover:text-slate-800" onClick={() => navigate('/dashboard')} />
                            <span>Notifications</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HEV Reports</h1>
                        <p className="text-slate-500">Manage and track Hepatitis E Virus notifications</p>
                    </div>

                    <div className="flex gap-3">
                         <button 
                            onClick={() => navigate('/hev-notification-form')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-sm shadow-blue-200 hover:shadow-blue-300 active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Notification</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards - Simplified for HEV */}
                {/* Wait, the stats cards were using `stats.total` etc. I should include them. */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Total</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    {/* ... other stats ... */}
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Saved</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{stats.saved}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Rejected</p>
                                <p className="text-3xl font-bold text-red-600 mt-1">{stats.rejected}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Institutes</p>
                                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.institutes}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search - Simplified for HEV */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name, ID or civil ID..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors">
                            Search
                        </button>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient Info</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">IDs</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Reporting Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-500">
                                            <div className="flex justify-center items-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Loading records...
                                            </div>
                                        </td>
                                    </tr>
                                ) : records.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-500">
                                            No HEV notifications found
                                        </td>
                                    </tr>
                                ) : (
                                    records.map((record) => (
                                        <tr key={record._id || record.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                        {record.firstName?.[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">
                                                            {record.firstName} {record.secondName}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            File ID: {record.patientId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-slate-700">{record.civilId}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-600">
                                                    {record.reportingDate ? new Date(record.reportingDate).toLocaleDateString() : '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    record.outcome === 'Recovered' ? 'bg-green-100 text-green-800' :
                                                    record.outcome === 'Died' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {record.outcome || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => navigate(`/hev-view/${record.id || record._id}`)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => navigate(`/hev-notification/${record.id || record._id}`)}
                                                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(record.id || record._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HEVListing;
