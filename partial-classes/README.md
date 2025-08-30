# Partial Classes Examples

This folder contains example partial classes that demonstrate the flexible file extension support of the `supplementAll` function. Each file showcases different module formats and functionality.

## File Types Supported

The `supplementAll` function can automatically load partial classes from files with these extensions:

- **`.js`** - Standard JavaScript files
- **`.ts`** - TypeScript files  
- **`.mjs`** - ES modules
- **`.cjs`** - CommonJS modules

## Example Partial Classes

### 1. `validation.js` - JavaScript Validation Methods
Provides common validation utilities:
- `validateEmail(email)` - Email format validation
- `validateRequired(value)` - Required field validation
- `validatePhone(phone)` - Phone number format validation
- `validateMinLength(str, minLength)` - Minimum length validation

### 2. `utilities.ts` - TypeScript Utility Functions
Provides data formatting and manipulation utilities:
- `formatDate(date)` - Date formatting
- `formatCurrency(amount, currency, locale)` - Currency formatting
- `capitalize(str)` - String capitalization
- `generateRandomString(length)` - Random string generation
- `debounce(func, delay)` - Function debouncing

### 3. `api.mjs` - ES Module API Methods
Provides HTTP request utilities:
- `get(url, options)` - GET request method
- `post(url, data, options)` - POST request method
- `createApiClient(baseUrl)` - API client factory
- `withRetry(apiCall, maxRetries, delay)` - Retry logic wrapper

### 4. `logger.cjs` - CommonJS Logging Methods
Provides logging functionality with different levels:
- `logError(message, error)` - Error logging
- `logWarn(message, data)` - Warning logging
- `logInfo(message, data)` - Info logging
- `logDebug(message, data)` - Debug logging
- `setLogLevel(level)` - Log level configuration
- `createLogger(config)` - Logger factory

## Usage

These partial classes are automatically loaded when using the `supplementAll` function. **Important**: `supplementAll` requires absolute paths for proper module resolution. Use the `myDir` function to get the current directory path.

```javascript
import { supplementAll, myDir } from 'js-partial-classes';

class MainClass {
  static {
    // This will load all the partial classes in this folder
    // Note: supplementAll requires absolute paths
    const partialClassesDir = myDir(import.meta.url) + '/partial-classes';
    supplementAll(this, partialClassesDir);
  }
}
```

## Testing

Run the comprehensive demo to see all partial classes working together:

```bash
node examples/comprehensive-demo.js
```

This will demonstrate how methods from all different file types are seamlessly integrated into the main class.

## Customization

You can create your own partial classes following these patterns:

1. **Export a default class** with the methods you want to add
2. **Use any supported file extension** (.js, .ts, .mjs, .cjs)
3. **Include both static and instance methods** as needed
4. **Add proper JSDoc documentation** for better IDE support

The `supplementAll` function will automatically detect and load your custom partial classes regardless of their file extension.
