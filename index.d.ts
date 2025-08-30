/**
 * Supplements a main class with methods from a partial class.
 * 
 * This function copies all static and instance methods from a partial class to a main class.
 * It supports both direct class references and dynamic imports via string paths.
 * The function automatically awaits dynamic imports and handles both default exports and direct exports.
 * 
 * @param mainClass - The target class to be supplemented with methods from the partial class
 * @param partialClass - The partial class, string path to partial class module, or promise resolving to a partial class
 * @returns Promise that resolves when the supplementation is complete
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
export function supplement(
  mainClass: Function, 
  partialClass: Function | string | Promise<Function>
): Promise<void>;

/**
 * Iterates over class descriptors, excluding the constructor.
 * 
 * This utility function iterates through all own property descriptors of a class
 * and calls the provided callback function for each descriptor, skipping the constructor.
 * It's used internally by the supplement function to copy methods from partial classes.
 * 
 * @param cls - The class to iterate over (can be a class constructor or class prototype)
 * @param cb - Callback function called for each descriptor
 * @param cb.0 - Array containing [key, descriptor] pair
 * @param cb.0.0 - The property key/name
 * @param cb.0.1 - The property descriptor
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
export function iterateDescriptors(
  cls: Function, 
  cb: (descriptor: [string, PropertyDescriptor]) => void
): void;
