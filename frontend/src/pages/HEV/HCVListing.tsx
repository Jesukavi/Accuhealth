import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileDown, Plus, X, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface HCVRecord {
    _id?: string;
    id?: number;
    patientId: string;
    firstName: string;
    secondName: string;
    thirdName?: string;
    tribe?: string;
    civilId: string;
    reportingDate: string;
    outcome: string;
    institution?: string;
    governorate?: string;
}

const EMPTY_FORM = {
    patientId: '',
    civilId: '',
    governorate: '',
    wilayat: '',
    nationality: '',
    outcome: '',
    reportingDateFrom: '',
    reportingDateTo: '',
    status: '',
    sex: ''
};

const HCVListing: React.FC = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState<HCVRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [quickSearch, setQuickSearch] = useState('');
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
                await fetch(`${API_BASE_URL}/hcv-notifications/init-table`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (e) {
                console.warn('Table init warning:', e);
            }
            fetchRecords();
        };
        initAndFetch();
    }, []);

    const fetchRecords = async (queryParams = new URLSearchParams()) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const qs = queryParams.toString();
            const url = qs ? `${API_BASE_URL}/hcv-notifications?${qs}` : `${API_BASE_URL}/hcv-notifications`;

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
                
                setStats({
                    total: notifications.length,
                    saved: notifications.filter((n: HCVRecord) => n.outcome === 'Recovered').length,
                    rejected: notifications.filter((n: HCVRecord) => n.outcome === 'Died').length,
                    institutes: new Set(notifications.map((n: any) => n.institution)).size
                });
            } else {
                console.error('Failed to fetch records');
            }
        } catch (error) {
            console.error('Error fetching HCV records:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        fetchRecords(params);
    };

    const handleClear = () => {
        setFormData(EMPTY_FORM);
        fetchRecords();
    };

    const exportToExcel = async () => {
        try {
            const XLSX = await import('xlsx');
            const exportData = records.map((r, idx) => ({
                'S.No': idx + 1,
                'Patient ID': r.patientId,
                'Civil ID': r.civilId,
                'Name': `${r.firstName} ${r.secondName} ${r.thirdName || ''} ${r.tribe || ''}`.trim(),
                'Reporting Date': r.reportingDate,
                'Outcome': r.outcome,
                'Institution': r.institution || '',
                'Governorate': r.governorate || ''
            }));

            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Records');

            const dateStr = new Date().toISOString().split('T')[0];
            XLSX.writeFile(wb, `HCV_Notifications_${dateStr}.xlsx`);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Failed to export to Excel');
        }
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 border-b-2 border-slate-900 inline-block pb-1">
                        VIRAL HEPATITIS: HCV
                    </h1>
                </div>
            </div>

            {/* Advanced Search Panel */}
            {showAdvancedSearch && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Advanced Search</h3>
                    <form onSubmit={handleSearch}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Patient ID</label>
                                <input
                                    type="text" name="patientId" value={formData.patientId} onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter Patient ID"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Civil ID</label>
                                <input
                                    type="text" name="civilId" value={formData.civilId} onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter Civil ID"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Governorate</label>
                                <input
                                    type="text" name="governorate" value={formData.governorate} onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Muscat"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Nationality</label>
                                <input
                                    type="text" name="nationality" value={formData.nationality} onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter Nationality"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Reporting Date From</label>
                                <input
                                    type="date" name="reportingDateFrom" value={formData.reportingDateFrom} onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Reporting Date To</label>
                                <input
                                    type="date" name="reportingDateTo" value={formData.reportingDateTo} onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Outcome</label>
                                <input
                                    type="text" name="outcome" value={formData.outcome} onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Recovered, Died"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                            <button
                                type="button" onClick={handleClear}
                                className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center space-x-2"
                            >
                                <X className="h-4 w-4" />
                                <span>Clear</span>
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                            >
                                <Search className="h-4 w-4" />
                                <span>Search</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Actions & Results */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3 bg-slate-50">
                    <div className="flex flex-wrap gap-2 items-center">
                        <button
                            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                            <Search className="h-4 w-4" />
                            {showAdvancedSearch ? 'Hide Search' : 'Advanced Search'}
                        </button>
                        <button
                            onClick={exportToExcel}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FileDown className="h-4 w-4" />
                            Export to Excel
                        </button>
                    </div>

                    {/* Quick Search Bar */}
                    <div className="flex items-center gap-2 flex-1 min-w-[220px] max-w-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={quickSearch}
                                onChange={e => setQuickSearch(e.target.value)}
                                placeholder="Search by name, ID..."
                                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {quickSearch && (
                            <button
                                onClick={() => setQuickSearch('')}
                                className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg transition-colors text-sm"
                                title="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/hcv-notification')}
                        className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Create New
                    </button>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                            <Loader2 className="h-8 w-8 animate-spin mb-4" />
                            <p>Loading records...</p>
                        </div>
                    ) : (() => {
                        const filteredRecords = records.filter(r =>
                            !quickSearch ||
                            `${r.firstName} ${r.secondName}`.toLowerCase().includes(quickSearch.toLowerCase()) ||
                            r.patientId?.toLowerCase().includes(quickSearch.toLowerCase()) ||
                            r.civilId?.toLowerCase().includes(quickSearch.toLowerCase())
                        );
                        return filteredRecords.length === 0 ? (
                            <div className="text-center p-12 text-slate-500">
                                <p>No records found matching your criteria</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Patient</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Civil ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Reporting Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Outcome</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredRecords.map((record) => (
                                        <tr key={record._id || record.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900 border-r border-slate-100">{record.patientId}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">{record.firstName} {record.secondName}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">{record.civilId}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100 border-b-2 font-semibold">
                                                {new Date(record.reportingDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm border-r border-slate-100 font-bold border-l-2">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    record.outcome === 'Recovered' ? 'bg-green-100 text-green-700' :
                                                    record.outcome === 'Died' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {record.outcome || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <button 
                                                  onClick={() => navigate(`/hcv-view/${record.id || record._id}`)}
                                                  className="text-blue-500 hover:text-blue-700 mr-3"
                                                >
                                                    View
                                                </button>
                                                <button
                                                  onClick={() => navigate(`/hcv-notification/${record.id || record._id}`)}
                                                  className="text-amber-500 hover:text-amber-700"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};

export default HCVListing;
