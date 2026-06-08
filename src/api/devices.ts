import { deGet } from './client';

export interface DEDevice {
  _id: string;
  name: string;
  industry_id: string;
  camera_id?: string;
  status: 'active' | 'inactive';
}

export interface DECameraDetail {
  camera_id: string;
  camera_name: string;
}

export function getDevices(params?: { industry_id?: string; company_id?: string }) {
  return deGet<DEDevice[]>('/api/v1/devices/', { params });
}

export function getDeviceById(id: string) {
  return deGet<DEDevice>(`/api/v1/devices/${id}`);
}

export function getCameraDetailsByIndustry(params: { industry_id: string }) {
  return deGet<DECameraDetail[]>('/api/v1/devices/camera-details/by-industry', { params });
}

export function getPackerDetails(params?: { industry_id?: string }) {
  return deGet<DEDevice[]>('/api/v1/devices/packer-details', { params });
}
