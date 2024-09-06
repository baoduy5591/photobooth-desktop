import path from 'path';
import fs from 'fs';
import Loggers from './loggers';
import Paths from './paths';
import { 
  CONST_CHILD_FOLDER_OF_AUDIOS,
  CONST_CHILD_FOLDER_OF_STICKERS, 
  CONST_CHILD_FOLDER_OF_VIDEOS, 
  CONST_REL_PATH_AUDIOS, 
  CONST_REL_PATH_BACKGROUND_IMAGES, 
  CONST_REL_PATH_ICONS, 
  CONST_REL_PATH_STICKERS, 
  CONST_REL_PATH_VIDEOS
} from '../libs/constants';

const loggers = new Loggers(true);
const { mainLogger } = loggers.getLoggers();


class Resources {
  pathFolderAssets: string;

  constructor() {
    this.pathFolderAssets = Paths.getFolderAssets();
  }

  async getRelPathFiles(relPath: string, extensions = ['.jpg', '.png', '.svg']) {
    try {
      const _path = path.join(this.pathFolderAssets, relPath);
      const files = fs.readdirSync(_path);
      const filesFiltered = files.filter(file => {
        if (file.length !== 9) return false;

        return extensions.some((ext: string) => file.endsWith(ext));
      });

      const pathFiles = filesFiltered.map((file: string) => {
        return path.join(relPath, file);
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
    const listPromiseForGetPath = CONST_CHILD_FOLDER_OF_STICKERS.map(item => this.getRelPathFiles(path.join(CONST_REL_PATH_STICKERS, item)))
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
    const results = await this.getRelPathFiles(CONST_REL_PATH_BACKGROUND_IMAGES);
    if (!results) return false;

    const resultsTranslate = await this.translateToDict(results);
    return resultsTranslate;
  }

  async getVideos() {
    const listPromiseVideos = CONST_CHILD_FOLDER_OF_VIDEOS.map(item => this.getRelPathFiles(path.join(CONST_REL_PATH_VIDEOS, item), ['.mp4']));
    const resultsVideos = await Promise.all(listPromiseVideos);
    if (resultsVideos.some(rs => !rs)) return false;

    const listPromiseTranslate = resultsVideos.map(result => this.translateToDict(result as string[]));
    const resultsTranslate = await Promise.all(listPromiseTranslate);
    const [loading, introduces] = resultsTranslate;
    return { loading, introduces };
  }

  async getIcons() {
    const results = await this.getRelPathFiles(CONST_REL_PATH_ICONS);
    if (!results) return false;

    const resultsTranslate = await this.translateToDict(results);
    return resultsTranslate;
  }

  async getAudios() {
    const listPromiseAudios = CONST_CHILD_FOLDER_OF_AUDIOS.map(item => this.getRelPathFiles(path.join(CONST_REL_PATH_AUDIOS, item), ['.mp3']));
    const resultsAudios = await Promise.all(listPromiseAudios);
    if (resultsAudios.some(rs => !rs)) return false;

    const listPromiseTranslate = resultsAudios.map(result => this.translateToDict(result as string[]));
    const resultsTranslate = await Promise.all(listPromiseTranslate);
    const [backgrounds, touch] = resultsTranslate;
    return { backgrounds, touch };
  }

  async resources() {
    const results = await Promise.all([
      this.getBackgroundImages(),
      this.getStickers(),
      this.getVideos(),
      this.getIcons(),
      this.getAudios()
    ]);
    if (results.some(rs => !rs)) return false;

    const [backgroundImages, stickers, videos, icons, audios] = results;

    return {
      backgroundImages,
      stickers,
      videos,
      icons,
      audios
    }
  }
}

export default Resources;