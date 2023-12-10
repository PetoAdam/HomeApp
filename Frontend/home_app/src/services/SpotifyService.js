import HttpService from './HttpService';

class SpotifyService {
  apiUrl = 'https://homeapp.ddns.net/api/spotify';

  async getTrackInfo(trackId) {
    try {
      const response = await HttpService.get(`${this.apiUrl}/track/${trackId}`);
      return response;
    } catch (error) {
      console.error('Error getting track info:', error);
      throw error;
    }
  }

  async pausePlayback() {
    try {
      await HttpService.post(`${this.apiUrl}/pause`);
      return;
    } catch (error) {
      console.error('Error pausing playback:', error);
      throw error;
    }
  }

  async continuePlayback() {
    try {
      await HttpService.post(`${this.apiUrl}/play`);
      return;
    } catch (error) {
      console.error('Error continuing playback:', error);
      throw error;
    }
  }

  async changeVolume(requestBody) {
    try {
      await HttpService.post(`${this.apiUrl}/volume`, requestBody);
      return;
    } catch (error) {
      console.error('Error changing volume:', error);
      throw error;
    }
  }

  async skipSong() {
    try {
      await HttpService.post(`${this.apiUrl}/skip`);
      return;
    } catch (error) {
      console.error('Error skipping song:', error);
      throw error;
    }
  }

  async playPreviousSong() {
    try {
      await HttpService.post(`${this.apiUrl}/previous`);
      return;
    } catch (error) {
      console.error('Error playing previous song:', error);
      throw error;
    }
  }

  async searchSongs(query) {
    try {
      const response = await HttpService.get(`${this.apiUrl}/search?query=${query}`);
      return response;
    } catch (error) {
      console.error('Error searching songs:', error);
      throw error;
    }
  }

  async addToQueue(requestBody) {
    try {
      await HttpService.post(`${this.apiUrl}/queue`, requestBody);
      return;
    } catch (error) {
      console.error('Error adding to queue:', error);
      throw error;
    }
  }

  async listQueue() {
    try {
      const response = await HttpService.get(`${this.apiUrl}/queue`);
      return response;
    } catch (error) {
      console.error('Error listing queue:', error);
      throw error;
    }
  }

  async getCurrentPlaybackInfo() {
    try {
      const response = await HttpService.get(`${this.apiUrl}/playback`);
      return response;
    } catch (error) {
      console.error('Error getting current playback info:', error);
      throw error;
    }
  }
}

export default new SpotifyService();
