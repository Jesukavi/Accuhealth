import e from "cors";

export interface TBNotificationFormData {
  governorate: string;
  wilayat: string;
  institution: string;
  reportingDate: string;
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
  labTests: unknown[];
  radiologyTests: unknown[];
  drugSensitivityTests: unknown[];
  classification: string;
  outcome: string;
  outcomeDate: string;
  confirmedTB: string;
  finalOutcome: string;
  finalOutcomeDate: string;
  attachments: File[];
}

export interface TBScreeningFormData {
  governorate: string;
  wilayat: string;
  institution: string;
  reportingDate: string;
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
  mantouxDate: string;
  mantouxReading: string;
  mantouxResult: string;
  mantouxRemarks: string;
  labTests: any[];
  radiologyTests: any[];
  screeningOutcome: string;
  screeningRemarks: string;
  screeningType: string;
}

export interface TBListingSearchData {
  governorate: string;
  wilayat: string;
  reportingInstitute: string;
  notificationId: string;
  reportingDateFrom: string;
  reportingDateTo: string;
  classification: string;
  status: string;
  finalOutcome: string;
  finalOutcomeDateFrom: string;
  finalOutcomeDateTo: string;
  tbContact: string;
  confirmedTB: string;
  mode: string;
  hospitalType: string;
  includeGovernorate: boolean;
  riskFactors: string;
}

export interface ReferralListingSearchData {
  fromGovernorate: string;
  fromWilayat: string;
  reportingFromInstitute: string;
  followUpGovernorate: string;
  followUpWilayat: string;
  followUpInstitute: string;
  reportingDateFrom: string;
  reportingDateTo: string;
  notificationId: string;
  patientName: string;
  notificationType: string;
  civilNo: string;
  gsmNo: string;
}


export interface ValidationError {
  field: string;
  message: string;
}
