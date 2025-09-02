# js-partial-classes

A utility package for supplementing main classes with methods from partial classes, supporting both static and instance methods.

## Features

- **Method Injection**: Copy all static and instance methods from a partial class to a main class
- **Dynamic Import Support**: Support for both direct class references and dynamic imports via string paths
- **TypeScript Support**: Full TypeScript support with type definitions and `.ts` file handling
- **Advanced Type System**: Utility types for combining class types after supplementation
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

### Bulk Loading with TypeScript Support

```typescript
import { supplementAll, myDir } from 'js-partial-classes';

class MainClass {
  static {
    // Load all .js and .ts files from a directory
    // Note: supplementAll requires absolute paths
    const partialClassesDir = myDir(import.meta.url) + '/partial-classes';
    supplementAll(this, partialClassesDir);
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

### `supplementAll(mainClass, directory)`

Supplements a main class with methods from all partial classes in a directory.

**Parameters:**
- `mainClass` (Class): The target class to be supplemented
- `directory` (string): The absolute directory path to scan for partial class files

**Returns:** Promise<Record<string, any>>

**Behavior:**
- Scans the specified directory for `.js`, `.ts`, `.mjs`, and `.cjs` files
- Automatically supplements the main class with all found partial classes
- Supports JavaScript, TypeScript, ES modules, and CommonJS files
- **Important**: Requires absolute paths for proper module resolution

### `myDir(url)`

Utility function to get the directory path from a file URL. Essential for ES modules to obtain absolute paths.

**Parameters:**
- `url` (string): The import.meta.url or file URL

**Returns:** string - The directory path

**Example:**
```javascript
import { myDir } from 'js-partial-classes';

// Get current directory in ES module
const currentDir = myDir(import.meta.url);

// Use with supplementAll
const partialClassesDir = myDir(import.meta.url) + '/partial-classes';
supplementAll(MainClass, partialClassesDir);
```

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

## TypeScript Types

The library provides powerful utility types that help TypeScript understand the combined structure of classes after supplementation.

### Basic Type Combination

```typescript
import { supplement, Combine } from 'js-partial-classes';

class Home {
  static {
    supplement(this, HomePartial);
  }
  
  homeMethod() { return 'home'; }
}

class HomePartial {
  static staticMethod() { return 'static'; }
  partialMethod() { return 'partial'; }
}

// Create a type that represents the combined class
export type HomeFull = Combine<[typeof Home, typeof HomePartial]>;

// HomeFull now includes all methods from both classes
const home = new Home() as HomeFull;
home.homeMethod();      // ✅ Available
home.partialMethod();   // ✅ Available
Home.staticMethod();    // ✅ Available
```

### Multiple Partial Classes

```typescript
import { supplement, Combine } from 'js-partial-classes';

class UserService {
  static {
    supplement(this, ValidationPartial);
    supplement(this, UtilitiesPartial);
  }
  
  addUser(user: any) { this.users.push(user); }
}

class ValidationPartial {
  static validateEmail(email: string): boolean { return true; }
  validateRequired(value: any): boolean { return true; }
}

class UtilitiesPartial {
  static formatDate(date: Date): string { return date.toISOString(); }
  formatCurrency(amount: number): string { return `$${amount}`; }
}

// Combine all classes into one type
export type UserServiceFull = Combine<[
  typeof UserService, 
  typeof ValidationPartial, 
  typeof UtilitiesPartial
]>;

// UserServiceFull now has all methods from all classes
const service = new UserService() as UserServiceFull;
service.validateEmail('test@example.com');  // ✅ Available
service.formatDate(new Date());             // ✅ Available
service.formatCurrency(1234.56);           // ✅ Available
```

### Type Assertion with `as` Operator

```typescript
// Simply use the 'as' operator for type assertion
const user = new UserService() as UserServiceFull;

// Now TypeScript knows about all supplemented methods
user.validateEmail('test@example.com');
user.formatDate(new Date());
user.addUser({ name: 'John' });
```

## Examples

### TypeScript Usage

```typescript
// partial-classes/validation.ts
export default class ValidationPartial {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  validateRequired(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }
}

// partial-classes/utilities.ts
export default class UtilitiesPartial {
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}

// main-class.ts
import { supplementAll, myDir, Combine } from 'js-partial-classes';

class UserService {
  static {
    // Load all partial classes from the directory (supports .js, .ts, .mjs, .cjs)
    // Note: supplementAll requires absolute paths
    const partialClassesDir = myDir(import.meta.url) + '/partial-classes';
    supplementAll(this, partialClassesDir);
  }
  
  constructor() {
    this.users: any[] = [];
  }
  
  addUser(user: any): void {
    this.users.push(user);
  }
}

// Define the partial classes for type combination
class ValidationPartial {
  static validateEmail(email: string): boolean { return true; }
  validateRequired(value: any): boolean { return true; }
}

class UtilitiesPartial {
  static formatDate(date: Date): string { return date.toISOString(); }
  formatCurrency(amount: number): string { return `$${amount}`; }
}

// Create a combined type that includes all supplemented methods
export type UserServiceFull = Combine<[
  typeof UserService, 
  typeof ValidationPartial, 
  typeof UtilitiesPartial
]>;

// Usage with proper typing
const service = new UserService() as UserServiceFull;

// Now TypeScript knows about all supplemented methods!
console.log(UserService.validateEmail('test@example.com')); // ✅ No @ts-ignore needed
console.log(UserService.formatDate(new Date())); // ✅ No @ts-ignore needed
console.log(service.validateRequired('hello')); // ✅ No @ts-ignore needed
console.log(service.formatCurrency(1234.56)); // ✅ No @ts-ignore needed
```

### JavaScript Usage

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
