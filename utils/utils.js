
import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Iterates over class descriptors, excluding the constructor.
 *
 * This utility function iterates through all own property descriptors of a class
 * and calls the provided callback function for each descriptor, skipping the constructor.
 * It's used internally by the supplement function to copy methods from partial classes.
 *
 * @param {Function} cls - The class to iterate over (can be a class constructor or class prototype)
 * @param {Function} cb - Callback function called for each descriptor
 * @param {Array} cb.0 - Array containing [key, descriptor] pair
 * @param {string} cb.0.0 - The property key/name
 * @param {PropertyDescriptor} cb.0.1 - The property descriptor
 * @returns {void}
 *
 * @example
 * // Iterate over class static methods
 * iterateDescriptors(MyClass, ([key, descriptor]) => {
 *   console.log(`Static method: ${key}`);
 * });
 *
 * @example
 * // Iterate over class instance methods
 * iterateDescriptors(MyClass.prototype, ([key, descriptor]) => {
 *   console.log(`Instance method: ${key}`);
 * });
 *
 * @since 1.0.0
 */

export function iterateDescriptors(cls, cb) {
  Object.entries(Object.getOwnPropertyDescriptors(cls)).forEach(
    ([key, value]) => key !== "constructor" && cb([key, value])
  );
}

/**
 * Gets the directory path from a file URL.
 * Useful for ES modules to get the current directory path.
 * 
 * @function myDir
 * @param {string} url - The import.meta.url or file URL
 * @returns {string} The directory path
 * 
 * @example
 * // In an ES module
 * const currentDir = myDir(import.meta.url);
 * console.log('Current directory:', currentDir);
 * 
 * @example
 * // Get directory of a specific file
 * const fileUrl = 'file:///path/to/file.js';
 * const dir = myDir(fileUrl);
 * 
 * @since 1.0.0
 */

export const myDir = (url) => {
  const __filename = fileURLToPath(url);
  return path.dirname(__filename);
};
