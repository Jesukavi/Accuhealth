import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Loader2, Thermometer } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

interface FeverRashRecord {
    id: number;
    notificationId?: string;
    patientId?: string;
    patient_id?: string;
    firstName?: string;
    first_name?: string;
    secondName?: string;
    second_name?: string;
    thirdName?: string;
    third_name?: string;
    civilId?: string;
    civil_id?: string;
    dob?: string;
    age?: number | string;
    term?: string;
    gender?: string;
    nationality?: string;
    mobileNo?: string;
    mobile_no?: string;
    maritalStatus?: string;
    marital_status?: string;
    education?: string;
    occupations?: string;
    placeOfWork?: string;
    place_of_work?: string;
    patientGovernorate?: string;
    patient_governorate?: string;
    patientWilayat?: string;
    patient_wilayat?: string;
    village?: string;
    governorate?: string;
    wilayat?: string;
    institution?: string;
    reportingDate?: string;
    reporting_date?: string;
    dateOfOnset?: string;
    date_of_onset?: string;
    remarks?: string;
    clinicalSymptoms?: string[];
    clinical_symptoms?: string;
    receivedMMR?: string;
    received_mmr?: string;
    abroadTravel?: string;
    abroad_travel?: string;
    tourismWork?: string;
    tourism_work?: string;
    massGathering?: string;
    mass_gathering?: string;
    outcome?: string;
    outcomeDate?: string;
    outcome_date?: string;
    classification?: string;
    finalOutcome?: string;
    final_outcome?: string;
    finalOutcomeDate?: string;
    final_outcome_date?: string;
    finalRemarks?: string;
    final_remarks?: string;
    created_at?: string;
}

const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString() : '-';
const val = (v?: string | number | null) => (v !== undefined && v !== null && v !== '') ? String(v) : '-';
const parseArr = (a?: string[] | string) => {
    if (!a) return '-';
    if (Array.isArray(a)) return a.length > 0 ? a.join(', ') : '-';
    try { const p = JSON.parse(a); return Array.isArray(p) && p.length > 0 ? p.join(', ') : val(a); }
    catch { return val(a); }
};

const FeverRashView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<FeverRashRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/fever-rash/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (res.ok) {
                    const result = await res.json();
                    setData(result.notification || result);
                } else {
                    toast.error('Failed to fetch Fever & Rash notification');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                toast.error('Error loading data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleDownloadPDF = async () => {
        const element = printRef.current;
        if (!element || !data) return;
        try {
            await document.fonts.ready;
            const originalStyle = element.style.cssText;
            element.style.width = '210mm';
            element.style.maxWidth = 'none';
            element.style.padding = '15mm';
            element.style.boxSizing = 'border-box';

            const canvas = await html2canvas(element, {
                scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff',
            });
            element.style.cssText = originalStyle;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            const patId = val(data.patientId || data.patient_id);
            pdf.save(`FeverRash-Notification-${patId !== '-' ? patId : id}.pdf`);
            toast.success('PDF Downloaded Successfully');
        } catch (err) {
            console.error('PDF Error:', err);
            toast.error('Failed to generate PDF');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
    );

    if (!data) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center space-y-3">
                <Thermometer className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-medium">Record not found</p>
            </div>
        </div>
    );

    const firstName  = val(data.firstName  || data.first_name);
    const secondName = val(data.secondName || data.second_name);
    const thirdName  = val(data.thirdName  || data.third_name);
    const fullName   = [firstName, secondName, thirdName].filter(v => v !== '-').join(' ') || '-';
    const patientId  = val(data.patientId  || data.patient_id);
    const reportDate = val(data.reportingDate || data.reporting_date);
    const onsetDate  = val(data.dateOfOnset  || data.date_of_onset);
    const outcomeDate = val(data.outcomeDate || data.outcome_date);
    const finalOutcomeDate = val(data.finalOutcomeDate || data.final_outcome_date);
    const finalOutcome = val(data.finalOutcome || data.final_outcome);
    const symptoms = parseArr(data.clinicalSymptoms || data.clinical_symptoms as any);
    const mmr = val(data.receivedMMR || data.received_mmr);
    const travel = val(data.abroadTravel || data.abroad_travel);
    const tourism = val(data.tourismWork || data.tourism_work);
    const mass = val(data.massGathering || data.mass_gathering);
    const notifId = data.notificationId || `FR-${new Date(data.created_at || Date.now()).getFullYear()}-${String(data.id).padStart(4, '0')}`;

    const Row = ({ label, value }: { label: string; value: string }) => (
        <div className="grid grid-cols-[190px_1fr] border-b border-slate-200 last:border-0">
            <div className="bg-slate-50 p-2 font-semibold text-slate-700 border-r border-slate-200 text-sm">{label}</div>
            <div className="p-2 text-sm">{value}</div>
        </div>
    );

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <h2 className="text-orange-800 font-bold uppercase mb-2 border-b-2 border-orange-200 pb-1 text-xs tracking-wider">{children}</h2>
    );

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="max-w-5xl mx-auto space-y-4">
                {/* Top bar */}
                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 print:hidden">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Listing
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                        <Download className="w-5 h-5" />
                        Download PDF
                    </button>
                </div>

                {/* A4 Report */}
                <div className="overflow-auto flex justify-center">
                    <div
                        ref={printRef}
                        className="bg-white shadow-lg w-full max-w-[210mm] min-h-[297mm] mx-auto text-slate-900 leading-relaxed p-10"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                        {/* Report Header */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-3">
                                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Thermometer className="w-7 h-7 text-orange-600" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wide mb-1">
                                Fever & Rash Case Notification Report
                            </h1>
                            <p className="text-slate-500 text-sm">Communicable Disease Surveillance Unit</p>
                            <div className="h-1 w-full bg-orange-600 mt-3 mb-0.5 rounded" />
                            <div className="h-0.5 w-full bg-orange-300 rounded" />
                        </div>

                        {/* Notification Details */}
                        <div className="mb-6 border border-slate-200 rounded">
                            <div className="bg-orange-600 text-white font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-t">
                                Notification Details
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-slate-200">
                                <div className="divide-y divide-slate-200">
                                    <Row label="Notification ID"   value={notifId} />
                                    <Row label="Reporting Date"    value={reportDate !== '-' ? fmtDate(reportDate) : '-'} />
                                    <Row label="Institution"       value={val(data.institution)} />
                                </div>
                                <div className="divide-y divide-slate-200">
                                    <Row label="Governorate"       value={val(data.governorate)} />
                                    <Row label="Wilayat"           value={val(data.wilayat)} />
                                    <Row label="Classification"    value={val(data.classification)} />
                                </div>
                            </div>
                        </div>

                        {/* Section 1: Patient Information */}
                        <div className="mb-6">
                            <SectionTitle>Section 1: Patient Information</SectionTitle>
                            <div className="border border-slate-200 rounded divide-y divide-slate-200">
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Patient ID"        value={patientId} />
                                    <Row label="Civil ID"          value={val(data.civilId || data.civil_id)} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Full Name"         value={fullName} />
                                    <Row label="Gender"            value={val(data.gender)} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Date of Birth"     value={fmtDate(data.dob)} />
                                    <Row label="Age"               value={data.age ? `${data.age} ${data.term || 'Years'}` : '-'} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Nationality"       value={val(data.nationality)} />
                                    <Row label="Marital Status"    value={val(data.maritalStatus || data.marital_status)} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Mobile No"         value={val(data.mobileNo || data.mobile_no)} />
                                    <Row label="Education"         value={val(data.education)} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Occupation"        value={val(data.occupations)} />
                                    <Row label="Place of Work"     value={val(data.placeOfWork || data.place_of_work)} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Patient Governorate" value={val(data.patientGovernorate || data.patient_governorate)} />
                                    <Row label="Patient Wilayat"   value={val(data.patientWilayat || data.patient_wilayat)} />
                                </div>
                                <Row label="Village"               value={val(data.village)} />
                            </div>
                        </div>

                        {/* Section 2: Clinical Details */}
                        <div className="mb-6">
                            <SectionTitle>Section 2: Clinical Details</SectionTitle>
                            <div className="border border-slate-200 rounded divide-y divide-slate-200">
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Date of Onset"     value={onsetDate !== '-' ? fmtDate(onsetDate) : '-'} />
                                    <Row label="Received MMR"      value={mmr} />
                                </div>
                                <Row label="Clinical Symptoms"     value={symptoms} />
                                <Row label="Remarks"               value={val(data.remarks)} />
                            </div>
                        </div>

                        {/* Section 3 & 4 side by side */}
                        <div className="grid grid-cols-2 gap-5 mb-6">
                            {/* Exposure */}
                            <div>
                                <SectionTitle>Section 3: Exposure History</SectionTitle>
                                <div className="border border-slate-200 rounded divide-y divide-slate-200">
                                    <Row label="Abroad Travel"     value={travel} />
                                    <Row label="Tourism Work"      value={tourism} />
                                    <Row label="Mass Gathering"    value={mass} />
                                </div>
                            </div>
                            {/* Outcome */}
                            <div>
                                <SectionTitle>Section 4: Outcome & Classification</SectionTitle>
                                <div className="border border-slate-200 rounded divide-y divide-slate-200">
                                    <Row label="Outcome"           value={val(data.outcome)} />
                                    <Row label="Outcome Date"      value={outcomeDate !== '-' ? fmtDate(outcomeDate) : '-'} />
                                    <Row label="Final Outcome"     value={finalOutcome} />
                                    <Row label="Final Outcome Date" value={finalOutcomeDate !== '-' ? fmtDate(finalOutcomeDate) : '-'} />
                                    <Row label="Final Remarks"     value={val(data.finalRemarks || data.final_remarks)} />
                                </div>
                            </div>
                        </div>

                        {/* Declaration */}
                        <div className="border-t border-slate-300 pt-4 mt-4">
                            <h3 className="font-bold text-orange-800 mb-2 text-sm uppercase">Declaration</h3>
                            <p className="text-sm text-slate-600">
                                This case has been notified as per Fever & Rash disease surveillance and reporting guidelines.
                                All information contained herein is confidential and for official use only.
                            </p>
                        </div>

                        {/* Signatures */}
                        <div className="mt-10 grid grid-cols-3 gap-8 text-sm">
                            {['Reporting Officer', 'Verified By', 'Approved By'].map(role => (
                                <div key={role} className="text-center">
                                    <div className="border-b border-slate-400 mb-2 mt-8" />
                                    <p className="font-medium text-slate-700">{role}</p>
                                    <p className="text-slate-400 text-xs">Date: ___________</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeverRashView;
