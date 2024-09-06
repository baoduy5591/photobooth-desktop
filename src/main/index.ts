import { app, BrowserWindow, ipcMain } from 'electron';
import Resources from './utils/resources';
import Paths from './utils/paths';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// ipcMain get resources
ipcMain.handle('get-resources', async () => {
  const _resources = new Resources();
  const getResources = await _resources.resources();
  return getResources;
});

// get system configs (call api)
ipcMain.handle('get-system-configs', async() => {
  return { 
    defaultLanguage: 'en',
    backgroundImageTypeA: 'backgroundImages/typeA/00000.png',
    backgroundImageTypeB: 'backgroundImages/typeB/00000.png',
    videoIntro: 'videos/introduces/00000.mp4'
  };
});

// get path folder assets
ipcMain.handle('get-path-folder-assets', () => {
  const pathFolderAssets = Paths.getFolderAssetsForRenderer();
  return pathFolderAssets;
} )

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
