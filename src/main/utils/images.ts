import fs from 'fs';
import Loggers from './loggers';

const logger = new Loggers();
const { mainLogger } = logger.getLoggers();

class Images {
  imagePath: string;
  imageBase64: string;

  constructor(imagePath: string, imageBase64: string) {
    this.imagePath = imagePath;
    this.imageBase64 = imageBase64;
  }

  saveImage() {
    try {
      fs.writeFileSync(this.imagePath, this.imageBase64, 'base64');
      return true;
    } catch (error) {
      mainLogger.error('@Images.saveImage: ERROR = ', error);
      return false;
    }
  }
}

export default Images;
