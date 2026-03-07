import React, { useState } from 'react';
import { X, Search, RotateCcw } from 'lucide-react';

interface VaccinationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (data: any) => void;
}

const VaccinationSearchModal: React.FC<VaccinationSearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [searchData, setSearchData] = useState({
    caseId: '',
    injectionDateFrom: '',
    injectionDateTo: '',
    institution: '',
    civilId: '',
    opipNumber: '',
    vaccineName: '',
    vaccineManufacturer: '',
    batchNo: '',
    category: '',
    governorate: '',
    wilayat: '',
    doseNumber: '',
    parentInstitution: '',
    governorateVaccinated: '',
    mobile: '',
    mr2No: '',
    passportNo: '',
    nationality: '',
    createdBy: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchData);
    onClose();
  };

  const handleClear = () => {
    setSearchData({
      caseId: '',
      injectionDateFrom: '',
      injectionDateTo: '',
      institution: '',
      civilId: '',
      opipNumber: '',
      vaccineName: '',
      vaccineManufacturer: '',
      batchNo: '',
      category: '',
      governorate: '',
      wilayat: '',
      doseNumber: '',
      parentInstitution: '',
      governorateVaccinated: '',
      mobile: '',
      mr2No: '',
      passportNo: '',
      nationality: '',
      createdBy: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between sticky top-0">
          <h2 className="text-xl font-bold text-white">Advanced Search - Vaccination Listing</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSearch} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Row 1 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Case ID
              </label>
              <input
                type="text"
                name="caseId"
                value={searchData.caseId}
                onChange={handleInputChange}
                placeholder="Enter Case ID"
                className="input"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Injection Date From
              </label>
              <input
                type="date"
                name="injectionDateFrom"
                value={searchData.injectionDateFrom}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Injection Date To
              </label>
              <input
                type="date"
                name="injectionDateTo"
                value={searchData.injectionDateTo}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Institution / Place of Vaccination
              </label>
              <select
                name="institution"
                value={searchData.institution}
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

            {/* Row 2 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Civil ID
              </label>
              <input
                type="text"
                name="civilId"
                value={searchData.civilId}
                onChange={handleInputChange}
                placeholder="Enter Civil ID"
                className="input"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                OP/IP Number
              </label>
              <input
                type="text"
                name="opipNumber"
                value={searchData.opipNumber}
                onChange={handleInputChange}
                placeholder="Enter OP/IP Number"
                className="input"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Vaccine Name
              </label>
              <select
                name="vaccineName"
                value={searchData.vaccineName}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">Select</option>
                <option value="covid-19">COVID-19</option>
                <option value="influenza">Influenza</option>
                <option value="hepatitis-b">Hepatitis B</option>
                <option value="tetanus">Tetanus</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Vaccine Manufacturer
              </label>
              <select
                name="vaccineManufacturer"
                value={searchData.vaccineManufacturer}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">Select</option>
                <option value="pfizer">Pfizer</option>
                <option value="moderna">Moderna</option>
                <option value="astrazeneca">AstraZeneca</option>
                <option value="johnson">Johnson & Johnson</option>
              </select>
            </div>

            {/* Row 3 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Batch No
              </label>
              <input
                type="text"
                name="batchNo"
                value={searchData.batchNo}
                onChange={handleInputChange}
                placeholder="Enter Batch No"
                className="input"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                name="category"
                value={searchData.category}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">Select</option>
                <option value="routine">Routine</option>
                <option value="emergency">Emergency</option>
                <option value="campaign">Campaign</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Governorate
              </label>
              <select
                name="governorate"
                value={searchData.governorate}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">Select</option>
                <option value="khartoum">Khartoum</option>
                <option value="kassala">Kassala</option>
                <option value="aljazeera">Aljazeera</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Wilayat
              </label>
              <select
                name="wilayat"
                value={searchData.wilayat}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">Select</option>
                <option value="khartoum">Khartoum</option>
                <option value="omdurman">Omdurman</option>
                <option value="bahri">Bahri</option>
              </select>
            </div>

            {/* Row 4 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Dose Number
              </label>
              <select
                name="doseNumber"
                value={searchData.doseNumber}
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
                Parent Institution of Work
              </label>
              <select
                name="parentInstitution"
                value={searchData.parentInstitution}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">Select</option>
                <option value="moh">Ministry of Health</option>
                <option value="private">Private</option>
                <option value="ngo">NGO</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Governorate Vaccinated
              </label>
              <select
                name="governorateVaccinated"
                value={searchData.governorateVaccinated}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">Select</option>
                <option value="khartoum">Khartoum</option>
                <option value="kassala">Kassala</option>
                <option value="aljazeera">Aljazeera</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Mobile
              </label>
              <input
                type="tel"
                name="mobile"
                value={searchData.mobile}
                onChange={handleInputChange}
                placeholder="Enter Mobile Number"
                className="input"
              />
            </div>

            {/* Row 5 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                MR2 No
              </label>
              <input
                type="text"
                name="mr2No"
                value={searchData.mr2No}
                onChange={handleInputChange}
                placeholder="Enter MR2 No"
                className="input"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Passport No.
              </label>
              <input
                type="text"
                name="passportNo"
                value={searchData.passportNo}
                onChange={handleInputChange}
                placeholder="Enter Passport No"
                className="input"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Nationality <span className="text-red-500">*</span>
              </label>
              <select
                name="nationality"
                value={searchData.nationality}
                onChange={handleInputChange}
                className="select"
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
                Created By
              </label>
              <select
                name="createdBy"
                value={searchData.createdBy}
                onChange={handleInputChange}
                className="select"
              >
                <option value="">Select</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-slate-200 mt-8">
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-secondary"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </button>
            <button
              type="submit"
              className="btn btn-success"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaccinationSearchModal;