import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileDown, Plus, Minus } from 'lucide-react';
import { tbScreeningApi } from './api/tbScreening';
import type { TBListingSearchData ,ReferralListingSearchData } from './types';

const TBListing: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tb-listing' | 'referral-listing'>('tb-listing');
  const [tbSearchData, setTbSearchData] = useState<TBListingSearchData>({
    governorate: '',
    wilayat: '',
    reportingInstitute: '',
    notificationId: '',
    reportingDateFrom: '',
    reportingDateTo: '',
    classification: '',
    status: '',
    finalOutcome: '',
    finalOutcomeDateFrom: '',
    finalOutcomeDateTo: '',
    tbContact: '',
    confirmedTB: '',
    mode: '',
    hospitalType: '',
    includeGovernorate: false,
    riskFactors: ''
  });

  const [referralSearchData, setReferralSearchData] = useState<ReferralListingSearchData>({
    fromGovernorate: 'MUSCAT',
    fromWilayat: 'As Seeb',
    reportingFromInstitute: '',
    followUpGovernorate: '',
    followUpWilayat: '',
    followUpInstitute: '',
    reportingDateFrom: '',
    reportingDateTo: '',
    notificationId: '',
    patientName: '',
    notificationType: '',
    civilNo: '',
    gsmNo: ''
  });

  const [tbResults, setTbResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 35
  });
  const [filterOptions, setFilterOptions] = useState<any>({
    institutions: [],
    governorates: [],
    wilayats: [],
    outcomes: [],
    screeningTypes: []
  });
  const [referralResults, setReferralResults] = useState<any[]>([
    {
      notificationId: '10896448',
      reportingDate: '27/12/21',
      patientName: 'MOHAMMED SALIM AL QULHATI',
      patientNo: '8520952',
      notificationName: 'ARI Notification',
      reportingFromGov: 'Muscat',
      reportingFromInst: 'Dr Rafy Diagnostic Laboratory',
      followUpGov: 'Muscat',
      followUpInst: 'Al Shumoos Clinic, Mabela'
    },
    {
      notificationId: '10879631',
      reportingDate: '24/12/21',
      patientName: 'SOUD MOHAMMED AL SHIELY',
      patientNo: '306811',
      notificationName: 'ARI Notification',
      reportingFromGov: 'Muscat',
      reportingFromInst: 'Al Hayat International Hospital',
      followUpGov: 'Muscat',
      followUpInst: 'Al Shumoos Clinic, Mabela'
    },
    {
      notificationId: '10825069',
      reportingDate: '23/01/22',
      patientName: 'SHAM MOHAMMED AL MAQBALI',
      patientNo: '100274',
      notificationName: 'ARI Notification',
      reportingFromGov: 'North Batinah',
      reportingFromInst: 'Al Shamoos Medical Center, Soh...',
      followUpGov: 'North Batinah',
      followUpInst: 'Al Shamoos Medical Center, Soh...'
    },
    {
      notificationId: '12018905',
      reportingDate: '23/01/22',
      patientName: 'KAMLA KHALIFA AL HATTALI',
      patientNo: '521408',
      notificationName: 'ARI Notification',
      reportingFromGov: 'Muscat',
      reportingFromInst: 'Al Shumoos Clinic, Mabela',
      followUpGov: 'Muscat',
      followUpInst: 'Al Shumoos Clinic, Mabela'
    },
    {
      notificationId: '10931438',
      reportingDate: '24/01/22',
      patientName: 'RASHID SALIM AL HAJRI',
      patientNo: '11870133',
      notificationName: 'ARI Notification',
      reportingFromGov: 'North Ash Sharqiyah',
      reportingFromInst: 'Dar al Qamar medical Center',
      followUpGov: 'Adh Dhahirah',
      followUpInst: 'International SOS'
    },
    {
      notificationId: '10620631',
      reportingDate: '24/01/22',
      patientName: 'LESLIE FERNANDES',
      patientNo: '140848',
      notificationName: 'ARI Notification',
      reportingFromGov: 'Muscat',
      reportingFromInst: 'Lifeline Medical Centre, Darsait',
      followUpGov: 'Adh Dhahirah',
      followUpInst: 'International SOS'
    },
    {
      notificationId: '11077607',
      reportingDate: '23/01/22',
      patientName: 'MALISHA MASUD AL AWFI',
      patientNo: '7654347',
      notificationName: 'ARI Notification',
      reportingFromGov: 'Muscat',
      reportingFromInst: 'Royal Hospital',
      followUpGov: 'Muscat',
      followUpInst: 'Al Janah health Center'
    },
    {
      notificationId: '10834959',
      reportingDate: '18/12/21',
      patientName: 'SAID SAAD AL BADRANI',
      patientNo: '36103',
      notificationName: 'ARI Notification',
      reportingFromGov: 'North Batinah',
      reportingFromInst: 'Dar Al Majid Medical polyclinic',
      followUpGov: 'North Batinah',
      followUpInst: 'Al Shamoos Medical Center, Soh...'
    },
    {
      notificationId: '11066737',
      reportingDate: '23/01/22',
      patientName: 'YAQOOB SULMAN AL LOYAHI',
      patientNo: '114200',
      notificationName: 'ARI Notification',
      reportingFromGov: 'Muscat',
      reportingFromInst: 'Al Shumoos Clinic, Mabela',
      followUpGov: 'Muscat',
      followUpInst: 'Al Shumoos Clinic, Mabela'
    },
    {
      notificationId: '10860705',
      reportingDate: '22/12/21',
      patientName: 'MANYAB SELL AL ZAABI',
      patientNo: '173129',
      notificationName: 'ARI Notification',
      reportingFromGov: 'North Batinah',
      reportingFromInst: 'Badr al samaa polyclinic - Falaj ...',
      followUpGov: 'North Batinah',
      followUpInst: 'Al Shamoos Medical Center, Soh...'
    }
  ]);

  const handleTbInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setTbSearchData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'radio') {
      setTbSearchData(prev => ({ ...prev, [name]: value }));
    } else {
      setTbSearchData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleReferralInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReferralSearchData(prev => ({ ...prev, [name]: value }));
  };

  const handleTbSearch = async () => {
    setLoading(true);
    try {
      const filters = {
        governorate: tbSearchData.governorate,
        wilayat: tbSearchData.wilayat,
        reportingInstitute: tbSearchData.reportingInstitute,
        notificationId: tbSearchData.notificationId,
        reportingDateFrom: tbSearchData.reportingDateFrom,
        reportingDateTo: tbSearchData.reportingDateTo,
        classification: tbSearchData.classification,
        status: tbSearchData.status,
        finalOutcome: tbSearchData.finalOutcome,
        finalOutcomeDateFrom: tbSearchData.finalOutcomeDateFrom,
        finalOutcomeDateTo: tbSearchData.finalOutcomeDateTo,
        tbContact: tbSearchData.tbContact,
        confirmedTB: tbSearchData.confirmedTB,
        mode: tbSearchData.mode,
        hospitalType: tbSearchData.hospitalType,
        includeGovernorate: tbSearchData.includeGovernorate,
        riskFactors: tbSearchData.riskFactors,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage
      };

      const response = await tbScreeningApi.getAll(filters);

      if (response.success) {
        setTbResults(response.screenings);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error searching TB listings:', error);
      alert(`Failed to search TB listings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const response = await tbScreeningApi.getFilterOptions();
      if (response.success) {
        setFilterOptions(response.filters);
      }
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  useEffect(() => {
    handleTbSearch();
    loadFilterOptions();
  }, [pagination.currentPage]);

  const handleReferralSearch = () => {
    console.log('Searching Referral Listing:', referralSearchData);
  };

  const clearTbForm = () => {
    setTbSearchData({
      governorate: '',
      wilayat: '',
      reportingInstitute: '',
      notificationId: '',
      reportingDateFrom: '',
      reportingDateTo: '',
      classification: '',
      status: '',
      finalOutcome: '',
      finalOutcomeDateFrom: '',
      finalOutcomeDateTo: '',
      tbContact: '',
      confirmedTB: '',
      mode: '',
      hospitalType: '',
      includeGovernorate: false,
      riskFactors: ''
    });
  };

  const clearReferralForm = () => {
    setReferralSearchData({
      fromGovernorate: 'MUSCAT',
      fromWilayat: 'As Seeb',
      reportingFromInstitute: '',
      followUpGovernorate: '',
      followUpWilayat: '',
      followUpInstitute: '',
      reportingDateFrom: '',
      reportingDateTo: '',
      notificationId: '',
      patientName: '',
      notificationType: '',
      civilNo: '',
      gsmNo: ''
    });
  };

  const renderTbListing = () => (
    <div className="space-y-6">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Governorate</label>
            <select
              name="governorate"
              value={tbSearchData.governorate}
              onChange={handleTbInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
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
              value={tbSearchData.wilayat}
              onChange={handleTbInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Reporting Institute</label>
            <select
              name="reportingInstitute"
              value={tbSearchData.reportingInstitute}
              onChange={handleTbInputChange}
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
              value={tbSearchData.notificationId}
              onChange={handleTbInputChange}
              placeholder="Enter Notification ID"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Reporting Date</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                name="reportingDateFrom"
                value={tbSearchData.reportingDateFrom}
                onChange={handleTbInputChange}
                placeholder="From"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="date"
                name="reportingDateTo"
                value={tbSearchData.reportingDateTo}
                onChange={handleTbInputChange}
                placeholder="To"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Classification</label>
            <input
              type="text"
              name="classification"
              value={tbSearchData.classification}
              onChange={handleTbInputChange}
              placeholder="Enter Classification"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              name="status"
              value={tbSearchData.status}
              onChange={handleTbInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Final Outcome</label>
            <select
              name="finalOutcome"
              value={tbSearchData.finalOutcome}
              onChange={handleTbInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="Cured">Cured</option>
              <option value="Treatment Completed">Treatment Completed</option>
              <option value="Treatment Failed">Treatment Failed</option>
              <option value="Died">Died</option>
              <option value="Lost to Follow-up">Lost to Follow-up</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Final Outcome Date</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                name="finalOutcomeDateFrom"
                value={tbSearchData.finalOutcomeDateFrom}
                onChange={handleTbInputChange}
                placeholder="From"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="date"
                name="finalOutcomeDateTo"
                value={tbSearchData.finalOutcomeDateTo}
                onChange={handleTbInputChange}
                placeholder="To"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">History of contact with known TB</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tbContact"
                  value="yes"
                  checked={tbSearchData.tbContact === 'yes'}
                  onChange={handleTbInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tbContact"
                  value="no"
                  checked={tbSearchData.tbContact === 'no'}
                  onChange={handleTbInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">No</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Confirmed Case of TB</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="confirmedTB"
                  value="yes"
                  checked={tbSearchData.confirmedTB === 'yes'}
                  onChange={handleTbInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="confirmedTB"
                  value="no"
                  checked={tbSearchData.confirmedTB === 'no'}
                  onChange={handleTbInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">No</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Mode <span className="text-red-500">*</span>
            </label>
            <select
              name="mode"
              value={tbSearchData.mode}
              onChange={handleTbInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Hospital Type</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hospitalType"
                  value="all"
                  checked={tbSearchData.hospitalType === 'all'}
                  onChange={handleTbInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">All</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hospitalType"
                  value="moh"
                  checked={tbSearchData.hospitalType === 'moh'}
                  onChange={handleTbInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">MOH</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hospitalType"
                  value="non-moh"
                  checked={tbSearchData.hospitalType === 'non-moh'}
                  onChange={handleTbInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Non-MOH</span>
              </label>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="includeGovernorate"
                checked={tbSearchData.includeGovernorate}
                onChange={handleTbInputChange}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Include this Governorate patients also</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Risk Factors</label>
            <select
              name="riskFactors"
              value={tbSearchData.riskFactors}
              onChange={handleTbInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="HIV">HIV</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Smoking">Smoking</option>
              <option value="Drug Addiction">Drug Addiction</option>
              <option value="Chronic Lung Disease">Chronic Lung Disease</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Advanced Search
          </button>
          <button
            type="button"
            onClick={handleTbSearch}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            onClick={clearTbForm}
            className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Clear
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <FileDown className="h-4 w-4" />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Notification ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Reporting Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Patient Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Patient NO</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Reporting Governorate</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Reporting Institute</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Final Outcome</th>
              </tr>
            </thead>
            <tbody>
              {tbResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 italic">
                    No Rows To Show
                  </td>
                </tr>
              ) : (
                tbResults.map((result, index) => (
                  <tr key={index} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{result.notificationId}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{result.reportingDate}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{result.patientName}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{result.patientNo}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{result.governorate}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{result.institute}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{result.status}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{result.finalOutcome}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
          <div className="flex space-x-2">
            <button type="button" className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">
              Relative Screening
            </button>
            <button type="button" className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">
              Follow up
            </button>
            <button
              type="button"
              onClick={() => navigate('/tb-notifications/new')}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </button>
          </div>
          <nav>
            <ul className="flex items-center space-x-1">
              <li>
                <button className="px-3 py-2 text-sm text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed">
                  Previous
                </button>
              </li>
              <li>
                <button className="px-3 py-2 text-sm text-white bg-blue-500 rounded-lg">1</button>
              </li>
              <li>
                <button className="px-3 py-2 text-sm text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed">
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );

  const renderReferralListing = () => (
    <div className="space-y-6">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">From Governorate</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralSearchData.fromGovernorate}
                readOnly
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg bg-slate-50"
              />
              <button type="button" className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-100">
                ×
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">From Wilayat</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralSearchData.fromWilayat}
                readOnly
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg bg-slate-50"
              />
              <button type="button" className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-100">
                ×
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Reporting From Institute</label>
            <select
              name="reportingFromInstitute"
              value={referralSearchData.reportingFromInstitute}
              onChange={handleReferralInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Follow-Up Governorate</label>
            <select
              name="followUpGovernorate"
              value={referralSearchData.followUpGovernorate}
              onChange={handleReferralInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Follow-Up Wilayat</label>
            <select
              name="followUpWilayat"
              value={referralSearchData.followUpWilayat}
              onChange={handleReferralInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Follow-Up Institute</label>
            <select
              name="followUpInstitute"
              value={referralSearchData.followUpInstitute}
              onChange={handleReferralInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Reporting Date</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                name="reportingDateFrom"
                value={referralSearchData.reportingDateFrom}
                onChange={handleReferralInputChange}
                placeholder="From"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="date"
                name="reportingDateTo"
                value={referralSearchData.reportingDateTo}
                onChange={handleReferralInputChange}
                placeholder="To"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Notification ID</label>
            <input
              type="text"
              name="notificationId"
              value={referralSearchData.notificationId}
              onChange={handleReferralInputChange}
              placeholder="Enter Notification ID"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Patient Name</label>
            <input
              type="text"
              name="patientName"
              value={referralSearchData.patientName}
              onChange={handleReferralInputChange}
              placeholder="Enter Patient Name"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Notification Type</label>
            <select
              name="notificationType"
              value={referralSearchData.notificationType}
              onChange={handleReferralInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="ARI Notification">ARI Notification</option>
              <option value="TB Notification">TB Notification</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Civil No</label>
            <input
              type="text"
              name="civilNo"
              value={referralSearchData.civilNo}
              onChange={handleReferralInputChange}
              placeholder="Enter Civil No"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">GSM No</label>
            <input
              type="text"
              name="gsmNo"
              value={referralSearchData.gsmNo}
              onChange={handleReferralInputChange}
              placeholder="Enter GSM No"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={clearReferralForm}
            className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleReferralSearch}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Notification ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Reporting Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Patient Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Patient NO</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Notification Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Reporting from Governorate</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Reporting from Institute</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Follow-Up Governorate</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Follow-Up Institute</th>
              </tr>
            </thead>
            <tbody>
              {referralResults.map((result, index) => (
                <tr key={index} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">{result.notificationId}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{result.reportingDate}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{result.patientName}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{result.patientNo}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{result.notificationName}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{result.reportingFromGov}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{result.reportingFromInst}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{result.followUpGov}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{result.followUpInst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
          <div>
            <span className="text-sm text-slate-600">(Total: 1342 records)</span>
          </div>
          <nav>
            <ul className="flex items-center space-x-1">
              <li>
                <button className="px-3 py-2 text-sm text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
                  ‹
                </button>
              </li>
              <li>
                <button className="px-3 py-2 text-sm text-white bg-blue-500 rounded-lg">1</button>
              </li>
              <li>
                <button className="px-3 py-2 text-sm text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
                  2
                </button>
              </li>
              <li>
                <button className="px-3 py-2 text-sm text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
                  3
                </button>
              </li>
              <li>
                <button className="px-3 py-2 text-sm text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
                  4
                </button>
              </li>
              <li>
                <button className="px-3 py-2 text-sm text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
                  5
                </button>
              </li>
              <li>
                <button className="px-3 py-2 text-sm text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
                  ›
                </button>
              </li>
              <li>
                <button className="px-3 py-2 text-sm text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
                  »
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );

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
                TB Listing
              </h1>
              <p className="text-sm text-slate-600">Search and manage TB records</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('tb-listing')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === 'tb-listing'
                  ? 'text-blue-600 border-b-3 border-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              TB Listing
            </button>
            <button
              onClick={() => setActiveTab('referral-listing')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === 'referral-listing'
                  ? 'text-blue-600 border-b-3 border-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Referral Listing
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'tb-listing' ? renderTbListing() : renderReferralListing()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TBListing;
