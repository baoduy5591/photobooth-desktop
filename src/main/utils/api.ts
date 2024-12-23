import axios from 'axios';
import Loggers from './loggers';

const logger = new Loggers();
const { mainLogger } = logger.getLoggers();

const ROOT = 'http://172.16.50.20:3000';

class API {
  headers: { headers: Record<string, string> };

  constructor() {
    this.headers = { headers: { 'Content-Type': 'application/json' } };
  }

  async getOrderInfoById(value: string): Promise<false | unknown> {
    try {
      const response = await axios.get(`${ROOT}/api/clientOrders/start/${value}`, this.headers);
      return response.data;
    } catch (error) {
      mainLogger.error('@API.getOrderInfoById: ERROR = ', error);
      return false;
    }
  }

  async saveImage(orderInfo: Record<string, string | number | boolean>): Promise<false | unknown> {
    try {
      const response = await axios.post(`${ROOT}/api/clientOrders/endOrder`, orderInfo, this.headers);
      return response;
    } catch (error) {
      mainLogger.error('@API.saveImage: ERROR = ', error);
      return false;
    }
  }

  async getQrCodeByOrderId(orderId: string): Promise<false | string> {
    try {
      const response = await axios.get(`${ROOT}/api/clientOrders/createQR/${orderId}`, this.headers);
      if (!response.data || !response.data.qrCode) return false;

      return response.data.qrCode;
    } catch (error) {
      mainLogger.error('@API.getQrCodeByOrderId: ERROR = ', error);
      return false;
    }
  }

  async getClientSettingByMachineId(machineId: string) {
    try {
      const response = await axios.get(`${ROOT}/api/clientSettings/${machineId}`);
      if (!response.data.data.clientSetting) return false;

      return response.data.data.clientSetting;
    } catch (error) {
      mainLogger.error('@API.getClientSettingByMachineId: ERROR = ', error);
      return false;
    }
  }
}

export default API;
