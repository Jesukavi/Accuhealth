import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Syringe,
  Calendar,
  User,
  Building,
  FileText,
  Download,
  Plus
} from 'lucide-react';
import VaccinationSearchModal from '../../components/VaccinationSearchModal';

interface VaccinationListing {
  id: number;
  caseId: string;
  patientName: string;
  civilId: string;
  institute: string;
  vaccineName: string;
  injectionDate: string;
  status?: string;
  age?: number;
  gender?: string;
  vaccineType?: string;
}

import { API_BASE_URL } from '../../config';

const API_URL = API_BASE_URL;

const VaccinationListing: React.FC = () => {
  const [vaccinations, setVaccinations] = useState<VaccinationListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInstitute, setFilterInstitute] = useState('all');
  const [selectedVaccinations, setSelectedVaccinations] = useState<number[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    fetchVaccinations();
  }, []);

  const fetchVaccinations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/vaccination/vaccination-listing`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVaccinations(data);
      }
    } catch (error) {
      console.error('Error fetching vaccination listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedSearch = async (searchData: any) => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();

      // Add non-empty search parameters
      Object.entries(searchData).forEach(([key, value]) => {
        if (value && value !== '') {
          queryParams.append(key, value as string);
        }
      });

      const response = await fetch(`${API_URL}/vaccination-listing/search?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVaccinations(data);
      }
    } catch (error) {
      console.error('Error performing advanced search:', error);
    }
  };

  const filteredVaccinations = vaccinations.filter(vaccination => {
    const matchesSearch = vaccination.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccination.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccination.vaccineName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterInstitute === 'all' || vaccination.institute === filterInstitute;
    return matchesSearch && matchesFilter;
  });

  const handleSelectVaccination = (vaccinationId: number) => {
    setSelectedVaccinations(prev =>
      prev.includes(vaccinationId)
        ? prev.filter(id => id !== vaccinationId)
        : [...prev, vaccinationId]
    );
  };

  const handleSelectAll = () => {
    setSelectedVaccinations(
      selectedVaccinations.length === filteredVaccinations.length
        ? []
        : filteredVaccinations.map(vaccination => vaccination.id)
    );
  };

  const uniqueInstitutes = Array.from(new Set(vaccinations.map(v => v.institute)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-subtle text-slate-500">Loading vaccination listing...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gradient">Vaccination Listing</h1>
              <p className="text-slate-600 mt-2">Comprehensive vaccination records and patient management</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Vaccinations</p>
                <p className="text-2xl font-bold text-slate-900">{vaccinations.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Syringe className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Unique Patients</p>
                <p className="text-2xl font-bold text-slate-900">
                  {new Set(vaccinations.map(v => v.patientName)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Institutes</p>
                <p className="text-2xl font-bold text-slate-900">{uniqueInstitutes.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Building className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Vaccine Types</p>
                <p className="text-2xl font-bold text-slate-900">
                  {new Set(vaccinations.map(v => v.vaccineName)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        {/* <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4"> */}
        {/* Search */}
        {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search vaccinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full sm:w-80"
              />
            </div> */}

        {/* Filter */}
        {/* <select
              value={filterInstitute}
              onChange={(e) => setFilterInstitute(e.target.value)}
              className="select w-full sm:w-auto"
            >
              <option value="all">All Institutes</option>
              {uniqueInstitutes.map(institute => (
                <option key={institute} value={institute}>{institute}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-3">
            {selectedVaccinations.length > 0 && (
              <button className="btn btn-secondary">
                <Download className="h-4 w-4" />
                Export Selected ({selectedVaccinations.length})
              </button>
            )}
            <button className="btn btn-outline">
              <Filter className="h-4 w-4" />
              Advanced Filter
            </button>
            <button className="btn btn-primary">
              <Plus className="h-4 w-4" />
              Add Vaccination
            </button>
          </div>
        </div>
      </div> */}

        {/* Vaccination Listing Table */}
        <div className="card overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Syringe className="h-5 w-5 mr-2" />
              Vaccination Listing
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSearchModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-blue-400">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedVaccinations.length === filteredVaccinations.length && filteredVaccinations.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Case ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Civil ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Institute
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Vaccine Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Injection Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredVaccinations.map((vaccination, index) => (
                  <tr key={vaccination.id} className="hover:bg-slate-50 transition-colors animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedVaccinations.includes(vaccination.id)}
                        onChange={() => handleSelectVaccination(vaccination.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm bg-slate-100 px-3 py-1 rounded-lg text-slate-700 font-medium">
                        {vaccination.caseId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                          {vaccination.patientName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{vaccination.patientName}</div>
                          <div className="text-sm text-slate-500">Patient</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">{vaccination.civilId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-900">{vaccination.institute}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-slate-900 truncate" title={vaccination.vaccineName}>
                          {vaccination.vaccineName}
                        </div>
                        <div className="text-xs text-slate-500">Vaccine</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-900">{vaccination.injectionDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVaccinations.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Syringe className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No vaccinations found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Search Modal */}
      <VaccinationSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={handleAdvancedSearch}
      />
    </>
  );
};

export default VaccinationListing;