import path from 'path';
import fs from 'fs';
import Loggers from './loggers';
import Paths from './paths';
import {
  CONST_CHILD_FOLDER_OF_AUDIOS,
  CONST_CHILD_FOLDER_OF_FRAMES_TYPE,
  CONST_CHILD_FOLDER_OF_STICKERS,
  CONST_CHILD_FOLDER_OF_VIDEOS,
  CONST_REL_PATH_AUDIOS,
  CONST_REL_PATH_BACKGROUND_IMAGES,
  CONST_REL_PATH_FRAMES_CUTTING_TYPE_A,
  CONST_REL_PATH_FRAMES_CUTTING_TYPE_B,
  CONST_REL_PATH_FRAMES_CUTTING_TYPE_C,
  CONST_REL_PATH_FRAMES_REGULAR_TYPE_A,
  CONST_REL_PATH_FRAMES_REGULAR_TYPE_B,
  CONST_REL_PATH_FRAMES_REGULAR_TYPE_C,
  CONST_REL_PATH_FRAMES_REGULAR_TYPE_D,
  CONST_REL_PATH_FRAMES_REGULAR_TYPE_E,
  CONST_REL_PATH_FRAMES_REGULAR_TYPE_F,
  CONST_REL_PATH_ICONS,
  CONST_REL_PATH_STICKERS,
  CONST_REL_PATH_VIDEOS,
} from '../libs/constants';

const loggers = new Loggers(true);
const { mainLogger } = loggers.getLoggers();

class Resources {
  assetsFolderPath: string;

  constructor() {
    this.assetsFolderPath = Paths.getAssetsFolderPathForMain();
  }

  async getRelPathFiles(relPath: string, extensions = ['.jpg', '.png', '.svg']) {
    try {
      const _path = path.join(this.assetsFolderPath, relPath);
      const files = fs.readdirSync(_path);
      const filesFiltered = files.filter((file) => {
        if (file.length !== 9 && file.length !== 15) return false;

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
      if (!item.includes('_thumb')) {
        const name = item.slice(-9);
        const ext = name.slice(-4);
        const path = item.slice(0, -9);
        const isNew = name['4'] === '1';
        let thumb = path + name.slice(0, -4) + '_thumb' + ext;
        const order = Number(name.slice(0, 3));
        if (!items.includes(thumb)) {
          thumb = '';
        }

        return { name, relPath: item, isNew, thumb, order };
      }

      return null;
    });

    return newData.filter((data) => data !== null);
  }

  async getHotStickers(items: string[]) {
    return items.filter((item) => {
      const name = item.slice(-9);
      return name[3] === '1';
    });
  }

  async getStickers() {
    const listPromiseForGetPath = CONST_CHILD_FOLDER_OF_STICKERS.map((item) =>
      this.getRelPathFiles(path.join(CONST_REL_PATH_STICKERS, item)),
    );
    const results = await Promise.all(listPromiseForGetPath);
    if (results.some((rs) => !rs)) return false;

    const listPromiseForGetHotStickers = results.map((result) => this.getHotStickers(result as string[]));
    const getHotStickers = await Promise.all(listPromiseForGetHotStickers);
    const hotStickers = getHotStickers.flat();
    const newResults = [hotStickers, ...results];
    const listPromiseForTranslate = newResults.map((result) => this.translateToDict(result as string[]));
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
    const listPromiseVideos = CONST_CHILD_FOLDER_OF_VIDEOS.map((item) =>
      this.getRelPathFiles(path.join(CONST_REL_PATH_VIDEOS, item), ['.mp4']),
    );
    const resultsVideos = await Promise.all(listPromiseVideos);
    if (resultsVideos.some((rs) => !rs)) return false;

    const listPromiseTranslate = resultsVideos.map((result) => this.translateToDict(result as string[]));
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
    const listPromiseAudios = CONST_CHILD_FOLDER_OF_AUDIOS.map((item) =>
      this.getRelPathFiles(path.join(CONST_REL_PATH_AUDIOS, item), ['.mp3']),
    );
    const resultsAudios = await Promise.all(listPromiseAudios);
    if (resultsAudios.some((rs) => !rs)) return false;

    const listPromiseTranslate = resultsAudios.map((result) => this.translateToDict(result as string[]));
    const resultsTranslate = await Promise.all(listPromiseTranslate);
    const [backgrounds, touch] = resultsTranslate;
    return { backgrounds, touch };
  }

  async getFramesByType(relPath: string, childPaths: string[]) {
    const listPromiseFrames = childPaths.map((item) => this.getRelPathFiles(path.join(relPath, item)));
    const resultsFrames = await Promise.all(listPromiseFrames);
    if (resultsFrames.some((rs) => !rs)) return false;

    const listPromiseTranslate = resultsFrames.map((result) => this.translateToDict(result as string[]));
    const resultsTranslate = await Promise.all(listPromiseTranslate);
    const [normal, season, special] = resultsTranslate;
    return { normal, season, special };
  }

  async resources() {
    const results = await Promise.all([
      this.getBackgroundImages(),
      this.getStickers(),
      this.getVideos(),
      this.getIcons(),
      this.getAudios(),
      this.getFramesByType(CONST_REL_PATH_FRAMES_CUTTING_TYPE_A, CONST_CHILD_FOLDER_OF_FRAMES_TYPE),
      this.getFramesByType(CONST_REL_PATH_FRAMES_CUTTING_TYPE_B, CONST_CHILD_FOLDER_OF_FRAMES_TYPE),
      this.getFramesByType(CONST_REL_PATH_FRAMES_CUTTING_TYPE_C, CONST_CHILD_FOLDER_OF_FRAMES_TYPE),
      this.getFramesByType(CONST_REL_PATH_FRAMES_REGULAR_TYPE_A, CONST_CHILD_FOLDER_OF_FRAMES_TYPE),
      this.getFramesByType(CONST_REL_PATH_FRAMES_REGULAR_TYPE_B, CONST_CHILD_FOLDER_OF_FRAMES_TYPE),
      this.getFramesByType(CONST_REL_PATH_FRAMES_REGULAR_TYPE_C, CONST_CHILD_FOLDER_OF_FRAMES_TYPE),
      this.getFramesByType(CONST_REL_PATH_FRAMES_REGULAR_TYPE_D, CONST_CHILD_FOLDER_OF_FRAMES_TYPE),
      this.getFramesByType(CONST_REL_PATH_FRAMES_REGULAR_TYPE_E, CONST_CHILD_FOLDER_OF_FRAMES_TYPE),
      this.getFramesByType(CONST_REL_PATH_FRAMES_REGULAR_TYPE_F, CONST_CHILD_FOLDER_OF_FRAMES_TYPE),
      this.getFramesByType(CONST_REL_PATH_FRAMES_CUTTING_TYPE_A, CONST_CHILD_FOLDER_OF_FRAMES_TYPE),
      this.getFramesByType(CONST_REL_PATH_FRAMES_CUTTING_TYPE_B, CONST_CHILD_FOLDER_OF_FRAMES_TYPE),
      this.getFramesByType(CONST_REL_PATH_FRAMES_CUTTING_TYPE_C, CONST_CHILD_FOLDER_OF_FRAMES_TYPE),
    ]);
    if (results.some((rs) => !rs)) return false;

    const [
      backgroundImages,
      stickers,
      videos,
      icons,
      audios,
      framesCuttingTypeA,
      framesCuttingTypeB,
      framesCuttingTypeC,
      framesRegularTypeA,
      framesRegularTypeB,
      framesRegularTypeC,
      framesRegularTypeD,
      framesRegularTypeE,
      framesRegularTypeF,
      framesWideTypeA,
      framesWideTypeB,
    ] = results;

    return {
      backgroundImages,
      stickers,
      videos,
      icons,
      audios,
      frames: {
        regular: {
          typeA: framesRegularTypeA,
          typeB: framesRegularTypeB,
          typeC: framesRegularTypeC,
          typeD: framesRegularTypeD,
          typeE: framesRegularTypeE,
          typeF: framesRegularTypeF,
        },
        cutting: {
          typeA: framesCuttingTypeA,
          typeB: framesCuttingTypeB,
          typeC: framesCuttingTypeC,
        },
        wide: {
          typeA: framesWideTypeA,
          typeB: framesWideTypeB,
        },
      },
    };
  }
}

export default Resources;
