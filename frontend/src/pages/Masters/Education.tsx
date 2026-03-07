import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import EducationModal from '../../components/EducationModal';

interface EducationData {
    id: number;
    code: string;
    education: string;
    isActive: boolean;
}

import { API_BASE_URL } from '../../config';

const API_URL = API_BASE_URL;

const Education: React.FC = () => {
    const [educations, setEducations] = useState<EducationData[]>([
        {
            id: 1,
            code: '001',
            education: 'Computer Science',
            isActive: true
        },
        {
            id: 2,
            code: '002',
            education: 'Mathematics',
            isActive: true
        },
        {
            id: 3,
            code: '003',
            education: 'Bioscience',
            isActive: true
        },
        {
            id: 4,
            code: '004',
            education: 'Chemistry',
            isActive: true
        }
    ]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchEducations();
    }, []);

    const fetchEducations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/masters/educations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setEducations(data);
            }
        } catch (error) {
            console.error('Error fetching educations:', error);
        }
    };

    const handleAddClick = () => {
        setShowModal(true);
    };

    const handleSubmit = async (data: any) => {
        try {
            // Optimistic update
            const newEducation = { ...data, id: Date.now() };
            setEducations([...educations, newEducation]);

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/masters/educations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Handle success
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error adding education:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h1 className="text-xl font-semibold text-gray-800">Education</h1>
                        <button
                            onClick={handleAddClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200 shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Add
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#3b82f6] text-white">
                                    <th className="px-6 py-4 text-left text-sm font-medium border-r border-blue-400 last:border-r-0">S.No</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium border-r border-blue-400 last:border-r-0">Code</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium border-r border-blue-400 last:border-r-0">Education</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">IsActive</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {educations.map((edu, index) => (
                                    <tr key={edu.id} className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100 last:border-r-0">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100 last:border-r-0">
                                            {edu.code}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100 last:border-r-0">
                                            {edu.education}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium ${edu.isActive
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                                }`}>
                                                {edu.isActive ? 'yes' : 'no'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {educations.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No data found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Education Modal */}
            <EducationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default Education;
