import { supplement } from 'js-partial-classes';

// Main class with static initialization block
class ApiService {
  static {
    // Supplement with partial classes during static initialization
    supplement(this, import('./auth-partial.js'));
    supplement(this, import('./logging-partial.js'));
  }
  
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.endpoints = {};
  }
  
  addEndpoint(name, path) {
    this.endpoints[name] = path;
  }
  
  getEndpoint(name) {
    return this.endpoints[name];
  }
}

// Test the supplemented methods (after static initialization)
async function testApiService() {
  console.log('ApiService has been supplemented with auth and logging methods');
  
  // Test the supplemented methods
  const apiService = new ApiService('https://api.example.com');
  
  // Static methods
  const token = ApiService.generateToken();
  console.log('Generated token:', token);
  console.log('Token validation:', ApiService.validateToken(token)); // true
  
  ApiService.logInfo('API service initialized');
  
  // Instance methods
  apiService.logError(new Error('Test error message'));
  
  // Original methods still work
  apiService.addEndpoint('users', '/users');
  console.log('Users endpoint:', apiService.getEndpoint('users')); // '/users'
}

// Run the example
testApiService().catch(console.error);
