import HttpService from './HttpService';

class LocationService {

  // Use the default API base URL
  apiUrl = 'https://homeapp.ddns.net/api/locations';

  // List locations endpoint
  async listLocations() {
    try {
      const response = await HttpService.get(`${this.apiUrl}`);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error listing locations:', error);
      throw error;
    }
  }

  // Get location by ID endpoint
  async getLocationById(locationId) {
    try {
      const response = await HttpService.get(`${this.apiUrl}/${locationId}`);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error getting location by ID:', error);
      throw error;
    }
  }

  // Create location endpoint
  async createLocation(newLocation) {
    try {
      const response = await HttpService.post(`${this.apiUrl}`, newLocation);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error creating location:', error);
      throw error;
    }
  }
}

export default new LocationService();
