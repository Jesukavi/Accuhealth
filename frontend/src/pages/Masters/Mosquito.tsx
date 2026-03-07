import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import RoleModal from '../../components/RoleModal'; // Make sure this import path is correct

interface Role {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
}

import { API_BASE_URL } from '../../config';

const API_URL = API_BASE_URL;

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      code: '1001',
      name: 'admin',
      description: 'test',
      isActive: true
    },
    {
      id: 2,
      code: '1002',
      name: 'user',
      description: 'test',
      isActive: true
    }
  ]);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      // Keep mock data if API fails
    }
  };

  const handleAddRole = () => {
    setShowRoleModal(true);
  };

  const handleRoleSubmit = async (roleData: Omit<Role, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/masters/roles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roleData)
      });

      if (response.ok) {
        const newRole = await response.json();
        setRoles([...roles, newRole]);
        setShowRoleModal(false);
      }
    } catch (error) {
      console.error('Error adding role:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">Roles</h1>
            <button
              onClick={handleAddRole}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-6 py-4 text-left text-sm font-medium">S.No</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">IsActive</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role, index) => (
                  <tr key={role.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {role.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {role.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {role.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${role.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {role.isActive ? 'yes' : 'no'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {roles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No roles found</p>
            </div>
          )}
        </div>
      </div>

      {/* Role Modal */}
      <RoleModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onSubmit={handleRoleSubmit}
      />
    </div>
  );
};

export default Roles;