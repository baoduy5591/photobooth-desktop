import path from 'path';
import fs from 'fs';
import Loggers from './loggers';
import Paths from './paths';
import { app } from 'electron';
import { 
  CONST_CHILD_FOLDER_OF_BACKGROUND_IMAGES,
  CONST_CHILD_FOLDER_OF_STICKERS, 
  CONST_CHILD_FOLDER_OF_VIDEOS, 
  CONST_REL_PATH_BACKGROUND_IMAGES, 
  CONST_REL_PATH_FONTS, 
  CONST_REL_PATH_STICKERS, 
  CONST_REL_PATH_VIDEOS
} from '../libs/constants';

const loggers = new Loggers(true);
const { mainLogger } = loggers.getLoggers();


class Resources {
  pathFolderAssets: string;
  isDev: boolean;

  constructor() {
    this.pathFolderAssets = Paths.getFolderAssets();
    this.isDev = !app.isPackaged;
  }

  async getPathFiles(pathRel: string, extensions = ['.jpg', '.png', '.svg']) {
    try {
      const _path = path.join(this.pathFolderAssets, pathRel);
      const files = fs.readdirSync(_path);
      const filesFiltered = files.filter(file => {
        if (file.length !== 9) return false;

        return extensions.some((ext: string) => file.endsWith(ext));
      });

      const pathFiles = filesFiltered.map((file: string) => {
        if (this.isDev) {
          return path.join('assets', pathRel, file);
        } else {
          return path.join(_path, file); 
        }
      });

      return pathFiles;
    } catch (error) {
      mainLogger.error('@Resources.getFiles: ERROR = ', error);
      return false;
    }
  }

  async translateToDict(items: string[]) {
    const newData = items.map((item) => {
      const name = item.slice(-9);
      const isNew = name[4] === '1';
      return { name, relPath: item, isNew };
    })

    return newData;
  }

  async getHotStickers(items: string[]) {
    return items.filter(item => {
      const name = item.slice(-9);
      return name[3] === '1';
    })
  }

  async getStickers() {
    const listPromiseForGetPath = CONST_CHILD_FOLDER_OF_STICKERS.map(item => this.getPathFiles(path.join(CONST_REL_PATH_STICKERS, item)))
    const results = await Promise.all(listPromiseForGetPath);
    if (results.some(rs => !rs)) return false;

    const listPromiseForGetHotStickers = results.map(result => this.getHotStickers(result as string[]));
    const getHotStickers = await Promise.all(listPromiseForGetHotStickers);
    const hotStickers = getHotStickers.flat();
    const newResults = [hotStickers, ...results];
    const listPromiseForTranslate = newResults.map(result => this.translateToDict(result as string[]));
    const resultsTranslate = await Promise.all(listPromiseForTranslate);
    const [hot, birthday, flowers, heart, others] = resultsTranslate;
    return { hot, birthday, flowers, heart, others };
  }

  async getBackgroundImages() {
    const listPromiseBackgroundImages = CONST_CHILD_FOLDER_OF_BACKGROUND_IMAGES.map(item => this.getPathFiles(path.join(CONST_REL_PATH_BACKGROUND_IMAGES, item)));
    const resultsBackgroundImages = await Promise.all(listPromiseBackgroundImages);
    if (resultsBackgroundImages.some(rs => !rs)) return false;

    const listPromiseTranslate = resultsBackgroundImages.map(result => this.translateToDict(result as string[]));
    const resultsTranslate = await Promise.all(listPromiseTranslate);
    const [typeA, typeB, typeC] = resultsTranslate;
    return { typeA, typeB, typeC };
  }

  async getVideos() {
    const listPromiseVideos = CONST_CHILD_FOLDER_OF_VIDEOS.map(item => this.getPathFiles(path.join(CONST_REL_PATH_VIDEOS, item), ['.mp4']));
    const resultsVideos = await Promise.all(listPromiseVideos);
    if (resultsVideos.some(rs => !rs)) return false;

    const listPromiseTranslate = resultsVideos.map(result => this.translateToDict(result as string[]));
    const resultsTranslate = await Promise.all(listPromiseTranslate);
    const [loading, introduces] = resultsTranslate;
    return { loading, introduces };
  }



  async resources() {
    const results = await Promise.all([
      this.getBackgroundImages(),
      this.getStickers(),
      this.getVideos(),
    ]);
    if (results.some(rs => !rs)) return false;

    const [backgroundImages, stickers, videos] = results;

    return {
      backgroundImages,
      stickers,
      videos,
    }
  }
}

export default Resources;