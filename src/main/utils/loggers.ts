import fs from 'fs';
import winston from 'winston';
import Paths from './paths';
import DailyRotateFile from 'winston-daily-rotate-file';

const {combine, timestamp, json, prettyPrint, errors } = winston.format;


class Loggers {
  isShowConsole: boolean;
  pathMainLogger: string;
  pathRendererLogger: string;
  mainId: string;
  rendererId: string;

  constructor(isShowConsole = true) {
    this.isShowConsole = isShowConsole;
    this.mainId = 'MainProcess';
    this.rendererId = 'RendererProcess';
    this.pathMainLogger = this.getFolderLoggers() + '/main-%DATE%.log';
    this.pathRendererLogger = this.getFolderLoggers() + '/renderer-%DATE%.log';
    this.registryLoggers();
  }

  getFolderLoggers() {
    const pathLogger = Paths.getFolderAppData() + "/loggers";
    if (!fs.existsSync(pathLogger)) {
      fs.mkdirSync(pathLogger);
    }

    return pathLogger;
  }
  
  configsDailyRotateTransport(pathFile: string) {
    return new DailyRotateFile({
      filename: pathFile,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
    })
  }
  
  configsTransport(pathFile: string) {
    if (this.isShowConsole) {
      return [
        new winston.transports.Console(),
        this.configsDailyRotateTransport(pathFile)
      ]
    }

    return [
      this.configsDailyRotateTransport(pathFile)
    ]
  }

  configs(server: string, pathFile: string) {
    return {
      level: 'info',
      format: combine(
        errors({ stack: true }),
        timestamp(),
        json(),
        prettyPrint()
      ),
      transports: this.configsTransport(pathFile),
      defaultMeta: {server: server}
    }
  }

  registryLoggers() {
    winston.loggers.add(this.mainId, this.configs(this.mainId, this.pathMainLogger));
    winston.loggers.add(this.rendererId, this.configs(this.rendererId, this.pathRendererLogger));
  }

  getLoggers() {
    const mainLogger = winston.loggers.get(this.mainId);
    const rendererLogger = winston.loggers.get(this.rendererId);
    return {
      mainLogger,
      rendererLogger
    }
  }
}

export default Loggers;


