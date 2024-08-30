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
      return path.join(process.resourcesPath, 'assets');
    } else {
      return path.join(__dirname, '..', 'renderer', 'assets');
    }
  }
}

export default Paths;