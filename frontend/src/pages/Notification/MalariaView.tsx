import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Loader2, Bug } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

interface MalariaRecord {
    id: number;
    notificationId?: string;
    patientId?: string;
    patient_id?: string;
    firstName?: string;
    first_name?: string;
    secondName?: string;
    second_name?: string;
    reportingDate?: string;
    reporting_date?: string;
    age?: number | string;
    gender?: string;
    sex?: string;
    nationality?: string;
    governorate?: string;
    wilayat?: string;
    institution?: string;
    reporting_institute?: string;
    mobileNo?: string;
    mobile_no?: string;
    treatment?: string;
    outcome?: string;
    outcomeDate?: string;
    outcome_date?: string;
    remarks?: string;
    species?: string[];
    symptoms?: string[];
    density?: string;
    stages?: string[];
    parasiteCount?: string;
    parasite_count?: string;
    rdtReportedDate?: string;
    rdt_reported_date?: string;
    dateOfOnset?: string;
    date_of_onset?: string;
    pastHistoryOfMalaria?: string;
    past_history_of_malaria?: string;
    relapse?: string;
    status?: string;
    dob?: string;
    civilId?: string;
    civil_id?: string;
    patientGovernorate?: string;
    patient_governorate?: string;
    maritalStatus?: string;
    marital_status?: string;
}

const field = (a: string | undefined, b: string | undefined) => a || b || '-';

const MalariaView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<MalariaRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/malaria-notifications/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (res.ok) {
                    const result = await res.json();
                    // backend may return { notification: {...} } or the object directly
                    setData(result.notification || result);
                } else {
                    toast.error('Failed to fetch malaria notification');
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
            const patId = field(data.patientId, data.patient_id);
            pdf.save(`Malaria-Notification-${patId !== '-' ? patId : id}.pdf`);
            toast.success('PDF Downloaded Successfully');
        } catch (err) {
            console.error('PDF Error:', err);
            toast.error('Failed to generate PDF');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
    );

    if (!data) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center space-y-3">
                <Bug className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-medium">Record not found</p>
            </div>
        </div>
    );

    const firstName  = field(data.firstName,  data.first_name);
    const secondName = field(data.secondName, data.second_name);
    const fullName   = [firstName, secondName].filter(v => v !== '-').join(' ') || '-';
    const patientId  = field(data.patientId,  data.patient_id);
    const reportDate = field(data.reportingDate, data.reporting_date);
    const institution = field(data.institution, data.reporting_institute);
    const mobileNo   = field(data.mobileNo,   data.mobile_no);
    const civilId    = field(data.civilId,    data.civil_id);
    const rdtDate    = field(data.rdtReportedDate, data.rdt_reported_date);
    const onsetDate  = field(data.dateOfOnset, data.date_of_onset);
    const outcomeDate = field(data.outcomeDate, data.outcome_date);
    const parasite   = field(data.parasiteCount, data.parasite_count);
    const patGov     = field(data.patientGovernorate, data.patient_governorate);
    const marital    = field(data.maritalStatus, data.marital_status);
    const pastMalaria = field(data.pastHistoryOfMalaria, data.past_history_of_malaria);
    const speciesList = Array.isArray(data.species) ? data.species.join(', ') : '-';
    const symptomList = Array.isArray(data.symptoms) ? data.symptoms.join(', ') : '-';
    const stageList   = Array.isArray(data.stages)  ? data.stages.join(', ')  : '-';
    const notifId     = data.notificationId || `MAL-${new Date().getFullYear()}-${String(data.id).padStart(4,'0')}`;

    const Row = ({ label, value }: { label: string; value: string }) => (
        <div className="grid grid-cols-[180px_1fr] border-b border-slate-200 last:border-0">
            <div className="bg-slate-50 p-2 font-semibold text-slate-700 border-r border-slate-200 text-sm">{label}</div>
            <div className="p-2 text-sm">{value}</div>
        </div>
    );

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <h2 className="text-red-800 font-bold uppercase mb-2 border-b-2 border-red-200 pb-1 text-xs tracking-wider">{children}</h2>
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
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                        <Download className="w-5 h-5" />
                        Download PDF
                    </button>
                </div>

                {/* A4 Report */}
                <div className="overflow-auto flex justify-center">
                    <div
                        ref={printRef}
                        className="bg-white shadow-lg w-full max-w-[210mm] min-h-[297mm] mx-auto text-slate-900 text-base leading-relaxed p-10"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                        {/* Report Header */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-3">
                                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                                    <Bug className="w-7 h-7 text-red-600" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wide mb-1">
                                Malaria Case Notification Report
                            </h1>
                            <p className="text-slate-500 text-sm">Communicable Disease Surveillance Unit</p>
                            <div className="h-1 w-full bg-red-700 mt-3 mb-0.5 rounded" />
                            <div className="h-0.5 w-full bg-red-400 rounded" />
                        </div>

                        {/* Facility Details */}
                        <div className="mb-6 border border-slate-200 rounded">
                            <div className="bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-t">
                                Notification Details
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-slate-200">
                                <div className="space-y-0 divide-y divide-slate-200">
                                    <Row label="Notification ID"   value={notifId} />
                                    <Row label="Reporting Date"    value={reportDate !== '-' ? new Date(reportDate).toLocaleDateString() : '-'} />
                                    <Row label="Reporting Institution" value={institution} />
                                </div>
                                <div className="space-y-0 divide-y divide-slate-200">
                                    <Row label="Governorate"       value={data.governorate || '-'} />
                                    <Row label="Wilayat"           value={data.wilayat || '-'} />
                                    <Row label="Status"            value={data.status || '-'} />
                                </div>
                            </div>
                        </div>

                        {/* Section 1: Patient Information */}
                        <div className="mb-6">
                            <SectionTitle>Section 1: Patient Information</SectionTitle>
                            <div className="border border-slate-200 rounded divide-y divide-slate-200">
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Patient ID"      value={patientId} />
                                    <Row label="Civil ID"        value={civilId} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Full Name"       value={fullName} />
                                    <Row label="Gender"          value={field(data.gender, data.sex)} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Age"             value={data.age ? `${data.age} ${(data as any).term || 'Years'}` : '-'} />
                                    <Row label="Nationality"     value={data.nationality || '-'} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Mobile No"       value={mobileNo} />
                                    <Row label="Marital Status"  value={marital} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Patient Governorate" value={patGov} />
                                    <Row label="Patient Wilayat" value={(data as any).patientWilayat || (data as any).patient_wilayat || '-'} />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Clinical & History */}
                        <div className="mb-6">
                            <SectionTitle>Section 2: Clinical & History</SectionTitle>
                            <div className="border border-slate-200 rounded divide-y divide-slate-200">
                                <Row label="Date of Onset"  value={onsetDate !== '-' ? new Date(onsetDate).toLocaleDateString() : '-'} />
                                <Row label="Symptoms"       value={symptomList} />
                                <Row label="Past Malaria Hx" value={pastMalaria} />
                                <Row label="Blood Transfusion (3 mo)" value={(data as any).bloodTransfusionWithinPast3Months || (data as any).blood_transfusion_within_past_3_months || '-'} />
                            </div>
                        </div>

                        {/* Section 3 & 4 side by side */}
                        <div className="grid grid-cols-2 gap-5 mb-6">
                            {/* Lab */}
                            <div>
                                <SectionTitle>Section 3: Lab Results</SectionTitle>
                                <div className="border border-slate-200 rounded divide-y divide-slate-200">
                                    <Row label="RDT Date"       value={rdtDate !== '-' ? new Date(rdtDate).toLocaleDateString() : '-'} />
                                    <Row label="Species"        value={speciesList} />
                                    <Row label="Density"        value={data.density || '-'} />
                                    <Row label="Stages"         value={stageList} />
                                    <Row label="Parasite Count" value={parasite} />
                                    <Row label="Relapse"        value={data.relapse || '-'} />
                                </div>
                            </div>
                            {/* Treatment & Outcome */}
                            <div>
                                <SectionTitle>Section 4: Treatment & Outcome</SectionTitle>
                                <div className="border border-slate-200 rounded divide-y divide-slate-200">
                                    <Row label="Treatment"      value={data.treatment || '-'} />
                                    <Row label="Treatment Dose" value={(data as any).treatmentDose || (data as any).treatment_dose || '-'} />
                                    <Row label="Primaquine"     value={(data as any).primaquine || '-'} />
                                    <Row label="Outcome"        value={data.outcome || '-'} />
                                    <Row label="Outcome Date"   value={outcomeDate !== '-' ? new Date(outcomeDate).toLocaleDateString() : '-'} />
                                    <Row label="Remarks"        value={data.remarks || '-'} />
                                </div>
                            </div>
                        </div>

                        {/* Declaration */}
                        <div className="border-t border-slate-300 pt-4 mt-4">
                            <h3 className="font-bold text-red-800 mb-2 text-sm uppercase">Declaration</h3>
                            <p className="text-sm text-slate-600">
                                This case has been notified as per Malaria disease surveillance and reporting guidelines.
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

export default MalariaView;
