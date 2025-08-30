import { supplementAll, myDir } from '../index.js';

// This example demonstrates the flexible file extension support
// The supplementAll function can handle various file types:
// - .js (JavaScript files)
// - .ts (TypeScript files) 
// - .mjs (ES modules)
// - .cjs (CommonJS modules)

class MainClass {
  constructor() {
    console.log('MainClass constructor');
  }

  // Static initialization block to load all partial classes
  static {
    // This will automatically detect and load files with any of these extensions:
    // - partial-class.js
    // - partial-class.ts
    // - partial-class.mjs
    // - partial-class.cjs
    // Note: supplementAll requires absolute paths
    const partialClassesDir = myDir(import.meta.url) + '/partial-classes';
    supplementAll(this, partialClassesDir);
  }
}

// Example usage showing how different file types are supported
console.log('Loading partial classes with flexible extension support...');

const instance = new MainClass();

// The supplemented methods will be available regardless of the original file extension
// @ts-ignore - TypeScript won't know about these methods at compile time
if (typeof MainClass.staticMethod === 'function') {
  console.log('Static method loaded successfully');
}

// @ts-ignore
if (typeof instance.instanceMethod === 'function') {
  console.log('Instance method loaded successfully');
}

console.log('All partial classes loaded with flexible extension support!');
