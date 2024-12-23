import { app } from 'electron';
import path from 'path';
import fs from 'fs';

class Paths {
  static getAppDataFolderPath() {
    const _platform = process.platform;
    if (_platform === 'darwin') {
      return app.getPath('userData');
    } else if (_platform === 'win32') {
      return app.getPath('appData');
    } else {
      return '';
    }
  }

  static getUserPhotosFolderPathForMain() {
    const isPackaged = app.isPackaged;
    if (isPackaged) {
      return path.join(this.getAppDataFolderPath(), 'photo-booth', 'userPhotos');
    } else {
      return path.join(__dirname, '..', 'renderer', 'userPhotos');
    }
  }

  static getUserPhotosFolderPathForRenderer() {
    const isPackaged = app.isPackaged;
    if (isPackaged) {
      const userPhotos = path.join(this.getAppDataFolderPath(), 'photo-booth', 'userPhotos/');
      if (!fs.existsSync(userPhotos)) {
        fs.mkdirSync(userPhotos);
      }

      return userPhotos;
    } else {
      return 'userPhotos/';
    }
  }

  static getFolderExternal() {
    const isPackaged = app.isPackaged;
    if (isPackaged) {
      return path.join(process.resourcesPath, 'external');
    } else {
      return path.join(__dirname, '..', '..', 'src', 'main', 'external');
    }
  }

  static getAssetsFolderPathForMain() {
    const isPackaged = app.isPackaged;
    if (isPackaged) {
      return process.resourcesPath;
    } else {
      return path.join(__dirname, '..', 'renderer');
    }
  }

  static getAssetsFolderPathForRenderer() {
    const isPackaged = app.isPackaged;
    if (isPackaged) {
      return process.resourcesPath;
    } else {
      return '';
    }
  }
}

export default Paths;
