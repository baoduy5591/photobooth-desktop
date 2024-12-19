import { app, BrowserWindow, ipcMain } from 'electron';
import Resources from './utils/resources';
import Paths from './utils/paths';
import UserPhotos from './utils/userPhotos';
import path from 'path';
import { generateVideo } from './utils/video';
import Images from './utils/images';
import { CONST_FRAME_STICKER_IMAGE_NAME } from './libs/constants';
import { deleteFileAndFolder } from './libs/common';
import API from './utils/api';

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
  // mainWindow.webContents.openDevTools();

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
    warningAudio: 'audios/touch/00100.mp3',
  };
});

ipcMain.handle('get-order-info-by-id', async (event, value) => {
  const api = new API();
  const _getOrderInfoById = await api.getOrderInfoById(value);
  if (!_getOrderInfoById) return false;

  return _getOrderInfoById;
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
  const orderInfo = data.orderInfo;
  orderInfo['orderStatus'] = 'COMPLETED';
  delete orderInfo['imageSelectEffect'];
  delete orderInfo['imageSelectPhoto'];
  delete orderInfo['selectedPhotos'];
  const api = new API();
  const _saveImage = await api.saveImage(orderInfo);
  if (!_saveImage) return false;

  const rootPath = Paths.getFolderUserPhotos();
  const _deleteFileAndFolder = deleteFileAndFolder(rootPath);
  if (!_deleteFileAndFolder) return false;

  return true;
});

// save image frame + sticker
ipcMain.handle('save-image-frame-sticker', async (event, imageBase64) => {
  const pathFolderUserPhotos = Paths.getFolderUserPhotos();
  const imagePath = path.join(pathFolderUserPhotos, CONST_FRAME_STICKER_IMAGE_NAME);
  const base64Data = imageBase64.replace(/^data:image\/png;base64,/, '');
  const images = new Images(imagePath, base64Data);
  const _saveImage = images.saveImage();
  if (!_saveImage) return false;

  return true;
});

// ipcMain generateVideo
ipcMain.handle('generate-video', async (event, data) => {
  const _generateVideoToBase64 = generateVideo(data);
  if (!_generateVideoToBase64) return false;

  return _generateVideoToBase64;
});

ipcMain.handle('delete-files', async () => {
  const rootPath = Paths.getFolderUserPhotos();
  const _deleteFileAndFolder = deleteFileAndFolder(rootPath);
  if (!_deleteFileAndFolder) return false;

  return true;
});

ipcMain.handle('get-qr-code', async (event, orderId) => {
  const api = new API();
  const _getQrCodeByOrderId = await api.getQrCodeByOrderId(orderId);
  if (!_getQrCodeByOrderId) return false;

  return _getQrCodeByOrderId;
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
