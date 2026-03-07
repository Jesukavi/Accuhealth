import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, FileText, Pencil, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import toast from 'react-hot-toast';

interface HemorrhagicFormData {
  governorate: string; wilayat: string; institution: string;
  reportingDate: string; dateOfOnset: string;
  patientId: string; civilId: string;
  firstName: string; secondName: string; thirdName: string;
  gender: string; age: string; dob: string;
  nationality: string; mobileNo: string; maritalStatus: string;
  patientGovernorate: string; patientWilayat: string;
  classification: string; hospitalType: string; noOfMMGiven: string;
  finalOutcome: string; finalOutcomeDate: string;
  remarks: string; status: string;
}

const EMPTY: HemorrhagicFormData = {
  governorate: '', wilayat: '', institution: '', reportingDate: '', dateOfOnset: '',
  patientId: '', civilId: '', firstName: '', secondName: '', thirdName: '',
  gender: '', age: '', dob: '', nationality: '', mobileNo: '', maritalStatus: '',
  patientGovernorate: '', patientWilayat: '',
  classification: '', hospitalType: 'all', noOfMMGiven: '',
  finalOutcome: '', finalOutcomeDate: '', remarks: '', status: 'Pending',
};

const governorates = ['Muscat','Dhofar','Al Dakhiliyah','Al Sharqiyah North','Al Sharqiyah South','Al Batinah North','Al Batinah South','Musandam','Al Dhahirah','Al Buraimi','Al Wusta'];
const nationalities = ['Omani','Indian','Pakistani','Bangladeshi','Filipinos','Other'];

const inputCls = 'w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-colors';
const selectCls = inputCls;

const HemorrhagicNewEntry: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<HemorrhagicFormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [records, setRecords] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Fetch listing
  const fetchRecords = async () => {
    setLoadingList(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/hemorrhagic`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRecords(data.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  // Load existing record for editing
  useEffect(() => {
    if (!id) return;
    setShowForm(true);
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/hemorrhagic/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const r = data.notification || data;
          setFormData({
            governorate: r.governorate || '', wilayat: r.wilayat || '',
            institution: r.institution || '',
            reportingDate: r.reportingDate ? r.reportingDate.slice(0, 10) : '',
            dateOfOnset: r.dateOfOnset ? r.dateOfOnset.slice(0, 10) : '',
            patientId: r.patientId || '', civilId: r.civilId || '',
            firstName: r.firstName || '', secondName: r.secondName || '', thirdName: r.thirdName || '',
            gender: r.gender || '', age: r.age || '',
            dob: r.dob ? r.dob.slice(0, 10) : '',
            nationality: r.nationality || '', mobileNo: r.mobileNo || '',
            maritalStatus: r.maritalStatus || '',
            patientGovernorate: r.patientGovernorate || '', patientWilayat: r.patientWilayat || '',
            classification: r.classification || '', hospitalType: r.hospitalType || 'all',
            noOfMMGiven: r.noOfMMGiven || '', finalOutcome: r.finalOutcome || '',
            finalOutcomeDate: r.finalOutcomeDate ? r.finalOutcomeDate.slice(0, 10) : '',
            remarks: r.remarks || '', status: r.status || 'Pending',
          });
        } else { toast.error('Failed to load record'); }
      } catch { toast.error('Error loading record'); }
      finally { setLoadingData(false); }
    })();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId.trim()) { toast.error('Patient ID is required'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `${API_BASE_URL}/hemorrhagic/${id}` : `${API_BASE_URL}/hemorrhagic`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success(isEdit ? 'Record updated successfully!' : 'Notification created successfully!');
        setFormData(EMPTY);
        setShowForm(false);
        fetchRecords();
        if (isEdit) navigate('/hemorrhagic-new-entry');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save');
      }
    } catch { toast.error('Error saving record'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (recId: string) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/hemorrhagic/${recId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { fetchRecords(); toast.success('Deleted successfully'); }
      else toast.error('Failed to delete');
    } catch { toast.error('Error deleting record'); }
  };

  if (loadingData) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-red-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-slate-700 bg-clip-text text-transparent">
              Hemorrhagic DS Notification
            </h1>
            <p className="text-sm text-slate-500">Manage hemorrhagic disease notifications</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* ── Form (collapsible) ── */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Section 1: Notification Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-xs font-bold text-red-700 border-b border-red-100 pb-2 mb-4 uppercase tracking-wide">
                1. Notification Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Governorate</label>
                  <select name="governorate" value={formData.governorate} onChange={handleChange} className={selectCls}>
                    <option value="">Select</option>
                    {governorates.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Wilayat</label>
                  <input name="wilayat" value={formData.wilayat} onChange={handleChange} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Institution</label>
                  <input name="institution" value={formData.institution} onChange={handleChange} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Reporting Date</label>
                  <input type="date" name="reportingDate" value={formData.reportingDate} onChange={handleChange} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Date of Onset</label>
                  <input type="date" name="dateOfOnset" value={formData.dateOfOnset} onChange={handleChange} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Section 2: Patient Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-xs font-bold text-red-700 border-b border-red-100 pb-2 mb-4 uppercase tracking-wide">
                2. Patient Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'Patient ID', name: 'patientId', required: true },
                  { label: 'Civil ID', name: 'civilId' },
                  { label: 'First Name', name: 'firstName', required: true },
                  { label: 'Second Name', name: 'secondName' },
                  { label: 'Third Name', name: 'thirdName' },
                ].map(f => (
                  <div key={f.name} className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      {f.label}{f.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input name={f.name} value={(formData as any)[f.name]} onChange={handleChange} required={f.required} className={inputCls} />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className={selectCls}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Nationality</label>
                  <select name="nationality" value={formData.nationality} onChange={handleChange} className={selectCls}>
                    <option value="">Select</option>
                    {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Mobile No</label>
                  <input type="tel" name="mobileNo" value={formData.mobileNo} onChange={handleChange} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Marital Status</label>
                  <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={selectCls}>
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Patient Governorate</label>
                  <select name="patientGovernorate" value={formData.patientGovernorate} onChange={handleChange} className={selectCls}>
                    <option value="">Select</option>
                    {governorates.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Patient Wilayat</label>
                  <input name="patientWilayat" value={formData.patientWilayat} onChange={handleChange} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Section 3: Clinical Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-xs font-bold text-red-700 border-b border-red-100 pb-2 mb-4 uppercase tracking-wide">
                3. Clinical Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Classification</label>
                  <div className="flex flex-wrap gap-4 pt-1.5">
                    {['measles','rubella','discarded'].map(c => (
                      <label key={c} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="classification" value={c}
                          checked={formData.classification === c} onChange={handleChange} className="accent-red-500" />
                        <span className="text-sm text-slate-700 capitalize">{c === 'discarded' ? 'Discarded' : c.charAt(0).toUpperCase() + c.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Hospital Type</label>
                  <div className="flex flex-wrap gap-4 pt-1.5">
                    {['all','moh','non-moh'].map(h => (
                      <label key={h} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="hospitalType" value={h}
                          checked={formData.hospitalType === h} onChange={handleChange} className="accent-red-500" />
                        <span className="text-sm text-slate-700 uppercase">{h}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">No. of MM Given</label>
                  <input type="number" name="noOfMMGiven" value={formData.noOfMMGiven} onChange={handleChange} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Final Outcome</label>
                  <select name="finalOutcome" value={formData.finalOutcome} onChange={handleChange} className={selectCls}>
                    <option value="">Select</option>
                    <option value="Recovered">Recovered</option>
                    <option value="Died">Died</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Final Outcome Date</label>
                  <input type="date" name="finalOutcomeDate" value={formData.finalOutcomeDate} onChange={handleChange} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className={selectCls}>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Remarks</label>
                <textarea name="remarks" value={formData.remarks} onChange={handleChange} rows={3}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 resize-none"
                  placeholder="Additional notes or remarks..." />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                <button type="button" onClick={() => { setShowForm(false); setFormData(EMPTY); if (isEdit) navigate('/hemorrhagic-new-entry'); }}
                  className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-md disabled:opacity-60">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> {isEdit ? 'Update' : 'Save'}</>}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── Records Table ── */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">HEMORRHAGIC DS NOTIFICATION</h2>
            <button
              onClick={() => { setShowForm(!showForm); if (!showForm) setFormData(EMPTY); }}
              className={`px-4 py-2 text-white text-sm rounded-lg transition-colors font-medium shadow-sm ${
                showForm ? 'bg-slate-500 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {showForm ? '✕ Cancel' : '+ Add New'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Notification ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Reporting Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date of Onset</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Patient No.</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Patient Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Age</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Sex</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Governorate</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Institution</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loadingList ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-slate-500">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-1" />
                      Loading...
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-slate-400 text-sm">
                      No notifications found. Click <strong className="text-red-600">+ Add New</strong> to create one.
                    </td>
                  </tr>
                ) : (
                  records.map((row, index) => (
                    <tr key={row.notificationId || index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-400">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-mono text-xs text-slate-700">{String(row.notificationId)?.slice(-8)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.reportingDate}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.dateOfCourt}</td>
                      <td className="px-4 py-3 text-sm font-mono text-slate-700">{row.patientNo}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.patientName}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.age}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.sex}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.reportingDocuments}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{row.reportingInstitutes}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.status === 'Completed' ? 'bg-green-100 text-green-700'
                          : row.status === 'Rejected'  ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}>{row.status || 'Pending'}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/hemorrhagic-view/${row.notificationId}`)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View / Download"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/hemorrhagic-edit/${row.notificationId}`)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(row.notificationId)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HemorrhagicNewEntry;
