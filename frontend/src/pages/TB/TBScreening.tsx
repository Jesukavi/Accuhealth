import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft, Save, X } from 'lucide-react';
import { tbScreeningApi } from './api/tbScreening';
import type { TBScreeningFormData } from './types';


const TBScreening: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [formData, setFormData] = useState<TBScreeningFormData>({
    governorate: 'NORTH ASH SHARQIYAH',
    wilayat: 'Ibra',
    institution: 'Ibra Hospital',
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
    patientWilayat: 'fgh',
    village: 'dfgfde',
    latitude: '',
    longitude: '',
    firstSymptom: '',
    onsetSymptom: '',
    diagnosedDate: '',
    tbTreatmentDate: '',
    patientReferred: '',
    previousTB: '',
    familyTB: '',
    contactTB: '',
    travelHistory: '',
    signsSymptoms: [],
    riskFactors: [],
    mantouxDate: '',
    mantouxReading: '',
    mantouxResult: '',
    mantouxRemarks: '',
    labTests: [],
    radiologyTests: [],
    screeningOutcome: '',
    screeningRemarks: '',
    screeningType: ''
  });

  const steps = [
    { id: 'patient-info', title: 'Patient Info', description: 'Patient Information & Basic Details' },
    { id: 'clinical-details', title: 'Clinical Details', description: 'Symptoms, History & Risk Factors' },
    { id: 'tests-results', title: 'Tests & Results', description: 'Mantoux Test' },
    { id: 'lab-investigation', title: 'Lab Investigation', description: 'Lab Tests, Radiology & Outcome' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      const checkboxValue = (e.target as HTMLInputElement).value;
      if (name === 'signsSymptoms' || name === 'riskFactors') {
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
      const response = await tbScreeningApi.create(formData);
      alert(`TB Screening submitted successfully! ID: ${response.screeningId}`);
      setFormData({
        governorate: 'NORTH ASH SHARQIYAH',
        wilayat: 'Ibra',
        institution: 'Ibra Hospital',
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
        firstSymptom: '',
        onsetSymptom: '',
        diagnosedDate: '',
        tbTreatmentDate: '',
        patientReferred: '',
        previousTB: '',
        familyTB: '',
        contactTB: '',
        travelHistory: '',
        signsSymptoms: [],
        riskFactors: [],
        mantouxDate: '',
        mantouxReading: '',
        mantouxResult: '',
        mantouxRemarks: '',
        labTests: [],
        radiologyTests: [],
        screeningOutcome: '',
        screeningRemarks: '',
        screeningType: ''
      });
      setCurrentStep(0);
    } catch (error) {
      console.error('Error submitting screening:', error);
      alert(`Failed to submit TB screening: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const selectScreeningType = (type: string) => {
    setFormData(prev => ({ ...prev, screeningType: type }));
    setShowModal(false);
  };

  const renderPatientInfo = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">TB Screening</h2>
        <p className="text-yellow-600">[Patient Information & Basic Details]</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Governorate</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.governorate}
              readOnly
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg bg-slate-50"
            />
            <button type="button" className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Wilayat</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.wilayat}
              readOnly
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg bg-slate-50"
            />
            <button type="button" className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Institution <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.institution}
              readOnly
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg bg-slate-50"
            />
            <button type="button" className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>
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
                <option value="Bangladeshi">Bangladeshi</option>
                <option value="Egyptian">Egyptian</option>
                <option value="Filipino">Filipino</option>
                <option value="Sri Lankan">Sri Lankan</option>
                <option value="Other">Other</option>
              </select>
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
              </select>
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
        <p className="text-yellow-600">[Symptoms, History & Risk Factors]</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h5 className="text-lg font-semibold text-slate-900">Clinical Information</h5>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                First symptom <span className="text-red-500">*</span>
              </label>
              <select
                name="firstSymptom"
                value={formData.firstSymptom}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select</option>
                <option value="Cough">Cough</option>
                <option value="Fever">Fever</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Night Sweats">Night Sweats</option>
                <option value="Chest Pain">Chest Pain</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Onset of first symptom <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="onsetSymptom"
                value={formData.onsetSymptom}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Diagnosed Date</label>
              <input
                type="date"
                name="diagnosedDate"
                value={formData.diagnosedDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">TB treatment Starting Date</label>
              <input
                type="date"
                name="tbTreatmentDate"
                value={formData.tbTreatmentDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Patient Referred to/from</label>
              <select
                name="patientReferred"
                value={formData.patientReferred}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="Primary Health Care">Primary Health Care</option>
                <option value="Regional Hospital">Regional Hospital</option>
                <option value="Tertiary Hospital">Tertiary Hospital</option>
                <option value="Private Clinic">Private Clinic</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-l-4 border-red-500 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-red-50 px-6 py-4 border-b border-red-200">
          <h5 className="text-lg font-semibold text-red-700">History of TB</h5>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">History of previous TB Treatment</p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="previousTB"
                    value="Yes"
                    checked={formData.previousTB === 'Yes'}
                    onChange={handleInputChange}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="previousTB"
                    value="No"
                    checked={formData.previousTB === 'No'}
                    onChange={handleInputChange}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">No</span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Family History of TB</p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="familyTB"
                    value="Yes"
                    checked={formData.familyTB === 'Yes'}
                    onChange={handleInputChange}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="familyTB"
                    value="No"
                    checked={formData.familyTB === 'No'}
                    onChange={handleInputChange}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">No</span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">History of contact with a known TB</p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="contactTB"
                    value="Yes"
                    checked={formData.contactTB === 'Yes'}
                    onChange={handleInputChange}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="contactTB"
                    value="No"
                    checked={formData.contactTB === 'No'}
                    onChange={handleInputChange}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">No</span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Travel history (within last 2 years)</p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="travelHistory"
                    value="Yes"
                    checked={formData.travelHistory === 'Yes'}
                    onChange={handleInputChange}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="travelHistory"
                    value="No"
                    checked={formData.travelHistory === 'No'}
                    onChange={handleInputChange}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h6 className="text-base font-semibold text-slate-900">Signs & Symptoms</h6>
          </div>
          <div className="p-6 space-y-3">
            {[
              { value: 'Cough more than 2 weeks', label: 'Cough more than 2 weeks' },
              { value: 'Chest pain', label: 'Chest pain' },
              { value: 'Enlarged lymph nodes', label: 'Enlarged lymph nodes' },
              { value: 'Night sweats', label: 'Night sweats' },
              { value: 'Fever', label: 'Fever' },
              { value: 'Loss of weight / Appetite', label: 'Loss of weight / Appetite' },
              { value: 'Hemoptysis', label: 'Hemoptysis' },
              { value: 'Others', label: 'Others' }
            ].map((symptom) => (
              <label key={symptom.value} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="signsSymptoms"
                  value={symptom.value}
                  checked={formData.signsSymptoms.includes(symptom.value)}
                  onChange={handleInputChange}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{symptom.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h6 className="text-base font-semibold text-slate-900">Risk Factors</h6>
          </div>
          <div className="p-6 space-y-3">
            {[
              { value: 'Smoker', label: 'Smoker' },
              { value: 'HIV', label: 'HIV' },
              { value: 'Drug Addiction', label: 'Drug Addiction' },
              { value: 'Chronic Lung Disease', label: 'Chronic Lung Disease' },
              { value: 'Diabetes Mellitus', label: 'Diabetes Mellitus' },
              { value: 'Alcoholic', label: 'Alcoholic' },
              { value: 'Chronic Renal Disease', label: 'Chronic Renal Disease' },
              { value: 'Anti-TNF treatment', label: 'Anti-TNF treatment' }
            ].map((risk) => (
              <label key={risk.value} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="riskFactors"
                  value={risk.value}
                  checked={formData.riskFactors.includes(risk.value)}
                  onChange={handleInputChange}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{risk.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTestsResults = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Tests & Results</h2>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h6 className="text-base font-semibold text-slate-900">Mantoux Test</h6>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              name="mantouxDate"
              value={formData.mantouxDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Reading</label>
            <input
              type="text"
              name="mantouxReading"
              value={formData.mantouxReading}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Result</label>
            <select
              name="mantouxResult"
              value={formData.mantouxResult}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Remarks</label>
            <textarea
              name="mantouxRemarks"
              value={formData.mantouxRemarks}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderLabInvestigation = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Laboratory Investigation</h2>
        <p className="text-yellow-600">[Lab Tests, Radiology & Outcome]</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h6 className="text-base font-semibold text-slate-900">Laboratory Investigation</h6>
          <div className="flex space-x-2">
            <button type="button" className="px-3 py-1 bg-slate-500 text-white text-sm rounded hover:bg-slate-600">
              Download
            </button>
            <button type="button" className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
              +
            </button>
            <button type="button" className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">
              -
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
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h6 className="text-base font-semibold text-slate-900">Radiology</h6>
          <div className="flex space-x-2">
            <button type="button" className="px-3 py-1 bg-slate-500 text-white text-sm rounded hover:bg-slate-600">
              Download
            </button>
            <button type="button" className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
              +
            </button>
            <button type="button" className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">
              -
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Test</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Finding</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Screening Outcome <span className="text-red-500">*</span>
          </label>
          <select
            name="screeningOutcome"
            value={formData.screeningOutcome}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Outcome</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
            <option value="Indeterminate">Indeterminate</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Remarks</label>
          <textarea
            name="screeningRemarks"
            value={formData.screeningRemarks}
            onChange={handleInputChange}
            rows={3}
            placeholder="Enter remarks"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
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
        return renderTestsResults();
      case 3:
        return renderLabInvestigation();
      default:
        return renderPatientInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4">
            <div className="bg-blue-500 text-white px-6 py-4 rounded-t-2xl">
              <h5 className="text-xl font-bold">Select the Screening Type to proceed</h5>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={() => selectScreeningType('Presumptive TB Screening')}
                className="w-full text-left px-6 py-4 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Presumptive TB Screening
              </button>
              <button
                onClick={() => selectScreeningType('Pre-employment / Annual screening of HCW')}
                className="w-full text-left px-6 py-4 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Pre-employment / Annual screening of HCW
              </button>
              <button
                onClick={() => selectScreeningType('Screening of contacts of TB case')}
                className="w-full text-left px-6 py-4 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Screening of contacts of TB case
              </button>
              <button
                onClick={() => selectScreeningType('High Risk Group Screening')}
                className="w-full text-left px-6 py-4 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                High Risk Group Screening
              </button>
            </div>
          </div>
        </div>
      )}

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
                TB Screening Entry
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
                    onClick={() => setFormData({} as TBScreeningFormData)}
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

export default TBScreening;
