import { create } from 'zustand';
import type { DEDevice } from '../lib/api/devices';
import type { DECameraDetail } from '../lib/api/devices';

interface DeviceState {
  devices:      DEDevice[];
  cameras:      DECameraDetail[];
  setDevices:   (devices: DEDevice[]) => void;
  setCameras:   (cameras: DECameraDetail[]) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  devices:    [],
  cameras:    [],
  setDevices: (devices) => set({ devices }),
  setCameras: (cameras) => set({ cameras }),
}));
