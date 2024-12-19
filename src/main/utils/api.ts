import axios from 'axios';
import Loggers from './loggers';

const logger = new Loggers();
const { mainLogger } = logger.getLoggers();

const ROOT = 'http://localhost:3001';

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
}

export default API;
