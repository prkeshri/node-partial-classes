/**
 * Validation partial class - JavaScript version
 * Provides validation methods for common data types
 */
export default class ValidationPartial {
  /**
   * Validates email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email format
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates if a value is required (not null, undefined, or empty string)
   * @param {any} value - Value to validate
   * @returns {boolean} True if value is not empty
   */
  validateRequired(value) {
    return value !== null && value !== undefined && value !== '';
  }

  /**
   * Validates phone number format (basic US format)
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid phone format
   */
  static validatePhone(phone) {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validates if a string has minimum length
   * @param {string} str - String to validate
   * @param {number} minLength - Minimum required length
   * @returns {boolean} True if string meets minimum length
   */
  validateMinLength(str, minLength) {
    return typeof str === 'string' && str.length >= minLength;
  }
}
