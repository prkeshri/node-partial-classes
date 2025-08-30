import fs from 'fs/promises';
import path from 'path';
import { iterateDescriptors, myDir } from './utils/utils.js';
import { addSupplementationMetadata } from './utils/metadata.js';
import { SUPPLEMENTED_SYMBOLS } from './utils/metadata.js';
import * as tsImport from 'ts-import';

/**
 * Supplements a main class with methods from a partial class.
 *
 * This function copies all static and instance methods from a partial class to a main class.
 * It supports both direct class references and dynamic imports via string paths.
 * The function automatically awaits dynamic imports and handles both default exports and direct exports.
 *
 * @async
 * @param {Function} mainClass - The target class to be supplemented with methods from the partial class
 * @param {Function|string|Promise<Function>} partialClass - The partial class, string path to partial class module, or promise resolving to a partial class
 * @returns {Promise<void>} A promise that resolves when the supplementation is complete
 *
 * @example
 * // Using with direct class reference
 * class MainClass {
 *   static {
 *     supplement(this, PartialClass);
 *   }
 * }
 *
 * @example
 * // Using with dynamic import
 * class MainClass {
 *   static {
 *     supplement(this, import('./partial-class.js'));
 *   }
 * }
 *
 * @example
 * // Using with string path (will be dynamically imported)
 * class MainClass {
 *   static {
 *     supplement(this, './path/to/partial-class.js');
 *   }
 * }
 *
 * @throws {Error} If the partial class cannot be imported or is invalid
 * @since 1.0.0
 */
export async function supplement(mainClass, partialClass) {
  addSupplementationMetadata(mainClass);
  let partialClassOrPath = partialClass; // To debug
  if (typeof partialClass === "string") {
    if(partialClass.endsWith(".ts")) {
      partialClass = tsImport.load(partialClass);
    } else {
      partialClass = import(partialClass);
    }
  }
  partialClass = await partialClass;
  const PartialClass = partialClass.default || partialClass;

  mainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_STARTED_SINGLE]();

  iterateDescriptors(PartialClass.prototype, ([key, value]) => {
    if (!value.writable) {
      return;
    }
    mainClass.prototype[key] = value.value;
  });

  iterateDescriptors(PartialClass, ([key, value]) => {
    if (!value.writable) {
      return;
    }
    mainClass[key] = value.value;
  });

  mainClass[SUPPLEMENTED_SYMBOLS.SUPPLEMENTATION_ENDED_SINGLE]();
}

/**
 * Supplements a main class with methods from all partial classes in a directory.
 *
 * This function scans a directory for JavaScript and TypeScript files and automatically
 * supplements the main class with methods from each partial class found. It supports
 * various file extensions including .js, .ts, .mjs, and .cjs.
 *
 * @async
 * @param {Function} mainClass - The target class to be supplemented with methods from partial classes
 * @param {string} directory - The directory path to scan for partial class files. Should be the absolute path. Can be obtained using the myDir function.
 * @returns {Promise<void>} A promise that resolves after the supplementation is complete
 *
 * @example
 * // Supplement with all partial classes in a directory
 * class MainClass {
 *   static {
 *     supplementAll(this, './partial-classes');
 *   }
 * }
 *
 * @example
 * // Using with async/await
 * async function setupClass() {
 *   await supplementAll(MainClass, './partial-classes');
 * }
 *
 * @throws {Error} If the directory cannot be read or partial classes cannot be imported
 * @since 1.0.0
 */
export async function supplementAll(mainClass, directory) {
  const files = await fs.readdir(directory);

  // Define valid file extensions for partial classes
  const validExtensions = ['.js', '.ts', '.mjs', '.cjs'];
  
  for (const file of files) {
    // Use flexible extension checking for better compatibility
    const fileExtension = path.extname(file);
    if (validExtensions.includes(fileExtension)) {
      const modulePath = path.join(directory, file);
      supplement(mainClass, modulePath);
    }
  }
}

export { iterateDescriptors, SUPPLEMENTED_SYMBOLS, myDir };