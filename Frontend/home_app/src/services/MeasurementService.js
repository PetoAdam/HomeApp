import HttpService from './HttpService';

class MeasurementService {

  // Use the default API base URL
  apiUrl = 'homeapp.ddns.net/api/measurements';

  // Get current measurement endpoint
  async getCurrentMeasurement(deviceId) {
    try {
      const response = await HttpService.get(`${this.apiUrl}/current?deviceId=${deviceId}`);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error getting current measurement:', error);
      throw error;
    }
  }

  // List day measurements endpoint
  async listDayMeasurements(deviceId) {
    try {
      const response = await HttpService.get(`${this.apiUrl}/day?deviceId=${deviceId}`);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error listing day measurements:', error);
      throw error;
    }
  }

  // Create measurement endpoint
  async createMeasurement(newMeasurement) {
    try {
      const response = await HttpService.post(`${this.apiUrl}`, newMeasurement);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error creating measurement:', error);
      throw error;
    }
  }
}

export default new MeasurementService();
