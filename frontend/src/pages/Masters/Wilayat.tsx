import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import WilayatModal from '../../components/WilayatModal';

interface WilayatData {
    id: number;
    code: string;
    governorate: string; // The selected governorate name
    wilayat: string;
    isActive: boolean;
}

import { API_BASE_URL } from '../../config';

const API_URL = API_BASE_URL;

const Wilayat: React.FC = () => {
    const [wilayats, setWilayats] = useState<WilayatData[]>([
        {
            id: 1,
            code: '10272325',
            governorate: 'Muscut',
            wilayat: 'Dhofar',
            isActive: true
        }
    ]);

    // Mock governorates for dropdown - in real app might fetch from API
    const [governorates, setGovernorates] = useState<string[]>([
        'Muscut', 'Seeb', 'Muttrah', 'Al Amerat', 'Adam'
    ]);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchWilayats();
        fetchGovernorates();
    }, []);

    const fetchWilayats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/masters/wilayats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setWilayats(data);
            }
        } catch (error) {
            console.error('Error fetching wilayats:', error);
        }
    };

    const fetchGovernorates = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/masters/governorates`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Assuming governorate API returns list of objects with 'governorate' field
                setGovernorates(data.map((g: any) => g.governorate));
            }
        } catch (error) {
            console.error('Error fetching governorates:', error);
            // Keep mock if fails
        }
    }

    const handleAddClick = () => {
        setShowModal(true);
    };

    const handleSubmit = async (data: any) => {
        try {
            // Optimistic update
            const newWilayat = { ...data, id: Date.now() };
            setWilayats([...wilayats, newWilayat]);

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/masters/wilayats`, {
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
            console.error('Error adding wilayat:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h1 className="text-xl font-semibold text-gray-800">Wilayat</h1>
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
                                    <th className="px-6 py-4 text-left text-sm font-medium border-r border-blue-400 last:border-r-0">Governorate</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium border-r border-blue-400 last:border-r-0">Wilayat</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">IsActive</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {wilayats.map((w, index) => (
                                    <tr key={w.id} className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100 last:border-r-0">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100 last:border-r-0">
                                            {w.code}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100 last:border-r-0">
                                            {w.governorate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100 last:border-r-0">
                                            {w.wilayat}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium ${w.isActive
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                                }`}>
                                                {w.isActive ? 'yes' : 'no'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {wilayats.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No data found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Wilayat Modal */}
            <WilayatModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                governorates={governorates}
            />
        </div>
    );
};

export default Wilayat;
