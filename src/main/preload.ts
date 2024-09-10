import { ipcRenderer, contextBridge } from "electron";

const WINDOW_API = {
  getResources: () => ipcRenderer.invoke('get-resources'),
  getSystemConfigs: () => ipcRenderer.invoke('get-system-configs'),
  getPathFolderAssets: () => ipcRenderer.invoke('get-path-folder-assets'),
  getOrderInfoById: (value: string) => ipcRenderer.invoke('get-order-info-by-id', value),
  getMachineConfigs: () => ipcRenderer.invoke('get-machine-configs'),
}

contextBridge.exposeInMainWorld('api', WINDOW_API);