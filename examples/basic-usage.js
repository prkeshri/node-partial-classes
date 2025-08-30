import { supplement } from '../index.js';

// Main class with static initialization block
class UserService {
  static {
    // Supplement with partial classes during static initialization
    supplement(this, import('./validation-partial.js'));
    supplement(this, import('./utilities-partial.js'));
  }
  
  constructor() {
    this.users = [];
  }
  
  addUser(user) {
    this.users.push(user);
    return this.users.length;
  }
  
  getUserCount() {
    return this.users.length;
  }
}

// Partial class with validation methods (would be in validation-partial.js)
class ValidationPartial {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  validateRequired(value) {
    return value !== null && value !== undefined && value !== '';
  }
  
  validateAge(age) {
    return typeof age === 'number' && age >= 0 && age <= 150;
  }
}

// Partial class with utility methods (would be in utilities-partial.js)
class UtilitiesPartial {
  static formatDate(date) {
    return date.toISOString().split('T')[0];
  }
  
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
  
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Test the supplemented methods (after static initialization)
async function testUserService() {
  console.log('UserService has been supplemented with validation and utility methods');
  
  // Test the supplemented methods
  const service = new UserService();
  
  // Static methods
  console.log('Email validation:', UserService.validateEmail('test@example.com')); // true
  console.log('Date formatting:', UserService.formatDate(new Date())); // '2024-01-15'
  
  // Instance methods
  console.log('Required validation:', service.validateRequired('hello')); // true
  console.log('Age validation:', service.validateAge(25)); // true
  console.log('Currency formatting:', service.formatCurrency(1234.56)); // '$1,234.56'
  console.log('Generated ID:', service.generateId()); // random string
  
  // Original methods still work
  service.addUser({ name: 'John', email: 'john@example.com' });
  console.log('User count:', service.getUserCount()); // 1
}

// Run the example
testUserService().catch(console.error);
