import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, FileDown, FileText, Pencil, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface ARIListingData {
  notificationId: string;
  reportingDate: string;
  patientName: string;
  patientNo: string;
  age: string | number;
  sex: string;
  reportingInstitute: string;
  governorate?: string;
  status: string;
}

interface ARIListingFormData {
  governorate: string;
  wilayat: string;
  reportingInstitute: string;
  notificationId: string;
  caseId: string;
  caseType: string;
  confirmedDisease: string;
  reportingDate: string;
  reportingDateTo: string;
  suspectedDisease: string;
  sentinelSite: string;
  status: string;
  patientGovernorate: string;
  patientWilayat: string;
  includeGovernorate: boolean;
  hospitalType: string;
  diseaseStatus: string;
  civilNo: string;
  name: string;
  patientId: string;
  sex: string;
  gsmNo: string;
  nationality: string;
  maritalStatus: string;
  age: string;
  outcome: string;
}

const EMPTY_FORM: ARIListingFormData = {
  governorate: '',
  wilayat: '',
  reportingInstitute: '',
  notificationId: '',
  caseId: '',
  caseType: '',
  confirmedDisease: '',
  reportingDate: '',
  reportingDateTo: '',
  suspectedDisease: '',
  sentinelSite: '',
  status: '',
  patientGovernorate: '',
  patientWilayat: '',
  includeGovernorate: false,
  hospitalType: 'All',
  diseaseStatus: 'Suspect',
  civilNo: '',
  name: '',
  patientId: '',
  sex: '',
  gsmNo: '',
  nationality: '',
  maritalStatus: '',
  age: '',
  outcome: ''
};

const ARIListing: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ARIListingData[]>([]);
  const [formData, setFormData] = useState<ARIListingFormData>(EMPTY_FORM);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/ari/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchListings();
      else alert('Failed to delete notification');
    } catch { alert('Error deleting record'); }
  };

  const fetchListings = async (params?: Partial<ARIListingFormData>) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const search = params || formData;
      const queryParams = new URLSearchParams();
      if (search.patientId) queryParams.append('patientId', search.patientId);
      if (search.notificationId) queryParams.append('notificationId', search.notificationId);
      if (search.governorate) queryParams.append('governorate', search.governorate);
      if (search.wilayat) queryParams.append('wilayat', search.wilayat);
      if (search.caseType) queryParams.append('caseType', search.caseType);
      if (search.status) queryParams.append('status', search.status);
      if (search.diseaseStatus) queryParams.append('diseaseStatus', search.diseaseStatus);

      const response = await fetch(`${API_BASE_URL}/ari?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching ARI listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'radio') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  const handleClear = () => {
    setFormData(EMPTY_FORM);
    fetchListings(EMPTY_FORM);
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
                ARI Listing
              </h1>
              <p className="text-sm text-slate-600">Search and view ARI notifications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {showForm && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 p-8 mb-6">
            <h5 className="text-xl font-bold text-red-600 mb-6">ARI Listing</h5>
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Governorate</label>
                  <select
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Muscat">Muscat</option>
                    <option value="Dhofar">Dhofar</option>
                    <option value="Al Batinah">Al Batinah</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Wilayat</label>
                  <select
                    name="wilayat"
                    value={formData.wilayat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Reporting Institute</label>
                  <select
                    name="reportingInstitute"
                    value={formData.reportingInstitute}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Notification ID</label>
                  <input
                    type="text"
                    name="notificationId"
                    value={formData.notificationId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Case ID</label>
                  <input
                    type="text"
                    name="caseId"
                    value={formData.caseId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Case Type</label>
                  <select
                    name="caseType"
                    value={formData.caseType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Confirmed Disease</label>
                  <select
                    name="confirmedDisease"
                    value={formData.confirmedDisease}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Reporting Date</label>
                  <input
                    type="date"
                    name="reportingDate"
                    value={formData.reportingDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">To</label>
                  <input
                    type="date"
                    name="reportingDateTo"
                    value={formData.reportingDateTo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Suspected Disease</label>
                  <select
                    name="suspectedDisease"
                    value={formData.suspectedDisease}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Sentinel Site</label>
                  <select
                    name="sentinelSite"
                    value={formData.sentinelSite}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Patient Governorate</label>
                  <select
                    name="patientGovernorate"
                    value={formData.patientGovernorate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Wilayat</label>
                  <select
                    name="patientWilayat"
                    value={formData.patientWilayat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="includeGovernorate"
                      checked={formData.includeGovernorate}
                      onChange={handleInputChange}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Include this Governorate patients also</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Hospital Type</label>
                  <div className="flex space-x-4 pt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hospitalType"
                        value="All"
                        checked={formData.hospitalType === 'All'}
                        onChange={handleInputChange}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">All</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hospitalType"
                        value="MOH"
                        checked={formData.hospitalType === 'MOH'}
                        onChange={handleInputChange}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">MOH</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hospitalType"
                        value="Non-MOH"
                        checked={formData.hospitalType === 'Non-MOH'}
                        onChange={handleInputChange}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">Non-MOH</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Disease Status</label>
                  <div className="flex space-x-4 pt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="diseaseStatus"
                        value="Suspect"
                        checked={formData.diseaseStatus === 'Suspect'}
                        onChange={handleInputChange}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">Suspect</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="diseaseStatus"
                        value="Possible"
                        checked={formData.diseaseStatus === 'Possible'}
                        onChange={handleInputChange}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">Possible</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="diseaseStatus"
                        value="Probable"
                        checked={formData.diseaseStatus === 'Probable'}
                        onChange={handleInputChange}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">Probable</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Civil No</label>
                  <input
                    type="text"
                    name="civilNo"
                    value={formData.civilNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Patient Id</label>
                  <input
                    type="text"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Sex</label>
                  <input
                    type="text"
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">GSM No</label>
                  <input
                    type="text"
                    name="gsmNo"
                    value={formData.gsmNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Marital Status</label>
                  <input
                    type="text"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Age</label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Outcome</label>
                  <input
                    type="text"
                    name="outcome"
                    value={formData.outcome}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Advanced Search
                </button>
                <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </button>
                <button type="button" onClick={handleClear} className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors">
                  Clear
                </button>
                <button type="button" className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
                  <FileDown className="h-4 w-4" />
                  <span>Export to Excel</span>
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">ARI LISTING</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-slate-500 text-white text-sm rounded-lg hover:bg-slate-600 transition-colors"
              >
                {showForm ? 'Hide Filters' : 'Search Filters'}
              </button>
              <button
                onClick={() => navigate('/ari-notification/new')}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                + Add
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Notification ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Reporting Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Patient Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Patient NO</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Age</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Sex</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Reporting Institute</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-slate-500">Loading...</td>
                  </tr>
                ) : results.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-slate-500">No records found</td>
                  </tr>
                ) : (
                  results.map((row, index) => (
                    <tr key={row.notificationId || index} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-500">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 font-mono text-xs">{row.notificationId?.slice(-8)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.reportingDate}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.patientName}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 font-mono">{row.patientNo}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.age}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.sex}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.reportingInstitute}</td>
                      <td className="px-4 py-3 text-sm font-medium">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          row.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{row.status || 'Pending'}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/ari-view/${row.notificationId}`)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View / Download"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/ari-notification/${row.notificationId}`)}
                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(row.notificationId)}
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
        </div>
      </div>
    </div>
  );
};

export default ARIListing;
