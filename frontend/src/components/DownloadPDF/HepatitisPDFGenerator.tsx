import React from 'react';
import { Download } from 'lucide-react';

// Define the interface based on the Hepatitis data structure
interface HepatitisData {
    id: string | number;
    patientId: string;
    reportingDate: string;
    civilId: string;
    firstName: string;
    secondName: string;
    thirdName?: string;
    fourthName?: string;
    nationality: string;
    gender: string;
    age: string | number;
    term: string;
    governorate: string; // State
    wilayat: string; // Locality
    subLocality?: string;
    
    // Clinical Details
    symptoms: Array<{ name: string; value: string; duration: string }>;
    onsetOfSymptomsDate?: string;
    
    // Lab Investigation (Dynamic based on type)
    // Common fields or specific ones
    havIgM?: string;
    havPcr?: string;
    hbvIgM?: string;
    hbvPcr?: string;
    hcvIgM?: string;
    hcvPcr?: string;
    hevIgM?: string;
    hevPcr?: string;
    
    // Outcome
    alt?: string;
    ast?: string;
    outcome?: string;
    remarks?: string;

    // Type
    type?: 'HAV' | 'HBV' | 'HCV' | 'HEV';
    createdAt?: string;
}

interface HepatitisPDFGeneratorProps {
    data: HepatitisData;
    type: 'HAV' | 'HBV' | 'HCV' | 'HEV';
}

const HepatitisPDFGenerator: React.FC<HepatitisPDFGeneratorProps> = ({ data, type }) => {

    const generatePDF = async () => {
        try {
            const jsPDF = (await import('jspdf')).default;
            const html2canvas = (await import('html2canvas')).default;

            const pdfContent = createPDFContent(data, type);
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = pdfContent;
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.width = '210mm';
            tempDiv.style.padding = '20px';
            tempDiv.style.backgroundColor = '#ffffff';
            
            document.body.appendChild(tempDiv);

            const canvas = await html2canvas(tempDiv, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });

            document.body.removeChild(tempDiv);

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio);
            // Use normalized patient ID if available, else standard fallback
            const pId = data.patientId || (data as any).patient_id || 'Unknown';
            pdf.save(`Hepatitis_${type}_${pId}.pdf`);

        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF');
        }
    };

    const createPDFContent = (record: HepatitisData, type: string) => {
        // Normalize data to handle both camelCase (HEV) and snake_case (HAV/HBV/HCV)
        const r = record as any;
        const firstName = r.firstName || r.first_name || '';
        const secondName = r.secondName || r.second_name || '';
        const thirdName = r.thirdName || r.third_name || '';
        const fourthName = r.fourthName || r.fourth_name || '';
        const fullName = `${firstName} ${secondName} ${thirdName} ${fourthName}`.trim();
        
        const civilId = r.civilId || r.civil_id || '';
        const reportingDate = r.reportingDate || r.reporting_date;
        const nationality = r.nationality || '-';
        const gender = r.gender || '-';
        const age = r.age || '-';
        const term = r.term || '';
        const governorate = r.governorate || r.state || '-'; // Handle potential alias
        const wilayat = r.wilayat || r.locality || '-'; // Handle potential alias
        const subLocality = r.subLocality || r.sub_locality || '-';

        const generatedOn = new Date().toLocaleDateString('en-GB');
        
        // Helper to format date
        const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('en-GB') : '-';

        // Dynamic Lab Fields based on Type
        let labSection = '';
        if (type === 'HAV') {
            labSection = `
                <tr>
                    <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600; background-color: #f8fafc;">HAV IgM</td>
                    <td style="padding: 8px; border: 1px solid #e2e8f0;">${record.havIgM || '-'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600; background-color: #f8fafc;">HAV RNA PCR</td>
                    <td style="padding: 8px; border: 1px solid #e2e8f0;">${record.havPcr || '-'}</td>
                </tr>`;
        } else if (type === 'HBV') {
            labSection = `
                 <tr>
                    <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600; background-color: #f8fafc;">HBsAg</td>
                    <td style="padding: 8px; border: 1px solid #e2e8f0;">${r.hbsAg || '-'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600; background-color: #f8fafc;">HBV DNA PCR</td>
                    <td style="padding: 8px; border: 1px solid #e2e8f0;">${r.hbvPcr || '-'}</td>
                </tr>`;
        } else if (type === 'HCV') {
             labSection = `
                <tr>
                    <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600; background-color: #f8fafc;">Anti-HCV</td>
                    <td style="padding: 8px; border: 1px solid #e2e8f0;">${r.hcvAb || '-'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600; background-color: #f8fafc;">HCV RNA PCR</td>
                    <td style="padding: 8px; border: 1px solid #e2e8f0;">${r.hcvPcr || '-'}</td>
                </tr>`;
        } else if (type === 'HEV') {
             labSection = `
                <tr>
                    <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600; background-color: #f8fafc;">HEV IgM</td>
                    <td style="padding: 8px; border: 1px solid #e2e8f0;">${record.hevIgM || '-'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600; background-color: #f8fafc;">HEV RNA PCR</td>
                    <td style="padding: 8px; border: 1px solid #e2e8f0;">${record.hevPcr || '-'}</td>
                </tr>`;
        }

        const symptomsRows = record.symptoms && record.symptoms.length > 0 
            ? record.symptoms.map(s => `
                <tr>
                    <td style="padding: 8px; border: 1px solid #e2e8f0;">${s.name}</td>
                    <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; color: ${s.value === 'Yes' ? '#166534' : s.value === 'No' ? '#991b1b' : '#64748b'}; font-weight: ${s.value === 'Yes' ? 'bold' : 'normal'};">${s.value || '-'}</td>
                    <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">${s.duration || '-'}</td>
                </tr>
            `).join('')
            : '<tr><td colspan="3" style="padding: 8px; text-align: center;">No symptoms recorded</td></tr>';

        return `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; max-width: 800px; margin: 0 auto; background: white;">
                
                <!-- Title Header -->
                <div style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #1e3a8a; padding-bottom: 12px;">
                    <h1 style="color: #1e3a8a; font-size: 28px; font-weight: 700; text-transform: uppercase; margin: 0;">
                        HEPATITIS ${type.replace('H', '').replace('V', '')} (${type}) NOTIFICATION REPORT - SAMPLE
                    </h1>
                </div>

                <!-- Hospital Details -->
                <div style="margin-bottom: 24px;">
                     <h3 style="color: #1e3a8a; font-size: 16px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">
                        Hospital / Health Facility Details
                    </h3>
                    <table style="width: 100%; font-size: 15px; border-collapse: separate; border-spacing: 0;">
                        <tr>
                            <td style="padding: 4px 0; font-weight: 600; width: 180px;">Hospital Name:</td>
                            <td>Ibra Regional Hospital</td>
                        </tr>
                        <tr>
                            <td style="padding: 4px 0; font-weight: 600;">Department:</td>
                            <td>Internal Medicine</td>
                        </tr>
                        <tr>
                            <td style="padding: 4px 0; font-weight: 600;">Reporting Unit:</td>
                            <td>Communicable Disease Surveillance Unit</td>
                        </tr>
                        <tr>
                            <td style="padding: 4px 0; font-weight: 600;">Report Generated On:</td>
                            <td>${generatedOn}</td>
                        </tr>
                         <tr>
                            <td style="padding: 4px 0; font-weight: 600;">Report Reference No:</td>
                            <td>${type}-IRH-${new Date().getFullYear()}-${String(record.id).slice(-4)}</td>
                        </tr>
                    </table>
                </div>

                <!-- Section 1: Patient Information -->
                <div style="margin-bottom: 24px;">
                    <h3 style="background-color: #eff6ff; color: #1e3a8a; font-size: 16px; font-weight: 700; padding: 8px 12px; margin: 0 0 12px 0; border-left: 4px solid #1e3a8a;">
                        SECTION 1: PATIENT INFORMATION
                    </h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; background-color: #f1f5f9; font-weight: 600; width: 25%;">State</td>
                             <td style="padding: 8px; border: 1px solid #e2e8f0;">${governorate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; background-color: #f1f5f9; font-weight: 600;">Locality</td>
                             <td style="padding: 8px; border: 1px solid #e2e8f0;">${wilayat}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; background-color: #f1f5f9; font-weight: 600;">Sub-Locality</td>
                             <td style="padding: 8px; border: 1px solid #e2e8f0;">${subLocality}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; background-color: #f1f5f9; font-weight: 600;">Reporting Date</td>
                             <td style="padding: 8px; border: 1px solid #e2e8f0;">${formatDate(reportingDate)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; background-color: #f1f5f9; font-weight: 600;">National ID</td>
                             <td style="padding: 8px; border: 1px solid #e2e8f0;">${civilId}</td>
                        </tr>
                         <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; background-color: #f1f5f9; font-weight: 600;">Patient Name</td>
                             <td style="padding: 8px; border: 1px solid #e2e8f0;">${fullName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; background-color: #f1f5f9; font-weight: 600;">Nationality</td>
                             <td style="padding: 8px; border: 1px solid #e2e8f0;">${nationality}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; background-color: #f1f5f9; font-weight: 600;">Gender</td>
                             <td style="padding: 8px; border: 1px solid #e2e8f0;">${gender}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; background-color: #f1f5f9; font-weight: 600;">Age</td>
                             <td style="padding: 8px; border: 1px solid #e2e8f0;">${age} ${term}</td>
                        </tr>
                    </table>
                </div>

                <!-- Section 2: Clinical Details -->
                <div style="margin-bottom: 24px;">
                    <h3 style="background-color: #eff6ff; color: #1e3a8a; font-size: 16px; font-weight: 700; padding: 8px 12px; margin: 0 0 12px 0; border-left: 4px solid #1e3a8a;">
                        SECTION 2: CLINICAL DETAILS
                    </h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                        <thead>
                            <tr style="background-color: #f1f5f9;">
                                <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: left; font-weight: 600;">Symptoms and Duration</th>
                                <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: 600;">Present (Yes/No)</th>
                                <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: 600;">Duration (Days)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${symptomsRows}
                        </tbody>
                    </table>
                </div>

                <!-- Section 3 & 4 Grid -->
                <div style="display: flex; gap: 24px; margin-bottom: 24px;">
                    
                    <!-- Section 3: Lab Investigation -->
                    <div style="flex: 1;">
                        <h3 style="background-color: #eff6ff; color: #1e3a8a; font-size: 16px; font-weight: 700; padding: 8px 12px; margin: 0 0 12px 0; border-left: 4px solid #1e3a8a;">
                            SECTION 3: LAB INVESTIGATION
                        </h3>
                        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                            ${labSection}
                        </table>
                        
                        <div style="margin-top: 20px;">
                             <h4 style="background-color: #f1f5f9; padding: 6px; font-size: 15px; margin: 0 0 8px 0; color: #1e3a8a;">Final Outcome</h4>
                             <div style="font-size: 15px;">
                                <div style="margin-bottom: 4px;">
                                    <span style="display: inline-block; width: 16px; height: 16px; border: 1px solid #94a3b8; margin-right: 6px; vertical-align: text-bottom; text-align: center; line-height: 14px;">${record.outcome === 'Under Treatment' ? '✓' : ''}</span> Under Treatment
                                </div>
                                <div style="margin-bottom: 4px;">
                                     <span style="display: inline-block; width: 16px; height: 16px; border: 1px solid #94a3b8; margin-right: 6px; vertical-align: text-bottom; text-align: center; line-height: 14px;">${record.outcome === 'Recovered' ? '✓' : ''}</span> Recovered
                                </div>
                                <div style="margin-bottom: 4px;">
                                    <span style="display: inline-block; width: 16px; height: 16px; border: 1px solid #94a3b8; margin-right: 6px; vertical-align: text-bottom; text-align: center; line-height: 14px;">${record.outcome === 'Referred' ? '✓' : ''}</span> Referred
                                </div>
                                <div style="margin-bottom: 4px;">
                                    <span style="display: inline-block; width: 16px; height: 16px; border: 1px solid #94a3b8; margin-right: 6px; vertical-align: text-bottom; text-align: center; line-height: 14px;">${record.outcome === 'Died' || record.outcome === 'Deceased' ? '✓' : ''}</span> Deceased
                                </div>
                             </div>
                        </div>
                    </div>

                    <!-- Section 4: Classification & Outcome -->
                    <div style="flex: 1;">
                        <h3 style="background-color: #eff6ff; color: #1e3a8a; font-size: 16px; font-weight: 700; padding: 8px 12px; margin: 0 0 12px 0; border-left: 4px solid #1e3a8a;">
                            SECTION 4: CLASSIFICATION & OUTCOME
                        </h3>
                        
                        <div style="background-color: #e0e7ff; padding: 6px; font-weight: 600; font-size: 15px; color: #1e3a8a; border: 1px solid #c7d2fe;">Liver Function Tests</div>
                        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                            <thead>
                                <tr>
                                    <th style="padding: 6px; border: 1px solid #e2e8f0; background-color: #f8fafc; text-align: left;">Test</th>
                                    <th style="padding: 6px; border: 1px solid #e2e8f0; background-color: #f8fafc; text-align: center;">Value</th>
                                    <th style="padding: 6px; border: 1px solid #e2e8f0; background-color: #f8fafc; text-align: center;">Unit</th>
                                </tr>
                            </thead>
                             <tbody>
                                <tr>
                                    <td style="padding: 6px; border: 1px solid #e2e8f0;">ALT</td>
                                    <td style="padding: 6px; border: 1px solid #e2e8f0; text-align: center; font-weight: 600;">${record.alt || '-'}</td>
                                    <td style="padding: 6px; border: 1px solid #e2e8f0; text-align: center;">U/L</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px; border: 1px solid #e2e8f0;">AST</td>
                                    <td style="padding: 6px; border: 1px solid #e2e8f0; text-align: center; font-weight: 600;">${record.ast || '-'}</td>
                                    <td style="padding: 6px; border: 1px solid #e2e8f0; text-align: center;">U/L</td>
                                </tr>
                            </tbody>
                        </table>

                        <div style="margin-top: 16px;">
                            <h4 style="background-color: #f1f5f9; padding: 6px; font-size: 15px; margin: 0 0 4px 0; color: #1e3a8a;">Remarks</h4>
                            <div style="font-size: 14px; color: #475569; font-style: italic; min-height: 60px;">
                                ${record.remarks || 'No remarks.'}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="border-top: 1px solid #94a3b8; pt-4; margin-top: 32px;">
                    <p style="font-size: 14px; color: #64748b; margin-bottom: 24px;">
                        This case has been notified as per Hepatitis ${type.replace('H', '').replace('V', '')} (${type}) disease surveillance and reporting guidelines.
                    </p>
                    
                    <div style="display: flex; justify-content: space-between; font-size: 14px;">
                        <div style="width: 48%;">
                             <h4 style="color: #1e3a8a; font-weight: 700; margin-bottom: 8px;">AUTHORIZED BY:</h4>
                             <table style="width: 100%;">
                                <tr>
                                    <td style="padding-bottom: 4px;">Doctor / Reporting Officer Name:</td>
                                    <td style="font-weight: 600;">Dr. Mohammed Al-Busaidi</td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 4px;">Designation:</td>
                                    <td>Specialist - Internal Medicine</td>
                                </tr>
                                <tr>
                                    <td>Signature & Seal:</td>
                                    <td>(Digitally Signed)</td>
                                </tr>
                             </table>
                        </div>
                        <div style="width: 48%;">
                            <h4 style="color: #1e3a8a; font-weight: 700; margin-bottom: 8px;">SYSTEM DETAILS</h4>
                            <table style="width: 100%;">
                                 <tr>
                                    <td style="padding-bottom: 4px;">Entered By:</td>
                                    <td style="font-weight: 600;">Surveillance Nurse - A. Fatima</td>
                                </tr>
                                <tr>
                                    <td>Entry Date & Time:</td>
                                    <td>${record.createdAt ? new Date(record.createdAt).toLocaleString('en-GB') : generatedOn}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        `;
    };

    return (
        <button
            onClick={generatePDF}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Download PDF"
        >
            <Download className="h-4 w-4" />
        </button>
    );
};

export default HepatitisPDFGenerator;
