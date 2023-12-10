import HttpService from './HttpService';

class SpotifyService {

  // Use the default API base URL
  apiUrl = 'homeapp.ddns.net/api/spotify';

  // Get track info endpoint
  async getTrackInfo(trackId) {
    try {
      const response = await HttpService.get(`${this.apiUrl}/track/${trackId}`);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error getting track info:', error);
      throw error;
    }
  }

  // Pause playback endpoint
  async pausePlayback() {
    try {
      await HttpService.post(`${this.apiUrl}/pause`);
      return;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error pausing playback:', error);
      throw error;
    }
  }

  // Continue playback endpoint
  async continuePlayback() {
    try {
      await HttpService.post(`${this.apiUrl}/play`);
      return;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error continuing playback:', error);
      throw error;
    }
  }

  // Change volume endpoint
  async changeVolume(requestBody) {
    try {
      await HttpService.post(`${this.apiUrl}/volume`, requestBody);
      return;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error changing volume:', error);
      throw error;
    }
  }

  // Skip song endpoint
  async skipSong() {
    try {
      await HttpService.post(`${this.apiUrl}/skip`);
      return;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error skipping song:', error);
      throw error;
    }
  }

  // Play previous song endpoint
  async playPreviousSong() {
    try {
      await HttpService.post(`${this.apiUrl}/previous`);
      return;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error playing previous song:', error);
      throw error;
    }
  }

  // Search songs endpoint
  async searchSongs(query) {
    try {
      const response = await HttpService.get(`${this.apiUrl}/search?query=${query}`);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error searching songs:', error);
      throw error;
    }
  }

  // Add to queue endpoint
  async addToQueue(requestBody) {
    try {
      await HttpService.post(`${this.apiUrl}/queue`, requestBody);
      return;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error adding to queue:', error);
      throw error;
    }
  }

  // List queue endpoint
  async listQueue() {
    try {
      const response = await HttpService.get(`${this.apiUrl}/queue`);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error listing queue:', error);
      throw error;
    }
  }

  // Get current playback info endpoint
  async getCurrentPlaybackInfo() {
    try {
      const response = await HttpService.get(`${this.apiUrl}/playback`);
      return response;
    } catch (error) {
      // Handle error, e.g., redirect to login
      console.error('Error getting current playback info:', error);
      throw error;
    }
  }
}

export default new SpotifyService();
