/**
 * API partial class - ES Module version
 * Provides methods for API interactions and HTTP requests
 */
export default class ApiPartial {
  /**
   * Makes a GET request to the specified URL
   * @param {string} url - URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  static async get(url, options = {}) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  }

  /**
   * Makes a POST request to the specified URL
   * @param {string} url - URL to post to
   * @param {Object} data - Data to send
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  async post(url, data, options = {}) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(data),
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }

  /**
   * Creates an API client with base URL
   * @param {string} baseUrl - Base URL for the API
   * @returns {Object} API client object
   */
  static createApiClient(baseUrl) {
    return {
      get: (endpoint) => ApiPartial.get(`${baseUrl}${endpoint}`),
      post: (endpoint, data) => {
        const instance = new ApiPartial();
        return instance.post(`${baseUrl}${endpoint}`, data);
      }
    };
  }

  /**
   * Handles API errors with retry logic
   * @param {Function} apiCall - API function to retry
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} delay - Delay between retries in milliseconds
   * @returns {Promise<Object>} API response
   */
  static async withRetry(apiCall, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
}
