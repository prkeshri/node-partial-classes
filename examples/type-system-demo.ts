/**
 * TypeScript Type System Demo
 * 
 * This example demonstrates how to use the advanced type system
 * provided by js-partial-classes for better TypeScript support.
 * 
 * Note: This is a demonstration of the type system. In practice,
 * the supplement function would be called at runtime.
 */

import { supplement, Combine } from '../index.js';

// Example 1: Basic class combination
class HomePartial {
  static staticMethod() { 
    return 'This is a static method from partial'; 
  }
  
  partialMethod() { 
    return 'This is a partial method'; 
  }
}

class Home {
  // In practice, this would be called in a static initialization block
  // static { supplement(this, HomePartial); }
  
  homeMethod() { 
    return 'This is the home method'; 
  }
}

// Create a combined type that represents the supplemented class
export type HomeFull = Combine<[typeof Home, typeof HomePartial]>;

// Example 2: Multiple partial classes
class ValidationPartial {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  validateRequired(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }
  
  validateMinLength(str: string, minLength: number): boolean {
    return typeof str === 'string' && str.length >= minLength;
  }
}

class UtilitiesPartial {
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
  
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}

class UserService {
  private users: any[] = [];
  
  // In practice, this would be called in a static initialization block
  // static { 
  //   supplement(this, ValidationPartial);
  //   supplement(this, UtilitiesPartial);
  // }
  
  addUser(user: any) { 
    this.users.push(user); 
  }
  
  getUsers() { 
    return this.users; 
  }
}

// Create a combined type for the fully supplemented UserService
export type UserServiceFull = Combine<[
  typeof UserService, 
  typeof ValidationPartial, 
  typeof UtilitiesPartial
]>;

// Example 3: Using CombineSingle for simpler cases
class SimplePartial {
  static helper() { 
    return 'Helper method'; 
  }
  
  utility() { 
    return 'Utility method'; 
  }
}

class SimpleClass {
  // In practice, this would be called in a static initialization block
  // static { supplement(this, SimplePartial); }
  
  simpleMethod() { 
    return 'Simple method'; 
  }
}

export type SimpleClassFull = Combine<[typeof SimpleClass, typeof SimplePartial]>;

// Example 4: Type assertion usage
function demonstrateTypeAssertion() {
  // Create instances with type assertion
  const home = new Home() as HomeFull;
  const userService = new UserService() as UserServiceFull;
  const simpleClass = new SimpleClass() as SimpleClassFull;
  
  console.log('Type assertion examples:');
  console.log('  home:', typeof home);
  console.log('  userService:', typeof userService);
  console.log('  simpleClass:', typeof simpleClass);
}

// Example 5: Type demonstration (not runtime execution)
function demonstrateTypes() {
  console.log('🚀 TypeScript Type System Demo\n');
  
  console.log('1. Type Definitions Created:');
  console.log('   ✅ HomeFull type combines Home + HomePartial');
  console.log('   ✅ UserServiceFull type combines UserService + ValidationPartial + UtilitiesPartial');
  console.log('   ✅ SimpleClassFull type combines SimpleClass + SimplePartial');
  console.log();
  
  console.log('2. Type System Benefits:');
  console.log('   ✅ No @ts-ignore comments needed');
  console.log('   ✅ Full IntelliSense support');
  console.log('   ✅ Type safety for supplemented methods');
  console.log('   ✅ Compile-time error checking');
  console.log();
  
  console.log('3. Usage Pattern:');
  console.log('   ```typescript');
  console.log('   // Define your partial classes');
  console.log('   class HomePartial { ... }');
  console.log('   ');
  console.log('   // Define your main class with static initialization');
  console.log('   class Home {');
  console.log('     static {');
  console.log('       supplement(this, HomePartial);');
  console.log('     }');
  console.log('   }');
  console.log('   ');
  console.log('   // Create a combined type');
  console.log('   export type HomeFull = Combine<[typeof Home, typeof HomePartial]>;');
  console.log('   ```');
  console.log();
  
  console.log('4. Runtime vs Compile Time:');
  console.log('   - Types are created at compile time');
  console.log('   - Supplementation happens at runtime');
  console.log('   - TypeScript understands the final structure');
  console.log();
  
  console.log('5. Type Assertion Pattern:');
  console.log('   - Use "as" keyword for type assertion');
  console.log('   - Example: const service = new UserService() as UserServiceFull;');
  console.log('   - This tells TypeScript about the supplemented structure');
  console.log();
  
  // Demonstrate type assertion
  demonstrateTypeAssertion();
  
  console.log('\n✅ Type system demonstration completed!');
  console.log('   The types are now available for use in your TypeScript code.');
  console.log('   Remember to use type assertion (as) when creating instances!');
}

// Run the type demonstration
demonstrateTypes();
