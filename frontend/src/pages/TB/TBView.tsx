import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Loader2, FileText } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

interface TBRecord {
    id: number;
    patient_id?: string;
    first_name?: string;
    second_name?: string;
    third_name?: string;
    civil_id?: string;
    dob?: string;
    age?: number | string;
    term?: string;
    gender?: string;
    nationality?: string;
    mobile_no?: string;
    marital_status?: string;
    education?: string;
    occupations?: string;
    place_of_work?: string;
    patient_governorate?: string;
    patient_wilayat?: string;
    village?: string;
    governorate?: string;
    wilayat?: string;
    institution?: string;
    reporting_date?: string;
    first_symptom?: string;
    onset_symptom?: string;
    diagnosed_date?: string;
    tb_treatment_date?: string;
    previous_tb?: string;
    family_tb?: string;
    contact_tb?: string;
    travel_history?: string;
    signs_symptoms?: string[];
    risk_factors?: string[];
    igra_date?: string;
    igra_result?: string;
    igra_remarks?: string;
    mantoux_date?: string;
    mantoux_reading?: string;
    mantoux_result?: string;
    hiv_date?: string;
    hiv_result?: string;
    lab_tests?: string[];
    radiology_tests?: string[];
    drug_sensitivity_tests?: string[];
    classification?: string;
    outcome?: string;
    outcome_date?: string;
    confirmed_tb?: string;
    final_outcome?: string;
    final_outcome_date?: string;
    created_at?: string;
}

const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString() : '-';
const val = (v?: string | number | null) => (v !== undefined && v !== null && v !== '') ? String(v) : '-';
const arrVal = (a?: string[]) => Array.isArray(a) && a.length > 0 ? a.join(', ') : '-';

const TBView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<TBRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/tb/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                } else {
                    toast.error('Failed to fetch TB notification');
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
            pdf.save(`TB-Notification-${data.patient_id || id}.pdf`);
            toast.success('PDF Downloaded Successfully');
        } catch (err) {
            console.error('PDF Error:', err);
            toast.error('Failed to generate PDF');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    );

    if (!data) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center space-y-3">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-medium">Record not found</p>
            </div>
        </div>
    );

    const fullName = [data.first_name, data.second_name, data.third_name].filter(Boolean).join(' ') || '-';
    const notifId = `TB-${new Date(data.created_at || Date.now()).getFullYear()}-${String(data.id).padStart(4, '0')}`;

    const Row = ({ label, value }: { label: string; value: string }) => (
        <div className="grid grid-cols-[190px_1fr] border-b border-slate-200 last:border-0">
            <div className="bg-slate-50 p-2 font-semibold text-slate-700 border-r border-slate-200 text-sm">{label}</div>
            <div className="p-2 text-sm">{value}</div>
        </div>
    );

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <h2 className="text-blue-900 font-bold uppercase mb-2 border-b-2 border-blue-200 pb-1 text-xs tracking-wider">{children}</h2>
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
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105"
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
                                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FileText className="w-7 h-7 text-blue-600" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wide mb-1">
                                Tuberculosis (TB) Case Notification Report
                            </h1>
                            <p className="text-slate-500 text-sm">Communicable Disease Surveillance Unit</p>
                            <div className="h-1 w-full bg-blue-700 mt-3 mb-0.5 rounded" />
                            <div className="h-0.5 w-full bg-blue-400 rounded" />
                        </div>

                        {/* Notification Details */}
                        <div className="mb-6 border border-slate-200 rounded">
                            <div className="bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-t">
                                Notification Details
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-slate-200">
                                <div className="divide-y divide-slate-200">
                                    <Row label="Notification ID"   value={notifId} />
                                    <Row label="Reporting Date"    value={fmtDate(data.reporting_date)} />
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
                                    <Row label="Patient ID"        value={val(data.patient_id)} />
                                    <Row label="Civil ID"          value={val(data.civil_id)} />
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
                                    <Row label="Marital Status"    value={val(data.marital_status)} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Mobile No"         value={val(data.mobile_no)} />
                                    <Row label="Education"         value={val(data.education)} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Occupation"        value={val(data.occupations)} />
                                    <Row label="Place of Work"     value={val(data.place_of_work)} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Patient Governorate" value={val(data.patient_governorate)} />
                                    <Row label="Patient Wilayat"   value={val(data.patient_wilayat)} />
                                </div>
                                <Row label="Village"               value={val(data.village)} />
                            </div>
                        </div>

                        {/* Section 2: Clinical Details */}
                        <div className="mb-6">
                            <SectionTitle>Section 2: Clinical Details</SectionTitle>
                            <div className="border border-slate-200 rounded divide-y divide-slate-200">
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="First Symptom"     value={val(data.first_symptom)} />
                                    <Row label="Onset of Symptom"  value={fmtDate(data.onset_symptom)} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Diagnosed Date"    value={fmtDate(data.diagnosed_date)} />
                                    <Row label="TB Treatment Date" value={fmtDate(data.tb_treatment_date)} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Previous TB"       value={val(data.previous_tb)} />
                                    <Row label="Family TB"         value={val(data.family_tb)} />
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-slate-200">
                                    <Row label="Contact TB"        value={val(data.contact_tb)} />
                                    <Row label="Travel History"    value={val(data.travel_history)} />
                                </div>
                                <Row label="Signs & Symptoms"      value={arrVal(data.signs_symptoms)} />
                                <Row label="Risk Factors"          value={arrVal(data.risk_factors)} />
                            </div>
                        </div>

                        {/* Section 3 & 4 side by side */}
                        <div className="grid grid-cols-2 gap-5 mb-6">
                            {/* Tests */}
                            <div>
                                <SectionTitle>Section 3: Tests & Results</SectionTitle>
                                <div className="border border-slate-200 rounded divide-y divide-slate-200">
                                    <Row label="IGRA Date"         value={fmtDate(data.igra_date)} />
                                    <Row label="IGRA Result"       value={val(data.igra_result)} />
                                    <Row label="IGRA Remarks"      value={val(data.igra_remarks)} />
                                    <Row label="Mantoux Date"      value={fmtDate(data.mantoux_date)} />
                                    <Row label="Mantoux Reading"   value={val(data.mantoux_reading)} />
                                    <Row label="Mantoux Result"    value={val(data.mantoux_result)} />
                                    <Row label="HIV Date"          value={fmtDate(data.hiv_date)} />
                                    <Row label="HIV Result"        value={val(data.hiv_result)} />
                                </div>
                            </div>
                            {/* Lab & Outcome */}
                            <div>
                                <SectionTitle>Section 4: Lab & Outcome</SectionTitle>
                                <div className="border border-slate-200 rounded divide-y divide-slate-200">
                                    <Row label="Lab Tests"         value={arrVal(data.lab_tests)} />
                                    <Row label="Radiology Tests"   value={arrVal(data.radiology_tests)} />
                                    <Row label="Drug Sensitivity"  value={arrVal(data.drug_sensitivity_tests)} />
                                    <Row label="Confirmed TB"      value={val(data.confirmed_tb)} />
                                    <Row label="Outcome"           value={val(data.outcome)} />
                                    <Row label="Outcome Date"      value={fmtDate(data.outcome_date)} />
                                    <Row label="Final Outcome"     value={val(data.final_outcome)} />
                                    <Row label="Final Outcome Date" value={fmtDate(data.final_outcome_date)} />
                                </div>
                            </div>
                        </div>

                        {/* Declaration */}
                        <div className="border-t border-slate-300 pt-4 mt-4">
                            <h3 className="font-bold text-blue-800 mb-2 text-sm uppercase">Declaration</h3>
                            <p className="text-sm text-slate-600">
                                This case has been notified as per Tuberculosis (TB) disease surveillance and reporting guidelines.
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

export default TBView;
