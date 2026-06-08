import { create } from 'zustand';
import type { DEDevice } from '../api/devices';
import type { DECameraDetail } from '../api/devices';

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
