import HttpService from './HttpService';

class UserService {

  // Use the default API base URL
  apiUrl = 'https://homeapp.ddns.net/api/users';

  setTokens = () => {
    const accessToken = document.cookie.split('; ').find(row => row.startsWith('access_token')).split('=')[1];
    const accessTokenValidity = document.cookie.split('; ').find(row => row.startsWith('access_token_expires_in')).split('=')[1];
    const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refresh_token')).split('=')[1];
  
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('access_token_expires_in', (Date.now() + Number(accessTokenValidity) * 1000).toString());
    localStorage.setItem('refresh_token', refreshToken);
  }
  

  // Refresh token endpoint
  async refreshAccessToken(refreshToken) {
    try {
      const response = await HttpService.post(`${this.apiUrl}/auth/refresh`, { refresh_token: refreshToken });
      this.setTokens();
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
      await HttpService.getForAuth(`${this.apiUrl}/auth/google?code=${code}`);
      this.setTokens();
      return;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error with Google authentication:', error);
      throw error;
    }
  }

  // Login endpoint
  async login(loginInfo) {
    try {
      await HttpService.postForAuth(`${this.apiUrl}/auth/login`, loginInfo);
      const accessToken = document.cookie.split('; ').find(row => row.startsWith('access_token')).split('=')[1];
      const accessTokenValidity = document.cookie.split('; ').find(row => row.startsWith('access_token_expires_in')).split('=')[1];
      const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refresh_token')).split('=')[1];
    
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('access_token_expires_in', (Date.now() + Number(accessTokenValidity) * 1000).toString());
      localStorage.setItem('refresh_token', refreshToken);
      //this.setTokens();
      return;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error with login:', error);
      throw error;
    }
  }

  // Signup endpoint
  async signup(loginInfo) {
    try {
      await HttpService.postForAuth(`${this.apiUrl}/auth/signup`, loginInfo);
      this.setTokens();
      return;
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