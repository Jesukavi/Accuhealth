import React, { useState, useEffect } from 'react';
import {
  Users,
  Grid3x3,
  Monitor,
  Briefcase,
  Globe,
  Building,

  Flag,
  Share,
  Syringe,
  ClipboardList,
  GraduationCap,
  MapPin,
  Building2,
  Shield,
  Landmark,
  Database,
  Pill,
  Factory,
  FlaskConical,

} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CategoryModal from '../../components/CategoryModal';

interface Master {
  id: string;
  name: string;
  icon: string;
  description?: string;
  count?: number;
}

import { API_BASE_URL } from '../../config';

const API_URL = API_BASE_URL;

const Masters: React.FC = () => {
  const [masters, setMasters] = useState<Master[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMasters();
  }, []);

  const fetchMasters = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/masters`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();

        // Check for Dose Number
        const hasDoseDetails = data.some((m: Master) =>
          m.id === 'dose_number' ||
          m.id === 'dosenumber' ||
          m.name === 'Dose Number'
        );
        if (!hasDoseDetails) {
          data.push({
            id: 'dose_number',
            name: 'Dose Number',
            icon: 'syringe',
            description: 'Manage vaccination dose numbers',
            count: 0
          });
        }

        // Check for Education
        const hasEducation = data.some((m: Master) =>
          m.id === 'education' ||
          m.name === 'Education'
        );
        if (!hasEducation) {
          data.push({
            id: 'education',
            name: 'Education',
            icon: 'graduation-cap',
            description: 'Manage education levels',
            count: 0
          });
        }

        // Check for Governorate
        const hasGovernorate = data.some((m: Master) =>
          m.id === 'governorate' ||
          m.name === 'Governorate'
        );
        if (!hasGovernorate) {
          data.push({
            id: 'governorate',
            name: 'Governorate',
            icon: 'map-pin',
            description: 'Manage governorates',
            count: 0
          });
        }

        // Check for Wilayat
        const hasWilayat = data.some((m: Master) =>
          m.id === 'wilayat' ||
          m.name === 'Wilayat'
        );
        if (!hasWilayat) {
          data.push({
            id: 'wilayat',
            name: 'Wilayat',
            icon: 'building-2',
            description: 'Manage wilayats',
            count: 0
          });
        }

        // Check for Institution
        const hasInstitution = data.some((m: Master) =>
          m.id === 'institution' ||
          m.name === 'Institution'
        );
        if (!hasInstitution) {
          data.push({
            id: 'institution',
            name: 'Institution',
            icon: 'building',
            description: 'Manage institutions',
            count: 0
          });
        }


        // Check for Governorate Vaccinated
        const hasGovVaccinated = data.some((m: Master) =>
          m.id === 'governorate_vaccinated' ||
          m.name === 'Governorate vaccinated'
        );
        if (!hasGovVaccinated) {
          data.push({
            id: 'governorate_vaccinated',
            name: 'Governorate vaccinated',
            icon: 'shield',
            description: 'Manage vaccinated governorates',
            count: 0
          });
        }

        // Check for Institution/Place of vaccination
        const hasInstitutionPlace = data.some((m: Master) =>
          m.id === 'institution_place' ||
          m.name === 'Institution/Place of vaccination'
        );
        if (!hasInstitutionPlace) {
          data.push({
            id: 'institution_place',
            name: 'Institution/Place of vaccination',
            icon: 'landmark',
            description: 'Manage institutions/places of vaccination',
            count: 0
          });
        }

        // Check for Nationality
        const hasNationality = data.some((m: Master) =>
          m.id === 'nationality' ||
          m.name === 'Nationality'
        );
        if (!hasNationality) {
          data.push({
            id: 'nationality',
            name: 'Nationality',
            icon: 'flag',
            description: 'Manage nationalities',
            count: 0
          });
        }

        // Check for Occupation
        const hasOccupation = data.some((m: Master) =>
          m.id === 'occupation' ||
          m.name === 'Occupation'
        );
        if (!hasOccupation) {
          data.push({
            id: 'occupation',
            name: 'Occupation',
            icon: 'briefcase',
            description: 'Manage occupations',
            count: 0
          });
        }

        // Check for Source
        const hasSource = data.some((m: Master) =>
          m.id === 'source' ||
          m.name === 'Source'
        );
        if (!hasSource) {
          data.push({
            id: 'source',
            name: 'Source',
            icon: 'database',
            description: 'Manage sources',
            count: 0
          });
        }

        // Check for Site of Injection
        const hasSiteOfInjection = data.some((m: Master) =>
          m.id === 'site_of_injection' ||
          m.name === 'Site of Injection'
        );
        if (!hasSiteOfInjection) {
          data.push({
            id: 'site_of_injection',
            name: 'Site of Injection',
            icon: 'syringe',
            description: 'Manage injection sites',
            count: 0
          });
        }

        // Check for Treatment
        const hasTreatment = data.some((m: Master) =>
          m.id === 'treatment' ||
          m.name === 'Treatment'
        );
        if (!hasTreatment) {
          data.push({
            id: 'treatment',
            name: 'Treatment',
            icon: 'pill',
            description: 'Manage treatments',
            count: 0
          });
        }

        // Check for Vaccine Manufacturer
        const hasVaccineManufacturer = data.some((m: Master) =>
          m.id === 'vaccine_manufacturer' ||
          m.name === 'Vaccine Manufacturer'
        );
        if (!hasVaccineManufacturer) {
          data.push({
            id: 'vaccine_manufacturer',
            name: 'Vaccine Manufacturer',
            icon: 'factory',
            description: 'Manage vaccine manufacturers',
            count: 0
          });
        }

        // Check for Vaccine Name
        const hasVaccineName = data.some((m: Master) =>
          m.id === 'vaccine_name' ||
          m.name === 'Vaccine Name'
        );
        if (!hasVaccineName) {
          data.push({
            id: 'vaccine_name',
            name: 'Vaccine Name',
            icon: 'flask-conical',
            description: 'Manage vaccine names',
            count: 0
          });
        }

        setMasters(data);
      }
    } catch (error) {
      console.error('Error fetching masters:', error);
      // Fallback: show Dose Number even if API fails
      setMasters([{
        id: 'dose_number',
        name: 'Dose Number',
        icon: 'syringe',
        description: 'Manage vaccination dose numbers',
        count: 0
      },
      {
        id: 'education',
        name: 'Education',
        icon: 'graduation-cap',
        description: 'Manage education levels',
        count: 0
      },
      {
        id: 'governorate',
        name: 'Governorate',
        icon: 'map-pin',
        description: 'Manage governorates',
        count: 0
      },
      {
        id: 'wilayat',
        name: 'Wilayat',
        icon: 'building-2',
        description: 'Manage wilayats',
        count: 0
      },
      {
        id: 'governorate_vaccinated',
        name: 'Governorate vaccinated',
        icon: 'shield',
        description: 'Manage vaccinated governorates',
        count: 0
      },
      {
        id: 'institution',
        name: 'Institution',
        icon: 'building',
        description: 'Manage institutions',
        count: 0
      },
      {
        id: 'institution_place',
        name: 'Institution/Place of vaccination',
        icon: 'landmark',
        description: 'Manage institutions/places of vaccination',
        count: 0
      },
      {
        id: 'nationality',
        name: 'Nationality',
        icon: 'flag',
        description: 'Manage nationalities',
        count: 0
      },
      {
        id: 'occupation',
        name: 'Occupation',
        icon: 'briefcase',
        description: 'Manage occupations',
        count: 0
      },
      {
        id: 'source',
        name: 'Source',
        icon: 'database',
        description: 'Manage sources',
        count: 0
      },
      {
        id: 'site_of_injection',
        name: 'Site of Injection',
        icon: 'syringe',
        description: 'Manage injection sites',
        count: 0
      },
      {
        id: 'treatment',
        name: 'Treatment',
        icon: 'pill',
        description: 'Manage treatments',
        count: 0
      },
      {
        id: 'vaccine_manufacturer',
        name: 'Vaccine Manufacturer',
        icon: 'factory',
        description: 'Manage vaccine manufacturers',
        count: 0
      },
      {
        id: 'vaccine_name',
        name: 'Vaccine Name',
        icon: 'flask-conical',
        description: 'Manage vaccine names',
        count: 0
      }]);
    }
  };

  const handleMasterClick = (master: Master) => {
    console.log('Clicked Master:', master);

    // Check by ID or Name for Dose Number
    if (
      master.id === 'dose_number' ||
      master.id === 'dosenumber' ||
      master.name === 'Dose Number'
    ) {
      navigate('/dose-number');
      return;
    }

    if (master.id === 'education' || master.name === 'Education') {
      navigate('/education');
      return;
    }

    if (master.id === 'governorate' || master.name === 'Governorate') {
      navigate('/governorate');
      return;
    }

    if (master.id === 'wilayat' || master.name === 'Wilayat') {
      navigate('/wilayat');
      return;
    }

    if (master.id === 'institution' || master.name === 'Institution') {
      navigate('/institution');
      return;
    }

    if (master.id === 'governorate_vaccinated' || master.name === 'Governorate vaccinated') {
      navigate('/governorate-vaccinated');
      return;
    }

    if (master.id === 'institution_place' || master.name === 'Institution/Place of vaccination') {
      navigate('/institution-place');
      return;
    }

    if (master.id === 'nationality' || master.name === 'Nationality') {
      navigate('/nationality');
      return;
    }

    if (master.id === 'occupation' || master.name === 'Occupation') {
      navigate('/occupation');
      return;
    }

    if (master.id === 'source' || master.name === 'Source') {
      navigate('/source');
      return;
    }

    if (master.id === 'site_of_injection' || master.name === 'Site of Injection') {
      navigate('/site-of-injection');
      return;
    }

    if (master.id === 'treatment' || master.name === 'Treatment') {
      navigate('/treatment');
      return;
    }

    if (master.id === 'vaccine_manufacturer' || master.name === 'Vaccine Manufacturer') {
      navigate('/vaccine-manufacturer');
      return;
    }

    if (master.id === 'vaccine_name' || master.name === 'Vaccine Name') {
      navigate('/vaccine-name');
      return;
    }

    switch (master.id) {
      case 'role':
        navigate('/roles');
        break;
      case 'category':
        setShowCategoryModal(true);
        break;
      default:
        console.log(`Clicked on ${master.id}`);
        break;
    }
  };

  const handleCategorySubmit = async (categoryData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });

      if (response.ok) {
        console.log('Category added successfully');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      users: Users,
      grid: Grid3x3,
      monitor: Monitor,
      'graduation-cap': GraduationCap,
      briefcase: Briefcase,
      globe: Globe,
      building: Building,
      'map-pin': MapPin,
      flag: Flag,
      share: Share,
      syringe: Syringe,
      'clipboard-list': ClipboardList,
      'building-2': Building2,
      'shield': Shield,
      'landmark': Landmark,
      'database': Database,
      'pill': Pill,
      'factory': Factory,
      'flask-conical': FlaskConical
    };
    return icons[iconName] || Users;
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-blue-500">Masters</h1>
        </div>

        {/* Masters Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {masters.map((master) => {
              const Icon = getIcon(master.icon);

              return (
                <div
                  key={master.id}
                  className="bg-white rounded-lg border border-blue-200 p-8 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                  onClick={() => handleMasterClick(master)}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon */}
                    <div className="w-12 h-12 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-blue-500" />
                    </div>

                    {/* Master Name */}
                    <h3 className="text-sm font-medium text-gray-800 leading-tight">
                      {master.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSubmit={handleCategorySubmit}
      />
    </>
  );
};

export default Masters;