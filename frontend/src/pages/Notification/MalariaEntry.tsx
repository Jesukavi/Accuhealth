import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Bell, User, Info, History, FlaskConical,
    MoreHorizontal, ChevronRight, ChevronLeft, Save
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import { nationalities } from '../../constants/nationalities';

interface MalariaFormData {
    // Notification Info
    governorate: string;
    wilayat: string;
    institution: string;
    reportingDate: string;
    // Patient Info
    patientId: string;
    civilId: string;
    expiryDate: string;
    firstName: string;
    secondName: string;
    dob: string;
    age: string;
    term: string;
    mobileNo: string;
    nextOfKinMobileNo: string;
    education: string;
    passportNo: string;
    placeOfWork: string;
    monthlyIncome: string;
    patientGovernorate: string;
    nationality: string;
    longitude: string;
    maritalStatus: string;
    patientWilayat: string;
    gender: string;
    workStatus: string;
    // Source Details
    treatment: string;
    treatmentStartDate: string;
    treatmentDose: string;
    primaquine: string;
    outcome: string;
    outcomeDate: string;
    remarks: string;
    // History Details
    dateOfOnset: string;
    symptoms: string[];
    pastHistoryOfMalaria: string;
    bloodTransfusionWithinPast3Months: string;
    // Lab Results
    rdtReportedDate: string;
    species: string[];
    density: string;
    stages: string[];
    parasiteCount: string;
    relapse: string;
    // Other Details
    otherTreatment: string;
    otherTreatmentStartDate: string;
    treatmentEndDate: string;
    otherTreatmentDose: string;
    otherPrimaquine: string;
    otherOutcome: string;
    otherOutcomeDate: string;
    otherRemarks: string;
}

const SYMPTOM_OPTIONS = ['Fever', 'Headache', 'Dizziness', 'Vomiting', 'Chills', 'Fatigue', 'Muscle Pain', 'Other'];
const SPECIES_OPTIONS = ['P.falciparum', 'P.vivax', 'P.ovale', 'P.malariae', 'Mixed'];
const STAGE_OPTIONS   = ['Ring forms', 'Trophozoites', 'Schizonts', 'Gametocytes'];

const STEPS = [
    { id: 'notification', title: 'Notification Info',  icon: Bell },
    { id: 'patient',      title: 'Patient Info',       icon: User },
    { id: 'source',       title: 'Source Details',     icon: Info },
    { id: 'history',      title: 'History Details',    icon: History },
    { id: 'lab',          title: 'Lab Results',        icon: FlaskConical },
    { id: 'other',        title: 'Other Details',      icon: MoreHorizontal },
];

const EMPTY: MalariaFormData = {
    governorate: '', wilayat: '', institution: '', reportingDate: '',
    patientId: '', civilId: '', expiryDate: '', firstName: '', secondName: '',
    dob: '', age: '', term: 'Years', mobileNo: '', nextOfKinMobileNo: '',
    education: '', passportNo: '', placeOfWork: '', monthlyIncome: '',
    patientGovernorate: '', nationality: '', longitude: '', maritalStatus: '',
    patientWilayat: '', gender: '', workStatus: '',
    treatment: '', treatmentStartDate: '', treatmentDose: '', primaquine: '',
    outcome: '', outcomeDate: '', remarks: '',
    dateOfOnset: '', symptoms: [], pastHistoryOfMalaria: '', bloodTransfusionWithinPast3Months: '',
    rdtReportedDate: '', species: [], density: '', stages: [], parasiteCount: '', relapse: '',
    otherTreatment: '', otherTreatmentStartDate: '', treatmentEndDate: '', otherTreatmentDose: '',
    otherPrimaquine: '', otherOutcome: '', otherOutcomeDate: '', otherRemarks: '',
};

const inputCls  = 'w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none';
const selectCls = 'w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white';
const labelCls  = 'block text-sm font-medium text-slate-700 mb-1';

const MalariaEntry: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);
    const [step, setStep]       = useState(0);
    const [loading, setLoading] = useState(false);
    const [form, setForm]       = useState<MalariaFormData>(EMPTY);

    // Load existing record when editing
    useEffect(() => {
        if (!id) return;
        const fetchRecord = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/malaria-notifications/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    const n = data.notification || data;
                    // Map API fields back to form fields
                    setForm({
                        governorate: n.governorate || '',
                        wilayat: n.wilayat || '',
                        institution: n.institution || n.reporting_institute || '',
                        reportingDate: n.reporting_date || n.reportingDate || '',
                        patientId: n.patient_id || n.patientId || '',
                        civilId: n.civil_id || n.civilId || '',
                        expiryDate: n.expiry_date || n.expiryDate || '',
                        firstName: n.first_name || n.firstName || '',
                        secondName: n.second_name || n.secondName || '',
                        dob: n.dob || '',
                        age: String(n.age || ''),
                        term: n.term || 'Years',
                        mobileNo: n.mobile_no || n.mobileNo || '',
                        nextOfKinMobileNo: n.next_of_kin_mobile_no || n.nextOfKinMobileNo || '',
                        education: n.education || '',
                        passportNo: n.passport_no || n.passportNo || '',
                        placeOfWork: n.place_of_work || n.placeOfWork || '',
                        monthlyIncome: String(n.monthly_income || n.monthlyIncome || ''),
                        patientGovernorate: n.patient_governorate || n.patientGovernorate || '',
                        nationality: n.nationality || '',
                        longitude: n.longitude || '',
                        maritalStatus: n.marital_status || n.maritalStatus || '',
                        patientWilayat: n.patient_wilayat || n.patientWilayat || '',
                        gender: n.gender || n.sex || '',
                        workStatus: n.work_status || n.workStatus || '',
                        treatment: n.treatment || '',
                        treatmentStartDate: n.treatment_start_date || n.treatmentStartDate || '',
                        treatmentDose: n.treatment_dose || n.treatmentDose || '',
                        primaquine: n.primaquine || '',
                        outcome: n.outcome || '',
                        outcomeDate: n.outcome_date || n.outcomeDate || '',
                        remarks: n.remarks || '',
                        dateOfOnset: n.date_of_onset || n.dateOfOnset || '',
                        symptoms: Array.isArray(n.symptoms) ? n.symptoms : [],
                        pastHistoryOfMalaria: n.past_history_of_malaria || n.pastHistoryOfMalaria || '',
                        bloodTransfusionWithinPast3Months: n.blood_transfusion_within_past_3_months || n.bloodTransfusionWithinPast3Months || '',
                        rdtReportedDate: n.rdt_reported_date || n.rdtReportedDate || '',
                        species: Array.isArray(n.species) ? n.species : [],
                        density: n.density || '',
                        stages: Array.isArray(n.stages) ? n.stages : [],
                        parasiteCount: n.parasite_count || n.parasiteCount || '',
                        relapse: n.relapse || '',
                        otherTreatment: n.other_treatment || n.otherTreatment || '',
                        otherTreatmentStartDate: n.other_treatment_start_date || n.otherTreatmentStartDate || '',
                        treatmentEndDate: n.treatment_end_date || n.treatmentEndDate || '',
                        otherTreatmentDose: n.other_treatment_dose || n.otherTreatmentDose || '',
                        otherPrimaquine: n.other_primaquine || n.otherPrimaquine || '',
                        otherOutcome: n.other_outcome || n.otherOutcome || '',
                        otherOutcomeDate: n.other_outcome_date || n.otherOutcomeDate || '',
                        otherRemarks: n.other_remarks || n.otherRemarks || '',
                    });
                }
            } catch (err) {
                console.error('Failed to load record for editing:', err);
            }
        };
        fetchRecord();
    }, [id]);

    const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const toggleArr = (field: 'symptoms' | 'species' | 'stages', val: string) =>
        setForm(p => ({
            ...p,
            [field]: p[field].includes(val) ? p[field].filter(v => v !== val) : [...p[field], val],
        }));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = isEdit
                ? `${API_BASE_URL}/malaria-notifications/${id}`
                : `${API_BASE_URL}/malaria-notifications`;
            const method = isEdit ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                navigate('/malaria-listing');
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(err);
            alert('Network error saving notification');
        } finally {
            setLoading(false);
        }
    };

    /* ── Step renders ── */

    const renderNotification = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900">Malaria Notification</h2>
                <p className="text-sm text-yellow-600 mt-1">Notify only for confirmed cases</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                    <label className={labelCls}>Governorate</label>
                    <input name="governorate" value={form.governorate} onChange={set} className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>Wilayat</label>
                    <input name="wilayat" value={form.wilayat} onChange={set} className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>Institution <span className="text-red-500">*</span></label>
                    <input name="institution" value={form.institution} onChange={set} className={inputCls} required />
                </div>
                <div>
                    <label className={labelCls}>Reporting Date</label>
                    <input type="date" name="reportingDate" value={form.reportingDate} onChange={set} className={inputCls} />
                </div>
            </div>
        </div>
    );

    const renderPatient = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900">Patient Info</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Col 1 */}
                <div className="space-y-4">
                    <div>
                        <label className={labelCls}>Patient ID <span className="text-red-500">*</span></label>
                        <input name="patientId" value={form.patientId} onChange={set} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>First Name <span className="text-red-500">*</span></label>
                        <input name="firstName" value={form.firstName} onChange={set} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Mobile No</label>
                        <input type="tel" name="mobileNo" value={form.mobileNo} onChange={set} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Place of Work <span className="text-red-500">*</span></label>
                        <input name="placeOfWork" value={form.placeOfWork} onChange={set} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Longitude</label>
                        <input name="longitude" value={form.longitude} onChange={set} className={inputCls} />
                    </div>
                </div>
                {/* Col 2 */}
                <div className="space-y-4">
                    <div>
                        <label className={labelCls}>Civil ID</label>
                        <input name="civilId" value={form.civilId} onChange={set} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Second Name</label>
                        <input name="secondName" value={form.secondName} onChange={set} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Next of Kin Mobile No</label>
                        <input type="tel" name="nextOfKinMobileNo" value={form.nextOfKinMobileNo} onChange={set} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Monthly Income</label>
                        <input type="number" name="monthlyIncome" value={form.monthlyIncome} onChange={set} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Marital Status</label>
                        <select name="maritalStatus" value={form.maritalStatus} onChange={set} className={selectCls}>
                            <option value="">Select</option>
                            <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                        </select>
                    </div>
                </div>
                {/* Col 3 */}
                <div className="space-y-4">
                    <div>
                        <label className={labelCls}>Expiry Date</label>
                        <input type="date" name="expiryDate" value={form.expiryDate} onChange={set} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>DOB <span className="text-red-500">*</span></label>
                        <input type="date" name="dob" value={form.dob} onChange={set} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Education</label>
                        <select name="education" value={form.education} onChange={set} className={selectCls}>
                            <option value="">Select</option>
                            <option>None</option><option>Primary</option><option>Secondary</option><option>Higher</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Patient Governorate</label>
                        <input name="patientGovernorate" value={form.patientGovernorate} onChange={set} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Patient Wilayat</label>
                        <input name="patientWilayat" value={form.patientWilayat} onChange={set} className={inputCls} />
                    </div>
                </div>
                {/* Col 4 */}
                <div className="space-y-4">
                    <div>
                        <label className={labelCls}>Age</label>
                        <div className="flex gap-2">
                            <select name="term" value={form.term} onChange={set} className={`${selectCls} w-1/3`}>
                                <option>Years</option><option>Months</option><option>Days</option>
                            </select>
                            <input type="number" name="age" value={form.age} onChange={set} className={`${inputCls} flex-1`} />
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Passport No</label>
                        <input name="passportNo" value={form.passportNo} onChange={set} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Nationality <span className="text-red-500">*</span></label>
                        <select name="nationality" value={form.nationality} onChange={set} className={selectCls}>
                            <option value="">Select</option>
                            {nationalities.map(n => <option key={n}>{n}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Gender <span className="text-red-500">*</span></label>
                        <select name="gender" value={form.gender} onChange={set} className={selectCls}>
                            <option value="">Select</option><option>Male</option><option>Female</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Work Status</label>
                        <select name="workStatus" value={form.workStatus} onChange={set} className={selectCls}>
                            <option value="">Select</option><option>Employed</option><option>Unemployed</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSource = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900">Source Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                    <label className={labelCls}>Treatment <span className="text-red-500">*</span></label>
                    <input name="treatment" value={form.treatment} onChange={set} className={inputCls} placeholder="Enter treatment" />
                </div>
                <div>
                    <label className={labelCls}>Treatment Start Date</label>
                    <input type="date" name="treatmentStartDate" value={form.treatmentStartDate} onChange={set} className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>Treatment Dose</label>
                    <input name="treatmentDose" value={form.treatmentDose} onChange={set} className={inputCls} placeholder="Enter dose" />
                </div>
                <div>
                    <label className={labelCls}>Primaquine <span className="text-red-500">*</span></label>
                    <div className="flex gap-4 mt-2">
                        {['Given', 'Not Given'].map(v => (
                            <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" name="primaquine" value={v} checked={form.primaquine === v} onChange={set} />
                                {v}
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label className={labelCls}>Outcome</label>
                    <select name="outcome" value={form.outcome} onChange={set} className={selectCls}>
                        <option value="">Select</option><option>Recovered</option><option>Died</option><option>Referred</option>
                    </select>
                </div>
                <div>
                    <label className={labelCls}>Outcome Date</label>
                    <input type="date" name="outcomeDate" value={form.outcomeDate} onChange={set} className={inputCls} />
                </div>
                <div className="md:col-span-2">
                    <label className={labelCls}>Remarks</label>
                    <textarea name="remarks" value={form.remarks} onChange={set} rows={2} className={inputCls} />
                </div>
            </div>
        </div>
    );

    const renderHistory = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900">History Details</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                    <label className={labelCls}>Date of Onset <span className="text-red-500">*</span></label>
                    <input type="date" name="dateOfOnset" value={form.dateOfOnset} onChange={set} className={`${inputCls} md:col-span-2`} />
                </div>
                <div>
                    <label className={`${labelCls} mb-3`}>Symptoms</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {SYMPTOM_OPTIONS.map(s => (
                            <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="checkbox" checked={form.symptoms.includes(s)} onChange={() => toggleArr('symptoms', s)} className="w-4 h-4 text-blue-600 rounded" />
                                {s}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                    <label className={labelCls}>Past History of Malaria</label>
                    <div className="flex gap-6">
                        {['Yes', 'No'].map(v => (
                            <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" name="pastHistoryOfMalaria" value={v} checked={form.pastHistoryOfMalaria === v} onChange={set} />
                                {v}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                    <label className={labelCls}>Blood Transfusion (past 3 months)</label>
                    <div className="flex gap-6">
                        {['Yes', 'No'].map(v => (
                            <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" name="bloodTransfusionWithinPast3Months" value={v} checked={form.bloodTransfusionWithinPast3Months === v} onChange={set} />
                                {v}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderLab = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900">Lab Results</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                    <label className={labelCls}>RDT Reported Date <span className="text-red-500">*</span></label>
                    <input type="date" name="rdtReportedDate" value={form.rdtReportedDate} onChange={set} className={`${inputCls} md:col-span-2`} />
                </div>

                <div>
                    <label className={`${labelCls} mb-3`}>Species</label>
                    <div className="flex flex-wrap gap-5">
                        {SPECIES_OPTIONS.map(s => (
                            <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="checkbox" checked={form.species.includes(s)} onChange={() => toggleArr('species', s)} className="w-4 h-4 text-blue-600 rounded" />
                                {s}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className={`${labelCls} mb-3`}>Density</label>
                    <div className="flex gap-6">
                        {['+1', '+2', '+3', '+4'].map(v => (
                            <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" name="density" value={v} checked={form.density === v} onChange={set} />
                                {v}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className={`${labelCls} mb-3`}>Stages</label>
                    <div className="flex flex-wrap gap-5">
                        {STAGE_OPTIONS.map(s => (
                            <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="checkbox" checked={form.stages.includes(s)} onChange={() => toggleArr('stages', s)} className="w-4 h-4 text-blue-600 rounded" />
                                {s}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                    <label className={labelCls}>Parasite Count (parasite/µL)</label>
                    <input name="parasiteCount" value={form.parasiteCount} onChange={set} className={`${inputCls} md:col-span-2`} placeholder="e.g. 2500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                    <label className={labelCls}>Relapse?</label>
                    <div className="flex gap-6">
                        {['Yes', 'No'].map(v => (
                            <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" name="relapse" value={v} checked={form.relapse === v} onChange={set} />
                                {v}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderOther = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900">Other Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                    <label className={labelCls}>Treatment <span className="text-red-500">*</span></label>
                    <select name="otherTreatment" value={form.otherTreatment} onChange={set} className={selectCls}>
                        <option value="">Select Treatment</option>
                        <option value="artemether-lumefantrine">Artemether-Lumefantrine</option>
                        <option value="artesunate">Artesunate</option>
                        <option value="chloroquine">Chloroquine</option>
                        <option value="quinine">Quinine</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label className={labelCls}>Treatment Start Date</label>
                    <input type="date" name="otherTreatmentStartDate" value={form.otherTreatmentStartDate} onChange={set} className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>Treatment End Date</label>
                    <input type="date" name="treatmentEndDate" value={form.treatmentEndDate} onChange={set} className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>Treatment Dose</label>
                    <input name="otherTreatmentDose" value={form.otherTreatmentDose} onChange={set} className={inputCls} placeholder="Enter dose" />
                </div>
                <div>
                    <label className={labelCls}>Primaquine <span className="text-red-500">*</span></label>
                    <div className="flex gap-4 mt-2">
                        {['Given', 'Not Given'].map(v => (
                            <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" name="otherPrimaquine" value={v} checked={form.otherPrimaquine === v} onChange={set} />
                                {v}
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label className={labelCls}>Outcome</label>
                    <select name="otherOutcome" value={form.otherOutcome} onChange={set} className={selectCls}>
                        <option value="">Select Outcome</option>
                        <option value="cured">Cured</option>
                        <option value="died">Died</option>
                        <option value="transferred">Transferred</option>
                        <option value="lost-to-followup">Lost to Follow-up</option>
                        <option value="treatment-failure">Treatment Failure</option>
                    </select>
                </div>
                <div>
                    <label className={labelCls}>Outcome Date</label>
                    <input type="date" name="otherOutcomeDate" value={form.otherOutcomeDate} onChange={set} className={inputCls} />
                </div>
                <div className="md:col-span-4">
                    <label className={labelCls}>Remarks</label>
                    <textarea name="otherRemarks" value={form.otherRemarks} onChange={set} rows={4}
                        className={inputCls} placeholder="Please use this space to enter other details for Malaria" />
                </div>
            </div>
        </div>
    );

    const renderStep = () => {
        switch (step) {
            case 0: return renderNotification();
            case 1: return renderPatient();
            case 2: return renderSource();
            case 3: return renderHistory();
            case 4: return renderLab();
            case 5: return renderOther();
            default: return renderNotification();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            {/* Top bar */}
            <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60 px-6 py-4">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/malaria-listing')} className="p-2 hover:bg-slate-100 rounded-lg">
                        <ArrowLeft className="h-6 w-6 text-slate-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800">
                        {isEdit ? 'Edit Malaria Notification' : 'Malaria Notification Entry'}
                    </h1>
                </div>
            </div>

            <div className="p-6">
                {/* Step indicator */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 p-5 mb-6">
                    <p className="text-xs font-medium text-slate-500 mb-3">Step {step + 1} of {STEPS.length}</p>
                    <div className="flex items-center gap-1 overflow-x-auto pb-1">
                        {STEPS.map((s, i) => {
                            const Icon = s.icon;
                            const active    = i === step;
                            const completed = i < step;
                            return (
                                <React.Fragment key={s.id}>
                                    <button
                                        onClick={() => setStep(i)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                                            active    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' :
                                            completed ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                                        'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="hidden sm:block">{s.title}</span>
                                    </button>
                                    {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Step content */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 p-8">
                    {renderStep()}

                    <div className="flex justify-between pt-8 border-t border-slate-200 mt-8">
                        <button
                            onClick={() => setStep(s => Math.max(0, s - 1))}
                            disabled={step === 0}
                            className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 text-sm font-medium"
                        >
                            <ChevronLeft className="h-4 w-4" /> Previous
                        </button>

                        {step === STEPS.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm font-medium"
                            >
                                <Save className="h-4 w-4" />
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                        ) : (
                            <button
                                onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MalariaEntry;
