import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const HBVView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/hbv-notifications/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const result = await response.json();
                    
                    // Parse symptoms if it's a string
                    if (result.symptoms && typeof result.symptoms === 'string') {
                        try {
                            result.symptoms = JSON.parse(result.symptoms);
                        } catch (e) {
                            console.error("Error parsing symptoms", e);
                            result.symptoms = [];
                        }
                    }
                    setData(result);
                } else {
                    toast.error('Failed to fetch details');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('Error loading data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleDownloadPDF = async () => {
        const element = printRef.current;
        if (!element) return;

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

            pdf.save(`HBV-Notification-${data?.patientId || 'report'}.pdf`);
            toast.success('PDF Downloaded Successfully');
        } catch (error) {
            console.error('PDF Error:', error);
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
            <p className="text-slate-500">Record not found</p>
        </div>
    );

    // Default symptoms list to ensure we show all even if data is missing/partial
    const defaultSymptoms = [
        'Fever', 'Jaundice', 'Nausea / Vomiting', 'Anorexia', 
        'Abdominal Pain (RUQ)', 'Pruritus', 'Pale Stools', 
        'Arthralgia / Myalgia', 'Diarrhea', 'Fatigue / Malaise'
    ];

    const getSymptomData = (name: string) => {
        if (!data.symptoms || !Array.isArray(data.symptoms)) return { value: '-', duration: '-' };
        const s = data.symptoms.find((item: any) => item.name === name);
        return s ? { value: s.value || 'No', duration: s.duration || '-' } : { value: 'No', duration: '-' };
    };

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
                                Hepatitis B (HBV) Notification Report
                            </h1>
                            <div className="h-1 w-full bg-blue-800 mt-2 mb-1"></div>
                            <div className="h-0.5 w-full bg-blue-800"></div>
                        </div>

                        {/* Facility Details */}
                        <div className="mb-6 space-y-1.5 border-b border-slate-200 pb-4">
                            <div className="font-bold text-blue-900 mb-2 uppercase text-xs tracking-wider">Hospital / Health Facility Details</div>
                            <div className="grid grid-cols-[160px_1fr] gap-2">
                                <span className="font-bold text-slate-700">Hospital Name:</span>
                                <span>{data.institution || 'Wait for API'}</span>
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
                                <span>{data.id ? `HBV-${new Date().getFullYear()}-${data.id.toString().slice(-4).toUpperCase()}` : '-'}</span>
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
                                    <div className="p-2">{data.governorate || '-'}</div>
                                </div>
                                <div className="grid grid-cols-[160px_1fr] border-b border-slate-300">
                                    <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">Locality</div>
                                    <div className="p-2">{data.wilayat || '-'}</div>
                                </div>
                                 <div className="grid grid-cols-[160px_1fr] border-b border-slate-300">
                                    <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">Sub-Locality</div>
                                    <div className="p-2">{data.subLocality || data.village || '-'}</div>
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
                                    <div className="p-2 uppercase">{data.firstName} {data.secondName} {data.thirdName} {data.fourthName}</div>
                                </div>
                                <div className="grid grid-cols-[160px_1fr] border-b border-slate-300">
                                    <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">Nationality</div>
                                    <div className="p-2">{data.nationality || '-'}</div>
                                </div>
                                <div className="grid grid-cols-[160px_1fr] border-b border-slate-300">
                                    <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">Gender</div>
                                    <div className="p-2">{data.gender || '-'}</div>
                                </div>
                                <div className="grid grid-cols-[160px_1fr]">
                                    <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">Age</div>
                                    <div className="p-2">{data.age} {data.term}</div>
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
                                    {defaultSymptoms.map((symptom, index) => {
                                        const { value, duration } = getSymptomData(symptom);
                                        return (
                                            <tr key={index} className="border-b border-slate-300 last:border-0">
                                                <td className="p-2 border-r border-slate-300">{symptom}</td>
                                                <td className={`p-2 text-center font-medium border-r border-slate-300 ${value === 'Yes' ? 'text-green-600' : 'text-red-600'}`}>{value}</td>
                                                <td className="p-2 text-center">{duration}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                            {/* Section 3: Lab Investigation */}
                             <div>
                                <h2 className="text-blue-900 font-bold uppercase mb-2 border-b border-blue-200 pb-1 text-sm">
                                    Section 3: Lab Investigation
                                </h2>
                                <div className="border border-slate-300">
                                    <div className="grid grid-cols-2 border-b border-slate-300">
                                        <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">HBV IgM</div>
                                        <div className="p-2">{data.hbvIgM || '-'}</div>
                                    </div>
                                    <div className="grid grid-cols-2 border-b border-slate-300">
                                        <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">HBV DNA PCR</div>
                                        <div className="p-2">{data.hbvPcr || '-'}</div>
                                    </div>
                                     <div className="grid grid-cols-2">
                                        <div className="bg-slate-100 p-2 font-bold text-slate-700 border-r border-slate-300">PCR Value</div>
                                        <div className="p-2">{data.hbvPcrValue || '-'}</div>
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
                                         <div className="p-1 border-r border-slate-300">{data.alt || '-'}</div>
                                         <div className="p-1 text-slate-500">U/L</div>
                                     </div>
                                     <div className="grid grid-cols-3 text-center">
                                         <div className="p-1 border-r border-slate-300 font-medium">AST</div>
                                         <div className="p-1 border-r border-slate-300">{data.ast || '-'}</div>
                                         <div className="p-1 text-slate-500">U/L</div>
                                     </div>
                                </div>

                                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                                    <div className="font-bold text-slate-700 mb-2 border-b border-slate-200 pb-1">Final Outcome</div>
                                    <div className="space-y-1">
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={true} readOnly className="rounded text-blue-600 focus:ring-0" />
                                            <span>Under Treatment</span>
                                        </label>
                                         <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={data.outcome === 'Recovered'} readOnly className="rounded text-blue-600 focus:ring-0" />
                                            <span>Recovered</span>
                                        </label>
                                         <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={data.outcome === 'Referred'} readOnly className="rounded text-blue-600 focus:ring-0" />
                                            <span>Referred</span>
                                        </label>
                                         <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={data.outcome === 'Died'} readOnly className="rounded text-blue-600 focus:ring-0" />
                                            <span>Deceased</span>
                                        </label>
                                    </div>
                                </div>
                             </div>
                        </div>

                         {/* Remarks Box */}
                         <div className="mb-6">
                            <div className="font-bold text-blue-900 mb-1 border-b border-blue-100 pb-1">Remarks</div>
                            <div className="bg-slate-50 border border-slate-200 p-3 rounded min-h-[60px] italic text-slate-700">
                                {data.remarks || 'No additional remarks.'}
                            </div>
                        </div>

                        {/* Declaration Footer */}
                        <div className="mt-8 pt-4 border-t border-slate-300">
                             <div className="font-bold text-slate-700 mb-2">DECLARATION</div>
                             <p className="text-slate-600 italic mb-8 text-xs">
                                 This case has been notified as per Hepatitis B (HBV) disease surveillance and reporting guidelines.
                             </p>


                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default HBVView;
