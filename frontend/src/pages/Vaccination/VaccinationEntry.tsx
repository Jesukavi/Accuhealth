import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Syringe, Package, TestTube, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VaccinationFormData {
  // Patient Information
  idType: 'civil' | 'passport' | 'patient';
  civilId: string;
  cardExpiryDate: string;
  dateOfBirth: string;
  passport: string;
  name: string;
  sex: string;
  mobile: string;
  nationality: string;
  placeOfVaccination: string;
  patientId: string;
  governorate: string;
  wilayat: string;

  // Vaccination Details
  vaccineType: string;
  vaccinationUnit: string;
  doseNumber: string;
  dateOfInjection: string;
  siteOfInjection: string;

  // Batch Details
  batchNumber: string;
  manufacturer: string;
  batchExpiryDate: string;

  // Syringe Details
  lotNumber: string;
  syringeManufacturer: string;
  syringeExpiryDate: string;

  // Diluent Detail
  diluentLotNumber: string;
  diluentManufacturer: string;
  diluentExpiryDate: string;
}

import { API_BASE_URL } from '../../config';

const API_URL = API_BASE_URL;

const VaccinationEntry: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<VaccinationFormData>({
    // Patient Information
    idType: 'civil',
    civilId: '',
    cardExpiryDate: '',
    dateOfBirth: '',
    passport: '',
    name: '',
    sex: '',
    mobile: '',
    nationality: '',
    placeOfVaccination: '',
    patientId: '',
    governorate: '',
    wilayat: '',

    // Vaccination Details
    vaccineType: '',
    vaccinationUnit: '',
    doseNumber: '',
    dateOfInjection: '',
    siteOfInjection: '',

    // Batch Details
    batchNumber: '',
    manufacturer: '',
    batchExpiryDate: '',

    // Syringe Details
    lotNumber: '',
    syringeManufacturer: '',
    syringeExpiryDate: '',

    // Diluent Detail
    diluentLotNumber: '',
    diluentManufacturer: '',
    diluentExpiryDate: ''
  });

  const steps = [
    {
      id: 'patient-information',
      title: 'Patient Information',
      icon: User,
      description: 'Patient identification and personal details'
    },
    {
      id: 'vaccination-details',
      title: 'Vaccination Details',
      icon: Syringe,
      description: 'Vaccine type and administration details'
    },
    {
      id: 'batch-details',
      title: 'Batch Details',
      icon: Package,
      description: 'Vaccine batch and manufacturer information'
    },
    {
      id: 'syringe-details',
      title: 'Syringe Details',
      icon: TestTube,
      description: 'Syringe lot and manufacturer details'
    },
    {
      id: 'diluent-detail',
      title: 'Diluent Detail',
      icon: Calendar,
      description: 'Diluent information and expiry details'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
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
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/vaccinations/entry`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/vaccination-listing');
      }
    } catch (error) {
      console.error('Error submitting vaccination:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPatientInformation = () => (
    <div className="space-y-8">
      {/* ID Type Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          ID Type:
        </label>
        <div className="flex space-x-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="idType"
              value="civil"
              checked={formData.idType === 'civil'}
              onChange={handleInputChange}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Civil ID</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="idType"
              value="passport"
              checked={formData.idType === 'passport'}
              onChange={handleInputChange}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Passport</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="idType"
              value="patient"
              checked={formData.idType === 'patient'}
              onChange={handleInputChange}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Patient ID</span>
          </label>
        </div>
      </div>

      {/* Helper Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          Enter Card Expiry date if you have identity card otherwise enter date of birth
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Civil ID
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
            Card Expiry Date
          </label>
          <input
            type="date"
            name="cardExpiryDate"
            value={formData.cardExpiryDate}
            onChange={handleInputChange}
            className="input"
            placeholder="mm/dd/yyyy"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="input"
            placeholder="mm/dd/yyyy"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Passport
          </label>
          <input
            type="text"
            name="passport"
            value={formData.passport}
            onChange={handleInputChange}
            className="input"
          />
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
            className="input"
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
            className="select"
          >
            <option value="">Select</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Mobile
          </label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            className="input"
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
            className="select"
            required
          >
            <option value="">Select</option>
            <option value="sudanese">Sudanese</option>
            <option value="egyptian">Egyptian</option>
            <option value="saudi">Saudi</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Place of Vaccination
          </label>
          <select
            name="placeOfVaccination"
            value={formData.placeOfVaccination}
            onChange={handleInputChange}
            className="select"
          >
            <option value="">Select</option>
            <option value="hospital">Hospital</option>
            <option value="clinic">Clinic</option>
            <option value="health-center">Health Center</option>
            <option value="pharmacy">Pharmacy</option>
          </select>
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
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Governorate
          </label>
          <select
            name="governorate"
            value={formData.governorate}
            onChange={handleInputChange}
            className="select"
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
            className="select"
          >
            <option value="">Select</option>
            <option value="khartoum">Khartoum</option>
            <option value="omdurman">Omdurman</option>
            <option value="bahri">Bahri</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderVaccinationDetails = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Vaccine Type
          </label>
          <input
            type="text"
            name="vaccineType"
            value={formData.vaccineType}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Vaccination Unit
          </label>
          <select
            name="vaccinationUnit"
            value={formData.vaccinationUnit}
            onChange={handleInputChange}
            className="select"
          >
            <option value="">Select</option>
            <option value="pediatric">Pediatric Unit</option>
            <option value="adult">Adult Unit</option>
            <option value="emergency">Emergency Unit</option>
            <option value="outpatient">Outpatient Unit</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Dose Number
          </label>
          <select
            name="doseNumber"
            value={formData.doseNumber}
            onChange={handleInputChange}
            className="select"
          >
            <option value="">Select</option>
            <option value="1">First Dose</option>
            <option value="2">Second Dose</option>
            <option value="3">Third Dose</option>
            <option value="booster">Booster</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Date of Injection
          </label>
          <input
            type="date"
            name="dateOfInjection"
            value={formData.dateOfInjection}
            onChange={handleInputChange}
            className="input"
            placeholder="mm/dd/yyyy --:-- --"
          />
        </div>

        <div className="space-y-2 md:col-span-2 lg:col-span-4">
          <label className="block text-sm font-medium text-slate-700">
            Site of Injection
          </label>
          <select
            name="siteOfInjection"
            value={formData.siteOfInjection}
            onChange={handleInputChange}
            className="select"
          >
            <option value="">Select</option>
            <option value="left-arm">Left Arm</option>
            <option value="right-arm">Right Arm</option>
            <option value="left-thigh">Left Thigh</option>
            <option value="right-thigh">Right Thigh</option>
            <option value="buttock">Buttock</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderBatchDetails = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Batch Number
          </label>
          <input
            type="text"
            name="batchNumber"
            value={formData.batchNumber}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Manufacturer
          </label>
          <select
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleInputChange}
            className="select"
          >
            <option value="">Select Vaccine Type</option>
            <option value="pfizer">Pfizer-BioNTech</option>
            <option value="moderna">Moderna</option>
            <option value="astrazeneca">AstraZeneca</option>
            <option value="johnson">Johnson & Johnson</option>
            <option value="sinovac">Sinovac</option>
            <option value="sinopharm">Sinopharm</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Expiry Date
          </label>
          <input
            type="date"
            name="batchExpiryDate"
            value={formData.batchExpiryDate}
            onChange={handleInputChange}
            className="input"
            placeholder="mm/dd/yyyy"
          />
        </div>
      </div>
    </div>
  );

  const renderSyringeDetails = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Lot Number
          </label>
          <input
            type="text"
            name="lotNumber"
            value={formData.lotNumber}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Manufacturer
          </label>
          <select
            name="syringeManufacturer"
            value={formData.syringeManufacturer}
            onChange={handleInputChange}
            className="select"
          >
            <option value="">Select</option>
            <option value="bd">BD (Becton Dickinson)</option>
            <option value="terumo">Terumo</option>
            <option value="nipro">Nipro</option>
            <option value="smiths">Smiths Medical</option>
            <option value="covidien">Covidien</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Expiry Date
          </label>
          <input
            type="date"
            name="syringeExpiryDate"
            value={formData.syringeExpiryDate}
            onChange={handleInputChange}
            className="input"
            placeholder="mm/dd/yyyy"
          />
        </div>
      </div>
    </div>
  );

  const renderDiluentDetail = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Lot Number
          </label>
          <input
            type="text"
            name="diluentLotNumber"
            value={formData.diluentLotNumber}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Manufacturer
          </label>
          <select
            name="diluentManufacturer"
            value={formData.diluentManufacturer}
            onChange={handleInputChange}
            className="select"
          >
            <option value="">Select</option>
            <option value="pfizer">Pfizer</option>
            <option value="moderna">Moderna</option>
            <option value="astrazeneca">AstraZeneca</option>
            <option value="johnson">Johnson & Johnson</option>
            <option value="novartis">Novartis</option>
            <option value="gsk">GSK</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Expiry Date
          </label>
          <input
            type="date"
            name="diluentExpiryDate"
            value={formData.diluentExpiryDate}
            onChange={handleInputChange}
            className="input"
            placeholder="mm/dd/yyyy"
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderPatientInformation();
      case 1:
        return renderVaccinationDetails();
      case 2:
        return renderBatchDetails();
      case 3:
        return renderSyringeDetails();
      case 4:
        return renderDiluentDetail();
      default:
        return renderPatientInformation();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/vaccination-listing')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gradient">New Vaccination Entry</h1>
              <p className="text-sm text-slate-600">Complete vaccination information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
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

export default VaccinationEntry;