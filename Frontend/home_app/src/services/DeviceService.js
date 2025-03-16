import HttpService from './HttpService';

class DeviceService {

  // Use the default API base URL
  apiUrl = 'https://homenavi.org/api/devices';

  // List devices endpoint
  async listDevices() {
    try {
      const response = await HttpService.get(`${this.apiUrl}`);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error listing devices:', error);
      throw error;
    }
  }

  // Get device by location endpoint
  async getDeviceByLocation(locationId) {
    try {
      const response = await HttpService.get(`${this.apiUrl}/${locationId}`);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error getting device by location:', error);
      throw error;
    }
  }

  // Create device endpoint
  async createDevice(newDevice) {
    try {
      const response = await HttpService.post(`${this.apiUrl}`, newDevice);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error creating device:', error);
      throw error;
    }
  }
}

export default new DeviceService();
