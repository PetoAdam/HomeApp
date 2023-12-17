class HttpService {
  
    // Helper function to get access token from localStorage
    getAccessToken() {
      return localStorage.getItem('access_token');
    }

    // Helper function to get access token expiration from localStorage
    getAccessTokenExpiration() {
      const expiresIn = localStorage.getItem('access_token_expires_in');
      return expiresIn ? Number(expiresIn) : 0;
    }

    // Helper function to handle API responses
    handleResponse(response) {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }

    // Refresh the access token using the refresh token
    async refreshToken(refreshToken) {
      const refreshResponse = await fetch('https://homeapp.ddns.net/api/users/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    
      if (!refreshResponse.ok) {
        // Handle refresh failure, redirect to login or handle as needed
        window.location.href = 'https://homeapp.ddns.net/profile';
      }
    
      // Update the access_token cookie with the new value
      const newAccessTokenCookie = refreshResponse.headers.get('Set-Cookie');
      if (newAccessTokenCookie) {
        document.cookie = newAccessTokenCookie;
      }
    
      // Extract the new access token from the cookies and update localStorage
      const newAccessToken = document.cookie.split('; ').find(row => row.startsWith('access_token')).split('=')[1];
      const accessTokenValidity = document.cookie.split('; ').find(row => row.startsWith('access_token_expires_in')).split('=')[1];
    
      localStorage.setItem('access_token', newAccessToken);
      localStorage.setItem('access_token_expires_in', (Date.now() + accessTokenValidity * 1000).toString());
    
      return newAccessToken;
    }

    // Handle token expiration and refresh
    async handleToken() {
      const expirationTime = this.getAccessTokenExpiration();

      if (!this.getAccessToken() || expirationTime < Date.now() + 60000) {
        // Token expired or not present, try to refresh
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          return this.refreshToken(refreshToken);
        } else {
          // No refresh token, redirect to profile or handle as needed
          window.location.href = 'https://homeapp.ddns.net/profile';
          return null;
        }
      }

      return this.getAccessToken();
    }
  
    // CRUD methods
    async get(url) {
        try {
          const accessToken = await this.handleToken();
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
    
          return this.handleResponse(response);
        } catch (error) {
          // Handle network or request errors
          console.error('Error making GET request:', error);
          // Redirect to error page or handle as needed
          throw error;
        }
      }
    
      async post(url, body) {
        try {
          const accessToken = await this.handleToken();
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
          });
    
          return this.handleResponse(response);
        } catch (error) {
          // Handle network or request errors
          console.error('Error making POST request:', error);
          // Redirect to error page or handle as needed
          throw error;
        }
      }
    
      async put(url, body) {
        try {
          const accessToken = await this.handleToken();
          const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
          });
    
          return this.handleResponse(response);
        } catch (error) {
          // Handle network or request errors
          console.error('Error making PUT request:', error);
          // Redirect to error page or handle as needed
          throw error;
        }
      }
    
      async delete(url) {
        try {
          const accessToken = await this.handleToken();
          const response = await fetch(url, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
    
          return this.handleResponse(response);
        } catch (error) {
          // Handle network or request errors
          console.error('Error making DELETE request:', error);
          // Redirect to error page or handle as needed
          throw error;
        }
      }

      async getForAuth(url) {
        try {
          await fetch(url, {
          });
    
          return;
        } catch (error) {
          // Handle network or request errors
          console.error('Error making GET request:', error);
          // Redirect to error page or handle as needed
          throw error;
        }
      }

      async postForAuth(url, body) {
        try {
          await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });
    
          return;
        } catch (error) {
          // Handle network or request errors
          console.error('Error making POST request:', error);
          // Redirect to error page or handle as needed
          throw error;
        }
      }
  }
  
  export default new HttpService();
  