import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Bell, Plus, History } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface PolioListingData {
  notificationId: string;
  polioId: string;
  patientId: string;
  patientName: string;
  age: string | number;
  gsm: string;
  reportingInstitute: string;
  reportingDate: string;
  confirmedDate: string;
  pidDiagnosis: string;
  status: string;
}

interface CaseListingFormData {
  governorate: string;
  wilayat: string;
  reportingInstitute: string;
  notificationId: string;
  polioId: string;
  reportingDateFrom: string;
  reportingDateTo: string;
  status: string;
  confirmationDateFrom: string;
  confirmationDateTo: string;
  pidDiagnosis: string;
  includeGovernorate: boolean;
  name: string;
  patientId: string;
  sex: string;
  gsmNo: string;
  ageFrom: string;
  ageTo: string;
  nationality: string;
}

const EMPTY_FORM: CaseListingFormData = {
  governorate: '',
  wilayat: '',
  reportingInstitute: '',
  notificationId: '',
  polioId: '',
  reportingDateFrom: '',
  reportingDateTo: '',
  status: '',
  confirmationDateFrom: '',
  confirmationDateTo: '',
  pidDiagnosis: '',
  includeGovernorate: false,
  name: '',
  patientId: '',
  sex: '',
  gsmNo: '',
  ageFrom: '',
  ageTo: '',
  nationality: ''
};

const PolioCaseListing: React.FC = () => {
  const [formData, setFormData] = useState<CaseListingFormData>(EMPTY_FORM);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PolioListingData[]>([]);

  const fetchListings = async (params?: Partial<CaseListingFormData>) => {
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
      if (search.status) queryParams.append('status', search.status);
      if (search.pidDiagnosis) queryParams.append('pidDiagnosis', search.pidDiagnosis);

      const response = await fetch(`${API_BASE_URL}/polio?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching Polio listings:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
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
              <h1 className="text-2xl font-bold text-slate-900">Polio Case Listing</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Notification ID"
                className="pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2">
                <Search className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-slate-600" />
            </button>
            <div className="flex items-center space-x-2">
              <img src="/api/placeholder/32/32" alt="Admin" className="h-8 w-8 rounded-full" />
              <span className="text-sm font-medium text-slate-700">Admin user</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search Criteria Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 p-8 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 pb-3 border-b border-slate-200">
            Search Criteria
          </h2>

          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Governorate
                </label>
                <select
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Governorate</option>
                  <option value="muscat">Muscat</option>
                  <option value="dhofar">Dhofar</option>
                  <option value="al-dakhiliyah">Al Dakhiliyah</option>
                  <option value="al-sharqiyah-north">Al Sharqiyah North</option>
                  <option value="al-sharqiyah-south">Al Sharqiyah South</option>
                  <option value="al-batinah-north">Al Batinah North</option>
                  <option value="al-batinah-south">Al Batinah South</option>
                  <option value="musandam">Musandam</option>
                  <option value="al-dhahirah">Al Dhahirah</option>
                  <option value="al-buraimi">Al Buraimi</option>
                  <option value="al-wusta">Al Wusta</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Wilayat
                </label>
                <select
                  name="wilayat"
                  value={formData.wilayat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Wilayat</option>
                  <option value="ibra">Ibra</option>
                  <option value="muscat">Muscat</option>
                  <option value="salalah">Salalah</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Reporting Institute
                </label>
                <select
                  name="reportingInstitute"
                  value={formData.reportingInstitute}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Institute</option>
                  <option value="ibra">Ibra</option>
                  <option value="muscat">Muscat</option>
                  <option value="salalah">Salalah</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Notification ID
                </label>
                <input
                  type="text"
                  name="notificationId"
                  value={formData.notificationId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Polio ID
                </label>
                <input
                  type="text"
                  name="polioId"
                  value={formData.polioId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Reporting Date
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    name="reportingDateFrom"
                    value={formData.reportingDateFrom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-slate-600">To</span>
                  <input
                    type="date"
                    name="reportingDateTo"
                    value={formData.reportingDateTo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Confirmation Date
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    name="confirmationDateFrom"
                    value={formData.confirmationDateFrom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-slate-600">To</span>
                  <input
                    type="date"
                    name="confirmationDateTo"
                    value={formData.confirmationDateTo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  PID Diagnosis
                </label>
                <input
                  type="text"
                  name="pidDiagnosis"
                  value={formData.pidDiagnosis}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
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
                <label className="block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Patient ID
                </label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Sex
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  GSM NO
                </label>
                <input
                  type="text"
                  name="gsmNo"
                  value={formData.gsmNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Age (in Years)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="ageFrom"
                    value={formData.ageFrom}
                    onChange={handleInputChange}
                    placeholder="From"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-slate-600">To</span>
                  <input
                    type="number"
                    name="ageTo"
                    value={formData.ageTo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Nationality
                </label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Nationality</option>
                  <option value="omani">Omani</option>
                  <option value="indian">Indian</option>
                  <option value="pakistani">Pakistani</option>
                  <option value="bangladeshi">Bangladeshi</option>
                  <option value="egyptian">Egyptian</option>
                  <option value="filipino">Filipino</option>
                  <option value="sri-lankan">Sri Lankan</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-3 mt-8">
              <button
                type="button"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Advanced Search</span>
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Results Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 p-8 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 pb-3 border-b border-slate-200">
            Case Listing Results
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-200">Notification ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-200">Polio ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-200">Patient ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-200">Patient Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-200">Age</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-200">GSM</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-200">Reporting Institute</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-200">Reporting Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-200">Confirmed Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 border border-slate-200">PID Diagnosis</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-slate-500 italic border border-slate-200">Loading...</td>
                  </tr>
                ) : results.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-slate-500 italic border border-slate-200">No Rows To Show</td>
                  </tr>
                ) : (
                  results.map((row, index) => (
                    <tr key={row.notificationId || index} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-700 border border-slate-200 font-mono text-xs">{row.notificationId?.slice(-8)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 border border-slate-200">{row.polioId}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 border border-slate-200">{row.patientId}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 border border-slate-200">{row.patientName}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 border border-slate-200">{row.age}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 border border-slate-200">{row.gsm}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 border border-slate-200">{row.reportingInstitute}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 border border-slate-200">{row.reportingDate}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 border border-slate-200">{row.confirmedDate}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 border border-slate-200">{row.pidDiagnosis}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3">
          <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add New</span>
          </button>
          <button className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span>Follow Up</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolioCaseListing;
