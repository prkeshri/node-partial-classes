
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
  if (typeof partialClass === "string") {
    partialClass = import(partialClass);
  }
  partialClass = await partialClass;
  const PartialClass = partialClass.default || partialClass;
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
}

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
