import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, X, Calendar, User, Phone, MapPin, Building, FileText, Activity, Filter, Eye, Edit, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationPDFGenerator from '../../components/DownloadPDF/NotificationPDFGenerator';

interface FormData {
  patientId: string;
  name: string;
  gsmNo: string;
  sex: string;
  maritalStatus: string;
  ageFrom: string;
  ageTo: string;
  nationality: string;
  patientGovernorate: string;
  governorate: string;
  wilayat: string;
  reportingInstitute: string;
  finalOutcome: string;
  notificationId: string;
  reportingDate: string;
  finalOutcomeDate: string;
  caseDetectedVisa: string;
  labConfirmedCase: string;
  species: {
    pFalciparum: boolean;
    pVivax: boolean;
    mixed: boolean;
    pOvale: boolean;
    pMalariae: boolean;
  };
  pastMalariaHistory: string;
  travelHistory: string;
  classification: string;
  hospitalType: string;
}

interface Notification {
  id: number;
  notificationId: string;
  reportingDate: string;
  patientName: string;
  patientNo: string;
  age: number;
  sex: string;
  reportingInstitute: string;
  status: string;
}

import { API_BASE_URL } from '../../config';

const API_URL = API_BASE_URL;

const MalariaListing: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    patientId: '',
    name: '',
    gsmNo: '',
    sex: '',
    maritalStatus: '',
    ageFrom: '',
    ageTo: '',
    nationality: '',
    patientGovernorate: '',
    governorate: '',
    wilayat: '',
    reportingInstitute: '',
    finalOutcome: '',
    notificationId: '',
    reportingDate: '',
    finalOutcomeDate: '',
    caseDetectedVisa: '',
    labConfirmedCase: '',
    species: {
      pFalciparum: false,
      pVivax: false,
      mixed: false,
      pOvale: false,
      pMalariae: false
    },
    pastMalariaHistory: '',
    travelHistory: '',
    classification: 'imported',
    hospitalType: 'all'
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith('species.')) {
        const speciesType = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          species: {
            ...prev.species,
            [speciesType]: checked
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Basic Search - Only by Patient ID
  const handleBasicSearch = async () => {
    if (!formData.patientId.trim()) {
      alert('Please enter Patient ID for basic search');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      queryParams.append('patientId', formData.patientId);

      console.log('🔍 Basic search with Patient ID:', formData.patientId);

      const response = await fetch(`${API_URL}/notifications/search?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        console.log('✅ Basic search results:', data.notifications);
      } else {
        console.error('❌ Basic search failed:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('💥 Error in basic search:', error);
    } finally {
      setLoading(false);
    }
  };

  // Advanced Search - All fields
  const handleAdvancedSearch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();

      // Add all search parameters for advanced search
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'species') {
          // Handle species checkboxes
          const speciesObj = value as any;
          const selectedSpecies = Object.entries(speciesObj)
            .filter(([_, isSelected]) => isSelected)
            .map(([speciesKey]) => {
              return speciesKey.replace('p', 'P.').replace(/([A-Z])/g, ' $1').trim();
            });

          if (selectedSpecies.length > 0) {
            queryParams.append('species', selectedSpecies.join(','));
          }
        } else if (value && typeof value === 'string' && value.trim() !== '') {
          queryParams.append(key, value);
        }
      });

      console.log('🔍 Advanced search with params:', queryParams.toString());

      const response = await fetch(`${API_URL}/notifications/search?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        console.log('✅ Advanced search results:', data.notifications);
      } else {
        console.error('❌ Advanced search failed:', response.status);
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('💥 Error in advanced search:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      patientId: '',
      name: '',
      gsmNo: '',
      sex: '',
      maritalStatus: '',
      ageFrom: '',
      ageTo: '',
      nationality: '',
      patientGovernorate: '',
      governorate: '',
      wilayat: '',
      reportingInstitute: '',
      finalOutcome: '',
      notificationId: '',
      reportingDate: '',
      finalOutcomeDate: '',
      caseDetectedVisa: '',
      labConfirmedCase: '',
      species: {
        pFalciparum: false,
        pVivax: false,
        mixed: false,
        pOvale: false,
        pMalariae: false
      },
      pastMalariaHistory: '',
      travelHistory: '',
      classification: 'imported',
      hospitalType: 'all'
    });
    setShowAdvancedSearch(false);
    fetchNotifications();
  };

  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
  };

  // Add this exportToExcel function to your MalariaListing.tsx
  const exportToExcel = async () => {
    try {
      const XLSX = await import('xlsx');

      setLoading(true);

      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();

      // Check if any search criteria are filled
      let hasSearchCriteria = false;

      console.log('📊 Current formData:', formData);

      // Add all search parameters for advanced search - MATCH BACKEND FIELD NAMES
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'species') {
          const speciesObj = value as any;
          const selectedSpecies = Object.entries(speciesObj)
            .filter(([_, isSelected]) => isSelected)
            .map(([speciesKey]) => speciesKey);

          if (selectedSpecies.length > 0) {
            queryParams.append('species', selectedSpecies.join(','));
            hasSearchCriteria = true;
            console.log('🔬 Species filter:', selectedSpecies);
          }
        } else if (value && typeof value === 'string' && value.trim() !== '') {
          // Map frontend field names to backend field names
          const backendFieldMap: { [key: string]: string } = {
            patientId: 'patientId',
            name: 'name',
            gsmNo: 'gsmNo',
            sex: 'sex',
            maritalStatus: 'maritalStatus',
            ageFrom: 'ageFrom',
            ageTo: 'ageTo',
            nationality: 'nationality',
            patientGovernorate: 'patientGovernorate',
            governorate: 'governorate',
            wilayat: 'wilayat',
            reportingInstitute: 'reportingInstitute',
            finalOutcome: 'finalOutcome',
            notificationId: 'notificationId',
            reportingDate: 'reportingDate',
            finalOutcomeDate: 'finalOutcomeDate',
            caseDetectedVisa: 'caseDetectedVisa',
            labConfirmedCase: 'labConfirmedCase',
            pastMalariaHistory: 'pastMalariaHistory',
            travelHistory: 'travelHistory',
            classification: 'classification',
            hospitalType: 'hospitalType'
          };

          const backendField = backendFieldMap[key] || key;
          queryParams.append(backendField, value);
          hasSearchCriteria = true;
          console.log(`🔍 Added filter: ${backendField} = ${value}`);
        }
      });

      let apiUrl = `${API_URL}/notifications`;

      // Only append search parameters if there are actual search criteria
      if (hasSearchCriteria) {
        apiUrl = `${API_URL}/notifications/search?${queryParams.toString()}`;
        console.log('🔍 Excel Export with search params:', queryParams.toString());
      } else {
        console.log('📊 Excel Export - Fetching all notifications');
      }

      console.log('🌐 Final API URL:', apiUrl);

      const response = await fetch(`${API_URL}/notifications/export/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Response:', data);

        // Handle the response format - your backend returns { success: true, notifications: [...] }
        const exportNotifications = data.notifications || [];

        console.log('📋 Notifications to export:', exportNotifications.length);

        if (exportNotifications.length > 0) {
          console.log('🔍 First notification sample:', exportNotifications[0]);
        }

        if (exportNotifications.length === 0) {
          alert('No data found with the current search criteria to export.');
          setLoading(false);
          return;
        }

        // Create worksheet data with ALL FIELDS
        const worksheetData = exportNotifications.map((notification: any, index: number) => ({
          'S.No': index + 1,
          'ID': notification.id,
          'Patient ID': notification.patient_id,
          'First Name': notification.first_name,
          'Second Name': notification.second_name,
          'Full Name': notification.patientName || `${notification.first_name || ''} ${notification.second_name || ''}`.trim(),
          'Institution': notification.institution,
          'Governorate': notification.governorate,
          'Wilayat': notification.wilayat,
          'Treatment': notification.treatment,
          'Outcome': notification.outcome,
          'Age': notification.age,
          'Gender': notification.gender,
          'Mobile No': notification.mobile_no,
          'Place of Work': notification.place_of_work,
          'Reporting Date': notification.reporting_date,
          'Date of Birth': notification.dob,
          'Expiry Date': notification.expiry_date,
          'Term': notification.term,
          'Next of Kin Mobile': notification.next_of_kin_mobile_no,
          'Education': notification.education,
          'Passport No': notification.passport_no,
          'Monthly Income': notification.monthly_income,
          'Patient Governorate': notification.patient_governorate,
          'Nationality': notification.nationality,
          'Longitude': notification.longitude,
          'Marital Status': notification.marital_status,
          'Patient Wilayat': notification.patient_wilayat,
          'Work Status': notification.work_status,
          'Treatment Start Date': notification.treatment_start_date,
          'Treatment Dose': notification.treatment_dose,
          'Primaquine': notification.primaquine,
          'Outcome Date': notification.outcome_date,
          'Remarks': notification.remarks,
          'Date of Onset': notification.date_of_onset,
          'Symptoms': Array.isArray(notification.symptoms) ? notification.symptoms.join(', ') : notification.symptoms,
          'Past Malaria History': notification.past_history_of_malaria,
          'Blood Transfusion (3 months)': notification.blood_transfusion_within_past_3_months,
          'RDT Reported Date': notification.rdt_reported_date,
          'Species': Array.isArray(notification.species) ? notification.species.join(', ') : notification.species,
          'Density': notification.density,
          'Stages': Array.isArray(notification.stages) ? notification.stages.join(', ') : notification.stages,
          'Parasite Count': notification.parasite_count,
          'Relapse': notification.relapse,
          'Other Treatment': notification.other_treatment,
          'Other Treatment Start Date': notification.other_treatment_start_date,
          'Treatment End Date': notification.treatment_end_date,
          'Other Treatment Dose': notification.other_treatment_dose,
          'Other Primaquine': notification.other_primaquine,
          'Other Outcome': notification.other_outcome,
          'Other Outcome Date': notification.other_outcome_date,
          'Other Remarks': notification.other_remarks,
          'Created At': notification.created_at,
          'Updated At': notification.updated_at,
          'Status': notification.status
        }));

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);

        // Auto-size columns
        const maxWidth = worksheetData.reduce((w: number, r: Record<string, unknown>) => {
          return Math.max(w, Object.keys(r).length);
        }, 10);

        worksheet['!cols'] = Array(maxWidth).fill({ wch: 20 });

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Malaria Notifications');

        // Generate Excel file and download
        const fileName = `Malaria_Notifications_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);

        console.log('✅ Excel file generated successfully:', fileName);
        setLoading(false);
      } else {
        console.error('❌ Excel export failed:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        alert('Failed to fetch data for export. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('💥 Error exporting to Excel:', error);
      alert('Error exporting to Excel. Please try again.');
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/notifications')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Malaria Notification</h1>
              <p className="text-sm text-gray-600">Search and manage malaria case notifications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search Criteria
            </h2>
            <button
              onClick={toggleAdvancedSearch}
              className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>{showAdvancedSearch ? 'Hide Advanced' : 'Advanced Search'}</span>
            </button>
          </div>

          <div className="p-6">
            {/* Basic Search - Patient ID Only */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Quick Search
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Patient ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    placeholder="Enter Patient ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex items-end space-x-4 md:col-span-3">
                  <button
                    type="button"
                    onClick={handleBasicSearch}
                    disabled={loading || !formData.patientId.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Search className="h-5 w-5" />
                    <span>{loading ? 'Searching...' : 'Search'}</span>
                  </button>
                  <p className="text-sm text-gray-500">
                    Enter Patient ID and click Search for quick results
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Search Fields - Conditionally Rendered */}
            {showAdvancedSearch && (
              <>
                {/* Patient Information Section */}
                <div className="mb-8 border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        GSM NO
                      </label>
                      <input
                        type="text"
                        name="gsmNo"
                        value={formData.gsmNo}
                        onChange={handleInputChange}
                        placeholder="Enter GSM No"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Sex
                      </label>
                      <select
                        name="sex"
                        value={formData.sex}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Marital Status
                      </label>
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Age (in Years)
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          name="ageFrom"
                          value={formData.ageFrom}
                          onChange={handleInputChange}
                          placeholder="From"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <input
                          type="number"
                          name="ageTo"
                          value={formData.ageTo}
                          onChange={handleInputChange}
                          placeholder="To"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Nationality
                      </label>
                      <select
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select</option>
                        <option value="sudanese">Sudanese</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Patient Governorate
                      </label>
                      <select
                        name="patientGovernorate"
                        value={formData.patientGovernorate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select</option>
                        <option value="khartoum">Khartoum</option>
                        <option value="kassala">Kassala</option>
                        <option value="aljazeera">Aljazeera</option>
                        <option value="elgedarf">Elgedarf</option>
                        <option value="kordofan">Kordofan</option>
                        <option value="darfur">Darfur</option>
                        <option value="port-sudan">Port Sudan</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Location Information Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Location Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Governorate
                      </label>
                      <select
                        name="governorate"
                        value={formData.governorate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select Governorate</option>
                        <option value="khartoum">Khartoum</option>
                        <option value="kassala">Kassala</option>
                        <option value="aljazeera">Aljazeera</option>
                        <option value="elgedarf">Elgedarf</option>
                        <option value="kordofan">Kordofan</option>
                        <option value="darfur">Darfur</option>
                        <option value="port-sudan">Port Sudan</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Wilayat
                      </label>
                      <select
                        name="wilayat"
                        value={formData.wilayat}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select Wilayat</option>
                        <option value="khartoum">Khartoum</option>
                        <option value="omdurman">Omdurman</option>
                        <option value="bahri">Bahri</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        Reporting Institute
                      </label>
                      <select
                        name="reportingInstitute"
                        value={formData.reportingInstitute}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select</option>
                        <option value="hospital">Hospital</option>
                        <option value="clinic">Clinic</option>
                        <option value="health-center">Health Center</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Final Outcome
                      </label>
                      <select
                        name="finalOutcome"
                        value={formData.finalOutcome}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select</option>
                        <option value="cured">Cured</option>
                        <option value="died">Died</option>
                        <option value="transferred">Transferred</option>
                        <option value="lost-to-followup">Lost to Follow-up</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Date Information Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Date Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Notification ID
                      </label>
                      <input
                        type="text"
                        name="notificationId"
                        value={formData.notificationId}
                        onChange={handleInputChange}
                        placeholder="Enter Notification ID"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Reporting Date
                      </label>
                      <input
                        type="date"
                        name="reportingDate"
                        value={formData.reportingDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Final Outcome Date
                      </label>
                      <input
                        type="date"
                        name="finalOutcomeDate"
                        value={formData.finalOutcomeDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Clinical Information Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Clinical Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Case detected in visa screening */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Case detected in visa screening
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="caseDetectedVisa"
                            value="yes"
                            checked={formData.caseDetectedVisa === 'yes'}
                            onChange={handleInputChange}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="caseDetectedVisa"
                            value="no"
                            checked={formData.caseDetectedVisa === 'no'}
                            onChange={handleInputChange}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">No</span>
                        </label>
                      </div>
                    </div>

                    {/* Lab confirmed case */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Lab confirmed case
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="labConfirmedCase"
                            value="yes"
                            checked={formData.labConfirmedCase === 'yes'}
                            onChange={handleInputChange}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="labConfirmedCase"
                            value="no"
                            checked={formData.labConfirmedCase === 'no'}
                            onChange={handleInputChange}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">No</span>
                        </label>
                      </div>
                    </div>

                    {/* Species */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Species
                      </label>
                      <div className="space-y-2">
                        {Object.entries(formData.species).map(([key, value]) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              name={`species.${key}`}
                              checked={value}
                              onChange={handleInputChange}
                              className="mr-2 text-blue-600 focus:ring-blue-500 rounded"
                            />
                            <span className="text-sm text-gray-700">
                              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, '.$1')}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Classification */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Classification
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="classification"
                            value="imported"
                            checked={formData.classification === 'imported'}
                            onChange={handleInputChange}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Imported</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="classification"
                            value="local"
                            checked={formData.classification === 'local'}
                            onChange={handleInputChange}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Local</span>
                        </label>
                      </div>
                    </div>

                    {/* Past Malaria History */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Past Malaria History
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="pastMalariaHistory"
                            value="yes"
                            checked={formData.pastMalariaHistory === 'yes'}
                            onChange={handleInputChange}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="pastMalariaHistory"
                            value="no"
                            checked={formData.pastMalariaHistory === 'no'}
                            onChange={handleInputChange}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">No</span>
                        </label>
                      </div>
                    </div>

                    {/* Travel History */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Travel History
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="travelHistory"
                            value="yes"
                            checked={formData.travelHistory === 'yes'}
                            onChange={handleInputChange}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="travelHistory"
                            value="no"
                            checked={formData.travelHistory === 'no'}
                            onChange={handleInputChange}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">No</span>
                        </label>
                      </div>
                    </div>

                    {/* Hospital Type */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Hospital Type
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="hospitalType"
                            value="all"
                            checked={formData.hospitalType === 'all'}
                            onChange={handleInputChange}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">All</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="hospitalType"
                            value="moh"
                            checked={formData.hospitalType === 'moh'}
                            onChange={handleInputChange}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">MOH</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="hospitalType"
                            value="non-moh"
                            checked={formData.hospitalType === 'non-moh'}
                            onChange={handleInputChange}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Non-MOH</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              {showAdvancedSearch && (
                <button
                  type="button"
                  onClick={handleAdvancedSearch}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors disabled:opacity-50"
                >
                  <Filter className="h-5 w-5" />
                  <span>{loading ? 'Searching...' : 'Advanced Search'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleClear}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg flex items-center space-x-2 font-medium transition-colors"
              >
                <X className="h-5 w-5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Malaria Listing ({notifications.length} results)
            </h2>
            <button
              onClick={exportToExcel}
              disabled={notifications.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-blue-400">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Notification ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Reporting Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Patient NO
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Sex
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Reporting Institute
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <tr key={notification.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {notification.notificationId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.reportingDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.patientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.patientNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.sex}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.reportingInstitute}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${notification.status === 'Saved'
                          ? 'bg-green-100 text-green-800'
                          : notification.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {notification.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            onClick={() => console.log('View clicked for:', notification.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            onClick={() => console.log('Edit clicked for:', notification.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <NotificationPDFGenerator
                            notification={notification as any}
                            onDownload={() => console.log('PDF downloaded for:', notification.notificationId)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                      No notifications found. Try adjusting your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MalariaListing;