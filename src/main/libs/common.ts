import Loggers from '../utils/loggers';
import path from 'path';
import fs from 'fs';
import Paths from '../utils/paths';

const logger = new Loggers();
const { mainLogger } = logger.getLoggers();

export const deleteFileAndFolder = (rootPath: string) => {
  try {
    const files = fs.readdirSync(Paths.getUserPhotosFolderPathForMain());
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(rootPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        fs.unlinkSync(filePath);
      } else {
        fs.rmSync(filePath, { recursive: true, force: true });
      }
    }

    return true;
  } catch (error) {
    mainLogger.error('[deleteFileAndFolder]: ERROR = ', error);
    return false;
  }
};
