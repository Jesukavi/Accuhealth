import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

interface HAVNotification {
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

const HAVView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<HAVNotification | null>(null);
    const [loading, setLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/hav-notifications/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                } else {
                    toast.error('Failed to fetch HAV notification');
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
            element.style.padding = '15mm';
            element.style.boxSizing = 'border-box';
            
            const canvas = await html2canvas(element, { 
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            // Restore styles
            element.style.cssText = originalStyle;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Calculate dimensions for multi-page
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            // Add additional pages if content exceeds one page
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`HAV-Notification-${data.patientId || 'report'}.pdf`);
            toast.success('PDF Downloaded Successfully');
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
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                        <Download className="w-5 h-5" />
                        Download PDF
                    </button>
                </div>

                {/* Report Content - A4 Proportions */}
                <div className="overflow-auto flex justify-center">
                    <div 
                        ref={printRef} 
                        className="bg-white p-8 md:p-12 shadow-lg w-full max-w-[210mm] min-h-[297mm] mx-auto text-slate-900 text-base leading-relaxed"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                        {/* Report Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wide mb-2">
                                Hepatitis A (HAV) Notification Report
                            </h1>
                            <div className="h-1 w-full bg-blue-800 mt-2 mb-1"></div>
                            <div className="h-0.5 w-full bg-blue-800"></div>
                        </div>

                        {/* Facility Details */}
                        <div className="mb-6 space-y-1.5 border-b border-slate-200 pb-4">
                            <div className="font-bold text-blue-900 mb-2 uppercase text-xs tracking-wider">Hospital / Health Facility Details</div>
                            <div className="grid grid-cols-[160px_1fr] gap-2">
                                <span className="font-bold text-slate-700">Hospital Name:</span>
                                <span>{data.institution || '-'}</span>
                            </div>
                            <div className="grid grid-cols-[160px_1fr] gap-2">
                                <span className="font-bold text-slate-700">Department:</span>
                                <span>Internal Medicine</span>
                            </div>
                            <div className="grid grid-cols-[160px_1fr] gap-2">
                                <span className="font-bold text-slate-700">Reporting Unit:</span>
                                <span>Communicable Disease Surveillance Unit</span>
                            </div>
                             <div className="grid grid-cols-[160px_1fr] gap-2">
                                <span className="font-bold text-slate-700">Report Generated On:</span>
                                <span>{new Date().toLocaleDateString()}</span>
                            </div>
                             <div className="grid grid-cols-[160px_1fr] gap-2">
                                <span className="font-bold text-slate-700">Report Reference No:</span>
                                <span>{data.id ? `HAV-${new Date().getFullYear()}-${data.id.toString().padStart(4, '0')}` : '-'}</span>
                            </div>
                        </div>

                        {/* Section 1: Patient Information */}
                        <div className="mb-6">
                            <h2 className="text-blue-900 font-bold uppercase mb-2 border-b border-blue-200 pb-1 text-sm">
                                Section 1: Patient Information
                            </h2>
                            <div className="border border-slate-300">
                                <div className="grid grid-cols-[160px_1fr] border-b border-slate-300">
                                    <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">State</div>
                                    <div className="p-2">{data.region || '-'}</div>
                                </div>
                                <div className="grid grid-cols-[160px_1fr] border-b border-slate-300">
                                    <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">Locality</div>
                                    <div className="p-2">{data.wilayat || '-'}</div>
                                </div>
                                 <div className="grid grid-cols-[160px_1fr] border-b border-slate-300">
                                    <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">Sub-Locality</div>
                                    <div className="p-2">{data.village || '-'}</div>
                                </div>
                                <div className="grid grid-cols-[160px_1fr] border-b border-slate-300">
                                    <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">Reporting Date</div>
                                    <div className="p-2">{data.reportingDate ? new Date(data.reportingDate).toLocaleDateString() : '-'}</div>
                                </div>
                                <div className="grid grid-cols-[160px_1fr] border-b border-slate-300">
                                    <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">National ID</div>
                                    <div className="p-2 font-mono">{data.civilId || '-'}</div>
                                </div>
                                <div className="grid grid-cols-[160px_1fr] border-b border-slate-300">
                                    <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">Patient Name</div>
                                    <div className="p-2 uppercase">{data.firstName} {data.secondName} {data.thirdName} {data.tribe}</div>
                                </div>
                                <div className="grid grid-cols-[160px_1fr] border-b border-slate-300">
                                    <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">Nationality</div>
                                    <div className="p-2">Omani</div>
                                </div>
                                <div className="grid grid-cols-[160px_1fr] border-b border-slate-300">
                                    <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">Gender</div>
                                    <div className="p-2">{data.sex || '-'}</div>
                                </div>
                                <div className="grid grid-cols-[160px_1fr]">
                                    <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">Age</div>
                                    <div className="p-2">{calculateAge(data.dob)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Clinical Details */}
                        <div className="mb-6">
                             <h2 className="text-blue-900 font-bold uppercase mb-2 border-b border-blue-200 pb-1 text-sm">
                                Section 2: Clinical Details
                            </h2>
                            <table className="w-full border border-slate-300 text-sm">
                                <thead>
                                    <tr className="bg-slate-100 border-b border-slate-300">
                                        <th className="p-2 text-left font-bold text-slate-700 border-r border-slate-300">Symptoms and Duration</th>
                                        <th className="p-2 text-center font-bold text-slate-700 border-r border-slate-300">Present (Yes/No)</th>
                                        <th className="p-2 text-center font-bold text-slate-700">Duration (Days)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-slate-300">
                                        <td className="p-2 border-r border-slate-300">Fever</td>
                                        <td className="p-2 text-center text-green-600 font-medium border-r border-slate-300">Yes</td>
                                        <td className="p-2 text-center">4</td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="p-2 border-r border-slate-300">Jaundice</td>
                                        <td className="p-2 text-center text-green-600 font-medium border-r border-slate-300">Yes</td>
                                        <td className="p-2 text-center">3</td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="p-2 border-r border-slate-300">Nausea / Vomiting</td>
                                        <td className="p-2 text-center text-green-600 font-medium border-r border-slate-300">Yes</td>
                                        <td className="p-2 text-center">2</td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="p-2 border-r border-slate-300">Anorexia</td>
                                        <td className="p-2 text-center text-green-600 font-medium border-r border-slate-300">Yes</td>
                                        <td className="p-2 text-center">5</td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="p-2 border-r border-slate-300">Abdominal Pain (RUQ)</td>
                                        <td className="p-2 text-center text-green-600 font-medium border-r border-slate-300">Yes</td>
                                        <td className="p-2 text-center">3</td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="p-2 border-r border-slate-300">Pruritus</td>
                                        <td className="p-2 text-center text-red-600 font-medium border-r border-slate-300">No</td>
                                        <td className="p-2 text-center">-</td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="p-2 border-r border-slate-300">Pale Stools</td>
                                        <td className="p-2 text-center text-red-600 font-medium border-r border-slate-300">No</td>
                                        <td className="p-2 text-center">-</td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="p-2 border-r border-slate-300">Arthralgia / Myalgia</td>
                                        <td className="p-2 text-center text-red-600 font-medium border-r border-slate-300">No</td>
                                        <td className="p-2 text-center">-</td>
                                    </tr>
                                    <tr className="border-b border-slate-300">
                                        <td className="p-2 border-r border-slate-300">Diarrhea</td>
                                        <td className="p-2 text-center text-red-600 font-medium border-r border-slate-300">No</td>
                                        <td className="p-2 text-center">-</td>
                                    </tr>
                                    <tr className="last:border-0">
                                        <td className="p-2 border-r border-slate-300">Fatigue / Malaise</td>
                                        <td className="p-2 text-center text-green-600 font-medium border-r border-slate-300">Yes</td>
                                        <td className="p-2 text-center">6</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Sections 3 & 4: Side by Side */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* Section 3: Lab Investigation */}
                            <div>
                                <h2 className="text-blue-900 font-bold uppercase mb-2 border-b border-blue-200 pb-1 text-sm">
                                    Section 3: Lab Investigation
                                </h2>
                                <div className="border border-slate-300 mb-4">
                                    <div className="grid grid-cols-2 border-b border-slate-300">
                                        <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">HAV IgM</div>
                                        <div className="p-2">{data.labResult || 'Positive'}</div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">HAV RNA PCR</div>
                                        <div className="p-2">Negative</div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                                    <div className="font-bold text-slate-700 mb-2 border-b border-slate-200 pb-1">Final Outcome</div>
                                    <div className="space-y-1">
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={data.finalOutcome === 'Under Treatment'} readOnly className="rounded text-blue-600 focus:ring-0" />
                                            <span>Under Treatment</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={data.finalOutcome === 'Recovered'} readOnly className="rounded text-blue-600 focus:ring-0" />
                                            <span>Recovered</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={data.finalOutcome === 'Referred'} readOnly className="rounded text-blue-600 focus:ring-0" />
                                            <span>Referred</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={data.finalOutcome === 'Deceased'} readOnly className="rounded text-blue-600 focus:ring-0" />
                                            <span>Deceased</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Classification & Outcome */}
                            <div>
                                <h2 className="text-blue-900 font-bold uppercase mb-2 border-b border-blue-200 pb-1 text-sm">
                                    Section 4: Classification & Outcome
                                </h2>
                                <div className="border border-slate-300 mb-4">
                                    <div className="bg-slate-100 p-2 font-bold text-slate-700 border-b border-slate-300 text-center">Liver Function Tests</div>
                                    <div className="grid grid-cols-3 border-b border-slate-300 bg-slate-50 font-bold text-slate-700 text-center text-xs">
                                        <div className="p-1 border-r border-slate-300">Test</div>
                                        <div className="p-1 border-r border-slate-300">Value</div>
                                        <div className="p-1">Unit</div>
                                    </div>
                                    <div className="grid grid-cols-3 border-b border-slate-300 text-center">
                                        <div className="p-1 border-r border-slate-300 font-medium">ALT</div>
                                        <div className="p-1 border-r border-slate-300">685</div>
                                        <div className="p-1 text-slate-500">U/L</div>
                                    </div>
                                    <div className="grid grid-cols-3 text-center">
                                        <div className="p-1 border-r border-slate-300 font-medium">AST</div>
                                        <div className="p-1 border-r border-slate-300">512</div>
                                        <div className="p-1 text-slate-500">U/L</div>
                                    </div>
                                </div>

                                <div className="border border-slate-300 p-3">
                                    <h3 className="font-bold text-slate-700 mb-2">Remarks</h3>
                                    <p className="text-sm italic text-slate-700">
                                        {data.remarks || 'Patient diagnosed with acute Hepatitis A Infection. Supportive treatment initiated. Patient advised rest, hydration, and follow-up LFT monitoring.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Declaration */}
                        <div className="mb-6 pb-4 border-b border-slate-300">
                            <h3 className="font-bold text-blue-800 mb-2">DECLARATION</h3>
                            <p className="text-sm text-slate-700">
                                This case has been notified as per Hepatitis A (HAV) disease surveillance and reporting guidelines.
                            </p>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default HAVView;
