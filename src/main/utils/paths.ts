import { app } from "electron";
import path from 'path';

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

  static getFolderAssets() {
    const isPackaged = app.isPackaged;
    if (isPackaged) {
      return path.posix.join(process.resourcesPath, 'assets');
    } else {
      return path.posix.join(__dirname, '..', 'renderer', 'assets');
    }
  }

  static getFolderAssetsForRenderer() {
    const isPackaged = app.isPackaged;
    if (isPackaged) {
      return path.posix.join(process.resourcesPath, 'assets/');
    } else {
      return 'assets/';
    }
  }
}

export default Paths;