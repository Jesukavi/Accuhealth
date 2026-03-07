import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Bell, User, FileText, Save } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface InvestigationFormData {
  // Location Information
  governorate: string;
  wilayat: string;
  village: string;
  institution: string;

  // Patient Information
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
  nextOfKinMobileNo: string;
  maritalStatus: string;
  education: string;
  workStatus: string;
  occupations: string;
  placeOfWork: string;
  monthlyIncome: string;
  latitude: string;
  longitude: string;

  // Diagnosis History
  pidCase: string;
  familyHistory: string;
  dateOfFirstConsultation: string;
  dateOfConfirmation: string;
  ageAtDiagnosis: string;
  consanguinity: string;
  pidDiagnosis: string;
  travelOutsideOman: string;
  immunizationComplete: string;
  receivedIPV: string;
  receivedOPV: string;
  closeContactOPV: string;
}

const PolioInvestigation: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'patient' | 'diagnosis'>('patient');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<InvestigationFormData>({
    // Location Information
    governorate: '',
    wilayat: '',
    village: '',
    institution: '',

    // Patient Information
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
    nextOfKinMobileNo: '',
    maritalStatus: '',
    education: '',
    workStatus: '',
    occupations: '',
    placeOfWork: '',
    monthlyIncome: '',
    latitude: '',
    longitude: '',

    // Diagnosis History
    pidCase: '',
    familyHistory: '',
    dateOfFirstConsultation: '',
    dateOfConfirmation: '',
    ageAtDiagnosis: '',
    consanguinity: '',
    pidDiagnosis: '',
    travelOutsideOman: '',
    immunizationComplete: '',
    receivedIPV: '',
    receivedOPV: '',
    closeContactOPV: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      console.log('Submitting Polio Investigation:', formData);

      const response = await fetch(`${API_BASE_URL}/polio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit investigation');
      }

      const data = await response.json();
      alert('Polio Investigation submitted successfully!');
      navigate('/polio-notifications');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all fields?')) {
      setFormData({
        governorate: '',
        wilayat: '',
        village: '',
        institution: 'Ibra Hospital',
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
        nextOfKinMobileNo: '',
        maritalStatus: '',
        education: '',
        workStatus: '',
        occupations: '',
        placeOfWork: '',
        monthlyIncome: '',
        latitude: '',
        longitude: '',
        pidCase: '',
        familyHistory: '',
        dateOfFirstConsultation: '',
        dateOfConfirmation: '',
        ageAtDiagnosis: '',
        consanguinity: '',
        pidDiagnosis: '',
        travelOutsideOman: '',
        immunizationComplete: '',
        receivedIPV: '',
        receivedOPV: '',
        closeContactOPV: ''
      });
    }
  };

  const renderPatientTab = () => (
    <div className="space-y-8">
      {/* Location Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 pb-3 border-b border-slate-200">
          Location Information <span className="text-sm font-normal text-slate-500">[Reporting Institution Details]</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Governorate <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="governorate"
              value={formData.governorate}
              onChange={handleInputChange}
              placeholder="Enter governorate"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Wilayat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="wilayat"
              value={formData.wilayat}
              onChange={handleInputChange}
              placeholder="Enter wilayat"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Village <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="village"
              value={formData.village}
              onChange={handleInputChange}
              placeholder="Enter village"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
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
              placeholder="Enter institution name"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Patient Information */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 pb-3 border-b border-slate-200">
            Patient Information
          </h3>
          <p className="text-sm text-yellow-600 mt-2">
            [Enter Card Expiry date if you have identity card otherwise enter date of birth]
          </p>
        </div>

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
            <label className="block text-sm font-medium text-slate-700">
              Civil Id
            </label>
            <input
              type="text"
              name="civilId"
              value={formData.civilId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label className="block text-sm font-medium text-slate-700">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Years">Years</option>
              <option value="Months">Months</option>
              <option value="Days">Days</option>
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
              <option value="">Select Nationality</option>
              <option value="Afghan">Afghan</option>
              <option value="Albanian">Albanian</option>
              <option value="Algerian">Algerian</option>
              <option value="American">American</option>
              <option value="Andorran">Andorran</option>
              <option value="Angolan">Angolan</option>
              <option value="Antiguan">Antiguan</option>
              <option value="Argentine">Argentine</option>
              <option value="Armenian">Armenian</option>
              <option value="Australian">Australian</option>
              <option value="Austrian">Austrian</option>
              <option value="Azerbaijani">Azerbaijani</option>
              <option value="Bahamian">Bahamian</option>
              <option value="Bahraini">Bahraini</option>
              <option value="Bangladeshi">Bangladeshi</option>
              <option value="Barbadian">Barbadian</option>
              <option value="Belarusian">Belarusian</option>
              <option value="Belgian">Belgian</option>
              <option value="Belizean">Belizean</option>
              <option value="Beninese">Beninese</option>
              <option value="Bhutanese">Bhutanese</option>
              <option value="Bolivian">Bolivian</option>
              <option value="Bosnian">Bosnian</option>
              <option value="Botswanan">Botswanan</option>
              <option value="Brazilian">Brazilian</option>
              <option value="British">British</option>
              <option value="Bruneian">Bruneian</option>
              <option value="Bulgarian">Bulgarian</option>
              <option value="Burkinabe">Burkinabe</option>
              <option value="Burundian">Burundian</option>
              <option value="Cabo Verdean">Cabo Verdean</option>
              <option value="Cambodian">Cambodian</option>
              <option value="Cameroonian">Cameroonian</option>
              <option value="Canadian">Canadian</option>
              <option value="Central African">Central African</option>
              <option value="Chadian">Chadian</option>
              <option value="Chilean">Chilean</option>
              <option value="Chinese">Chinese</option>
              <option value="Colombian">Colombian</option>
              <option value="Comorian">Comorian</option>
              <option value="Congolese">Congolese</option>
              <option value="Costa Rican">Costa Rican</option>
              <option value="Croatian">Croatian</option>
              <option value="Cuban">Cuban</option>
              <option value="Cypriot">Cypriot</option>
              <option value="Czech">Czech</option>
              <option value="Danish">Danish</option>
              <option value="Djiboutian">Djiboutian</option>
              <option value="Dominican">Dominican</option>
              <option value="Dutch">Dutch</option>
              <option value="Ecuadorian">Ecuadorian</option>
              <option value="Egyptian">Egyptian</option>
              <option value="Emirati">Emirati</option>
              <option value="Equatorial Guinean">Equatorial Guinean</option>
              <option value="Eritrean">Eritrean</option>
              <option value="Estonian">Estonian</option>
              <option value="Eswatini">Eswatini</option>
              <option value="Ethiopian">Ethiopian</option>
              <option value="Fijian">Fijian</option>
              <option value="Finnish">Finnish</option>
              <option value="French">French</option>
              <option value="Gabonese">Gabonese</option>
              <option value="Gambian">Gambian</option>
              <option value="Georgian">Georgian</option>
              <option value="German">German</option>
              <option value="Ghanaian">Ghanaian</option>
              <option value="Greek">Greek</option>
              <option value="Grenadian">Grenadian</option>
              <option value="Guatemalan">Guatemalan</option>
              <option value="Guinean">Guinean</option>
              <option value="Guinea-Bissauan">Guinea-Bissauan</option>
              <option value="Guyanese">Guyanese</option>
              <option value="Haitian">Haitian</option>
              <option value="Honduran">Honduran</option>
              <option value="Hungarian">Hungarian</option>
              <option value="Icelandic">Icelandic</option>
              <option value="Indian">Indian</option>
              <option value="Indonesian">Indonesian</option>
              <option value="Iranian">Iranian</option>
              <option value="Iraqi">Iraqi</option>
              <option value="Irish">Irish</option>
              <option value="Israeli">Israeli</option>
              <option value="Italian">Italian</option>
              <option value="Ivorian">Ivorian</option>
              <option value="Jamaican">Jamaican</option>
              <option value="Japanese">Japanese</option>
              <option value="Jordanian">Jordanian</option>
              <option value="Kazakhstani">Kazakhstani</option>
              <option value="Kenyan">Kenyan</option>
              <option value="Kiribati">Kiribati</option>
              <option value="Kuwaiti">Kuwaiti</option>
              <option value="Kyrgyz">Kyrgyz</option>
              <option value="Laotian">Laotian</option>
              <option value="Latvian">Latvian</option>
              <option value="Lebanese">Lebanese</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Liberian">Liberian</option>
              <option value="Libyan">Libyan</option>
              <option value="Liechtensteiner">Liechtensteiner</option>
              <option value="Lithuanian">Lithuanian</option>
              <option value="Luxembourgish">Luxembourgish</option>
              <option value="Malagasy">Malagasy</option>
              <option value="Malawian">Malawian</option>
              <option value="Malaysian">Malaysian</option>
              <option value="Maldivian">Maldivian</option>
              <option value="Malian">Malian</option>
              <option value="Maltese">Maltese</option>
              <option value="Marshallese">Marshallese</option>
              <option value="Mauritanian">Mauritanian</option>
              <option value="Mauritian">Mauritian</option>
              <option value="Mexican">Mexican</option>
              <option value="Micronesian">Micronesian</option>
              <option value="Moldovan">Moldovan</option>
              <option value="Monegasque">Monegasque</option>
              <option value="Mongolian">Mongolian</option>
              <option value="Montenegrin">Montenegrin</option>
              <option value="Moroccan">Moroccan</option>
              <option value="Mozambican">Mozambican</option>
              <option value="Namibian">Namibian</option>
              <option value="Nauruan">Nauruan</option>
              <option value="Nepali">Nepali</option>
              <option value="New Zealander">New Zealander</option>
              <option value="Nicaraguan">Nicaraguan</option>
              <option value="Nigerian">Nigerian</option>
              <option value="Nigerien">Nigerien</option>
              <option value="North Korean">North Korean</option>
              <option value="North Macedonian">North Macedonian</option>
              <option value="Norwegian">Norwegian</option>
              <option value="Omani">Omani</option>
              <option value="Pakistani">Pakistani</option>
              <option value="Palauan">Palauan</option>
              <option value="Palestinian">Palestinian</option>
              <option value="Panamanian">Panamanian</option>
              <option value="Papua New Guinean">Papua New Guinean</option>
              <option value="Paraguayan">Paraguayan</option>
              <option value="Peruvian">Peruvian</option>
              <option value="Filipino">Filipino</option>
              <option value="Polish">Polish</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Qatari">Qatari</option>
              <option value="Romanian">Romanian</option>
              <option value="Russian">Russian</option>
              <option value="Rwandan">Rwandan</option>
              <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
              <option value="Saint Lucian">Saint Lucian</option>
              <option value="Saint Vincentian">Saint Vincentian</option>
              <option value="Samoan">Samoan</option>
              <option value="San Marinese">San Marinese</option>
              <option value="Sao Tomean">Sao Tomean</option>
              <option value="Saudi">Saudi</option>
              <option value="Senegalese">Senegalese</option>
              <option value="Serbian">Serbian</option>
              <option value="Seychellois">Seychellois</option>
              <option value="Sierra Leonean">Sierra Leonean</option>
              <option value="Singaporean">Singaporean</option>
              <option value="Slovak">Slovak</option>
              <option value="Slovenian">Slovenian</option>
              <option value="Solomon Islander">Solomon Islander</option>
              <option value="Somali">Somali</option>
              <option value="South African">South African</option>
              <option value="South Korean">South Korean</option>
              <option value="South Sudanese">South Sudanese</option>
              <option value="Spanish">Spanish</option>
              <option value="Sri Lankan">Sri Lankan</option>
              <option value="Sudanese">Sudanese</option>
              <option value="Surinamese">Surinamese</option>
              <option value="Swedish">Swedish</option>
              <option value="Swiss">Swiss</option>
              <option value="Syrian">Syrian</option>
              <option value="Taiwanese">Taiwanese</option>
              <option value="Tajik">Tajik</option>
              <option value="Tanzanian">Tanzanian</option>
              <option value="Thai">Thai</option>
              <option value="Timorese">Timorese</option>
              <option value="Togolese">Togolese</option>
              <option value="Tongan">Tongan</option>
              <option value="Trinidadian">Trinidadian</option>
              <option value="Tunisian">Tunisian</option>
              <option value="Turkish">Turkish</option>
              <option value="Turkmen">Turkmen</option>
              <option value="Tuvaluan">Tuvaluan</option>
              <option value="Ugandan">Ugandan</option>
              <option value="Ukrainian">Ukrainian</option>
              <option value="Uruguayan">Uruguayan</option>
              <option value="Uzbek">Uzbek</option>
              <option value="Vanuatuan">Vanuatuan</option>
              <option value="Venezuelan">Venezuelan</option>
              <option value="Vietnamese">Vietnamese</option>
              <option value="Yemeni">Yemeni</option>
              <option value="Zambian">Zambian</option>
              <option value="Zimbabwean">Zimbabwean</option>
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
            <label className="block text-sm font-medium text-slate-700">
              Second Name
            </label>
            <input
              type="text"
              name="secondName"
              value={formData.secondName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Third Name
            </label>
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
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Tribe
            </label>
            <input
              type="text"
              name="tribe"
              value={formData.tribe}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Sheikh Name
            </label>
            <input
              type="text"
              name="sheikhName"
              value={formData.sheikhName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              Education
            </label>
            <select
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="none">None</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="higher-secondary">Higher Secondary</option>
              <option value="graduate">Graduate</option>
              <option value="post-graduate">Post Graduate</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Work Status
            </label>
            <select
              name="workStatus"
              value={formData.workStatus}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="employed">Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="student">Student</option>
              <option value="retired">Retired</option>
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
              <option value="healthcare-worker">Healthcare Worker</option>
              <option value="teacher">Teacher</option>
              <option value="construction-worker">Construction Worker</option>
              <option value="driver">Driver</option>
              <option value="farmer">Farmer</option>
              <option value="student">Student</option>
              <option value="other">Other</option>
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
            <label className="block text-sm font-medium text-slate-700">
              Monthly Income
            </label>
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
              Latitude
            </label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setCurrentTab('diagnosis')}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderDiagnosisTab = () => (
    <div className="space-y-8">
      {/* Diagnosis History */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 pb-3 border-b border-slate-200">
          Diagnosis History
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              The PID case is:
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="pidCase"
                  value="old"
                  checked={formData.pidCase === 'old'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Old</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="pidCase"
                  value="newly_diagnosed"
                  checked={formData.pidCase === 'newly_diagnosed'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Newly diagnosed</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Family history of PID:
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="familyHistory"
                  value="yes"
                  checked={formData.familyHistory === 'yes'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="familyHistory"
                  value="no"
                  checked={formData.familyHistory === 'no'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">No</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="familyHistory"
                  value="unknown"
                  checked={formData.familyHistory === 'unknown'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Unknown</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Date of first consultation with immunologist <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfFirstConsultation"
              value={formData.dateOfFirstConsultation}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Date of Confirmation of PID <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfConfirmation"
              value={formData.dateOfConfirmation}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Age at diagnosis
            </label>
            <input
              type="number"
              name="ageAtDiagnosis"
              value={formData.ageAtDiagnosis}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Consanguinity:
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="consanguinity"
                value="yes"
                checked={formData.consanguinity === 'yes'}
                onChange={handleInputChange}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="consanguinity"
                value="no"
                checked={formData.consanguinity === 'no'}
                onChange={handleInputChange}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">No</span>
            </label>
          </div>
        </div>
      </div>

      {/* PID Diagnosis */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 pb-3 border-b border-slate-200">
          PID Diagnosis <span className="text-red-500">*</span>
        </h3>

        <div className="space-y-3">
          {[
            { value: 'Severe Combined Immunodeficiency', label: 'Severe Combined Immunodeficiency' },
            { value: 'Common Variable Immunodeficiency disorder (CVID)', label: 'Common Variable Immunodeficiency disorder (CVID)' },
            { value: 'Agammaglobulinemia', label: 'Agammaglobulinemia' },
            { value: 'X-linked Agammaglobulinemia', label: 'X-linked Agammaglobulinemia' },
            { value: 'Hypogammaglobulinemia', label: 'Hypogammaglobulinemia' },
            { value: 'Major histocompatibility complex deficiencies', label: 'Major histocompatibility complex deficiencies' },
            { value: 'Immunodeficiency-centromeric facial anomalies syndrome (ICF)', label: 'Immunodeficiency-centromeric facial anomalies syndrome (ICF)' },
            { value: 'Others', label: 'Others' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <input
                type="radio"
                name="pidDiagnosis"
                value={option.value}
                checked={formData.pidDiagnosis === option.value}
                onChange={handleInputChange}
                className="text-blue-600 focus:ring-blue-500"
                required
              />
              <span className="text-sm text-slate-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Travel History */}
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-700">Did the patient travel outside Oman?</p>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="travelOutsideOman"
                value="yes"
                checked={formData.travelOutsideOman === 'yes'}
                onChange={handleInputChange}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="travelOutsideOman"
                value="no"
                checked={formData.travelOutsideOman === 'no'}
                onChange={handleInputChange}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">No</span>
            </label>
          </div>
        </div>
      </div>

      {/* Immunization History */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900 pb-3 border-b border-slate-200">
          Immunization History
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Immunization complete according to patient's age:
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="immunizationComplete"
                  value="yes"
                  checked={formData.immunizationComplete === 'yes'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="immunizationComplete"
                  value="no"
                  checked={formData.immunizationComplete === 'no'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">No</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Did patient receive IPV?
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="receivedIPV"
                  value="yes"
                  checked={formData.receivedIPV === 'yes'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="receivedIPV"
                  value="no"
                  checked={formData.receivedIPV === 'no'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">No</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Did patient receive OPV?
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="receivedOPV"
                  value="yes"
                  checked={formData.receivedOPV === 'yes'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="receivedOPV"
                  value="no"
                  checked={formData.receivedOPV === 'no'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">No</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Any close contact receive OPV vaccine?
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="closeContactOPV"
                  value="yes"
                  checked={formData.closeContactOPV === 'yes'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="closeContactOPV"
                  value="no"
                  checked={formData.closeContactOPV === 'no'}
                  onChange={handleInputChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">No</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Stool Specimen Collection */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900 pb-3 border-b border-slate-200 flex-1">
            Stool Specimen Collection
          </h3>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Add
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-900">
            <strong>*</strong> It is mandatory to collect AFP stool sample at the time of notification if not found rectal swab is acceptable.
          </p>
          <p className="text-sm text-blue-900">
            <strong>**</strong> The stool sample should reach CPHL within 3 days of collection.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setCurrentTab('patient')}
          className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          Previous
        </button>
        <div className="flex space-x-3">
          <button
            type="submit"
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );

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
              <h1 className="text-2xl font-bold text-slate-900">Polio Investigation Form</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Case ID"
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
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 p-8">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 border-b border-slate-200">
            <button
              onClick={() => setCurrentTab('patient')}
              className={`flex items-center space-x-2 px-6 py-3 border-b-2 transition-colors ${
                currentTab === 'patient'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="h-5 w-5" />
              <span className="font-medium">Patient Information</span>
            </button>
            <button
              onClick={() => setCurrentTab('diagnosis')}
              className={`flex items-center space-x-2 px-6 py-3 border-b-2 transition-colors ${
                currentTab === 'diagnosis'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Diagnosis History</span>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            {currentTab === 'patient' ? renderPatientTab() : renderDiagnosisTab()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PolioInvestigation;
