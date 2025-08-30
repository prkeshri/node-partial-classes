import { supplement } from '../index.js';

/**
 * Test suite for the supplement function
 */
class SupplementTestSuite {
  constructor() {
    this.testCount = 0;
    this.passedTests = 0;
    this.failedTests = 0;
  }

  // Test helper methods
  assert(condition, message) {
    this.testCount++;
    if (condition) {
      this.passedTests++;
      console.log(`✅ ${message}`);
    } else {
      this.failedTests++;
      console.log(`❌ ${message}`);
    }
  }

  assertEqual(actual, expected, message) {
    this.testCount++;
    if (actual === expected) {
      this.passedTests++;
      console.log(`✅ ${message}`);
    } else {
      this.failedTests++;
      console.log(`❌ ${message}: expected ${expected}, got ${actual}`);
    }
  }

  // Test classes
  createMainClass() {
    return class MainClass {
      constructor() {
        this.name = 'Main';
      }
      
      mainMethod() {
        return 'Main method';
      }
    };
  }

  createPartialClass() {
    return class PartialClass {
      static staticMethod() {
        return 'Static method from partial';
      }
      
      instanceMethod() {
        return 'Instance method from partial';
      }
      
      anotherInstanceMethod() {
        return 'Another instance method';
      }
    };
  }

  // Test cases
  async testDirectClassReference() {
    console.log('\n🧪 Testing direct class reference...');
    
    const MainClass = this.createMainClass();
    const PartialClass = this.createPartialClass();
    
    await supplement(MainClass, PartialClass);
    
    const instance = new MainClass();
    
    this.assertEqual(instance.mainMethod(), 'Main method', 'Main method should remain unchanged');
    this.assertEqual(MainClass.staticMethod(), 'Static method from partial', 'Static method should be supplemented');
    this.assertEqual(instance.instanceMethod(), 'Instance method from partial', 'Instance method should be supplemented');
    this.assertEqual(instance.anotherInstanceMethod(), 'Another instance method', 'Another instance method should be supplemented');
  }

  async testStringPathImport() {
    console.log('\n🧪 Testing string path import...');
    
    const MainClass = this.createMainClass();
    
    await supplement(MainClass, './test-partial.js');
    
    const instance = new MainClass();
    
    this.assertEqual(instance.mainMethod(), 'Main method', 'Main method should remain unchanged');
    this.assertEqual(MainClass.staticMethod(), 'Static method from partial', 'Static method should be supplemented');
    this.assertEqual(instance.instanceMethod(), 'Instance method from partial', 'Instance method should be supplemented');
  }

  async testPromiseImport() {
    console.log('\n🧪 Testing promise import...');
    
    const MainClass = this.createMainClass();
    
    await supplement(MainClass, import('./test-partial.js'));
    
    const instance = new MainClass();
    
    this.assertEqual(instance.mainMethod(), 'Main method', 'Main method should remain unchanged');
    this.assertEqual(MainClass.staticMethod(), 'Static method from partial', 'Static method should be supplemented');
    this.assertEqual(instance.instanceMethod(), 'Instance method from partial', 'Instance method should be supplemented');
  }

  async testMethodOverride() {
    console.log('\n🧪 Testing method override...');
    
    const MainClass = class {
      static staticMethod() {
        return 'Original static method';
      }
      
      instanceMethod() {
        return 'Original instance method';
      }
    };
    
    const PartialClass = class {
      static staticMethod() {
        return 'Overridden static method';
      }
      
      instanceMethod() {
        return 'Overridden instance method';
      }
    };
    
    await supplement(MainClass, PartialClass);
    
    const instance = new MainClass();
    
    this.assertEqual(MainClass.staticMethod(), 'Overridden static method', 'Static method should be overridden');
    this.assertEqual(instance.instanceMethod(), 'Overridden instance method', 'Instance method should be overridden');
  }

  async testConstructorExclusion() {
    console.log('\n🧪 Testing constructor exclusion...');
    
    const MainClass = class {
      constructor() {
        this.mainConstructor = true;
      }
    };
    
    const PartialClass = class {
      constructor() {
        this.partialConstructor = true;
      }
    };
    
    await supplement(MainClass, PartialClass);
    
    const instance = new MainClass();
    
    this.assert(instance.mainConstructor, 'Main constructor should be preserved');
    this.assert(!instance.partialConstructor, 'Partial constructor should not be copied');
  }

  async testNonWritableProperties() {
    console.log('\n🧪 Testing non-writable properties...');
    
    const MainClass = class {};
    
    const PartialClass = class {
      static get readOnlyProperty() {
        return 'readonly';
      }
    };
    
    // Define a non-writable property
    Object.defineProperty(PartialClass, 'nonWritable', {
      value: 'non-writable',
      writable: false
    });
    
    await supplement(MainClass, PartialClass);
    
    this.assert(!MainClass.hasOwnProperty('readOnlyProperty'), 'Read-only properties should not be copied');
    this.assert(!MainClass.hasOwnProperty('nonWritable'), 'Non-writable properties should not be copied');
  }

  async runAllTests() {
    console.log('🚀 Starting supplement function tests...\n');
    
    try {
      await this.testDirectClassReference();
      await this.testStringPathImport();
      await this.testPromiseImport();
      await this.testMethodOverride();
      await this.testConstructorExclusion();
      await this.testNonWritableProperties();
      
      console.log(`\n📊 Test Results:`);
      console.log(`   Total tests: ${this.testCount}`);
      console.log(`   Passed: ${this.passedTests}`);
      console.log(`   Failed: ${this.failedTests}`);
      
      if (this.failedTests === 0) {
        console.log('\n🎉 All supplement tests passed!');
      } else {
        console.log('\n❌ Some supplement tests failed!');
      }
      
    } catch (error) {
      console.error('❌ Test suite error:', error);
    }
  }
}

// Run the test suite
const testSuite = new SupplementTestSuite();
testSuite.runAllTests();
