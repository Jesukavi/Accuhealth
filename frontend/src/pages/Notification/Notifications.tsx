import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Plus, Filter, Eye, CreditCard as Edit, Trash2, FileText, Activity, CheckCircle, XCircle, Calendar, User, Building, MoreVertical, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotificationPDFGenerator from '../../components/DownloadPDF/NotificationPDFGenerator';

interface Notification {
  id: number;
  patient_id: string;
  first_name: string;
  second_name: string;
  institution: string;
  governorate: string;
  wilayat: string;
  treatment: string;
  outcome: string;
  created_at: string;
  updated_at: string;
  age?: number;
  gender?: string;
  blood_transfusion_within_past_3_months?: string;
  date_of_onset?: string;
  density?: string;
  dob?: string;
  education?: string;
  expiry_date?: string;
  longitude?: string;
  marital_status?: string;
  mobile_no?: string;
  monthly_income?: string;
  nationality?: string;
  next_of_kin_mobile_no?: string;
  other_outcome?: string;
  other_outcome_date?: string;
  other_primaquine?: string;
  other_remarks?: string;
  other_treatment?: string;
  other_treatment_dose?: string;
  other_treatment_start_date?: string;
  outcome_date?: string;
  parasite_count?: string;
  passport_no?: string;
  past_history_of_malaria?: string;
  patient_governorate?: string;
  patient_wilayat?: string;
  place_of_work?: string;
  primaquine?: string;
  rdt_reported_date?: string;
  relapse?: string;
  remarks?: string;
  reporting_date?: string;
  species?: string[];
  stages?: string[];
  symptoms?: string[];
  term?: string;
  treatment_dose?: string;
  treatment_end_date?: string;
  treatment_start_date?: string;
  work_status?: string;
}

import { API_BASE_URL } from '../../config';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched notifications:', data); // Debug log

        // Handle both response formats
        if (data.notifications) {
          console.log('data.notifications:', data.notifications); // Debug log
          setNotifications(data.notifications);
        } else if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          setError('Unexpected response format');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Format data for display
  const formatNotificationData = (notification: Notification) => {
    const fullName = `${notification.first_name} ${notification.second_name || ''}`.trim();
    const reportingDate = new Date(notification.created_at).toLocaleDateString();

    // Generate a notification ID based on actual data
    const notificationId = `MLR-${notification.id.toString().padStart(6, '0')}`;

    // Determine status based on outcome or other criteria
    const getStatus = () => {
      if (notification.outcome === 'cured') return 'saved';
      if (notification.outcome === 'died') return 'rejected';
      return 'pending';
    };

    return {
      formatted: {
        id: notification.id,
        notificationId: notificationId,
        reportingDate: reportingDate,
        patientName: fullName,
        patientNo: notification.patient_id,
        age: notification.age || 0,
        sex: notification.gender === 'M' ? 'M' : 'F',
        reportingInstitute: notification.institution,
        status: getStatus(),
        governorate: notification.governorate,
        wilayat: notification.wilayat,
        outcome: notification.outcome
      },
      original: notification // Keep the original data for PDF
    };
  };

  const filteredNotifications = notifications
    .map(formatNotificationData)
    .filter(({ formatted }) => {
      const matchesSearch =
        formatted.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatted.notificationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatted.reportingInstitute.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatted.patientNo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterStatus === 'all' || formatted.status.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesFilter;
    });

  const handleSelectNotification = (notificationId: number) => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    setSelectedNotifications(
      selectedNotifications.length === filteredNotifications.length
        ? []
        : filteredNotifications.map(({ formatted }) => formatted.id)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'saved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'saved':
        return <CheckCircle className="h-3 w-3" />;
      case 'rejected':
        return <XCircle className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-slate-500">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.history.back()}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Malaria Notifications</h1>
            <p className="text-xs md:text-sm text-slate-600 hidden sm:block">Manage case notifications and records</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center space-x-2 text-sm">
          <XCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">Total</p>
              <p className="text-lg md:text-xl font-bold text-slate-900">{notifications.length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">Saved</p>
              <p className="text-lg md:text-xl font-bold text-slate-900">
                {filteredNotifications.filter(({ formatted }) => formatted.status.toLowerCase() === 'saved').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">Rejected</p>
              <p className="text-lg md:text-xl font-bold text-slate-900">
                {filteredNotifications.filter(({ formatted }) => formatted.status.toLowerCase() === 'rejected').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">Institutes</p>
              <p className="text-lg md:text-xl font-bold text-slate-900">
                {new Set(notifications.map(n => n.institution)).size}
              </p>
            </div>
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <Building className="h-4 w-4 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="saved">Saved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedNotifications.length > 0 && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export</span> ({selectedNotifications.length})
              </button>
            )}
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Advanced</span>
            </button>
            <Link to="/notification-entry" className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ml-auto">
              <Plus className="h-3.5 w-3.5" />
              New
            </Link>
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-2.5 flex items-center justify-between">
          <h2 className="text-sm md:text-base font-semibold text-white flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Malaria Listing
          </h2>
          <span className="text-xs text-slate-300">{filteredNotifications.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase">
                  No
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase">
                  ID
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase">
                  Date
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase">
                  Patient
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase">
                  Patient ID
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase">
                  Age
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase">
                  Sex
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase">
                  Institute
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredNotifications.map(({ formatted, original }, index) => (
                <tr key={formatted.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(formatted.id)}
                      onChange={() => handleSelectNotification(formatted.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs font-medium text-slate-900">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                      {formatted.notificationId}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-xs text-slate-900">{formatted.reportingDate}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {formatted.patientName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-xs text-slate-900">{formatted.patientName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs text-slate-900">
                    {formatted.patientNo}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs text-slate-900">
                    {formatted.age || 'N/A'}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${formatted.sex === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                      {formatted.sex === 'M' ? 'M' : 'F'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap max-w-[200px]">
                    <div className="flex items-center space-x-1.5">
                      <Building className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      <span className="text-xs text-slate-900 truncate">{formatted.reportingInstitute}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(formatted.status)}`}>
                      {getStatusIcon(formatted.status)}
                      <span className="capitalize">{formatted.status}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded transition-all">
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <NotificationPDFGenerator
                        notification={original}
                        onDownload={() => console.log('PDF downloaded for:', formatted.notificationId)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-base font-medium text-slate-900 mb-1">No notifications found</h3>
            <p className="text-sm text-slate-600">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Create your first notification'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Link to="/notification-entry" className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-3">
                <Plus className="h-4 w-4" />
                Create First Notification
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;