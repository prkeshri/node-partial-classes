/**
 * TypeScript utility types for partial class supplementation.
 * 
 * This module provides type utilities that help TypeScript understand the combined
 * structure of main classes and partial classes after supplementation.
 * 
 * @module types
 * @since 1.0.0
 */

/**
 * Recursively combines instance types from an array of class constructors.
 * 
 * This utility type takes an array of class constructors and merges their
 * instance types together, creating a union type that represents all possible
 * instance properties and methods.
 * 
 * @template T - Array of class constructors
 * @returns Union type of all instance types
 * 
 * @example
 * ```typescript
 * class User { name: string; }
 * class Admin { role: string; }
 * 
 * type UserOrAdmin = CombineInstances<[typeof User, typeof Admin]>;
 * // Result: { name: string } | { role: string }
 * ```
 * 
 * @since 1.0.0
 */
export type CombineInstances<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First & CombineInstances<Rest>
  : unknown;

/**
 * Extracts instance types from an array of class constructors.
 * 
 * This utility type maps over an array of class constructors and extracts
 * the instance type of each class, creating an array of instance types.
 * 
 * @template T - Array of class constructors
 * @returns Array of instance types
 * 
 * @example
 * ```typescript
 * class User { name: string; }
 * class Admin { role: string; }
 * 
 * type InstanceArray = Instances<[typeof User, typeof Admin]>;
 * // Result: [{ name: string }, { role: string }]
 * ```
 * 
 * @since 1.0.0
 */
export type Instances<T extends Array<new (...args: any) => any>> = {
  [K in keyof T]: T[K] extends new (...args: any) => infer R ? R : never;
};

/**
 * Combines multiple class constructors into a single combined type.
 * 
 * This is the main utility type that combines the static and instance
 * properties of multiple classes. It's particularly useful for creating
 * type definitions that represent classes after supplementation with
 * partial classes.
 * 
 * @template T - Array of class constructors to combine
 * @returns Combined type with all static and instance properties
 * 
 * @example
 * ```typescript
 * import { supplement } from 'js-partial-classes';
 * 
 * class Home {
 *   constructor() {
 *     supplement(this, import('./HomePartial'));
 *   }
 *   
 *   homeMethod() { return 'home'; }
 * }
 * 
 * class HomePartial {
 *   static staticMethod() { return 'static'; }
 *   partialMethod() { return 'partial'; }
 * }
 * 
 * // Create a type that represents the combined class
 * export type HomeFull = Combine<[typeof Home, typeof HomePartial]>;
 * 
 * // HomeFull now includes:
 * // - All static methods from Home and HomePartial
 * // - All instance methods from Home and HomePartial
 * // - All properties from both classes
 * ```
 * 
 * @example
 * ```typescript
 * // For multiple partial classes
 * class UserService {
 *   constructor() {
 *     supplement(this, import('./ValidationPartial'));
 *     supplement(this, import('./UtilitiesPartial'));
 *   }
 * }
 * 
 * class ValidationPartial {
 *   static validateEmail(email: string): boolean { return true; }
 *   validateRequired(value: any): boolean { return true; }
 * }
 * 
 * class UtilitiesPartial {
 *   static formatDate(date: Date): string { return date.toISOString(); }
 *   formatCurrency(amount: number): string { return `$${amount}`; }
 * }
 * 
 * export type UserServiceFull = Combine<[
 *   typeof UserService, 
 *   typeof ValidationPartial, 
 *   typeof UtilitiesPartial
 * ]>;
 * ```
 * 
 * @since 1.0.0
 */
export type Combine<T extends Array<new (...args: any) => any>> = CombineInstances<Instances<T>>;




