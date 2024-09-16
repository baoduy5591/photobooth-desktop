import fs from 'fs';

class Images {
    pathImage: string;
    imageBase64: string;

    constructor(pathImage: string, imageBase64: string) {
        this.pathImage = pathImage;
        this.imageBase64 = imageBase64;
    }

    saveImage() {
        try {
            fs.writeFileSync(this.pathImage, this.imageBase64, 'base64');
            return true;
          } catch (error) {
            console.error('@Images.saveImage: ERROR = ', error);
            return false;
          }
    }
}

export default Images;