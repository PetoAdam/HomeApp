import HttpService from './HttpService';

class SpeakerService {

  // Use the default API base URL
  apiUrl = 'https://homeapp.ddns.net/api/speakers';

  // List pairable devices endpoint
  async listPairableDevices() {
    try {
      const response = await HttpService.get(`${this.apiUrl}/pairable`);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error listing pairable devices:', error);
      throw error;
    }
  }

  // Connect device endpoint
  async connectDevice(requestBody) {
    try {
      const response = await HttpService.post(`${this.apiUrl}/connect`, requestBody);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error connecting device:', error);
      throw error;
    }
  }

  // Disconnect device endpoint
  async disconnectDevice(requestBody) {
    try {
      const response = await HttpService.post(`${this.apiUrl}/disconnect`, requestBody);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error disconnecting device:', error);
      throw error;
    }
  }

  // List connected speakers endpoint
  async listConnectedSpeakers() {
    try {
      const response = await HttpService.get(`${this.apiUrl}/connected`);
      console.log('Raw response from listConnectedSpeakers:', response);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error listing connected speakers:', error);
      throw error;
    }
  }
}

export default new SpeakerService();
