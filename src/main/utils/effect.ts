import path from 'path';
import Paths from './paths';
import { CONST_FFMPEG_NAME } from '../libs/constants';
import { execSync } from 'child_process';

class Effect {
  constructor() {}

  lut3D() {
    const ffmpegPath = path.join(Paths.getExternalFolderPath(), CONST_FFMPEG_NAME);
    const lutFile = path.join(Paths.getExternalFolderPath(), 'lutFiles', 'MagicHour.cube');
    const inputFile = path.join(Paths.getExternalFolderPath(), 'converted_photo_001.jpg');
    const outputFile = path.join(Paths.getExternalFolderPath(), 'lut.jpg');
    const ffmpegCommand = `"${ffmpegPath}" -i "${inputFile}" -vf lut3d="${lutFile}" -q:v 1 -map_metadata 0 "${outputFile}"`;
    try {
      const _lut3D = execSync(ffmpegCommand);
    } catch (error) {
      return false;
    }
  }
}

export default Effect;
