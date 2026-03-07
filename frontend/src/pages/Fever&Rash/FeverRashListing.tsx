import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileDown, Plus, Search, X, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import NationalitySelect from '../../components/NationalitySelect';

// ──────────────────────────────────────────────────────────────
// Wilayat map (mirrors the HTML template)
// ──────────────────────────────────────────────────────────────
const wilayatMap: Record<string, string[]> = {
  Muscat: ['Muscat', 'Seeb', 'Muttrah', 'Al Amerat', 'Bausher', 'Quriyat'],
  Dhofar: ['Salalah', 'Taqah', 'Mirbat', 'Rakhyut', 'Sadah'],
  'Al Dakhiliyah': ['Nizwa', 'Bahla', 'Adam', 'Izki', 'Manah'],
  'Al Sharqiyah North': ['Ibra', 'Al Mudhaibi', 'Bidiya', 'Dama wa At-Tayin'],
  'Al Sharqiyah South': ['Sur', 'Al Kamil wa Al Wafi', 'Jalan Bani Bu Ali'],
  'Al Batinah North': ['Sohar', 'Shinas', 'Liwa', 'Saham'],
  'Al Batinah South': ['Rustaq', 'Al Awabi', 'Nakhal', 'Wadi Al Maawil'],
  Musandam: ['Khasab', 'Daba Al Baiha', 'Bukha', 'Madha'],
  'Al Dhahirah': ['Ibri', 'Yanqul', 'Dhank'],
  'Al Buraimi': ['Al Buraimi', 'Mahadah', 'As Sunaynah'],
  'Al Wusta': ['Haima', 'Al Duqm', 'Mahoot', 'Al Jazir'],
};

const GOVERNORATES = Object.keys(wilayatMap);

// ──────────────────────────────────────────────────────────────
// Search-state shape
// ──────────────────────────────────────────────────────────────
interface SearchState {
  // Location
  governorate: string;
  wilayat: string;
  reportingInstitute: string;
  includeGovernorate: boolean;
  // Notification
  notificationId: string;
  status: string;
  reportingDateFrom: string;
  reportingDateTo: string;
  // Date of Onset
  onsetDateFrom: string;
  onsetDateTo: string;
  finalOutcome: string;
  finalOutcomeDateFrom: string;
  finalOutcomeDateTo: string;
  noOfMMGiven: string;
  // Classification
  classification: string;
  // Hospital Type
  hospitalType: string;
  // Patient Info
  patientName: string;
  ageFrom: string;
  ageTo: string;
  civilId: string;
  sex: string;
  gsmNo: string;
  nationality: string;
  patientGovernorate: string;
  patientWilayat: string;
}

const defaultSearch: SearchState = {
  governorate: '',
  wilayat: '',
  reportingInstitute: '',
  includeGovernorate: false,
  notificationId: '',
  status: '',
  reportingDateFrom: '',
  reportingDateTo: '',
  onsetDateFrom: '',
  onsetDateTo: '',
  finalOutcome: '',
  finalOutcomeDateFrom: '',
  finalOutcomeDateTo: '',
  noOfMMGiven: '',
  classification: '',
  hospitalType: 'all',
  patientName: '',
  ageFrom: '',
  ageTo: '',
  civilId: '',
  sex: '',
  gsmNo: '',
  nationality: '',
  patientGovernorate: '',
  patientWilayat: '',
};

interface ListingRow {
  notificationId: string;
  reportingDate: string;
  dateOfOnset: string;
  patientNo: string;
  patientName: string;
  age: string | number;
  sex: string;
  reportingDocuments: string;
  reportingInstitute: string;
  status: string;
}

// ──────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────
const FeverRashListing: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState<SearchState>(defaultSearch);
  const [results, setResults] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 35;

  // Derived wilayat options
  const wilayatOptions = wilayatMap[search.governorate] ?? [];
  const patientWilayatOptions = wilayatMap[search.patientGovernorate] ?? [];

  // ── helpers ────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSearch(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'radio') {
      setSearch(prev => ({ ...prev, [name]: value }));
    } else {
      // Reset child wilayat when governorate changes
      if (name === 'governorate') {
        setSearch(prev => ({ ...prev, governorate: value, wilayat: '' }));
      } else if (name === 'patientGovernorate') {
        setSearch(prev => ({ ...prev, patientGovernorate: value, patientWilayat: '' }));
      } else {
        setSearch(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(search).map(([k, v]) => [k, String(v)])
        ),
        page: String(currentPage),
        limit: String(itemsPerPage),
      });

      const res = await fetch(`${API_BASE_URL}/fever-rash?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.notifications ?? []);
        setTotalRecords(data.total ?? 0);
      }
    } catch (err) {
      console.error('Error fetching Fever & Rash listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchListings();
  };

  const handleClear = () => {
    setSearch(defaultSearch);
  };

  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));

  // ── shared input classes ───────────────────────────────────
  const inputCls =
    'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const labelCls = 'block text-sm font-medium text-slate-700 mb-1';
  const sectionHeader =
    'text-sm font-semibold text-slate-600 mb-3 pb-2 border-b border-slate-200';

  // ── render ─────────────────────────────────────────────────
  return (
    <div className="space-y-4 sm:space-y-5 p-0">
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5 text-slate-500" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              Fever and Rash Notification Listing
            </h1>
            <p className="text-xs text-slate-500">
              Search and manage fever &amp; rash notifications
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/fever-rash-entry/new')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Entry</span>
        </button>
      </div>

      {/* ── Filter panel ────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">

        {/* ── Location ──────────────────────────────────────── */}
        <div>
          <p className={sectionHeader}>Location</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Governorate */}
            <div>
              <label className={labelCls}>Governorate</label>
              <select name="governorate" value={search.governorate} onChange={handleChange} className={inputCls}>
                <option value="">All</option>
                {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Wilayat */}
            <div>
              <label className={labelCls}>Wilayat</label>
              <select name="wilayat" value={search.wilayat} onChange={handleChange} className={inputCls}>
                <option value="">All</option>
                {wilayatOptions.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            {/* Reporting Institute */}
            <div>
              <label className={labelCls}>Reporting Institute</label>
              <select name="reportingInstitute" value={search.reportingInstitute} onChange={handleChange} className={inputCls}>
                <option value="">All</option>
                <option value="Ibra Hospital">Ibra Hospital</option>
                <option value="Sur Hospital">Sur Hospital</option>
                <option value="Nizwa Hospital">Nizwa Hospital</option>
                <option value="Royal Hospital">Royal Hospital</option>
              </select>
            </div>

            {/* Include governorate checkbox */}
            <div className="flex items-end pb-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="includeGovernorate"
                  checked={search.includeGovernorate}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">
                  Include this Governorate patients also
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ── Notification ──────────────────────────────────── */}
        <div>
          <p className={sectionHeader}>Notification</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Notification ID */}
            <div>
              <label className={labelCls}>Notification ID</label>
              <input type="text" name="notificationId" value={search.notificationId} onChange={handleChange} className={inputCls} placeholder="Enter ID" />
            </div>

            {/* Status */}
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" value={search.status} onChange={handleChange} className={inputCls}>
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
                <option value="Final Outcome">Final Outcome</option>
              </select>
            </div>

            {/* Reporting Date range */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Reporting Date</label>
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                <input type="date" name="reportingDateFrom" value={search.reportingDateFrom} onChange={handleChange} className={inputCls} />
                <span className="text-slate-400 text-sm text-center">to</span>
                <input type="date" name="reportingDateTo" value={search.reportingDateTo} onChange={handleChange} className={inputCls} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Date of Onset ─────────────────────────────────── */}
        <div>
          <p className={sectionHeader}>Date of Onset</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Onset date range */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Date of Onset</label>
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                <input type="date" name="onsetDateFrom" value={search.onsetDateFrom} onChange={handleChange} className={inputCls} />
                <span className="text-slate-400 text-sm text-center">to</span>
                <input type="date" name="onsetDateTo" value={search.onsetDateTo} onChange={handleChange} className={inputCls} />
              </div>
            </div>

            {/* Final Outcome */}
            <div>
              <label className={labelCls}>Final Outcome</label>
              <select name="finalOutcome" value={search.finalOutcome} onChange={handleChange} className={inputCls}>
                <option value="">All</option>
                <option value="Recovered">Recovered</option>
                <option value="Died">Died</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            {/* No of MM Given */}
            <div>
              <label className={labelCls}>No of MM Given</label>
              <input type="text" name="noOfMMGiven" value={search.noOfMMGiven} onChange={handleChange} className={inputCls} placeholder="Enter count" />
            </div>

            {/* Final Outcome Date range */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Final Outcome Date</label>
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                <input type="date" name="finalOutcomeDateFrom" value={search.finalOutcomeDateFrom} onChange={handleChange} className={inputCls} />
                <span className="text-slate-400 text-sm text-center">to</span>
                <input type="date" name="finalOutcomeDateTo" value={search.finalOutcomeDateTo} onChange={handleChange} className={inputCls} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Classification ────────────────────────────────── */}
        <div>
          <p className={sectionHeader}>Classification</p>
          <div className="flex items-center flex-wrap gap-6">
            {[
              { value: 'measles', label: 'Measles' },
              { value: 'rubella', label: 'Rubella' },
              { value: 'discarded', label: 'Discarded case' },
            ].map(opt => (
              <label key={opt.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="classification"
                  value={opt.value}
                  checked={search.classification === opt.value}
                  onChange={handleChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{opt.label}</span>
              </label>
            ))}
            {search.classification && (
              <button
                type="button"
                onClick={() => setSearch(prev => ({ ...prev, classification: '' }))}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Hospital Type ─────────────────────────────────── */}
        <div>
          <p className={sectionHeader}>Hospital Type</p>
          <div className="flex items-center flex-wrap gap-6">
            {[
              { value: 'all', label: 'All' },
              { value: 'moh', label: 'MOH' },
              { value: 'non-moh', label: 'Non-MOH' },
            ].map(opt => (
              <label key={opt.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="hospitalType"
                  value={opt.value}
                  checked={search.hospitalType === opt.value}
                  onChange={handleChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Patient Information ───────────────────────────── */}
        <div>
          <p className={sectionHeader}>Patient Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Patient Name */}
            <div>
              <label className={labelCls}>Patient Name</label>
              <input type="text" name="patientName" value={search.patientName} onChange={handleChange} className={inputCls} placeholder="Enter name" />
            </div>

            {/* Age range */}
            <div>
              <label className={labelCls}>Age (in Years)</label>
              <div className="flex items-center gap-2">
                <input type="number" name="ageFrom" value={search.ageFrom} onChange={handleChange} className={inputCls} placeholder="From" min={0} />
                <span className="text-slate-400 text-sm flex-shrink-0">to</span>
                <input type="number" name="ageTo" value={search.ageTo} onChange={handleChange} className={inputCls} placeholder="To" min={0} />
              </div>
            </div>

            {/* Civil ID */}
            <div>
              <label className={labelCls}>Civil ID</label>
              <input type="text" name="civilId" value={search.civilId} onChange={handleChange} className={inputCls} placeholder="Enter Civil ID" />
            </div>

            {/* Sex */}
            <div>
              <label className={labelCls}>Sex</label>
              <select name="sex" value={search.sex} onChange={handleChange} className={inputCls}>
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* GSM No */}
            <div>
              <label className={labelCls}>GSM No</label>
              <input type="text" name="gsmNo" value={search.gsmNo} onChange={handleChange} className={inputCls} placeholder="Enter GSM No" />
            </div>

            {/* Nationality */}
            <div>
              <label className={labelCls}>Nationality</label>
              <NationalitySelect
                name="nationality"
                value={search.nationality}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            {/* Patient Governorate */}
            <div>
              <label className={labelCls}>Patient Governorate</label>
              <select name="patientGovernorate" value={search.patientGovernorate} onChange={handleChange} className={inputCls}>
                <option value="">All</option>
                {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Patient Wilayat */}
            <div>
              <label className={labelCls}>Patient Wilayat</label>
              <select name="patientWilayat" value={search.patientWilayat} onChange={handleChange} className={inputCls}>
                <option value="">All</option>
                {patientWilayatOptions.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── Action Buttons ─────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-60"
          >
            <Search className="h-4 w-4" />
            <span>{loading ? 'Searching…' : 'Search'}</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center space-x-2 px-5 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
          >
            <X className="h-4 w-4" />
            <span>Clear</span>
          </button>
          <button
            type="button"
            className="flex items-center space-x-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <FileDown className="h-4 w-4" />
            <span>Export to Excel</span>
          </button>
          <button
            type="button"
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Advanced Search
          </button>
          <button
            type="button"
            className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
          >
            Add Note
          </button>
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        {/* Loading / empty state */}
        {loading && (
          <div className="py-14 text-center text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
            <p className="text-sm italic">Loading…</p>
          </div>
        )}
        {!loading && results.length === 0 && (
          <div className="py-14 text-center text-slate-400 italic text-sm">No records found</div>
        )}

        {!loading && results.length > 0 && (
          <>
            {/* Desktop table — hidden on small screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    {['#', 'Notification ID', 'Reporting Date', 'Date of Onset', 'Patient No.', 'Patient Name', 'Age', 'Sex', 'Reporting Inst.', 'Status'].map(col => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={row.notificationId ?? idx} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-400">{idx + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-blue-600 cursor-pointer hover:underline whitespace-nowrap">{row.notificationId || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">{row.reportingDate || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">{row.dateOfOnset || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">{row.patientNo || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 max-w-[160px] truncate" title={row.patientName}>{row.patientName || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.age ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.sex || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 max-w-[140px] truncate" title={row.reportingInstitute}>{row.reportingInstitute || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          row.status === 'Completed' ? 'bg-green-100 text-green-700'
                          : row.status === 'Rejected' ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}>{row.status || 'Saved'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards — shown only on small screens */}
            <div className="md:hidden divide-y divide-slate-100">
              {results.map((row, idx) => (
                <div key={row.notificationId ?? idx} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-blue-600 text-sm truncate">{row.patientName || '—'}</p>
                      <p className="text-xs text-slate-500">{row.sex || '—'} · Age {row.age ?? '—'}</p>
                    </div>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      row.status === 'Completed' ? 'bg-green-100 text-green-700'
                      : row.status === 'Rejected' ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}>{row.status || 'Saved'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <span className="text-slate-400 block mb-0.5">Notification ID</span>
                      <span className="text-slate-700 font-medium">{row.notificationId || '—'}</span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <span className="text-slate-400 block mb-0.5">Patient No.</span>
                      <span className="text-slate-700 font-medium">{row.patientNo || '—'}</span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <span className="text-slate-400 block mb-0.5">Reporting Date</span>
                      <span className="text-slate-700 font-medium">{row.reportingDate || '—'}</span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <span className="text-slate-400 block mb-0.5">Date of Onset</span>
                      <span className="text-slate-700 font-medium">{row.dateOfOnset || '—'}</span>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2 col-span-2">
                      <span className="text-slate-400 block mb-0.5">Reporting Institute</span>
                      <span className="text-slate-700 font-medium">{row.reportingInstitute || '—'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer */}

        {/* ── Footer: total + pagination ──────────────────── */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Total: <span className="font-semibold text-slate-700">{totalRecords}</span> records
          </p>
          <nav>
            <ul className="flex items-center space-x-1">
              <li>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                  className="px-3 py-1.5 text-xs text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = i + 1;
                return (
                  <li key={page}>
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 text-xs rounded-lg ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {page}
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || loading}
                  className="px-3 py-1.5 text-xs text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default FeverRashListing;
