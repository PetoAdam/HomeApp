import HttpService from './HttpService';

class UserService {

  // Use the default API base URL
  apiUrl = 'https://homeapp.ddns.net/api/users';

  // Refresh token endpoint
  async refreshAccessToken(refreshToken) {
    try {
      const response = await HttpService.post(`${this.apiUrl}/auth/refresh`, { refresh_token: refreshToken });
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }

  // Google authentication endpoint
  async googleAuth(code) {
    try {
      const response = await HttpService.get(`${this.apiUrl}/auth/google?code=${code}`);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error with Google authentication:', error);
      throw error;
    }
  }

  // Login endpoint
  async login(loginInfo) {
    try {
      const response = await HttpService.post(`${this.apiUrl}/auth/login`, loginInfo);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error with login:', error);
      throw error;
    }
  }

  // Signup endpoint
  async signup(loginInfo) {
    try {
      const response = await HttpService.post(`${this.apiUrl}/auth/signup`, loginInfo);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error with signup:', error);
      throw error;
    }
  }

  // Get user info by ID
  async getUserInfo(userId) {
    try {
      const response = await HttpService.get(`${this.apiUrl}/${userId}`);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error getting user info:', error);
      throw error;
    }
  }
}

export default new UserService();