import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, User, FileText, Activity, ChevronRight, ChevronLeft, Save, Pencil, Trash2, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface ARINotificationFormData {
  // Notification Info
  governorate: string;
  wilayat: string;
  institution: string;
  reportingDate: string;

  // Patient Info
  patientId: string;
  civilId: string;
  expiryDate: string;
  age: string;
  firstName: string;
  secondName: string;
  dob: string;
  term: string;
  mobileNo: string;
  nextOfKinMobileNo: string;
  education: string;
  passportNo: string;
  placeOfWork: string;
  monthlyIncome: string;
  patientGovernorate: string;
  nationality: string;
  longitude: string;
  maritalStatus: string;
  patientWilayat: string;
  gender: string;
  workStatus: string;

  // Vaccination Details
  caseType: string;
  vaccinationDetails: string;
  sentinelSite: string;
  suspectDisease: string;
  diseaseStatus: string;

  // Diseases
  confirmedDiseases: string;
  sourceOfInfection: string;
  finalOutcome: string;
  finalOutcomeDate: string;
  remarks: string;
}

const ARINotification: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    setLoadingList(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/ari`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching ARI notifications:', err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/ari/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchNotifications();
      else alert('Failed to delete notification');
    } catch { alert('Error deleting record'); }
  };
  const [formData, setFormData] = useState<ARINotificationFormData>({
    governorate: '',
    wilayat: '',
    institution: '',
    reportingDate: '',
    patientId: '',
    civilId: '',
    expiryDate: '',
    age: '',
    firstName: '',
    secondName: '',
    dob: '',
    term: 'Years',
    mobileNo: '',
    nextOfKinMobileNo: '',
    education: '',
    passportNo: '',
    placeOfWork: '',
    monthlyIncome: '',
    patientGovernorate: '',
    nationality: '',
    longitude: '',
    maritalStatus: '',
    patientWilayat: '',
    gender: '',
    workStatus: '',
    caseType: '',
    vaccinationDetails: '',
    sentinelSite: '',
    suspectDisease: '',
    diseaseStatus: '',
    confirmedDiseases: '',
    sourceOfInfection: '',
    finalOutcome: '',
    finalOutcomeDate: '',
    remarks: ''
  });

  const steps = [
    {
      id: 'notification-info',
      title: 'Notification Info',
      icon: Bell,
      description: 'Basic notification details'
    },
    {
      id: 'patient-info',
      title: 'Patient Info',
      icon: User,
      description: 'Patient personal information'
    },
    {
      id: 'vaccination-details',
      title: 'Vaccination Details',
      icon: FileText,
      description: 'Vaccination and case details'
    },
    {
      id: 'diseases',
      title: 'Diseases',
      icon: Activity,
      description: 'Confirmed diseases and outcome'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      console.log('Submitting ARI Notification:', formData);
      
      const response = await fetch(`${API_BASE_URL}/ari`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit notification');
      }

      await response.json();
      alert('ARI Notification submitted successfully!');
      navigate('/ari-listing');
    } catch (error: any) {
      console.error('Error submitting notification:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderNotificationInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <label className="block text-sm font-medium text-slate-700">
            Institution <span className="text-red-500">*</span>
          </label>
          <select
            name="institution"
            value={formData.institution}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
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
      </div>
    </div>
  );

  const renderPatientInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Patient Id <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Mobile No</label>
            <input
              type="tel"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Place of Work <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="placeOfWork"
              value={formData.placeOfWork}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Longitude</label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Civil Id</label>
            <input
              type="text"
              name="civilId"
              value={formData.civilId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Second Name</label>
            <input
              type="text"
              name="secondName"
              value={formData.secondName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Next of Kin Mobile No</label>
            <input
              type="tel"
              name="nextOfKinMobileNo"
              value={formData.nextOfKinMobileNo}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Monthly Income</label>
            <input
              type="number"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Marital Status</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              DOB <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Education</label>
            <select
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="None">None</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="Higher">Higher</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Governorate <span className="text-red-500">*</span>
            </label>
            <select
              name="patientGovernorate"
              value={formData.patientGovernorate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Governorate A">Governorate A</option>
              <option value="Governorate B">Governorate B</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Wilayat <span className="text-red-500">*</span>
            </label>
            <select
              name="patientWilayat"
              value={formData.patientWilayat}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Wilayat A">Wilayat A</option>
              <option value="Wilayat B">Wilayat B</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Term</label>
            <select
              name="term"
              value={formData.term}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Years">Years</option>
              <option value="Months">Months</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Passport No</label>
            <input
              type="text"
              name="passportNo"
              value={formData.passportNo}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Nationality <span className="text-red-500">*</span>
            </label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Omani">Omani</option>
              <option value="Indian">Indian</option>
              <option value="Pakistani">Pakistani</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 col-span-1">
          <label className="block text-sm font-medium text-slate-700">Work Status</label>
          <select
            name="workStatus"
            value={formData.workStatus}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select</option>
            <option value="Employed">Employed</option>
            <option value="Unemployed">Unemployed</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderVaccinationDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Case Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="caseType"
            value={formData.caseType}
            onChange={handleInputChange}
            placeholder="Enter Case Type"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Vaccination Details <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="vaccinationDetails"
                value="Yes"
                checked={formData.vaccinationDetails === 'Yes'}
                onChange={handleInputChange}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="vaccinationDetails"
                value="No"
                checked={formData.vaccinationDetails === 'No'}
                onChange={handleInputChange}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">No</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Sentinel Site <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="sentinelSite"
                value="Yes"
                checked={formData.sentinelSite === 'Yes'}
                onChange={handleInputChange}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sentinelSite"
                value="No"
                checked={formData.sentinelSite === 'No'}
                onChange={handleInputChange}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">No</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Suspect Disease <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {['Influenza', 'MERS CoV', 'COVID-19', 'Others'].map((disease) => (
              <label key={disease} className="flex items-center">
                <input
                  type="radio"
                  name="suspectDisease"
                  value={disease}
                  checked={formData.suspectDisease === disease}
                  onChange={handleInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{disease}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Disease Status <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {['Suspect', 'Possible', 'Probable'].map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="radio"
                  name="diseaseStatus"
                  value={status}
                  checked={formData.diseaseStatus === status}
                  onChange={handleInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{status}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDiseases = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Confirmed Diseases (For Governorate/Central Users/Hospital Focal Point) <span className="text-red-500">*</span>
        </label>
        <hr className="border-slate-300" />
        <div className="flex flex-wrap gap-4">
          {[
            'Influenza A(H1N1)pdm09',
            'Influenza B',
            'Respiratory syncytial virus',
            'Influenza A(not subtyped)',
            'MERS CoV',
            'Others',
            'Influenza A (H3)',
            'COVID-19',
            'Tested negative',
            'Lab sample not collected'
          ].map((disease) => (
            <label key={disease} className="flex items-center">
              <input
                type="radio"
                name="confirmedDiseases"
                value={disease}
                checked={formData.confirmedDiseases === disease}
                onChange={handleInputChange}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">{disease}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Source of Infection</label>
          <select
            name="sourceOfInfection"
            value={formData.sourceOfInfection}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Outcome</option>
            <option value="aa">aa</option>
            <option value="bb">bb</option>
            <option value="ccc">ccc</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Final Outcome</label>
          <select
            name="finalOutcome"
            value={formData.finalOutcome}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Outcome</option>
            <option value="aa">aa</option>
            <option value="bb">bb</option>
            <option value="ccc">ccc</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Final Outcome Date</label>
          <input
            type="date"
            name="finalOutcomeDate"
            value={formData.finalOutcomeDate}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">Remarks</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleInputChange}
          placeholder="Please use this space to enter other details for Malaria"
          rows={4}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderNotificationInfo();
      case 1:
        return renderPatientInfo();
      case 2:
        return renderVaccinationDetails();
      case 3:
        return renderDiseases();
      default:
        return renderNotificationInfo();
    }
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
                ARI Notification
              </h1>
              <p className="text-sm text-slate-600">Complete all required information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {showForm && (
          <>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Progress</h2>
                <span className="text-sm text-slate-600">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;

                  return (
                    <React.Fragment key={step.id}>
                      <div
                        onClick={() => setCurrentStep(index)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${isActive
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                            : isCompleted
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}>
                        <Icon className="h-5 w-5" />
                        <span className="font-medium text-sm hidden sm:block">{step.title}</span>
                      </div>
                      {index < steps.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 p-8">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {steps[currentStep].title}
                </h3>
                <p className="text-slate-600">{steps[currentStep].description}</p>
              </div>

              {renderCurrentStep()}

              <div className="flex justify-between pt-8 border-t border-slate-200 mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-3">
                  {currentStep === steps.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Save className="h-4 w-4" />
                          <span>Save</span>
                        </div>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">ARI NOTIFICATION</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              + Add
            </button>
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
                {loadingList ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-1" />
                      Loading...
                    </td>
                  </tr>
                ) : notifications.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-slate-400 text-sm">
                      No notifications found. Click <strong>+ Add</strong> to create one.
                    </td>
                  </tr>
                ) : (
                  notifications.map((row, index) => (
                    <tr key={row.notificationId || index} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-400">{index + 1}</td>
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

export default ARINotification;
