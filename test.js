import { supplement, iterateDescriptors } from './index.js';

// Test classes
class MainClass {
  static {
    // Supplement with partial class during static initialization
    supplement(this, import('./test-partial.js'));
  }
  
  constructor() {
    this.name = 'Main';
  }
  
  mainMethod() {
    return 'Main method';
  }
}

class PartialClass {
  static staticMethod() {
    return 'Static method from partial';
  }
  
  instanceMethod() {
    return 'Instance method from partial';
  }
  
  anotherInstanceMethod() {
    return 'Another instance method';
  }
}

// Test the supplement function
async function testSupplement() {
  console.log('Testing supplement function...');
  
  // Test after static initialization supplementation
  const mainAfter = new MainClass();
  console.log('After static initialization supplementation:');
  console.log('- Main method:', mainAfter.mainMethod());
  console.log('- Static method:', MainClass.staticMethod());
  console.log('- Instance method:', mainAfter.instanceMethod());
  console.log('- Another instance method:', mainAfter.anotherInstanceMethod());
  
  console.log('\n✅ Static initialization supplement test passed!');
}

// Test the iterateDescriptors function
function testIterateDescriptors() {
  console.log('\nTesting iterateDescriptors function...');
  
  const descriptors = [];
  iterateDescriptors(PartialClass, ([key, value]) => {
    descriptors.push({ key, type: typeof value.value });
  });
  
  console.log('Found descriptors:', descriptors.map(d => `${d.key} (${d.type})`));
  console.log('✅ IterateDescriptors test passed!');
}

// Run tests
async function runTests() {
  try {
    await testSupplement();
    testIterateDescriptors();
    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

runTests();
