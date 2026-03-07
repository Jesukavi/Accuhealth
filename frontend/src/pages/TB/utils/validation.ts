import type { TBNotificationFormData, ValidationError } from '../types';

export const validateStep = (
  step: number,
  formData: TBNotificationFormData
): ValidationError[] => {
  const errors: ValidationError[] = [];

  switch (step) {
    case 0:
      if (!formData.patientId?.trim()) {
        errors.push({ field: 'patientId', message: 'Patient ID is required' });
      }
      if (!formData.dob) {
        errors.push({ field: 'dob', message: 'Date of Birth is required' });
      }
      if (!formData.nationality) {
        errors.push({ field: 'nationality', message: 'Nationality is required' });
      }
      if (!formData.firstName?.trim()) {
        errors.push({ field: 'firstName', message: 'First Name is required' });
      }
      if (!formData.gender) {
        errors.push({ field: 'gender', message: 'Gender is required' });
      }
      if (!formData.occupations) {
        errors.push({ field: 'occupations', message: 'Occupation is required' });
      }
      if (!formData.placeOfWork?.trim()) {
        errors.push({ field: 'placeOfWork', message: 'Place of work is required' });
      }
      if (!formData.patientGovernorate) {
        errors.push({ field: 'patientGovernorate', message: 'Governorate is required' });
      }
      if (!formData.patientWilayat) {
        errors.push({ field: 'patientWilayat', message: 'Wilayat is required' });
      }
      if (!formData.village) {
        errors.push({ field: 'village', message: 'Village is required' });
      }
      break;

    case 1:
      if (!formData.firstSymptom) {
        errors.push({ field: 'firstSymptom', message: 'First symptom is required' });
      }
      if (!formData.onsetSymptom) {
        errors.push({ field: 'onsetSymptom', message: 'Onset of first symptom is required' });
      }
      break;

    case 4:
      if (!formData.classification) {
        errors.push({ field: 'classification', message: 'Classification is required' });
      }
      if (!formData.outcome) {
        errors.push({ field: 'outcome', message: 'Outcome is required' });
      }
      if (!formData.outcomeDate) {
        errors.push({ field: 'outcomeDate', message: 'Outcome date is required' });
      }
      if (!formData.confirmedTB) {
        errors.push({ field: 'confirmedTB', message: 'Confirmed case of TB is required' });
      }
      break;
  }

  return errors;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phone.length >= 8 && phoneRegex.test(phone);
};

export const validateDate = (date: string): boolean => {
  if (!date) return false;
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};
