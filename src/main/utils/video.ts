import { exec, execSync } from 'child_process';
import path from 'path';
import Paths from './paths';
import { CONST_FRAME_STICKER_IMAGE_NAME, CONST_MODE_CUTTING, CONST_VIDEO_RATIO_WITH_FRAME } from '../libs/constants';
import Loggers from './loggers';
import fs from 'fs';

const loggers = new Loggers(true);
const { mainLogger } = loggers.getLoggers();

interface VideosType {
  videoName: string;
  positions: {
    x: number;
    y: number;
    w: number;
    h: number;
  }[];
}

export function generateVideo(data: GenerateVideoType) {
  const ffmpeg = path.join(Paths.getFolderExternal(), 'ffmpeg');
  const folderUserPhotosPath = Paths.getFolderUserPhotos();
  const frameStickerImagePath = path.join(folderUserPhotosPath, CONST_FRAME_STICKER_IMAGE_NAME);
  const widthImage = Math.floor(data.frameWidth / CONST_VIDEO_RATIO_WITH_FRAME);
  const heightImage = Math.floor(data.frameHeight / CONST_VIDEO_RATIO_WITH_FRAME);
  const videos: VideosType[] = [];
  data.photos.forEach((photo, index) => {
    const positions = data.positions[index];
    const videoName = photo.photo.split('photo').join('video').slice(0, -4) + '.mp4';
    if (data.frameMode === CONST_MODE_CUTTING) {
      positions.forEach((position) => {
        const detailInfo = {
          videoName,
          positions: [position],
        };
        videos.push(detailInfo);
      });
    } else {
      const detailInfo = {
        videoName,
        positions,
      };
      videos.push(detailInfo);
    }
  });

  let command: string = `${ffmpeg} `;
  videos.forEach((video, index) => {
    const videoPath = path.join(folderUserPhotosPath, video.videoName);
    command += `-i "${videoPath}" `;
    if (index === videos.length - 1) {
      command += `-i "${frameStickerImagePath}" -filter_complex `;
    }
  });

  let command1: string = '';
  videos.forEach((video, index) => {
    const position = video.positions[0];
    command1 += `[${index}:v]scale=${position.w / CONST_VIDEO_RATIO_WITH_FRAME}:${position.h / CONST_VIDEO_RATIO_WITH_FRAME}[video_${index}]; `;
    if (index === videos.length - 1) {
      command1 += `[${index + 1}:v]scale=${widthImage}:${heightImage}[frame];`;
    }
  });

  let command2: string = '';
  videos.forEach((video, index) => {
    const position = video.positions[0];
    if (index === 0) {
      command2 += `[video_${index}]pad=${widthImage}:${heightImage}:${position.x / CONST_VIDEO_RATIO_WITH_FRAME}:${position.y / CONST_VIDEO_RATIO_WITH_FRAME}[video_out_${index}]; `;
    } else {
      command2 += `[video_out_${index - 1}][video_${index}]overlay=${position.x / CONST_VIDEO_RATIO_WITH_FRAME}:${position.y / CONST_VIDEO_RATIO_WITH_FRAME}[video_out_${index}]; `;
      if (index === videos.length - 1) {
        command2 += `[video_out_${index}][frame]overlay=0:0[out]`;
      }
    }
  });
  // }
  command += `"${command1} ${command2}" -map "[out]" -c:v libx264 -preset medium -movflags frag_keyframe+empty_moov -f mp4 pipe:1`;
  try {
    const videoData = execSync(command, { encoding: 'buffer', maxBuffer: 1024 * 1024 * 100 });
    mainLogger.info('[generateVideo]: SUCCESS');
    const videoBase64 = videoData.toString('base64');
    return videoBase64;
  } catch (error) {
    mainLogger.error(`[generateVideo]: ERROR = ${error}`);
    return false;
  }
}
