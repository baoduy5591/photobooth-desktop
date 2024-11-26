import { app, BrowserWindow, ipcMain } from 'electron';
import Resources from './utils/resources';
import Paths from './utils/paths';
import UserPhotos from './utils/userPhotos';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { generateVideo } from './utils/video';
import Images from './utils/images';
import { CONST_FRAME_STICKER_IMAGE_NAME } from './libs/constants';

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
  try {
    const response = await axios.get(`http://localhost:3001/api/clientOrders/start/${value}`);
    if (!response || response.status !== 200) return false;

    return response.data;
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
    const orderInfo = data.orderInfo;
    orderInfo['orderStatus'] = 'COMPLETED';
    // orderInfo['videoBase64']
    delete orderInfo['imageSelectEffect'];
    delete orderInfo['imageSelectPhoto'];
    delete orderInfo['selectedPhotos'];
    const response = await axios.post('http://localhost:3001/api/clientOrders/endOrder', orderInfo, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response || response.status !== 200) return false;

    // delete all file not folder
    const files = fs.readdirSync(Paths.getFolderUserPhotos());
    files.forEach((file) => {
      fs.unlinkSync(path.join(Paths.getFolderUserPhotos(), file));
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
});

// save image frame + sticker
ipcMain.handle('save-image-frame-sticker', async (event, imageBase64) => {
  try {
    const pathFolderUserPhotos = Paths.getFolderUserPhotos();
    const imagePath = path.join(pathFolderUserPhotos, CONST_FRAME_STICKER_IMAGE_NAME);
    const base64Data = imageBase64.replace(/^data:image\/png;base64,/, '');
    const images = new Images(imagePath, base64Data);
    const saveImage = images.saveImage();
    if (!saveImage) return false;

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
});

// ipcMain generateVideo
ipcMain.handle('generate-video', async (event, data) => {
  const _generateVideoToBase64 = generateVideo(data);
  if (!_generateVideoToBase64) return false;

  // Chuyển đổi base64 thành nhị phân
  const videoBuffer = Buffer.from(_generateVideoToBase64, 'base64');

  // Định nghĩa đường dẫn và tên tệp mp4
  const pathFolderUserPhotos = Paths.getFolderUserPhotos();
  const videoPath = path.join(pathFolderUserPhotos, 'output_video11111.mp4');

  // Ghi tệp video
  fs.writeFile(videoPath, videoBuffer, (err) => {
    if (err) {
      console.error('Lỗi khi ghi video:', err);
      return false;
    }
    console.log('Video đã được lưu tại:', videoPath);
  });
  return _generateVideoToBase64;
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

ipcMain.handle('get-qr-code', async (event, orderId) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/clientOrders/createQR/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response || response.status !== 200) return false;

    return response.data.qrCode;
  } catch (error) {
    console.error('[api-get-qr]: ERROR = ', error);
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
