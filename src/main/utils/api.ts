import axios from 'axios';
import Loggers from './loggers';

const logger = new Loggers();
const { mainLogger } = logger.getLoggers();

const BASE_URL = 'http://192.168.1.253:3001';

class API {
  headers: { headers: Record<string, string> };

  constructor() {
    this.headers = { headers: { 'Content-Type': 'application/json' } };
  }

  async getOrderInfoById(value: string): Promise<false | unknown> {
    try {
      const response = await axios.get(`${BASE_URL}/api/clientOrders/start/${value}`, this.headers);
      return response.data;
    } catch (error) {
      mainLogger.error('@API.getOrderInfoById: ERROR = ', error);
      return false;
    }
  }

  async saveImage(orderInfo: Record<string, string | number | boolean>): Promise<false | unknown> {
    try {
      const response = await axios.post(`${BASE_URL}/api/clientOrders/endOrder`, orderInfo, this.headers);
      return response;
    } catch (error) {
      mainLogger.error('@API.saveImage: ERROR = ', error);
      return false;
    }
  }

  async getQrCodeByOrderId(orderId: string): Promise<false | string> {
    try {
      const response = await axios.get(`${BASE_URL}/api/clientOrders/createQR/${orderId}`, this.headers);
      if (!response.data || !response.data.qrCode) return false;

      return response.data.qrCode;
    } catch (error) {
      mainLogger.error('@API.getQrCodeByOrderId: ERROR = ', error);
      return false;
    }
  }

  async getClientSettingByMachineId(machineId: string) {
    try {
      const response = await axios.get(`${BASE_URL}/api/clientSettings/${machineId}`);
      if (!response.data.data.clientSetting) return false;

      return response.data.data.clientSetting;
    } catch (error) {
      mainLogger.error('@API.getClientSettingByMachineId: ERROR = ', error);
      return false;
    }
  }
}

export default API;
