export interface TBNotificationFormData {
  // Notification Info
  governorate: string;
  wilayat: string;
  institution: string;
  reportingDate: string;

  // Patient Info
  patientId: string;
  civilId: string;
  expiryDate: string;
  dob: string;
  age: string;
  term: string;
  passportNo: string;
  nationality: string;
  firstName: string;
  secondName: string;
  thirdName: string;
  gender: string;
  tribe: string;
  sheikhName: string;
  mobileNo: string;
  nextOfKinMobile: string;
  maritalStatus: string;
  education: string;
  workStatus: string;
  occupations: string;
  placeOfWork: string;
  monthlyIncome: string;
  patientGovernorate: string;
  patientWilayat: string;
  village: string;
  latitude: string;
  longitude: string;

  // Clinical Details
  firstSymptom: string;
  onsetSymptom: string;
  diagnosedDate: string;
  tbTreatmentDate: string;
  patientReferred: string;
  previousTB: string;
  familyTB: string;
  contactTB: string;
  travelHistory: string;
  signsSymptoms: string[];
  riskFactors: string[];

  // Tests & Results
  igraDate: string;
  igraResult: string;
  igraRemarks: string;
  mantouxDate: string;
  mantouxReading: string;
  mantouxResult: string;
  mantouxRemarks: string;
  hivDate: string;
  hivResult: string;
  hivRemarks: string;

  // Lab Investigation
  labTests: any[];
  radiologyTests: any[];
  drugSensitivityTests: any[];

  // Classification & Outcome
  classification: string;
  outcome: string;
  outcomeDate: string;
  confirmedTB: string;
  finalOutcome: string;
  finalOutcomeDate: string;
  attachments: File[];
}

export interface HEVNotificationFormData {
  // Notification Info
  governorate: string;
  wilayat: string;
  institution: string;
  reportingDate: string;

  // Patient Info
  patientId: string;
  civilId: string;
  expiryDate: string;
  dob: string;
  age: string;
  term: string;
  passportNo: string;
  nationality: string;
  firstName: string;
  secondName: string;
  thirdName: string;
  fourthName: string;
  gender: string;
  tribe: string;
  sheikhName: string;
  mobileNo: string;
  nextOfKinMobile: string;

  // Address
  patientGovernorate: string;
  patientWilayat: string;
  village: string;
  subLocality: string;

  // Clinical
  symptoms: {
    name: string;
    value: string; // Yes/No
    duration: string;
  }[];

  // Lab / HEV Testing
  hevIgM: string;
  hevIgG: string;
  hevPcr: string;
  hevPcrValue: string;

  // Classification
  alt: string;
  ast: string;

  // Outcome
  outcome: string;
  remarks: string;
  onsetOfSymptomsDate: string;
  // New fields for pregnancy
  isPregnant?: string; // 'Yes' or 'No'
  pregnancyDuration?: string;
}