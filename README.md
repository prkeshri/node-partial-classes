# js-partial-classes

A utility package for supplementing main classes with methods from partial classes, supporting both static and instance methods.

## Features

- **Method Injection**: Copy all static and instance methods from a partial class to a main class
- **Dynamic Import Support**: Support for both direct class references and dynamic imports via string paths
- **ES6 Module Compatible**: Built with modern JavaScript and ES6 modules
- **Lightweight**: Minimal dependencies and footprint

## Installation

```bash
npm install js-partial-classes
```

## Usage

```javascript
import { supplement } from 'js-partial-classes';

class MainClass {
  static {
    // Supplement with partial class during static initialization
    supplement(this, import('./partial-class.js'));
  }
  
  constructor() {
    this.name = 'Main';
  }
  
  mainMethod() {
    return 'Main method';
  }
}

// The supplement function will await the dynamic import automatically
// Now MainClass has methods from the partial class
console.log(MainClass.staticMethod()); // Available from partial class
const instance = new MainClass();
console.log(instance.instanceMethod()); // Available from partial class
```

### Multiple Partial Classes

```javascript
import { supplement } from 'js-partial-classes';

class MainClass {
  static {
    // Supplement with multiple partial classes during static initialization
    supplement(this, import('./partials/validation.js'));
    supplement(this, import('./partials/utilities.js'));
    supplement(this, import('./partials/api.js'));
  }
  
  // ... main class implementation
}
```

## API Reference

### `supplement(mainClass, partialClass)`

Supplements a main class with methods from a partial class.

**Parameters:**
- `mainClass` (Class): The target class to be supplemented
- `partialClass` (Class | string): The partial class or path to the partial class module

**Returns:** Promise<void>

**Behavior:**
- Copies all static methods from `partialClass` to `mainClass`
- Copies all instance methods from `partialClass.prototype` to `mainClass.prototype`
- Skips the constructor method
- Supports both direct class references and dynamic imports

### `iterateDescriptors(cls, callback)`

Utility function to iterate over class descriptors.

**Parameters:**
- `cls` (Class): The class to iterate over
- `callback` (Function): Callback function called with `[key, descriptor]` pairs

## Limitations

1. **Method-Only Support**: Partial classes can only contain methods (both static and instance). Properties, getters, setters, and other class members are not supported.

2. **Constructor Exclusion**: The constructor method is automatically excluded from the supplementation process.

3. **Method Override**: If a method with the same name already exists in the main class, it will be overridden by the partial class method.

4. **No Property Copying**: Only methods are copied; properties and other descriptors are not transferred.

## Examples

### Validation Partial Class

```javascript
// validation.js
export default class ValidationPartial {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  validateRequired(value) {
    return value !== null && value !== undefined && value !== '';
  }
}
```

### Utilities Partial Class

```javascript
// utilities.js
export default class UtilitiesPartial {
  static formatDate(date) {
    return date.toISOString().split('T')[0];
  }
  
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
```

### Using Multiple Partials

```javascript
import { supplement } from 'js-partial-classes';

class UserService {
  static {
    // Supplement with validation and utilities during static initialization
    supplement(this, import('./validation.js'));
    supplement(this, import('./utilities.js'));
  }
  
  constructor() {
    this.users = [];
  }
  
  addUser(user) {
    this.users.push(user);
  }
}

// Now UserService has all methods from both partials
const service = new UserService();

// Static methods
console.log(UserService.validateEmail('test@example.com')); // true
console.log(UserService.formatDate(new Date())); // '2024-01-15'

// Instance methods
console.log(service.validateRequired('hello')); // true
console.log(service.formatCurrency(1234.56)); // '$1,234.56'
```

## License

ISC

## Author

Praveen Ranjan Keshri
