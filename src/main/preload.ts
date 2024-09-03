import { ipcRenderer, contextBridge } from "electron";

const WINDOW_API = {
  getResources: () => ipcRenderer.invoke('get-resources'),
  getSystemConfigs: () => ipcRenderer.invoke('get-system-configs'),
  getResolution: () => ipcRenderer.invoke('get-resolution'),
}

contextBridge.exposeInMainWorld('api', WINDOW_API);