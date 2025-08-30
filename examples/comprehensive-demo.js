import { supplementAll, myDir } from '../index.js';

/**
 * Comprehensive demo showing how supplementAll works with different file types
 * This example demonstrates loading partial classes from:
 * - validation.js (JavaScript)
 * - utilities.ts (TypeScript)
 * - api.mjs (ES Module)
 * - logger.cjs (CommonJS)
 */

class UserService {
  constructor() {
    this.users = [];
    console.log('UserService initialized');
  }

  // Static initialization block to load all partial classes
  static {
    console.log('Loading partial classes...');
    // Note: supplementAll requires absolute paths
    const partialClassesDir = myDir(import.meta.url) + '/partial-classes';
    supplementAll(this, partialClassesDir);
    console.log('Partial classes loaded successfully!');
  }

  // Main class methods
  addUser(user) {
    // Use validation methods from validation.js
    if (!this.validateRequired(user.email)) {
      throw new Error('Email is required');
    }
    
    if (!UserService.validateEmail(user.email)) {
      throw new Error('Invalid email format');
    }

    if (!this.validateMinLength(user.name, 2)) {
      throw new Error('Name must be at least 2 characters');
    }

    // Use logging from logger.cjs
    this.logInfo(`Adding user: ${user.name} (${user.email})`);

    this.users.push(user);
    return user;
  }

  async fetchUserData(userId) {
    try {
      // Use API methods from api.mjs
      const userData = await UserService.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
      
      // Use utility methods from utilities.ts
      const formattedDate = UserService.formatDate(new Date());
      const capitalizedName = UserService.capitalize(userData.name);
      
      this.logInfo(`Fetched user data for ${capitalizedName} on ${formattedDate}`);
      
      return userData;
    } catch (error) {
      this.logError('Failed to fetch user data', error);
      throw error;
    }
  }

  formatUserReport(user) {
    // Use utility methods from utilities.ts
    const formattedSalary = this.formatCurrency(user.salary || 0);
    const formattedDate = UserService.formatDate(new Date(user.createdAt || new Date()));
    
    return {
      name: UserService.capitalize(user.name),
      email: user.email,
      salary: formattedSalary,
      created: formattedDate
    };
  }
}

// Demo usage
async function runDemo() {
  console.log('=== Partial Classes Demo ===\n');

  const userService = new UserService();

  try {
    // Test validation methods (from validation.js)
    console.log('1. Testing validation methods:');
    console.log('   Email validation:', UserService.validateEmail('test@example.com')); // true
    console.log('   Phone validation:', UserService.validatePhone('(555) 123-4567')); // true
    console.log('   Required validation:', userService.validateRequired('hello')); // true
    console.log('   Min length validation:', userService.validateMinLength('John', 2)); // true
    console.log();

    // Test utility methods (from utilities.ts)
    console.log('2. Testing utility methods:');
    console.log('   Date formatting:', UserService.formatDate(new Date())); // YYYY-MM-DD
    console.log('   Currency formatting:', userService.formatCurrency(1234.56)); // $1,234.56
    console.log('   String capitalization:', UserService.capitalize('hello world')); // Hello world
    console.log('   Random string:', userService.generateRandomString(8)); // random 8-char string
    console.log();

    // Test API methods (from api.mjs)
    console.log('3. Testing API methods:');
    try {
      const userData = await userService.fetchUserData(1);
      console.log('   Fetched user:', userData.name);
    } catch (error) {
      console.log('   API test skipped (network not available)');
    }
    console.log();

    // Test logging methods (from logger.cjs)
    console.log('4. Testing logging methods:');
    userService.logInfo('This is an info message');
    userService.logWarn('This is a warning message');
    userService.logDebug('This is a debug message');
    console.log();

    // Test adding a user with validation
    console.log('5. Testing user addition with validation:');
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
      salary: 50000
    };
    
    const addedUser = userService.addUser(newUser);
    console.log('   User added successfully:', addedUser.name);
    
    // Test report formatting
    const report = userService.formatUserReport(addedUser);
    console.log('   User report:', report);
    console.log();

    console.log('=== Demo completed successfully! ===');
    console.log('All partial classes are working together seamlessly!');

  } catch (error) {
    console.error('Demo error:', error.message);
  }
}

// Run the demo
runDemo();
