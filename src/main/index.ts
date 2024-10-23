import { app, BrowserWindow, ipcMain } from 'electron';
import Resources from './utils/resources';
import Paths from './utils/paths';
import UserPhotos from './utils/userPhotos';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

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
    warningAudio: 'audios/touch/00100.mp3',
  };
});

ipcMain.handle('get-order-info-by-id', async (event, value) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/clientOrders/${value}`);
    return response.data.order;

    // _id: '66ffa0acc15de955d43cbe19',
    //   printCount: 4,
    //   grayScale: false,
    //   frameType: 'typeA',
    //   grayscaleBase64: '',
    //   colorBase64: '',
    //   frameMode: 'cutting',
    //   framePrice: 80000,
    //   frameStyle: 'normal',
    //   frameOrder: 0,
    //   quantityShootingPhotos: 6,
    //   quantitySelectedPhotos: 4,
    //   width: 1200,
    //   height: 1800,
    //   ratio: 1.5,
    //   frameRelPath: '',
    //   orderNumber: '123456',
    //   createdAt: '2024-10-04T08:00:44.930Z',
    //   updatedAt: '2024-10-04T08:00:44.930Z',
    //   __v: 0
  } catch (error) {
    console.log('ERROR = ', error);
    return false;
  }
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
  try {
    const imageBase64 = data.imageBase64;
    const orderInfo = data.orderInfo;
    orderInfo['colorBase64'] = imageBase64;
    orderInfo['orderStatus'] = 'COMPLETED';
    delete orderInfo['imageSelectEffect'];
    delete orderInfo['imageSelectPhoto'];
    delete orderInfo['selectedPhotos'];
    const response = await axios.post('http://localhost:3001/api/clientOrders/update', orderInfo, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // delete all file not folder
    const files = fs.readdirSync(Paths.getFolderUserPhotos());
    files.forEach((file) => {
      fs.unlinkSync(path.join(Paths.getFolderUserPhotos(), file));
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
});

ipcMain.handle('delete-files', async (event) => {
  try {
    const files = fs.readdirSync(Paths.getFolderUserPhotos());
    files.forEach((file) => {
      fs.unlinkSync(path.join(Paths.getFolderUserPhotos(), file));
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
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
