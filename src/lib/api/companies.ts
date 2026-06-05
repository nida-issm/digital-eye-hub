import { deGet } from './client';

export interface DECompany {
  _id: string;
  name: string;
  industries?: Array<{
    _id: string;
    industry_name: string;
    industry_status: 'active' | 'inactive';
  }>;
}

export function getCompanies(params?: { search?: string }) {
  return deGet<DECompany[]>('/api/v1/companies/', { params });
}

export function getCompanyById(id: string) {
  return deGet<DECompany>(`/api/v1/companies/${id}`);
}
