import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Phone, MapPin, Building, FileText, Activity, TestTube, ChevronRight, ChevronLeft, Save, Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

interface NotificationFormData {
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

  // Source Details
  treatment: string;
  treatmentStartDate: string;
  treatmentDose: string;
  primaquine: string;
  outcome: string;
  outcomeDate: string;
  remarks: string;

  // History Details
  dateOfOnset: string;
  symptoms: string[];
  pastHistoryOfMalaria: string;
  bloodTransfusionWithinPast3Months: string;

  // Lab Results
  rdtReportedDate: string;
  species: string[];
  density: string;
  stages: string[];
  parasiteCount: string;
  relapse: string;

  // Other Details
  otherTreatment: string;
  otherTreatmentStartDate: string;
  treatmentEndDate: string;
  otherTreatmentDose: string;
  otherPrimaquine: string;
  otherOutcome: string;
  otherOutcomeDate: string;
  otherRemarks: string;
}

const NotificationEntry: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [formData, setFormData] = useState<NotificationFormData>({
    // Notification Info
    governorate: '',
    wilayat: '',
    institution: '',
    reportingDate: '',

    // Patient Info
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

    // Source Details
    treatment: '',
    treatmentStartDate: '',
    treatmentDose: '',
    primaquine: 'Given',
    outcome: '',
    outcomeDate: '',
    remarks: '',

    // History Details
    dateOfOnset: '',
    symptoms: [],
    pastHistoryOfMalaria: 'No',
    bloodTransfusionWithinPast3Months: 'No',

    // Lab Results
    rdtReportedDate: '',
    species: [],
    density: '',
    stages: [],
    parasiteCount: '',
    relapse: 'No',

    // Other Details
    otherTreatment: '',
    otherTreatmentStartDate: '',
    treatmentEndDate: '',
    otherTreatmentDose: '',
    otherPrimaquine: 'Given',
    otherOutcome: '',
    otherOutcomeDate: '',
    otherRemarks: ''
  });

  const steps = [
    {
      id: 'notification-info',
      title: 'Notification Info',
      icon: FileText,
      description: 'Basic notification details'
    },
    {
      id: 'patient-info',
      title: 'Patient Info',
      icon: User,
      description: 'Patient personal information'
    },
    {
      id: 'source-details',
      title: 'Source Details',
      icon: Activity,
      description: 'Treatment and outcome details'
    },
    {
      id: 'history-details',
      title: 'History Details',
      icon: Calendar,
      description: 'Medical history and symptoms'
    },
    {
      id: 'lab-results',
      title: 'Lab Results',
      icon: TestTube,
      description: 'Laboratory test results'
    },
    {
      id: 'other-details',
      title: 'Other Details',
      icon: Activity,
      description: 'Additional treatment details'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setError(''); // Clear any existing errors

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'symptoms' || name === 'species' || name === 'stages') {
        const checkboxValue = (e.target as HTMLInputElement).value;
        setFormData(prev => ({
          ...prev,
          [name]: checked
            ? [...(prev[name as keyof typeof prev] as string[]), checkboxValue]
            : (prev[name as keyof typeof prev] as string[]).filter(s => s !== checkboxValue)
        }));
      }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        setError(`File ${file.name} is not a supported format`);
        return false;
      }

      if (file.size > maxSize) {
        setError(`File ${file.name} is too large (max 10MB)`);
        return false;
      }

      return true;
    });

    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step: number): boolean => {
    const requiredFields: { [key: number]: string[] } = {
      0: ['institution'], // Notification Info
      1: ['patientId', 'firstName', 'dob', 'placeOfWork', 'patientGovernorate', 'nationality', 'patientWilayat', 'gender'], // Patient Info
      2: ['treatment'], // Source Details
      3: ['dateOfOnset'], // History Details
      4: [], // Lab Results - no required fields
      5: [] // Other Details - no required fields
    };

    const required = requiredFields[step] || [];
    const missing = required.filter(field => !formData[field as keyof NotificationFormData]);

    if (missing.length > 0) {
      setError(`Please fill in required fields: ${missing.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setError('');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Notification created successfully! ID: ${data.notificationId}`);

        // Handle file uploads if there are attachments
        if (attachments.length > 0 && data.id) {
          await uploadAttachments(data.id);
        }

        // Redirect after a short delay to show success message
        setTimeout(() => {
          navigate('/notifications');
        }, 2000);
      } else {
        setError(data.error || 'Failed to create notification');
        if (data.missingFields) {
          setError(`Missing required fields: ${data.missingFields.join(', ')}`);
        }
      }
    } catch (error) {
      console.error('Error submitting notification:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const uploadAttachments = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/attachments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        console.error('Failed to upload attachments');
      }
    } catch (error) {
      console.error('Error uploading attachments:', error);
    }
  };

  const renderNotificationInfo = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Malaria Notification</h2>
        <p className="text-slate-600">[Notify only for confirmed cases]</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Governorate
          </label>
          <select
            name="governorate"
            value={formData.governorate}
            onChange={handleInputChange}
            className="input"
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Wilayat
          </label>
          <select
            name="wilayat"
            value={formData.wilayat}
            onChange={handleInputChange}
            className="input"
          >
            <option value="">Select</option>
            <option value="khartoum">Khartoum</option>
            <option value="omdurman">Omdurman</option>
            <option value="bahri">Bahri</option>
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
            className="input border-blue-300 focus:border-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="hospital">Hospital</option>
            <option value="clinic">Clinic</option>
            <option value="health-center">Health Center</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Reporting Date
          </label>
          <input
            type="date"
            name="reportingDate"
            value={formData.reportingDate}
            onChange={handleInputChange}
            className="input"
          />
        </div>
      </div>
    </div>
  );

  const renderPatientInfo = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Patient Id <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Civil Id
          </label>
          <input
            type="text"
            name="civilId"
            value={formData.civilId}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Expiry Date
          </label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="input"
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
            className="input"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Second Name
          </label>
          <input
            type="text"
            name="secondName"
            value={formData.secondName}
            onChange={handleInputChange}
            className="input"
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
            className="input"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Term
          </label>
          <select
            name="term"
            value={formData.term}
            onChange={handleInputChange}
            className="input"
          >
            <option value="Years">Years</option>
            <option value="Months">Months</option>
            <option value="Days">Days</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Mobile No
          </label>
          <input
            type="tel"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Next of Kin Mobile No
          </label>
          <input
            type="tel"
            name="nextOfKinMobileNo"
            value={formData.nextOfKinMobileNo}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Education
          </label>
          <select
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            className="input"
          >
            <option value="">Select</option>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="university">University</option>
            <option value="none">None</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Passport No
          </label>
          <input
            type="text"
            name="passportNo"
            value={formData.passportNo}
            onChange={handleInputChange}
            className="input"
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
            className="input"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Monthly Income
          </label>
          <input
            type="number"
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Governorate <span className="text-red-500">*</span>
          </label>
          <select
            name="patientGovernorate"
            value={formData.patientGovernorate}
            onChange={handleInputChange}
            className="input"
            required
          >
            <option value="">Select</option>
            <option value="khartoum">Khartoum</option>
            <option value="kassala">Kassala</option>
            <option value="aljazeera">Aljazeera</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Nationality <span className="text-red-500">*</span>
          </label>
          <select
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            className="input"
            required
          >
            <option value="">Select</option>
            <option value="sudanese">Sudanese</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Longitude
          </label>
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Marital Status
          </label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleInputChange}
            className="input"
          >
            <option value="">Select</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
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
            className="input"
            required
          >
            <option value="">Select</option>
            <option value="khartoum">Khartoum</option>
            <option value="omdurman">Omdurman</option>
            <option value="bahri">Bahri</option>
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
            className="input"
            required
          >
            <option value="">Select</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Work Status
          </label>
          <select
            name="workStatus"
            value={formData.workStatus}
            onChange={handleInputChange}
            className="input"
          >
            <option value="">Select</option>
            <option value="employed">Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="student">Student</option>
            <option value="retired">Retired</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSourceDetails = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Treatment <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="treatment"
            value={formData.treatment}
            onChange={handleInputChange}
            placeholder="Enter treatment"
            className="input"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Treatment Start Date
          </label>
          <select
            name="treatmentStartDate"
            value={formData.treatmentStartDate}
            onChange={handleInputChange}
            className="input"
          >
            <option value="">Select</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="custom">Custom Date</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Treatment Dose
          </label>
          <input
            type="text"
            name="treatmentDose"
            value={formData.treatmentDose}
            onChange={handleInputChange}
            placeholder="Enter dose"
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Primaquine <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="primaquine"
                value="Given"
                checked={formData.primaquine === 'Given'}
                onChange={handleInputChange}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Given</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="primaquine"
                value="Not Given"
                checked={formData.primaquine === 'Not Given'}
                onChange={handleInputChange}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Not Given</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Outcome
          </label>
          <select
            name="outcome"
            value={formData.outcome}
            onChange={handleInputChange}
            className="input"
          >
            <option value="">Select</option>
            <option value="cured">Cured</option>
            <option value="died">Died</option>
            <option value="transferred">Transferred</option>
            <option value="lost-to-followup">Lost to Follow-up</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Outcome Date
          </label>
          <input
            type="date"
            name="outcomeDate"
            value={formData.outcomeDate}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Remarks
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            placeholder="Add remarks"
            rows={4}
            className="input resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderHistoryDetails = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Date of Onset <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dateOfOnset"
            value={formData.dateOfOnset}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Symptoms
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Fever', 'Headache', 'Dizziness', 'Vomiting', 'Other'].map((symptom) => (
            <label key={symptom} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="symptoms"
                value={symptom}
                checked={formData.symptoms.includes(symptom)}
                onChange={handleInputChange}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Past History of Malaria
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="pastHistoryOfMalaria"
              value="Yes"
              checked={formData.pastHistoryOfMalaria === 'Yes'}
              onChange={handleInputChange}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="pastHistoryOfMalaria"
              value="No"
              checked={formData.pastHistoryOfMalaria === 'No'}
              onChange={handleInputChange}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">No</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Blood transfusion within past 3 months
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="bloodTransfusionWithinPast3Months"
              value="Yes"
              checked={formData.bloodTransfusionWithinPast3Months === 'Yes'}
              onChange={handleInputChange}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="bloodTransfusionWithinPast3Months"
              value="No"
              checked={formData.bloodTransfusionWithinPast3Months === 'No'}
              onChange={handleInputChange}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">No</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderLabResults = () => (
    <div className="space-y-8">
      <div className="bg-slate-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
          <TestTube className="h-5 w-5 mr-2" />
          Laboratory Findings
        </h3>

        <div className="space-y-8">
          {/* RDT Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
              RDT Reported Date
            </label>
            <input
              type="date"
              name="rdtReportedDate"
              value={formData.rdtReportedDate}
              onChange={handleInputChange}
              className="input max-w-xs"
            />
          </div>

          {/* Species Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
              Species <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 'P.falciparum', label: 'P.falciparum' },
                { value: 'P.vivax', label: 'P.vivax' },
                { value: 'P.ovale', label: 'P.ovale' },
                { value: 'P.malariae', label: 'P.malariae' }
              ].map((species) => (
                <label key={species.value} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="species"
                    value={species.value}
                    checked={formData.species.includes(species.value)}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-slate-700">{species.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Density Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
              Density
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '+1', label: '+1' },
                { value: '+2', label: '+2' },
                { value: '+3', label: '+3' },
                { value: '+4', label: '+4' }
              ].map((density) => (
                <label key={density.value} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="density"
                    value={density.value}
                    checked={formData.density === density.value}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-slate-700">{density.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stages Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
              Stages
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 'Ring forms', label: 'Ring forms' },
                { value: 'Trophozoites', label: 'Trophozoites' },
                { value: 'Schizonts', label: 'Schizonts' },
                { value: 'Gametocytes', label: 'Gametocytes' }
              ].map((stage) => (
                <label key={stage.value} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="stages"
                    value={stage.value}
                    checked={formData.stages.includes(stage.value)}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-slate-700">{stage.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Parasite Count Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
              Count (parasite/μl blood)
            </label>
            <input
              type="text"
              name="parasiteCount"
              value={formData.parasiteCount}
              onChange={handleInputChange}
              placeholder="Enter parasite count per microliter of blood"
              className="input max-w-md"
            />
          </div>

          {/* Relapse Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
              Relapse?
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                <input
                  type="radio"
                  name="relapse"
                  value="Yes"
                  checked={formData.relapse === 'Yes'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-slate-700">Yes</span>
              </label>
              <label className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                <input
                  type="radio"
                  name="relapse"
                  value="No"
                  checked={formData.relapse === 'No'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-slate-700">No</span>
              </label>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
              Attachments
            </label>
            <div className="bg-white rounded-lg border-2 border-dashed border-slate-300 p-6">
              <div className="text-center">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-sm text-slate-600 mb-4">Max. file size: 10MB</p>

                <div className="space-y-4">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  />
                  <div className="flex justify-center space-x-3">
                    <label
                      htmlFor="file-upload"
                      className="btn btn-outline cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      Browse Files
                    </label>
                  </div>
                  <p className="text-xs text-slate-500">
                    Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF
                  </p>
                </div>

                {/* File List */}
                {attachments.length > 0 && (
                  <div className="mt-6">
                    <div className="bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-100">
                        <span className="font-medium text-slate-700">Selected Files</span>
                        <span className="text-sm text-slate-500">{attachments.length} file(s)</span>
                      </div>
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between px-4 py-3 border-b border-slate-100 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600 truncate max-w-xs">{file.name}</span>
                            <span className="text-xs text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOtherDetails = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Treatment
          </label>
          <select
            name="otherTreatment"
            value={formData.otherTreatment}
            onChange={handleInputChange}
            className="input"
          >
            <option value="">Select Treatment</option>
            <option value="artemether-lumefantrine">Artemether-Lumefantrine</option>
            <option value="artesunate">Artesunate</option>
            <option value="chloroquine">Chloroquine</option>
            <option value="quinine">Quinine</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Treatment Start Date
          </label>
          <input
            type="date"
            name="otherTreatmentStartDate"
            value={formData.otherTreatmentStartDate}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Treatment End Date
          </label>
          <input
            type="date"
            name="treatmentEndDate"
            value={formData.treatmentEndDate}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Treatment Dose
          </label>
          <input
            type="text"
            name="otherTreatmentDose"
            value={formData.otherTreatmentDose}
            onChange={handleInputChange}
            placeholder="Enter dose"
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Primaquine
          </label>
          <div className="flex space-x-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="otherPrimaquine"
                value="Given"
                checked={formData.otherPrimaquine === 'Given'}
                onChange={handleInputChange}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Given</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="otherPrimaquine"
                value="Not Given"
                checked={formData.otherPrimaquine === 'Not Given'}
                onChange={handleInputChange}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Not Given</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Outcome
          </label>
          <select
            name="otherOutcome"
            value={formData.otherOutcome}
            onChange={handleInputChange}
            className="input"
          >
            <option value="">Select Outcome</option>
            <option value="cured">Cured</option>
            <option value="died">Died</option>
            <option value="transferred">Transferred</option>
            <option value="lost-to-followup">Lost to Follow-up</option>
            <option value="treatment-failure">Treatment Failure</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Outcome Date
          </label>
          <input
            type="date"
            name="otherOutcomeDate"
            value={formData.otherOutcomeDate}
            onChange={handleInputChange}
            className="input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Remarks
        </label>
        <textarea
          name="otherRemarks"
          value={formData.otherRemarks}
          onChange={handleInputChange}
          placeholder="Please use this space to enter other details for Malaria"
          rows={4}
          className="input resize-none"
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
        return renderSourceDetails();
      case 3:
        return renderHistoryDetails();
      case 4:
        return renderLabResults();
      case 5:
        return renderOtherDetails();
      default:
        return renderNotificationInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/malaria-notification')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gradient">New Notification Entry</h1>
              <p className="text-sm text-slate-600">Complete all required information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2 animate-scale-in">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center space-x-2 animate-scale-in">
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
          </div>
        )}

        {/* Step Navigation */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Progress</h2>
            <span className="text-sm text-slate-600">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <React.Fragment key={step.id}>
                  <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${isActive
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : isCompleted
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-600'
                    }`}>
                    <Icon className="h-5 w-5" />
                    <span className="font-medium text-sm">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
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

        {/* Form Content */}
        <div className="card p-8">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {steps[currentStep].title}
            </h3>
            <p className="text-slate-600">{steps[currentStep].description}</p>
          </div>

          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-slate-200 mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="flex space-x-3">
              {currentStep === steps.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn btn-success"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Submit</span>
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="btn btn-primary"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationEntry;