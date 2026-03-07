import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Shield,
    Users,
    Calendar,
    CheckCircle,
    XCircle,
    MoreVertical
} from 'lucide-react';

import { API_BASE_URL } from '../../config';

// const API_URL = import.meta.env.API_URL || 'http://localhost:3001/api';
// console.log('API_URL:', API_URL);


interface Role {
    id: number;
    caseId: string;
    patientName: string;
    civilId: string;
    institute: string;
    vaccineName: string;
    injectionDate: string;
    isActive: boolean;
    createdAt?: string;
    permissions?: string[];
}

const VaccinReport: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/vaccination/roles`, {
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
        } finally {
            setLoading(false);
        }
    };

    const filteredRoles = roles.filter(role => {
        const matchesSearch = role.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.institute.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' ||
            (filterStatus === 'active' && role.isActive) ||
            (filterStatus === 'inactive' && !role.isActive);
        return matchesSearch && matchesFilter;
    });

    const handleSelectRole = (roleId: number) => {
        setSelectedRoles(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    const handleSelectAll = () => {
        setSelectedRoles(
            selectedRoles.length === filteredRoles.length
                ? []
                : filteredRoles.map(role => role.id)
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-pulse-subtle text-slate-500">Loading roles...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gradient">Roles</h1>
                        <p className="text-slate-600 mt-2">Manage vaccination roles and patient assignments</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Roles</p>
                            <p className="text-2xl font-bold text-slate-900">{roles.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Shield className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Active Roles</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {roles.filter(r => r.isActive).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Institutes</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {new Set(roles.map(r => r.institute)).size}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                            <Users className="h-6 w-6 text-purple-500" />
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Vaccines</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {new Set(roles.map(r => r.vaccineName)).size}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-orange-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="card p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search roles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input pl-10 w-full sm:w-80"
                            />
                        </div>

                        {/* Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="select w-full sm:w-auto"
                        >
                            <option value="all">All Roles</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        {selectedRoles.length > 0 && (
                            <button className="btn btn-secondary">
                                <Trash2 className="h-4 w-4" />
                                Delete Selected ({selectedRoles.length})
                            </button>
                        )}
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                // If using react-router-dom v6
                                // navigate('/vaccination-report');
                                window.location.href = '/vaccination-entry';
                            }}
                        >
                            <Plus className="h-4 w-4" />
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {/* Roles Table */}
            <div className="card overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Roles
                    </h2>
                    <div className="flex items-center space-x-2 text-slate-300">
                        <span className="text-sm">{filteredRoles.length} roles</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-blue-400">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.length === filteredRoles.length && filteredRoles.length > 0}
                                        onChange={handleSelectAll}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    S.No
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
                                    Is Active
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredRoles.map((role, index) => (
                                <tr key={role.id} className="hover:bg-slate-50 transition-colors animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedRoles.includes(role.id)}
                                            onChange={() => handleSelectRole(role.id)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded text-slate-700">
                                            {role.caseId}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                {role.patientName.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-slate-900">{role.patientName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                        {role.civilId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                        {role.institute}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                        {role.vaccineName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-1 text-sm text-slate-600">
                                            <Calendar className="h-3 w-3" />
                                            <span>{role.injectionDate}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`status-badge ${role.isActive ? 'status-success' : 'status-error'} flex items-center space-x-1`}>
                                            {role.isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                            <span>{role.isActive ? 'Yes' : 'No'}</span>
                                        </span>
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
                                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredRoles.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No roles found</h3>
                        <p className="text-slate-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VaccinReport;