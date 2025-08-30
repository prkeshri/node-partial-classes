import { supplementAll, myDir } from '../index.js';

// Example partial class in TypeScript
class PartialClass1 {
  static staticMethod1() {
    console.log('Static method from PartialClass1');
  }

  instanceMethod1() {
    console.log('Instance method from PartialClass1');
  }
}

class PartialClass2 {
  static staticMethod2() {
    console.log('Static method from PartialClass2');
  }

  instanceMethod2() {
    console.log('Instance method from PartialClass2');
  }
}

// Main class that will be supplemented
class MainClass {
  constructor() {
    console.log('MainClass constructor');
  }

  // Static initialization block to load all partial classes
  static {
    // This will load all .js and .ts files from the partial-classes directory
    // Note: supplementAll requires absolute paths
    const partialClassesDir = myDir(import.meta.url) + '/partial-classes';
    supplementAll(this, partialClassesDir);
  }
}

// Export the partial classes so they can be imported
export { PartialClass1, PartialClass2 };

// Example usage
const instance = new MainClass();

// These methods will be available after supplementation
// @ts-ignore - TypeScript won't know about these methods at compile time
MainClass.staticMethod1();
// @ts-ignore
MainClass.staticMethod2();

// @ts-ignore
instance.instanceMethod1();
// @ts-ignore
instance.instanceMethod2();
