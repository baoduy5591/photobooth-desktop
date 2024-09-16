import { app, BrowserWindow, ipcMain } from 'electron';
import Resources from './utils/resources';
import Paths from './utils/paths';
import UserPhotos from './utils/userPhotos';
import fs from 'fs';
import path from 'path';
import Images from './utils/images';

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

  // get configs machine
  ipcMain.handle('get-machine-configs', async () => {
    return {
      platform: process.platform,
    };
  });
};

// ipcMain get resources
ipcMain.handle('get-resources', async () => {
  const _resources = new Resources();
  const getResources = await _resources.resources();
  return getResources;
});

// get system configs (call api)
ipcMain.handle('get-system-configs', async () => {
  return {
    defaultLanguage: 'en',
    videoIntro: 'videos/introduces/00000.mp4',
    backgroundAudio: 'audios/backgrounds/00000.mp3',
    touchAudio: 'audios/touch/00000.mp3',
  };
});

ipcMain.handle('get-order-info-by-id', async (event, value) => {
  return {
    modeFrame: 'regular',
    typeFrame: 'typeF',
    frame: 'frames/regular/typeF/normal/00000.png',
  };
});

// get path folder assets
ipcMain.handle('get-path-folder-assets', () => {
  const pathFolderAssets = Paths.getFolderAssetsForRenderer();
  return pathFolderAssets;
});

// get path folder userPhotos
ipcMain.handle('get-path-folder-userPhotos', () => {
  const pathFolderUserPhotos = Paths.getFolderUserPhotosForRenderer();
  return pathFolderUserPhotos;
});

//
ipcMain.handle('get-user-resized-photos', () => {
  const userPhotos = new UserPhotos();
  const resizedPhotos = userPhotos.getPhotosResized();
  return resizedPhotos;
});

// save image
ipcMain.handle('save-image', async (event, data) => {
  // const pathImage = path.join(Paths.getFolderUserPhotos(), `print_${data.modeFrame}.jpg`)
  // const imageBase64 = data.imageBase64.replace(/^data:image\/png;base64,/, "");
  // const images = new Images(pathImage, imageBase64);
  // const saveImage = images.saveImage();
  return true;
  
});

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
