import Paths from './paths';
import fs from 'fs';

class UserPhotos {
  getPhotosResized() {
    const pathUserPhotos = Paths.getFolderUserPhotos();
    const listUserPhotos = fs.readdirSync(pathUserPhotos);
    const filterPhotos = listUserPhotos.filter((photo) => photo.endsWith('.jpg') && photo.startsWith('converted_'));
    return filterPhotos;
  }
}

export default UserPhotos;
