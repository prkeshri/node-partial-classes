import { iterateDescriptors } from '../index.js';

/**
 * Test suite for the iterateDescriptors function
 */
class IterateDescriptorsTestSuite {
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
  createTestClass() {
    return class TestClass {
      constructor() {
        this.constructorProperty = 'constructor';
      }

      static staticMethod1() {
        return 'static method 1';
      }

      static staticMethod2() {
        return 'static method 2';
      }

      instanceMethod1() {
        return 'instance method 1';
      }

      instanceMethod2() {
        return 'instance method 2';
      }

      get getterProperty() {
        return 'getter value';
      }

      set setterProperty(value) {
        this._setterProperty = value;
      }
    };
  }

  // Test cases
  testStaticMethods() {
    console.log('\n🧪 Testing static methods iteration...');
    
    const TestClass = this.createTestClass();
    const descriptors = [];
    
    iterateDescriptors(TestClass, ([key, descriptor]) => {
      descriptors.push({ key, type: typeof descriptor.value });
    });
    
    this.assertEqual(descriptors.length, 2, 'Should find 2 static methods');
    this.assert(descriptors.some(d => d.key === 'staticMethod1'), 'Should find staticMethod1');
    this.assert(descriptors.some(d => d.key === 'staticMethod2'), 'Should find staticMethod2');
    this.assert(descriptors.every(d => d.type === 'function'), 'All descriptors should be functions');
  }

  testInstanceMethods() {
    console.log('\n🧪 Testing instance methods iteration...');
    
    const TestClass = this.createTestClass();
    const descriptors = [];
    
    iterateDescriptors(TestClass.prototype, ([key, descriptor]) => {
      descriptors.push({ key, type: typeof descriptor.value });
    });
    
    this.assertEqual(descriptors.length, 4, 'Should find 4 instance methods/properties');
    this.assert(descriptors.some(d => d.key === 'instanceMethod1'), 'Should find instanceMethod1');
    this.assert(descriptors.some(d => d.key === 'instanceMethod2'), 'Should find instanceMethod2');
    this.assert(descriptors.some(d => d.key === 'getterProperty'), 'Should find getterProperty');
    this.assert(descriptors.some(d => d.key === 'setterProperty'), 'Should find setterProperty');
  }

  testConstructorExclusion() {
    console.log('\n🧪 Testing constructor exclusion...');
    
    const TestClass = this.createTestClass();
    const descriptors = [];
    
    iterateDescriptors(TestClass, ([key, descriptor]) => {
      descriptors.push(key);
    });
    
    this.assert(!descriptors.includes('constructor'), 'Constructor should be excluded from static methods');
    
    const prototypeDescriptors = [];
    iterateDescriptors(TestClass.prototype, ([key, descriptor]) => {
      prototypeDescriptors.push(key);
    });
    
    this.assert(!prototypeDescriptors.includes('constructor'), 'Constructor should be excluded from instance methods');
  }

  testEmptyClass() {
    console.log('\n🧪 Testing empty class...');
    
    const EmptyClass = class {};
    const descriptors = [];
    
    iterateDescriptors(EmptyClass, ([key, descriptor]) => {
      descriptors.push(key);
    });
    
    this.assertEqual(descriptors.length, 0, 'Empty class should have no static descriptors');
    
    const prototypeDescriptors = [];
    iterateDescriptors(EmptyClass.prototype, ([key, descriptor]) => {
      prototypeDescriptors.push(key);
    });
    
    this.assertEqual(prototypeDescriptors.length, 0, 'Empty class should have no instance descriptors');
  }

  testClassWithProperties() {
    console.log('\n🧪 Testing class with properties...');
    
    const TestClass = class {
      static staticProperty = 'static value';
      instanceProperty = 'instance value';
      
      static staticMethod() {}
      instanceMethod() {}
    };
    
    const staticDescriptors = [];
    iterateDescriptors(TestClass, ([key, descriptor]) => {
      staticDescriptors.push({ key, type: typeof descriptor.value });
    });
    
    const instanceDescriptors = [];
    iterateDescriptors(TestClass.prototype, ([key, descriptor]) => {
      instanceDescriptors.push({ key, type: typeof descriptor.value });
    });
    
    this.assert(staticDescriptors.some(d => d.key === 'staticMethod'), 'Should find static method');
    this.assert(staticDescriptors.some(d => d.key === 'staticProperty'), 'Should find static property');
    this.assert(instanceDescriptors.some(d => d.key === 'instanceMethod'), 'Should find instance method');
    this.assert(instanceDescriptors.some(d => d.key === 'instanceProperty'), 'Should find instance property');
  }

  testClassWithNonWritableProperties() {
    console.log('\n🧪 Testing class with non-writable properties...');
    
    const TestClass = class {
      static staticMethod() {}
      instanceMethod() {}
    };
    
    // Add non-writable properties
    Object.defineProperty(TestClass, 'readOnlyStatic', {
      value: 'readonly',
      writable: false
    });
    
    Object.defineProperty(TestClass.prototype, 'readOnlyInstance', {
      value: 'readonly',
      writable: false
    });
    
    const staticDescriptors = [];
    iterateDescriptors(TestClass, ([key, descriptor]) => {
      staticDescriptors.push(key);
    });
    
    const instanceDescriptors = [];
    iterateDescriptors(TestClass.prototype, ([key, descriptor]) => {
      instanceDescriptors.push(key);
    });
    
    this.assert(staticDescriptors.includes('staticMethod'), 'Should find writable static method');
    this.assert(!staticDescriptors.includes('readOnlyStatic'), 'Should not find non-writable static property');
    this.assert(instanceDescriptors.includes('instanceMethod'), 'Should find writable instance method');
    this.assert(!instanceDescriptors.includes('readOnlyInstance'), 'Should not find non-writable instance property');
  }

  testCallbackFunctionality() {
    console.log('\n🧪 Testing callback functionality...');
    
    const TestClass = this.createTestClass();
    let callbackCount = 0;
    const callbackKeys = [];
    
    iterateDescriptors(TestClass, ([key, descriptor]) => {
      callbackCount++;
      callbackKeys.push(key);
    });
    
    this.assertEqual(callbackCount, 2, 'Callback should be called for each descriptor');
    this.assertEqual(callbackKeys.length, 2, 'Should collect all keys');
    this.assert(callbackKeys.includes('staticMethod1'), 'Should include staticMethod1');
    this.assert(callbackKeys.includes('staticMethod2'), 'Should include staticMethod2');
  }

  testDescriptorStructure() {
    console.log('\n🧪 Testing descriptor structure...');
    
    const TestClass = this.createTestClass();
    let descriptorStructure = null;
    
    iterateDescriptors(TestClass, ([key, descriptor]) => {
      if (key === 'staticMethod1') {
        descriptorStructure = descriptor;
      }
    });
    
    this.assert(descriptorStructure !== null, 'Should receive descriptor object');
    this.assert(descriptorStructure.hasOwnProperty('value'), 'Descriptor should have value property');
    this.assert(descriptorStructure.hasOwnProperty('writable'), 'Descriptor should have writable property');
    this.assert(descriptorStructure.hasOwnProperty('enumerable'), 'Descriptor should have enumerable property');
    this.assert(descriptorStructure.hasOwnProperty('configurable'), 'Descriptor should have configurable property');
    this.assertEqual(typeof descriptorStructure.value, 'function', 'Value should be a function');
  }

  testNullAndUndefined() {
    console.log('\n🧪 Testing null and undefined handling...');
    
    try {
      iterateDescriptors(null, () => {});
      this.assert(false, 'Should throw error for null');
    } catch (error) {
      this.assert(error instanceof TypeError, 'Should throw TypeError for null');
    }
    
    try {
      iterateDescriptors(undefined, () => {});
      this.assert(false, 'Should throw error for undefined');
    } catch (error) {
      this.assert(error instanceof TypeError, 'Should throw TypeError for undefined');
    }
  }

  runAllTests() {
    console.log('🚀 Starting iterateDescriptors function tests...\n');
    
    try {
      this.testStaticMethods();
      this.testInstanceMethods();
      this.testConstructorExclusion();
      this.testEmptyClass();
      this.testClassWithProperties();
      this.testClassWithNonWritableProperties();
      this.testCallbackFunctionality();
      this.testDescriptorStructure();
      this.testNullAndUndefined();
      
      console.log(`\n📊 Test Results:`);
      console.log(`   Total tests: ${this.testCount}`);
      console.log(`   Passed: ${this.passedTests}`);
      console.log(`   Failed: ${this.failedTests}`);
      
      if (this.failedTests === 0) {
        console.log('\n🎉 All iterateDescriptors tests passed!');
      } else {
        console.log('\n❌ Some iterateDescriptors tests failed!');
      }
      
    } catch (error) {
      console.error('❌ Test suite error:', error);
    }
  }
}

// Run the test suite
const testSuite = new IterateDescriptorsTestSuite();
testSuite.runAllTests();
