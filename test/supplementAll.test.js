import { supplementAll, myDir } from "../index.js";
import fs from "fs/promises";
import path from "path";
import { SUPPLEMENTED_SYMBOLS } from "../utils/metadata.js";

/**
 * Test suite for the supplementAll function
 */
class SupplementAllTestSuite {
  constructor() {
    this.testCount = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.testDir = path.join(myDir(import.meta.url), "test-partial-classes");
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

  // Setup and teardown
  async setupTestDirectory() {
    try {
      await fs.mkdir(this.testDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  async cleanupTestDirectory() {
    try {
      await fs.rm(this.testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  async createTestFile(filename, content) {
    const filePath = path.join(this.testDir, filename);
    await fs.writeFile(filePath, content);
  }

  // Test classes
  createMainClass() {
    return class MainClass {
      constructor() {
        this.name = "Main";
      }

      mainMethod() {
        return "Main method";
      }
    };
  }

  // Test cases
  async testJavaScriptFiles() {
    console.log("\n🧪 Testing JavaScript files (.js)...");

    await this.createTestFile(
      "validation.js",
      `
export default class ValidationPartial {
  static validateEmail(email) {
    return email.includes('@');
  }
  
  validateRequired(value) {
    return value !== null && value !== undefined && value !== '';
  }
}
    `
    );

    const MainClass = this.createMainClass();
    await supplementAll(MainClass, this.testDir);
    await MainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COMPLETED];

    const instance = new MainClass();

    this.assertEqual(
      instance.mainMethod(),
      "Main method",
      "Main method should remain unchanged"
    );
    this.assertEqual(
      MainClass.validateEmail("test@example.com"),
      true,
      "Static method from .js should be supplemented"
    );
    this.assertEqual(
      instance.validateRequired("hello"),
      true,
      "Instance method from .js should be supplemented"
    );
  }

  async testTypeScriptFiles() {
    console.log("\n🧪 Testing TypeScript files (.ts)...");

    await this.createTestFile(
      "utilities.ts",
      `
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
    `
    );

    const MainClass = this.createMainClass();
    await supplementAll(MainClass, this.testDir);
    await MainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COMPLETED];

    const instance = new MainClass();

    this.assertEqual(
      instance.mainMethod(),
      "Main method",
      "Main method should remain unchanged"
    );
    this.assertEqual(
      typeof MainClass.formatDate,
      "function",
      "Static method from .ts should be supplemented"
    );
    this.assertEqual(
      typeof instance.formatCurrency,
      "function",
      "Instance method from .ts should be supplemented"
    );
  }

  async testESModuleFiles() {
    console.log("\n🧪 Testing ES Module files (.mjs)...");

    await this.createTestFile(
      "api.mjs",
      `
export default class ApiPartial {
  static async get(url) {
    return { data: 'mock response' };
  }
  
  async post(url, data) {
    return { success: true, data };
  }
}
    `
    );

    const MainClass = this.createMainClass();
    await supplementAll(MainClass, this.testDir);
    await MainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COMPLETED];

    const instance = new MainClass();

    this.assertEqual(
      instance.mainMethod(),
      "Main method",
      "Main method should remain unchanged"
    );
    this.assertEqual(
      typeof MainClass.get,
      "function",
      "Static method from .mjs should be supplemented"
    );
    this.assertEqual(
      typeof instance.post,
      "function",
      "Instance method from .mjs should be supplemented"
    );
  }

  async testCommonJSFiles() {
    console.log("\n🧪 Testing CommonJS files (.cjs)...");

    await this.createTestFile(
      "logger.cjs",
      `
class LoggerPartial {
  static logInfo(message) {
    return 'INFO: ' + message;
  }
  
  logError(message) {
    return 'ERROR: ' + message;
  }
}

module.exports = LoggerPartial;
    `
    );

    const MainClass = this.createMainClass();
    await supplementAll(MainClass, this.testDir);
    await MainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COMPLETED];

    const instance = new MainClass();

    this.assertEqual(
      instance.mainMethod(),
      "Main method",
      "Main method should remain unchanged"
    );
    this.assertEqual(
      typeof MainClass.logInfo,
      "function",
      "Static method from .cjs should be supplemented"
    );
    this.assertEqual(
      typeof instance.logError,
      "function",
      "Instance method from .cjs should be supplemented"
    );
  }

  async testMixedFileTypes() {
    console.log("\n🧪 Testing mixed file types...");

    // Create multiple files with different extensions
    await this.createTestFile(
      "validation.js",
      `
export default class ValidationPartial {
  static validateEmail(email) {
    return email.includes('@');
  }
}
    `
    );

    await this.createTestFile(
      "utilities.ts",
      `
export default class UtilitiesPartial {
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
    `
    );

    await this.createTestFile(
      "api.mjs",
      `
export default class ApiPartial {
  static async get(url) {
    return { data: 'mock response' };
  }
}
    `
    );

    await this.createTestFile(
      "logger.cjs",
      `
class LoggerPartial {
  static logInfo(message) {
    return 'INFO: ' + message;
  }
}

module.exports = LoggerPartial;
    `
    );

    const MainClass = this.createMainClass();
    await supplementAll(MainClass, this.testDir);
    await MainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COMPLETED];

    const instance = new MainClass();

    this.assertEqual(
      instance.mainMethod(),
      "Main method",
      "Main method should remain unchanged"
    );
    this.assertEqual(
      MainClass.validateEmail("test@example.com"),
      true,
      "Method from .js should be supplemented"
    );
    this.assertEqual(
      typeof MainClass.formatDate,
      "function",
      "Method from .ts should be supplemented"
    );
    this.assertEqual(
      typeof MainClass.get,
      "function",
      "Method from .mjs should be supplemented"
    );
    this.assertEqual(
      typeof MainClass.logInfo,
      "function",
      "Method from .cjs should be supplemented"
    );
  }

  async testNonSupportedFiles() {
    console.log("\n🧪 Testing non-supported files...");

    await this.createTestFile(
      "config.json",
      `
{
  "setting": "value"
}
    `
    );

    await this.createTestFile(
      "readme.md",
      `
# Test file
This should not be loaded.
    `
    );

    await this.createTestFile(
      "data.txt",
      `
This is a text file.
    `
    );

    const MainClass = this.createMainClass();
    await supplementAll(MainClass, this.testDir);
    await MainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COMPLETED];

    const instance = new MainClass();

    this.assertEqual(
      instance.mainMethod(),
      "Main method",
      "Main method should remain unchanged"
    );
    this.assert(
      !MainClass.hasOwnProperty("setting"),
      "JSON files should not be loaded"
    );
    this.assert(
      !MainClass.hasOwnProperty("readme"),
      "MD files should not be loaded"
    );
    this.assert(
      !MainClass.hasOwnProperty("data"),
      "TXT files should not be loaded"
    );
  }

  async testEmptyDirectory() {
    console.log("\n🧪 Testing empty directory...");

    const emptyDir = path.join(myDir(import.meta.url), "test-empty-dir");
    await fs.mkdir(emptyDir, { recursive: true });

    const MainClass = this.createMainClass();
    await supplementAll(MainClass, emptyDir);
    await MainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COMPLETED];

    const instance = new MainClass();

    this.assertEqual(
      instance.mainMethod(),
      "Main method",
      "Main method should remain unchanged"
    );

    await fs.rm(emptyDir, { recursive: true, force: true });
  }

  async testInvalidDirectory() {
    console.log("\n🧪 Testing invalid directory...");

    const MainClass = this.createMainClass();
    await MainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_COMPLETED];

    try {
      const nonExistentDir = path.join(myDir(import.meta.url), 'non-existent-directory');
      await supplementAll(MainClass, nonExistentDir);
      this.assert(false, "Should throw error for non-existent directory");
    } catch (error) {
      this.assert(
        error instanceof Error,
        "Should throw Error for invalid directory"
      );
    }
  }

  async runAllTests() {
    console.log("🚀 Starting supplementAll function tests...\n");

    try {
      await this.setupTestDirectory();

      await this.testJavaScriptFiles();
      await this.testTypeScriptFiles();
      await this.testESModuleFiles();
      await this.testCommonJSFiles();
      await this.testMixedFileTypes();
      await this.testNonSupportedFiles();
      await this.testEmptyDirectory();
      await this.testInvalidDirectory();

      console.log(`\n📊 Test Results:`);
      console.log(`   Total tests: ${this.testCount}`);
      console.log(`   Passed: ${this.passedTests}`);
      console.log(`   Failed: ${this.failedTests}`);

      if (this.failedTests === 0) {
        console.log("\n🎉 All supplementAll tests passed!");
      } else {
        console.log("\n❌ Some supplementAll tests failed!");
      }
    } catch (error) {
      console.error("❌ Test suite error:", error);
    } finally {
      await this.cleanupTestDirectory();
    }
  }
}

// Run the test suite
const testSuite = new SupplementAllTestSuite();
testSuite.runAllTests();
