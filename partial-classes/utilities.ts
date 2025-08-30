/**
 * Utilities partial class - TypeScript version
 * Provides common utility methods for data formatting and manipulation
 */
export default class UtilitiesPartial {
  /**
   * Formats a date to ISO string format
   * @param date - Date to format
   * @returns Formatted date string
   */
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Formats a number as currency
   * @param amount - Amount to format
   * @param currency - Currency code (default: USD)
   * @param locale - Locale for formatting (default: en-US)
   * @returns Formatted currency string
   */
  formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Capitalizes the first letter of a string
   * @param str - String to capitalize
   * @returns Capitalized string
   */
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Generates a random string of specified length
   * @param length - Length of the random string
   * @returns Random string
   */
  generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Debounces a function call
   * @param func - Function to debounce
   * @param delay - Delay in milliseconds
   * @returns Debounced function
   */
  static debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }
}
