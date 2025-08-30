import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Main test runner that executes all test suites
 */
class TestRunner {
  constructor() {
    this.testSuites = [
  /*    'basic.test.js',
      'supplement.test.js', */
      'supplementAll.test.js',
      'iterateDescriptors.test.js'
    ];
    this.results = [];
  }

  async runTestSuite(testFile) {
    console.log(`\n🚀 Running ${testFile}...`);
    console.log('='.repeat(50));
    
    try {
      const { stdout, stderr } = await execAsync(`node test/${testFile}`, {
        cwd: process.cwd()
      });
      
      if (stdout) {
        console.log(stdout);
      }
      
      if (stderr) {
        console.error(stderr);
      }
      
      return {
        file: testFile,
        success: true,
        output: stdout,
        error: stderr
      };
      
    } catch (error) {
      console.error(`❌ Failed to run ${testFile}:`, error.message);
      return {
        file: testFile,
        success: false,
        error: error.message
      };
    }
  }

  async runAllTests() {
    console.log('🧪 Starting comprehensive test suite...\n');
    console.log('📋 Test suites to run:');
    this.testSuites.forEach(suite => console.log(`   - ${suite}`));
    
    const startTime = Date.now();
    
    for (const testFile of this.testSuites) {
      const result = await this.runTestSuite(testFile);
      this.results.push(result);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    this.printSummary(duration);
  }

  printSummary(duration) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE TEST SUMMARY');
    console.log('='.repeat(60));
    
    const successfulTests = this.results.filter(r => r.success);
    const failedTests = this.results.filter(r => !r.success);
    
    console.log(`\n⏱️  Total execution time: ${duration}ms`);
    console.log(`📁 Test suites executed: ${this.results.length}`);
    console.log(`✅ Successful: ${successfulTests.length}`);
    console.log(`❌ Failed: ${failedTests.length}`);
    
    if (successfulTests.length > 0) {
      console.log('\n✅ Successful test suites:');
      successfulTests.forEach(result => {
        console.log(`   - ${result.file}`);
      });
    }
    
    if (failedTests.length > 0) {
      console.log('\n❌ Failed test suites:');
      failedTests.forEach(result => {
        console.log(`   - ${result.file}: ${result.error}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (failedTests.length === 0) {
      console.log('🎉 ALL TESTS PASSED! The library is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please review the errors above.');
    }
    
    console.log('='.repeat(60));
  }
}

// Run all tests
const runner = new TestRunner();
runner.runAllTests().catch(error => {
  console.error('❌ Test runner error:', error);
  process.exit(1);
});
