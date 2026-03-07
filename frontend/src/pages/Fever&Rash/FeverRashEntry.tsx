import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronLeft, Save, X, Plus, Minus, Download, Upload } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import NationalitySelect from '../../components/NationalitySelect';

interface FeverRashFormData {
  governorate: string;
  wilayat: string;
  institution: string;
  reportingDate: string;
  patientId: string;
  civilId: string;
  expiryDate: string;
  dob: string;
  age: string;
  term: string;
  passportNo: string;
  nationality: string;
  firstName: string;
  secondName: string;
  thirdName: string;
  gender: string;
  tribe: string;
  sheikhName: string;
  mobileNo: string;
  nextOfKinMobile: string;
  maritalStatus: string;
  education: string;
  workStatus: string;
  occupations: string;
  placeOfWork: string;
  monthlyIncome: string;
  patientGovernorate: string;
  patientWilayat: string;
  village: string;
  latitude: string;
  longitude: string;
  dateOfOnset: string;
  remarks: string;
  clinicalSymptoms: string[];
  receivedMMR: string;
  immunizations: any[];
  abroadTravel: string;
  tourismWork: string;
  massGathering: string;
  outcome: string;
  outcomeDate: string;
  attachments: File[];
  classification: string;
  finalOutcome: string;
  finalOutcomeDate: string;
  finalRemarks: string;
  labTests: any[];
}

const FeverRashEntry: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FeverRashFormData>({
    governorate: '',
    wilayat: '',
    institution: '',
    reportingDate: '',
    patientId: '',
    civilId: '',
    expiryDate: '',
    dob: '',
    age: '',
    term: 'Years',
    passportNo: '',
    nationality: '',
    firstName: '',
    secondName: '',
    thirdName: '',
    gender: '',
    tribe: '',
    sheikhName: '',
    mobileNo: '',
    nextOfKinMobile: '',
    maritalStatus: '',
    education: '',
    workStatus: '',
    occupations: '',
    placeOfWork: '',
    monthlyIncome: '',
    patientGovernorate: '',
    patientWilayat: '',
    village: '',
    latitude: '',
    longitude: '',
    dateOfOnset: '',
    remarks: '',
    clinicalSymptoms: [],
    receivedMMR: '',
    immunizations: [],
    abroadTravel: '',
    tourismWork: '',
    massGathering: '',
    outcome: '',
    outcomeDate: '',
    attachments: [],
    classification: '',
    finalOutcome: '',
    finalOutcomeDate: '',
    finalRemarks: '',
    labTests: []
  });

  const steps = [
    { id: 'patient', title: 'Patient Info', description: 'Basic Details & Demographics' },
    { id: 'clinical', title: 'Clinical Details', description: 'Examination & Immunization History' },
    { id: 'exposure', title: 'Exposure History', description: 'Travel & Contact History' },
    { id: 'lab', title: 'Lab Investigation', description: 'Laboratory Tests & Classification' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      const checkboxValue = (e.target as HTMLInputElement).value;
      if (name === 'clinicalSymptoms') {
        setFormData(prev => ({
          ...prev,
          [name]: checked
            ? [...prev[name], checkboxValue]
            : prev[name].filter(s => s !== checkboxValue)
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
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
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

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      console.log('Submitting Fever & Rash Entry:', formData);

      const response = await fetch(`${API_BASE_URL}/fever-rash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit entry');
      }

      const data = await response.json();
      alert('Fever & Rash Entry submitted successfully!');
      navigate('/fever-rash-notifications');
    } catch (error: any) {
      console.error('Error submitting entry:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderPatientInfo = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Fever and Rash</h2>
        <p className="text-yellow-600">[Patient Information & Basic Details]</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Governorate
          </label>
          <input
            type="text"
            name="governorate"
            value={formData.governorate}
            onChange={handleInputChange}
            placeholder="Enter Governorate"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

         <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Wilayat
          </label>
          <input
            type="text"
            name="wilayat"
            value={formData.wilayat}
            onChange={handleInputChange}
            placeholder="Enter Wilayat"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

      <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Institution <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleInputChange}
            placeholder="Enter Institution"
            className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
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

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h5 className="text-lg font-semibold text-slate-900">Patient Information</h5>
          <small className="text-yellow-600">[Enter Card Expiry date if you have identity card otherwise enter date of birth]</small>
        </div>
        <div className="p-6">
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

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
                <option value="Days">Days</option>
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
              <NationalitySelect
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
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
              <label className="block text-sm font-medium text-slate-700">Third Name</label>
              <input
                type="text"
                name="thirdName"
                value={formData.thirdName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Tribe</label>
              <input
                type="text"
                name="tribe"
                value={formData.tribe}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Sheikh Name</label>
              <input
                type="text"
                name="sheikhName"
                value={formData.sheikhName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-slate-700">Next of Kin Mobile No</label>
              <input
                type="tel"
                name="nextOfKinMobile"
                value={formData.nextOfKinMobile}
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
                <option value="Widowed">Widowed</option>
              </select>
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
                <option value="Higher Secondary">Higher Secondary</option>
                <option value="Graduate">Graduate</option>
                <option value="Post Graduate">Post Graduate</option>
              </select>
            </div>

            <div className="space-y-2">
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
                <option value="Student">Student</option>
                <option value="Retired">Retired</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Occupations <span className="text-red-500">*</span>
              </label>
              <select
                name="occupations"
                value={formData.occupations}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select</option>
                <option value="Healthcare Worker">Healthcare Worker</option>
                <option value="Teacher">Teacher</option>
                <option value="Construction Worker">Construction Worker</option>
                <option value="Driver">Driver</option>
                <option value="Farmer">Farmer</option>
                <option value="Student">Student</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Place of work <span className="text-red-500">*</span>
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
              <label className="block text-sm font-medium text-slate-700">
                Village <span className="text-red-500">*</span>
              </label>
              <select
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select</option>
                <option value="Village A">Village A</option>
                <option value="Village B">Village B</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Latitude</label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        </div>
      </div>
    </div>
  );

  const renderClinicalDetails = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Clinical Details</h2>
        <p className="text-yellow-600">[Examination & Immunization History]</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Date of Onset (Non-vesicular maculopapular rash) <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfOnset"
                value={formData.dateOfOnset}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter remarks"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h5 className="text-lg font-semibold text-slate-900">Clinical Examination Details</h5>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {[
                { value: 'Fever', label: 'Fever' },
                { value: 'Coryza', label: 'Coryza' },
                { value: 'Non-vesicular Maculopapular Rash', label: 'Non-vesicular Maculopapular Rash' },
                { value: 'Arthralgia', label: 'Arthralgia' },
                { value: 'Koplik spots', label: 'Koplik spots' }
              ].map((symptom) => (
                <label key={symptom.value} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="clinicalSymptoms"
                    value={symptom.value}
                    checked={formData.clinicalSymptoms.includes(symptom.value)}
                    onChange={handleInputChange}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{symptom.label}</span>
                </label>
              ))}
            </div>
            <div className="space-y-3">
              {[
                { value: 'Cough', label: 'Cough' },
                { value: 'Conjunctivitis', label: 'Conjunctivitis' },
                { value: 'Arthritis', label: 'Arthritis' },
                { value: 'Lymphadenopathy', label: 'Lymphadenopathy' }
              ].map((symptom) => (
                <label key={symptom.value} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="clinicalSymptoms"
                    value={symptom.value}
                    checked={formData.clinicalSymptoms.includes(symptom.value)}
                    onChange={handleInputChange}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{symptom.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h5 className="text-lg font-semibold text-slate-900">Immunization History</h5>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Received MMR vaccine</label>
            <select
              name="receivedMMR"
              value={formData.receivedMMR}
              onChange={handleInputChange}
              className="w-full md:w-1/2 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h5 className="text-lg font-semibold text-slate-900">Immunization</h5>
          <div className="flex space-x-2">
            <button type="button" className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
              <Plus className="h-4 w-4" />
            </button>
            <button type="button" className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Vaccine</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date Given</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Dose Given</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500 italic">
                  No Rows To Show
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderExposureHistory = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Exposure History</h2>
        <p className="text-yellow-600">[Travel & Contact History]</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h5 className="text-lg font-semibold text-slate-900">Exposure History</h5>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-slate-700 mb-3">
              Did the patient or close family relatives has H/o abroad travel before 7-21 days onset of non-vesicular maculopapular rash?
            </p>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="abroadTravel"
                  value="yes"
                  checked={formData.abroadTravel === 'yes'}
                  onChange={handleInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="abroadTravel"
                  value="no"
                  checked={formData.abroadTravel === 'no'}
                  onChange={handleInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">No</span>
              </label>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-slate-700 mb-3">
              Is the patient/close family relative working in international tourism industry/area with large flow of international tourists?
            </p>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tourismWork"
                  value="yes"
                  checked={formData.tourismWork === 'yes'}
                  onChange={handleInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tourismWork"
                  value="no"
                  checked={formData.tourismWork === 'no'}
                  onChange={handleInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">No</span>
              </label>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-slate-700 mb-3">
              Did the patient/close family relative attend mass gathering (Ex. Marriage/religious/party/holiday/etc) and had contact with another suspect/confirmed measles case 7-21 days before onset of the rash?
            </p>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="massGathering"
                  value="yes"
                  checked={formData.massGathering === 'yes'}
                  onChange={handleInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="massGathering"
                  value="no"
                  checked={formData.massGathering === 'no'}
                  onChange={handleInputChange}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">No</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-yellow-100 px-6 py-4 border-b border-yellow-200">
            <h5 className="text-lg font-semibold text-yellow-800">Outcome</h5>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Outcome</label>
              <select
                name="outcome"
                value={formData.outcome}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="Recovered">Recovered</option>
                <option value="Died">Died</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Outcome Date</label>
              <input
                type="date"
                name="outcomeDate"
                value={formData.outcomeDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
            <h5 className="text-lg font-semibold text-slate-900">Attachments</h5>
          </div>
          <div className="p-6">
            <p className="text-xs text-slate-500 mb-4">Max File Size: 10MB</p>
            <div className="overflow-x-auto">
              <table className="w-full mb-4">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">File Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.attachments.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-slate-500 italic">
                        No files uploaded
                      </td>
                    </tr>
                  ) : (
                    formData.attachments.map((file, index) => (
                      <tr key={index} className="border-t border-slate-200">
                        <td className="px-4 py-3 text-sm text-slate-700">{file.name}</td>
                        <td className="px-4 py-3">
                          <button type="button" className="text-red-500 hover:text-red-700 text-sm">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex space-x-2">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 cursor-pointer"
              >
                Choose File
              </label>
              <button type="button" className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600">
                <Upload className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLabInvestigation = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Laboratory Investigation</h2>
        <p className="text-yellow-600">[Laboratory Tests & Classification]</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h5 className="text-lg font-semibold text-slate-900">Laboratory Investigation</h5>
          <div className="flex space-x-2">
            <button type="button" className="px-3 py-1 bg-slate-500 text-white text-sm rounded hover:bg-slate-600">
              <Download className="h-4 w-4" />
            </button>
            <button type="button" className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
              <Plus className="h-4 w-4" />
            </button>
            <button type="button" className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Lab Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Test</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Specimen</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Sample collected date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Released Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Result</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Observation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 italic">
                  No Rows To Show
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-slate-100 p-4">
          <p className="text-sm text-slate-700 mb-2">
            <strong>* In case the 1st blood sample result is equivocal/inconclusive, a 2nd sample must be collected &lt; 28 days from onset of rash.</strong>
          </p>
          <p className="text-sm text-slate-700 mb-2">
            <strong>* It is not mandatory to notify or collect laboratory samples for measles/rubella surveillance if:</strong>
          </p>
          <p className="text-sm text-slate-700">
            1. Assured of differential diagnosis of measles/rubella such as Scarlet Fever, Erythema Infectiosum, Kawasaki Disease, Drug Reaction, Roseola Infantum etc...
          </p>
          <p className="text-sm text-slate-700">
            2. Any adverse events due to MMR vaccine - Report it as AEFI not as fever and rash suspect case.
          </p>
        </div>
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-red-100 px-6 py-4 border-b border-red-200">
          <h5 className="text-lg font-semibold text-red-700">For Governorate/Central Users</h5>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Classification</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="classification"
                    value="measles"
                    checked={formData.classification === 'measles'}
                    onChange={handleInputChange}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Measles</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="classification"
                    value="rubella"
                    checked={formData.classification === 'rubella'}
                    onChange={handleInputChange}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Rubella</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="classification"
                    value="discarded"
                    checked={formData.classification === 'discarded'}
                    onChange={handleInputChange}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Discarded Case</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Final Outcome</label>
              <select
                name="finalOutcome"
                value={formData.finalOutcome}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="Recovered">Recovered</option>
                <option value="Died">Died</option>
                <option value="Unknown">Unknown</option>
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
            <div className="space-y-2 md:col-span-3">
              <label className="block text-sm font-medium text-slate-700">Final Remarks</label>
              <textarea
                name="finalRemarks"
                value={formData.finalRemarks}
                onChange={handleInputChange}
                rows={4}
                placeholder="Enter final remarks"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderPatientInfo();
      case 1:
        return renderClinicalDetails();
      case 2:
        return renderExposureHistory();
      case 3:
        return renderLabInvestigation();
      default:
        return renderPatientInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/fever-rash-entry')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
                Fever and Rash - New Entry
              </h1>
              <p className="text-sm text-slate-600">Complete all required information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Progress</h2>
            <span className="text-sm text-slate-600">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <React.Fragment key={step.id}>
                  <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : isCompleted
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
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
                <>
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
                  <button
                    type="button"
                    onClick={() => setFormData({} as FeverRashFormData)}
                    className="flex items-center space-x-2 px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear</span>
                  </button>
                </>
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
      </div>
    </div>
  );
};

export default FeverRashEntry;
