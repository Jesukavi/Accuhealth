import { apiClient } from './config';
import type { TBScreeningFormData } from '../types';


export interface TBScreeningFilters {
  page?: number;
  limit?: number;
  governorate?: string;
  wilayat?: string;
  reportingInstitute?: string;
  notificationId?: string;
  reportingDateFrom?: string;
  reportingDateTo?: string;
  classification?: string;
  status?: string;
  finalOutcome?: string;
  finalOutcomeDateFrom?: string;
  finalOutcomeDateTo?: string;
  tbContact?: string;
  confirmedTB?: string;
  mode?: string;
  hospitalType?: string;
  includeGovernorate?: boolean;
  riskFactors?: string;
}

export const tbScreeningApi = {
  create: async (data: TBScreeningFormData) => {
    return apiClient('/tb/tb-screening', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async (filters?: TBScreeningFilters) => {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/tb?${queryString}` : '/tb';

    return apiClient(endpoint);
  },

  getById: async (id: string) => {
    return apiClient(`/tb-screening/${id}`);
  },

  update: async (id: string, data: Partial<TBScreeningFormData>) => {
    return apiClient(`/tb-screening/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiClient(`/tb-screening/${id}`, {
      method: 'DELETE',
    });
  },

  getFilterOptions: async () => {
    return apiClient('/tb');
  },
};
