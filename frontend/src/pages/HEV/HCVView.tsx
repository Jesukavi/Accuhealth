import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

interface HCVNotification {
    id: number;
    patientId: string;
    firstName: string;
    secondName: string;
    thirdName: string;
    tribe: string;
    civilId: string;
    dob: string;
    sex: string;
    region: string;
    wilayat: string;
    village: string;
    contactNumber: string;
    reportingDate: string;
    onsetOfSymptomsDate: string;
    diagnosisDate: string;
    labResult: string;
    specimenType: string;
    outcome: string;
    finalOutcome: string;
    remarks: string;
    institution: string;
    reportingDistrict: string;
    createdBy: string;
    createdAt?: string;
}

const HCVView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<HCVNotification | null>(null);
    const [loading, setLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/hcv-notifications/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                } else {
                    toast.error('Failed to fetch HCV notification');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error loading data');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleDownloadPDF = async () => {
        const element = printRef.current;
        if (!element || !data) return;

        try {
            await document.fonts.ready;
            
            // Temporary style adjustments for PDF capture
            const originalStyle = element.style.cssText;
            element.style.width = '210mm';
            element.style.maxWidth = 'none';
            // Increase left padding for binding, decrease right to fill content
            element.style.paddingLeft = '25mm'; 
            element.style.paddingRight = '10mm';
            element.style.boxSizing = 'border-box';
            
            const canvas = await html2canvas(element, { 
                scale: 2, 
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 800 // Match approx A4 width
            });

            // Restore styles
            element.style.cssText = originalStyle;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`HCV-Notification-${data.patientId || 'report'}.pdf`);
            toast.success('PDF Downloaded');
        } catch (error) {
            console.error('PDF Error:', error);
            toast.error('Failed to generate PDF');
        }
    };

    const calculateAge = (dobString: string) => {
        if (!dobString) return '-';
        const dob = new Date(dobString);
        const diffMs = Date.now() - dob.getTime();
        const ageDate = new Date(diffMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970) + " Years";
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    );

    if (!data) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <p className="text-slate-500">Record not found</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 print:hidden">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <button 
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                </div>

                {/* Report Content - A4 Proportions */}
                <div className="overflow-auto flex justify-center">
                    <div 
                        ref={printRef} 
                        className="bg-white p-8 md:p-12 shadow-lg w-full max-w-[210mm] min-h-[297mm] mx-auto text-slate-900 text-sm leading-relaxed"
                        style={{ fontFamily: 'Arial, sans-serif' }}
                    >
                        {/* Report Header */}
                        <div className="text-center mb-6">
                            <h1 className="text-xl font-bold text-blue-800 uppercase mb-2">
                                Hepatitis C (HCV) Notification Report - Sample
                            </h1>
                            <div className="h-px w-full bg-slate-400"></div>
                        </div>

                        {/* Hospital / Health Facility Details */}
                        <div className="mb-6 pb-4 border-b border-slate-300">
                            <h2 className="font-bold text-blue-800 mb-3">Hospital / Health Facility Details</h2>
                            <div className="space-y-1 text-sm">
                                <div><span className="font-semibold text-blue-700">Hospital Name:</span> {data.institution || '-'}</div>
                                <div><span className="font-semibold text-blue-700">Department:</span> Internal Medicine</div>
                                <div><span className="font-semibold text-blue-700">Reporting Unit:</span> Communicable Disease Surveillance Unit</div>
                                <div><span className="font-semibold text-blue-700">Report Generated On:</span> {new Date().toLocaleDateString('en-GB')}</div>
                                <div><span className="font-semibold text-blue-700">Report Reference No:</span> {data.patientId || `HCV-IRH-${new Date().getFullYear()}-${data.id}`}</div>
                            </div>
                        </div>

                        {/* Section 1: Patient Information */}
                        <div className="mb-6">
                            <h2 className="bg-blue-800 text-white font-bold uppercase px-3 py-2 text-sm mb-0">
                                Section 1: Patient Information
                            </h2>
                            <table className="w-full border-collapse border border-slate-300 text-sm">
                                <tbody>
                                    <tr className="bg-slate-50">
                                        <td className="border border-slate-300 px-3 py-2 font-semibold text-blue-700 w-1/3">State</td>
                                        <td className="border border-slate-300 px-3 py-2">{data.region || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-3 py-2 font-semibold text-blue-700">Locality</td>
                                        <td className="border border-slate-300 px-3 py-2">{data.wilayat || '-'}</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="border border-slate-300 px-3 py-2 font-semibold text-blue-700">Sub-Locality</td>
                                        <td className="border border-slate-300 px-3 py-2">{data.village || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-3 py-2 font-semibold text-blue-700">Reporting Date</td>
                                        <td className="border border-slate-300 px-3 py-2">{data.reportingDate ? new Date(data.reportingDate).toLocaleDateString('en-GB') : '-'}</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="border border-slate-300 px-3 py-2 font-semibold text-blue-700">National ID</td>
                                        <td className="border border-slate-300 px-3 py-2">{data.civilId || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-3 py-2 font-semibold text-blue-700">Patient Name</td>
                                        <td className="border border-slate-300 px-3 py-2">{data.firstName} {data.secondName} {data.thirdName} {data.tribe}</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="border border-slate-300 px-3 py-2 font-semibold text-blue-700">Nationality</td>
                                        <td className="border border-slate-300 px-3 py-2">Omani</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-3 py-2 font-semibold text-blue-700">Gender</td>
                                        <td className="border border-slate-300 px-3 py-2">{data.sex || '-'}</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="border border-slate-300 px-3 py-2 font-semibold text-blue-700">Age</td>
                                        <td className="border border-slate-300 px-3 py-2">{calculateAge(data.dob)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Section 2: Clinical Details */}
                        <div className="mb-6">
                            <h2 className="bg-blue-800 text-white font-bold uppercase px-3 py-2 text-sm mb-0">
                                Section 2: Clinical Details
                            </h2>
                            <table className="w-full border-collapse border border-slate-300 text-sm">
                                <thead>
                                    <tr className="bg-slate-100">
                                        <th className="border border-slate-300 px-3 py-2 text-left font-semibold">Symptoms and Duration</th>
                                        <th className="border border-slate-300 px-3 py-2 text-center font-semibold">Present (Yes/No)</th>
                                        <th className="border border-slate-300 px-3 py-2 text-center font-semibold">Duration (Days)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-slate-300 px-3 py-2">Fever</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center text-green-600 font-semibold">Yes</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center">4</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-3 py-2">Jaundice</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center text-green-600 font-semibold">Yes</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center">3</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-3 py-2">Nausea / Vomiting</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center text-green-600 font-semibold">Yes</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center">2</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-3 py-2">Anorexia</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center text-green-600 font-semibold">Yes</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center">5</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-3 py-2">Abdominal Pain (RUQ)</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center text-green-600 font-semibold">Yes</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center">3</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-3 py-2">Pruritus</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center text-red-600 font-semibold">No</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-3 py-2">Pale Stools</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center text-red-600 font-semibold">No</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-3 py-2">Arthralgia / Myalgia</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center text-red-600 font-semibold">No</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-3 py-2">Diarrhea</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center text-red-600 font-semibold">No</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-slate-300 px-3 py-2">Fatigue / Malaise</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center text-green-600 font-semibold">Yes</td>
                                        <td className="border border-slate-300 px-3 py-2 text-center">6</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Sections 3 & 4: Side by Side */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* Section 3: Lab Investigation */}
                            <div>
                                <h2 className="bg-blue-800 text-white font-bold uppercase px-3 py-2 text-sm mb-0">
                                    Section 3: Lab Investigation
                                </h2>
                                <table className="w-full border-collapse border border-slate-300 text-sm mb-4">
                                    <tbody>
                                        <tr className="bg-slate-50">
                                            <td className="border border-slate-300 px-3 py-2 font-semibold text-blue-700">HCV Ab</td>
                                            <td className="border border-slate-300 px-3 py-2">{data.labResult || 'Positive'}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-slate-300 px-3 py-2 font-semibold text-blue-700">HCV RNA PCR</td>
                                            <td className="border border-slate-300 px-3 py-2">Detected</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="border border-slate-300 p-3">
                                    <h3 className="font-bold text-blue-800 mb-2 text-sm">Final Outcome</h3>
                                    <div className="space-y-1 text-sm">
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={data.finalOutcome === 'Under Treatment'} readOnly className="w-4 h-4" />
                                            <span>Under Treatment</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={data.finalOutcome === 'Recovered'} readOnly className="w-4 h-4" />
                                            <span>Recovered</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={data.finalOutcome === 'Referred'} readOnly className="w-4 h-4" />
                                            <span>Referred</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={data.finalOutcome === 'Deceased'} readOnly className="w-4 h-4" />
                                            <span>Deceased</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Classification & Outcome */}
                            <div>
                                <h2 className="bg-blue-800 text-white font-bold uppercase px-3 py-2 text-sm mb-0">
                                    Section 4: Classification & Outcome
                                </h2>
                                <div className="border border-slate-300 mb-4">
                                    <div className="bg-slate-100 px-3 py-2 font-semibold text-center border-b border-slate-300 text-sm">
                                        Liver Function Tests
                                    </div>
                                    <table className="w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-slate-50">
                                                <th className="border border-slate-300 px-2 py-1 text-center font-semibold">Test</th>
                                                <th className="border border-slate-300 px-2 py-1 text-center font-semibold">Value</th>
                                                <th className="border border-slate-300 px-2 py-1 text-center font-semibold">unit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-slate-300 px-2 py-1 text-center">ALT</td>
                                                <td className="border border-slate-300 px-2 py-1 text-center">685</td>
                                                <td className="border border-slate-300 px-2 py-1 text-center">U/L</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-slate-300 px-2 py-1 text-center">AST</td>
                                                <td className="border border-slate-300 px-2 py-1 text-center">512</td>
                                                <td className="border border-slate-300 px-2 py-1 text-center">U/L</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="border border-slate-300 p-3">
                                    <h3 className="font-bold text-blue-800 mb-2 text-sm">Remarks</h3>
                                    <p className="text-sm italic text-slate-700">
                                        {data.remarks || 'Patient diagnosed with Hepatitis C Infection. Treatment plan initiated. Patient advised for regular monitoring and follow-up.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Declaration */}
                        <div className="mb-6 pb-4 border-b border-slate-300">
                            <h3 className="font-bold text-blue-800 mb-2">DECLARATION</h3>
                            <p className="text-sm text-slate-700">
                                This case has been notified as per Hepatitis C (HCV) disease surveillance and reporting guidelines.
                            </p>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default HCVView;

