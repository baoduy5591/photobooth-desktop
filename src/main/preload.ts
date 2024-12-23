import { ipcRenderer, contextBridge } from 'electron';

const WINDOW_API = {
  getResources: () => ipcRenderer.invoke('get-resources'),
  getClientSetting: () => ipcRenderer.invoke('get-client-setting'),
  getPathFolderAssets: () => ipcRenderer.invoke('get-assets-folder-path'),
  getPathFolderUserPhotos: () => ipcRenderer.invoke('get-user-photos-folder-path'),
  getOrderInfoById: (value: string) => ipcRenderer.invoke('get-order-info-by-id', value),
  getMachineConfigs: () => ipcRenderer.invoke('get-machine-configs'),
  getUserConvertedPhotos: () => ipcRenderer.invoke('get-user-converted-photos'),
  saveImage: (data: { imageBase64: string; modeFrame: string }) => ipcRenderer.invoke('save-image', data),
  saveImageFrameSticker: (imageBase64: string) => ipcRenderer.invoke('save-image-frame-sticker', imageBase64),
  deleteFiles: () => ipcRenderer.invoke('delete-files'),
  generateVideo: (data: GenerateVideoType) => ipcRenderer.invoke('generate-video', data),
  getQRCode: (orderId: string) => ipcRenderer.invoke('get-qr-code', orderId),
};

contextBridge.exposeInMainWorld('api', WINDOW_API);
