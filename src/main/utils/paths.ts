import { app } from "electron";
import path from 'path';
import fs from 'fs';

class Paths {
  static getFolderAppData() {
    const _platform = process.platform;
    if (_platform === 'darwin') {
      return app.getPath('userData');
    } else if (_platform === 'win32') {
      return app.getPath('appData');
    } else {
      return '';
    }
  }

  static getFolderUserPhotosForRenderer() {
    const isPackaged = app.isPackaged;
    if (isPackaged) {
      const userPhotos = path.join(this.getFolderAppData(), 'userPhotos');
      if (!fs.existsSync(userPhotos)) {
        fs.mkdirSync(userPhotos);
      }
      
      return userPhotos;
    } else {
      return 'userPhotos/';
    }
  }

  static getFolderAssets() {
    const isPackaged = app.isPackaged;
    if (isPackaged) {
      return path.join(process.resourcesPath, 'assets');
    } else {
      return path.join(__dirname, '..', 'renderer', 'assets');
    }
  }

  static getFolderAssetsForRenderer() {
    const isPackaged = app.isPackaged;
    if (isPackaged) {
      return path.join(process.resourcesPath, 'assets/');
    } else {
      return 'assets/';
    }
  }
}

export default Paths;