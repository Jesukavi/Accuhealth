import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Loader2, Droplets } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

interface HemorrhagicRecord {
  id: string;
  patientId?: string;
  civilId?: string;
  firstName?: string;
  secondName?: string;
  thirdName?: string;
  gender?: string;
  age?: string | number;
  dob?: string;
  nationality?: string;
  mobileNo?: string;
  maritalStatus?: string;
  patientGovernorate?: string;
  patientWilayat?: string;
  governorate?: string;
  wilayat?: string;
  institution?: string;
  reportingDate?: string;
  dateOfOnset?: string;
  classification?: string;
  hospitalType?: string;
  noOfMMGiven?: string | number;
  finalOutcome?: string;
  finalOutcomeDate?: string;
  remarks?: string;
  status?: string;
  createdAt?: string;
}

const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString() : '—';
const val = (v?: string | number | null) =>
  (v !== undefined && v !== null && v !== '') ? String(v) : '—';

const HemorrhagicView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<HemorrhagicRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/hemorrhagic/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const result = await res.json();
          setData(result.notification || result);
        } else {
          toast.error('Failed to fetch notification');
        }
      } catch {
        toast.error('Error loading data');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element || !data) return;
    try {
      await document.fonts.ready;
      const origStyle = element.style.cssText;
      element.style.width = '210mm';
      element.style.maxWidth = 'none';
      element.style.padding = '15mm';
      element.style.boxSizing = 'border-box';

      const canvas = await html2canvas(element, {
        scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff',
      });
      element.style.cssText = origStyle;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pw) / canvas.width;
      let left = imgH;
      let pos = 0;
      pdf.addImage(imgData, 'PNG', 0, pos, pw, imgH);
      left -= ph;
      while (left > 0) {
        pos = left - imgH;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, pos, pw, imgH);
        left -= ph;
      }
      pdf.save(`Hemorrhagic-${data.patientId || id}.pdf`);
      toast.success('PDF Downloaded Successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-red-600" />
    </div>
  );
  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-3">
        <Droplets className="w-12 h-12 text-slate-300 mx-auto" />
        <p className="text-slate-500 font-medium">Record not found</p>
      </div>
    </div>
  );

  const fullName = [data.firstName, data.secondName, data.thirdName].filter(Boolean).join(' ') || '—';
  const notifId = `HDS-${new Date(data.createdAt || Date.now()).getFullYear()}-${String(data.id).slice(-6).toUpperCase()}`;

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="grid grid-cols-[200px_1fr] border-b border-slate-200 last:border-0">
      <div className="bg-red-50 p-2 font-semibold text-slate-700 border-r border-slate-200 text-sm">{label}</div>
      <div className="p-2 text-sm text-slate-800">{value}</div>
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
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
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
            className="bg-white shadow-lg w-full max-w-[210mm] min-h-[297mm] mx-auto text-slate-900 leading-relaxed p-10"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-7 h-7 text-red-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wide mb-1">
                Hemorrhagic Disease (Measles / Rubella) Case Notification
              </h1>
              <p className="text-slate-500 text-sm">Communicable Disease Surveillance Unit</p>
              <div className="h-1 w-full bg-red-700 mt-3 mb-0.5 rounded" />
              <div className="h-0.5 w-full bg-red-400 rounded" />
            </div>

            {/* Notification Info */}
            <div className="mb-6 border border-slate-200 rounded">
              <div className="bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-t">
                Notification Details
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-200">
                <div className="divide-y divide-slate-200">
                  <Row label="Notification ID"  value={notifId} />
                  <Row label="Reporting Date"   value={fmtDate(data.reportingDate)} />
                  <Row label="Date of Onset"    value={fmtDate(data.dateOfOnset)} />
                </div>
                <div className="divide-y divide-slate-200">
                  <Row label="Governorate"      value={val(data.governorate)} />
                  <Row label="Wilayat"          value={val(data.wilayat)} />
                  <Row label="Institution"      value={val(data.institution)} />
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="mb-6">
              <SectionTitle>Section 1: Patient Information</SectionTitle>
              <div className="border border-slate-200 rounded divide-y divide-slate-200">
                <div className="grid grid-cols-2 divide-x divide-slate-200">
                  <Row label="Patient ID"        value={val(data.patientId)} />
                  <Row label="Civil ID"          value={val(data.civilId)} />
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-200">
                  <Row label="Full Name"         value={fullName} />
                  <Row label="Gender"            value={val(data.gender)} />
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-200">
                  <Row label="Date of Birth"     value={fmtDate(data.dob)} />
                  <Row label="Age"               value={val(data.age)} />
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-200">
                  <Row label="Nationality"       value={val(data.nationality)} />
                  <Row label="Marital Status"    value={val(data.maritalStatus)} />
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-200">
                  <Row label="Mobile No"         value={val(data.mobileNo)} />
                  <Row label="Patient Governorate" value={val(data.patientGovernorate)} />
                </div>
                <Row label="Patient Wilayat"     value={val(data.patientWilayat)} />
              </div>
            </div>

            {/* Clinical Details */}
            <div className="mb-6">
              <SectionTitle>Section 2: Clinical & Classification Details</SectionTitle>
              <div className="border border-slate-200 rounded divide-y divide-slate-200">
                <div className="grid grid-cols-2 divide-x divide-slate-200">
                  <Row label="Classification"    value={val(data.classification)} />
                  <Row label="Hospital Type"     value={val(data.hospitalType)} />
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-200">
                  <Row label="No. of MM Given"   value={val(data.noOfMMGiven)} />
                  <Row label="Status"            value={val(data.status)} />
                </div>
              </div>
            </div>

            {/* Outcome */}
            <div className="mb-6">
              <SectionTitle>Section 3: Outcome</SectionTitle>
              <div className="border border-slate-200 rounded divide-y divide-slate-200">
                <div className="grid grid-cols-2 divide-x divide-slate-200">
                  <Row label="Final Outcome"     value={val(data.finalOutcome)} />
                  <Row label="Final Outcome Date" value={fmtDate(data.finalOutcomeDate)} />
                </div>
              </div>
              {data.remarks && (
                <div className="mt-3 border border-slate-200 rounded">
                  <div className="bg-slate-100 px-3 py-2 font-semibold text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200">
                    Remarks
                  </div>
                  <div className="p-3 text-sm text-slate-600">{data.remarks}</div>
                </div>
              )}
            </div>

            {/* Declaration */}
            <div className="border-t border-slate-300 pt-4 mt-4">
              <h3 className="font-bold text-red-800 mb-2 text-sm uppercase">Declaration</h3>
              <p className="text-sm text-slate-600">
                This case has been notified in accordance with the Hemorrhagic Disease Surveillance guidelines.
                All information contained herein is strictly confidential and for official use only.
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

export default HemorrhagicView;
