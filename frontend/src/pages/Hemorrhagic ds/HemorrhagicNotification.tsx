import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileDown, FileText, Pencil, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';


interface HemorrhagicSearchData {
  governorate: string;
  wilayat: string;
  reportingInstitute: string;
  includeGovernorate: boolean;
  notificationId: string;
  status: string;
  reportingDateFrom: string;
  reportingDateTo: string;
  dateOfOnsetFrom: string;
  dateOfOnsetTo: string;
  finalOutcome: string;
  finalOutcomeDateFrom: string;
  finalOutcomeDateTo: string;
  noOfMMGiven: string;
  classification: string;
  hospitalType: string;
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

interface HemorrhagicResult {
  notificationId: string;
  reportingDate: string;
  dateOfCourt: string;
  patientNo: string;
  patientName: string;
  age: string;
  sex: string;
  reportingDocuments: string;
  reportingInstitutes: string;
  status: string;
}

const HemorrhagicNotification: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState<HemorrhagicSearchData>({
    governorate: '',
    wilayat: '',
    reportingInstitute: '',
    includeGovernorate: false,
    notificationId: '',
    status: '',
    reportingDateFrom: '',
    reportingDateTo: '',
    dateOfOnsetFrom: '',
    dateOfOnsetTo: '',
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
    patientWilayat: ''
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<HemorrhagicResult[]>([]);

  const fetchListings = async (params?: Partial<HemorrhagicSearchData>) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const q = params || searchData;
      const qp = new URLSearchParams();
      if (q.patientName) qp.append('search', q.patientName);
      if (q.notificationId) qp.append('notificationId', q.notificationId);
      if (q.governorate) qp.append('governorate', q.governorate);
      if (q.wilayat) qp.append('wilayat', q.wilayat);
      if (q.status) qp.append('status', q.status);
      if (q.finalOutcome) qp.append('finalOutcome', q.finalOutcome);
      if (q.classification) qp.append('classification', q.classification);
      const response = await fetch(`${API_BASE_URL}/hemorrhagic?${qp.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setResults(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching Hemorrhagic listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSearchData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'radio') {
      setSearchData(prev => ({ ...prev, [name]: value }));
    } else {
      setSearchData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = () => {
    fetchListings();
  };


  const handleClear = () => {
    fetchListings({
      governorate: '',
      wilayat: '',
      reportingInstitute: '',
      includeGovernorate: false,
      notificationId: '',
      status: '',
      reportingDateFrom: '',
      reportingDateTo: '',
      dateOfOnsetFrom: '',
      dateOfOnsetTo: '',
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
      patientWilayat: ''
    });
  };

  const handleExportToExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      const exportData = results.map((r, idx) => ({
        'S.No': idx + 1,
        'Notification ID': r.notificationId,
        'Reporting Date': r.reportingDate,
        'Date of Onset': r.dateOfCourt, // note: property is named dateOfCourt
        'Patient No.': r.patientNo,
        'Patient Name': r.patientName,
        'Age': r.age,
        'Sex': r.sex,
        'Governorate': r.reportingDocuments, // maps to governorate visually
        'Institution': r.reportingInstitutes, // maps to institution visually
        'Status': r.status,
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Records');

      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Hemorrhagic_Notifications_${dateStr}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export to Excel');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/hemorrhagic/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchListings();
      else alert('Failed to delete notification');
    } catch { alert('Error deleting record'); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-slate-700 bg-clip-text text-transparent">
                Hemorrhagic ds Notification Listing
              </h1>
              <p className="text-sm text-slate-600">Search and filter hemorrhagic disease records</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/hemorrhagic-new-entry')}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
          >
            + Add New
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-200">
            Hemorrhagic ds Notification Listing
          </h2>

          {/* Location Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Governorate</label>
                <select
                  name="governorate"
                  value={searchData.governorate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="Muscat">Muscat</option>
                  <option value="Dhofar">Dhofar</option>
                  <option value="Al Dakhiliyah">Al Dakhiliyah</option>
                  <option value="Al Sharqiyah North">Al Sharqiyah North</option>
                  <option value="Al Sharqiyah South">Al Sharqiyah South</option>
                  <option value="Al Batinah North">Al Batinah North</option>
                  <option value="Al Batinah South">Al Batinah South</option>
                  <option value="Musandam">Musandam</option>
                  <option value="Al Dhahirah">Al Dhahirah</option>
                  <option value="Al Buraimi">Al Buraimi</option>
                  <option value="Al Wusta">Al Wusta</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Wilayat</label>
                <select
                  name="wilayat"
                  value={searchData.wilayat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="Ibra">Ibra</option>
                  <option value="Al Mudhaibi">Al Mudhaibi</option>
                  <option value="Bidiya">Bidiya</option>
                  <option value="Dama wa At-Tayin">Dama wa At-Tayin</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Reporting Institute</label>
                <select
                  name="reportingInstitute"
                  value={searchData.reportingInstitute}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="Ibra Hospital">Ibra Hospital</option>
                  <option value="Sur Hospital">Sur Hospital</option>
                  <option value="Nizwa Hospital">Nizwa Hospital</option>
                  <option value="Royal Hospital">Royal Hospital</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="includeGovernorate"
                    checked={searchData.includeGovernorate}
                    onChange={handleInputChange}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Include this Governorate patients also</span>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">Notification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Notification ID</label>
                <input
                  type="text"
                  name="notificationId"
                  value={searchData.notificationId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select
                  name="status"
                  value={searchData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Final Outcome">Final Outcome</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Reporting Date</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    name="reportingDateFrom"
                    value={searchData.reportingDateFrom}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-slate-600">to</span>
                  <input
                    type="date"
                    name="reportingDateTo"
                    value={searchData.reportingDateTo}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date of Onset Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">Date of Onset</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Date of Onset</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    name="dateOfOnsetFrom"
                    value={searchData.dateOfOnsetFrom}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-slate-600">to</span>
                  <input
                    type="date"
                    name="dateOfOnsetTo"
                    value={searchData.dateOfOnsetTo}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Final Outcome</label>
                <select
                  name="finalOutcome"
                  value={searchData.finalOutcome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="Recovered">Recovered</option>
                  <option value="Died">Died</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Final Outcome Date</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    name="finalOutcomeDateFrom"
                    value={searchData.finalOutcomeDateFrom}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-slate-600">to</span>
                  <input
                    type="date"
                    name="finalOutcomeDateTo"
                    value={searchData.finalOutcomeDateTo}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">No of MM Given</label>
                <input
                  type="text"
                  name="noOfMMGiven"
                  value={searchData.noOfMMGiven}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Classification Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">Classification</h3>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="classification"
                  value="measles"
                  checked={searchData.classification === 'measles'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Measles</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="classification"
                  value="rubella"
                  checked={searchData.classification === 'rubella'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Rubella</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="classification"
                  value="discarded"
                  checked={searchData.classification === 'discarded'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Discarded case</span>
              </label>
            </div>
          </div>

          {/* Hospital Type Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">Hospital Type</h3>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="hospitalType"
                  value="all"
                  checked={searchData.hospitalType === 'all'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">All</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="hospitalType"
                  value="moh"
                  checked={searchData.hospitalType === 'moh'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">MOH</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="hospitalType"
                  value="non-moh"
                  checked={searchData.hospitalType === 'non-moh'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Non-MOH</span>
              </label>
            </div>
          </div>

          {/* Patient Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={searchData.patientName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Age (in Years)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="ageFrom"
                    value={searchData.ageFrom}
                    onChange={handleInputChange}
                    placeholder="From"
                    min="0"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-slate-600">to</span>
                  <input
                    type="number"
                    name="ageTo"
                    value={searchData.ageTo}
                    onChange={handleInputChange}
                    placeholder="To"
                    min="0"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Civil ID</label>
                <input
                  type="text"
                  name="civilId"
                  value={searchData.civilId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Sex</label>
                <select
                  name="sex"
                  value={searchData.sex}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">GSM NO</label>
                <input
                  type="text"
                  name="gsmNo"
                  value={searchData.gsmNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Nationality</label>
                <select
                  name="nationality"
                  value={searchData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="Omani">Omani</option>
                  <option value="Indian">Indian</option>
                  <option value="Pakistani">Pakistani</option>
                  <option value="Bangladeshi">Bangladeshi</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Patient Governorate</label>
                <select
                  name="patientGovernorate"
                  value={searchData.patientGovernorate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="Muscat">Muscat</option>
                  <option value="Dhofar">Dhofar</option>
                  <option value="Al Dakhiliyah">Al Dakhiliyah</option>
                  <option value="Al Sharqiyah North">Al Sharqiyah North</option>
                  <option value="Al Sharqiyah South">Al Sharqiyah South</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Patient Wilayat</label>
                <select
                  name="patientWilayat"
                  value={searchData.patientWilayat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="Ibra">Ibra</option>
                  <option value="Al Mudhaibi">Al Mudhaibi</option>
                  <option value="Bidiya">Bidiya</option>
                  <option value="Dama wa At-Tayin">Dama wa At-Tayin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons - above table */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={handleSearch}
              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Search
            </button>
            <button
              onClick={handleClear}
              className="px-5 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
            >
              Clear
            </button>
            <button
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Advanced Search
            </button>
            <button
              onClick={handleExportToExcel}
              className="px-5 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2 font-medium"
            >
              <FileDown className="h-4 w-4" />
              Export to Excel
            </button>
            <button
              className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
            >
              Add Note
            </button>
          </div>

          {/* Results Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Notification ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Reporting Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date of Onset</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Patient No.</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Patient Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Age</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Sex</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Governorate</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Institution</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr><td colSpan={12} className="px-4 py-8 text-center text-slate-500 italic">Loading...</td></tr>
                  ) : results.length === 0 ? (
                    <tr><td colSpan={12} className="px-4 py-8 text-center text-slate-500 italic">No Records Found. <button onClick={() => navigate('/hemorrhagic-new-entry')} className="text-red-600 hover:underline font-medium">Add a new entry.</button></td></tr>
                  ) : (
                    results.map((result, index) => (
                      <tr key={result.notificationId || index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-slate-400">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-slate-700 font-mono text-xs">{(result.notificationId as string)?.slice(-8)}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{result.reportingDate}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{result.dateOfCourt}</td>
                        <td className="px-4 py-3 text-sm text-slate-700 font-mono">{result.patientNo}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{result.patientName}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{result.age}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{result.sex}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{result.reportingDocuments}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{result.reportingInstitutes}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.status === 'Completed' ? 'bg-green-100 text-green-700'
                            : result.status === 'Rejected' ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                          }`}>{result.status || 'Pending'}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => navigate(`/hemorrhagic-view/${result.notificationId}`)}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View / Download"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/hemorrhagic-edit/${result.notificationId}`)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(result.notificationId)}
                              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
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
          </div>

          {/* Pagination and Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-slate-600">(Total: 58 records)</div>
            <div className="flex space-x-1">
              <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-100 text-sm">«</button>
              <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-100 text-sm">‹</button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">1</button>
              <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-100 text-sm">›</button>
              <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-100 text-sm">»</button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default HemorrhagicNotification;
