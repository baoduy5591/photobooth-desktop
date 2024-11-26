import { ipcRenderer, contextBridge } from 'electron';

const WINDOW_API = {
  getResources: () => ipcRenderer.invoke('get-resources'),
  getSystemConfigs: () => ipcRenderer.invoke('get-system-configs'),
  getPathFolderAssets: () => ipcRenderer.invoke('get-path-folder-assets'),
  getPathFolderUserPhotos: () => ipcRenderer.invoke('get-path-folder-userPhotos'),
  getOrderInfoById: (value: string) => ipcRenderer.invoke('get-order-info-by-id', value),
  getMachineConfigs: () => ipcRenderer.invoke('get-machine-configs'),
  getUserResizedPhotos: () => ipcRenderer.invoke('get-user-resized-photos'),
  saveImage: (data: { imageBase64: string; modeFrame: string }) => ipcRenderer.invoke('save-image', data),
  saveImageFrameSticker: (imageBase64: string) => ipcRenderer.invoke('save-image-frame-sticker', imageBase64),
  deleteFiles: () => ipcRenderer.invoke('delete-files'),
  generateVideo: (data: GenerateVideoType) => ipcRenderer.invoke('generate-video', data),
};

contextBridge.exposeInMainWorld('api', WINDOW_API);
