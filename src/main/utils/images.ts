import fs from 'fs';

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
      console.error('@Images.saveImage: ERROR = ', error);
      return false;
    }
  }
}

export default Images;
