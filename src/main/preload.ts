import { ipcRenderer, contextBridge } from "electron";

const WINDOW_API = {
  getResources: () => ipcRenderer.invoke('get-resources'),
  getSystemConfigs: () => ipcRenderer.invoke('get-system-configs'),
  getPathFolderAssets: () => ipcRenderer.invoke('get-path-folder-assets'),
}

contextBridge.exposeInMainWorld('api', WINDOW_API);