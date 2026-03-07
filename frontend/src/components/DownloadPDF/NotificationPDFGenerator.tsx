import React from 'react';
import { Download } from 'lucide-react';
import logo from '../../public/acchu_logo.png'

interface NotificationData {
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


interface NotificationPDFGeneratorProps {
  notification: NotificationData;
  onDownload?: () => void;
}


const NotificationPDFGenerator: React.FC<NotificationPDFGeneratorProps> = ({ 
  notification, 
  onDownload 
}) => {
    console.log('Notification Data:', notification); // Debugging line
  const generatePDF = async () => {
    try {
      // Dynamically import jsPDF and html2canvas
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;

        const getStatus = () => {
      if (notification.outcome === 'cured') return 'saved';
      if (notification.outcome === 'died') return 'rejected';
      return 'pending';
    };

      

      // Create the PDF content
      const pdfContent = createPDFContent(notification);
      
      // Create a temporary div to render the content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = pdfContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '210mm'; // A4 width
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '12px';
      tempDiv.style.lineHeight = '1.4';
      tempDiv.style.color = '#000';
      tempDiv.style.backgroundColor = '#fff';
      
      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Remove temporary div
      document.body.removeChild(tempDiv);

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Download the PDF
      pdf.save(`Malaria_Notification_${notification.id}.pdf`);
      
      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const notificationId = `MLR-${notification.id.toString().padStart(6, '0')}`;

  const createPDFContent = (data: NotificationData): string => {
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    return `
      <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <!-- Header -->
        <div style="display: flex; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 20px;">
         
          
          <img src={logo} alt="AccuHealth Logo" style={{ maxWidth: '60px', maxHeight: '60px' }} />

       
          <div style="flex: 1;">
            <h1 style="color: #1e40af; font-size: 28px; font-weight: bold; margin: 0;">ACCUHEALTH</h1>
            <h2 style="color: #1e40af; font-size: 18px; font-weight: bold; margin: 5px 0;">MALARIA NOTIFICATION REPORT</h2>
            <p style="color: #666; font-size: 14px; margin: 0;">(For Confirmed Cases Only)</p>
          </div>
        </div>

        <!-- Report Info -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <strong>Report Generated:</strong> ${currentDate}
          </div>
          <div>
            <strong>Notification ID:</strong> ${notificationId || 'N/A'}
          </div>
        </div>

        <!-- 1. Patient Information -->
        <div style="margin-bottom: 25px;">
          <h3 style="background: #1e40af; color: white; padding: 10px; margin: 0 0 15px 0; font-size: 16px;">1. PATIENT INFORMATION</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold; width: 20%;">Patient ID</td>
              <td style="border: 1px solid #ddd; padding: 8px; width: 30%;">${data.patient_id || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold; width: 20%;">Full Name</td>
              <td style="border: 1px solid #ddd; padding: 8px; width: 30%;">${(data.first_name || '') + (data.second_name ? ' ' + data.second_name : '') || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Civil ID</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.id || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Passport No.</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.passport_no || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Age</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.age || 'N/A'} Years</td>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Gender</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.gender === 'M' ? 'Male' : data.gender === 'F' ? 'Female' : 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Nationality</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.nationality || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Marital Status</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.marital_status || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Education</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.education || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Place of Work</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.place_of_work || 'N/A'}</td>
            </tr>
          </table>
        </div>

        <!-- 2. Notification Details -->
        <div style="margin-bottom: 25px;">
          <h3 style="background: #1e40af; color: white; padding: 10px; margin: 0 0 15px 0; font-size: 16px;">2. NOTIFICATION DETAILS</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold; width: 20%;">Reporting Date</td>
              <td style="border: 1px solid #ddd; padding: 8px; width: 30%;">${data.reporting_date || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold; width: 20%;">Species Identified</td>
              <td style="border: 1px solid #ddd; padding: 8px; width: 30%;">${data.species || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Date of Onset</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.date_of_onset || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Parasite Density</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.density || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Symptoms</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.symptoms || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Parasite Stages</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.stages || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Past History of Malaria</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.past_history_of_malaria || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Relapse</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.relapse || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold; vertical-align: top;">Remarks</td>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px;">${data.remarks || data.other_remarks || 'N/A'}</td>
            </tr>
          </table>
        </div>

        <!-- 3. Lab Results -->
        <div style="margin-bottom: 25px;">
          <h3 style="background: #1e40af; color: white; padding: 10px; margin: 0 0 15px 0; font-size: 16px;">3. LAB RESULTS</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold; width: 20%;">Lab Report Date</td>
              <td style="border: 1px solid #ddd; padding: 8px; width: 30%;">${data.rdt_reported_date || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold; width: 20%;">Parasite Density</td>
              <td style="border: 1px solid #ddd; padding: 8px; width: 30%;">${data.density || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Treatment</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.treatment || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Count</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.parasite_count || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Treatment Start</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.treatment_start_date || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Outcome Date</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.outcome_date || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Dose</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.treatment_dose || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Outcome</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.outcome || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold;">Primaquine Given</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${data.primaquine || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold; vertical-align: middle; text-align: center;" rowspan="1">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6, #1e40af); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold;">A+</div>
              </td>
            </tr>
          </table>
        </div>

        <!-- 4. Attachments -->
        <div style="margin-bottom: 25px;">
          <h3 style="background: #1e40af; color: white; padding: 10px; margin: 0 0 15px 0; font-size: 16px;">4. ATTACHMENTS</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Lab result report (if available)</li>
            <li>Blood smear report (if available)</li>
          </ul>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <p style="margin: 0; font-size: 12px; color: #666;">© AccuHealth-Surveillance System – All Rights Reserved.</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 12px; color: #666;">${currentDate}</p>
            
          </div>
        </div>
      </div>
    `;
  };

  return (
    <button
      onClick={generatePDF}
      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
      title="Download PDF Report"
    >
      <Download className="h-4 w-4" />
    </button>
  );
};

export default NotificationPDFGenerator;