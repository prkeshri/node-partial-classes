/**
 * Logger partial class - CommonJS version
 * Provides logging methods with different levels and formatting
 */

class LoggerPartial {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  /**
   * Logs an error message
   * @param {string} message - Error message
   * @param {Error} error - Error object (optional)
   */
  logError(message, error = null) {
    if (this.shouldLog('error')) {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] ERROR: ${message}`);
      if (error) {
        console.error(error.stack || error);
      }
    }
  }

  /**
   * Logs a warning message
   * @param {string} message - Warning message
   * @param {Object} data - Additional data (optional)
   */
  logWarn(message, data = null) {
    if (this.shouldLog('warn')) {
      const timestamp = new Date().toISOString();
      console.warn(`[${timestamp}] WARN: ${message}`);
      if (data) {
        console.warn(data);
      }
    }
  }

  /**
   * Logs an info message
   * @param {string} message - Info message
   * @param {Object} data - Additional data (optional)
   */
  logInfo(message, data = null) {
    if (this.shouldLog('info')) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] INFO: ${message}`);
      if (data) {
        console.log(data);
      }
    }
  }

  /**
   * Logs a debug message
   * @param {string} message - Debug message
   * @param {Object} data - Additional data (optional)
   */
  logDebug(message, data = null) {
    if (this.shouldLog('debug')) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] DEBUG: ${message}`);
      if (data) {
        console.log(data);
      }
    }
  }

  /**
   * Checks if a log level should be output based on current log level
   * @param {string} level - Log level to check
   * @returns {boolean} True if should log
   */
  shouldLog(level) {
    return this.levels[level] <= this.levels[this.logLevel];
  }

  /**
   * Sets the log level
   * @param {string} level - New log level
   */
  setLogLevel(level) {
    if (this.levels.hasOwnProperty(level)) {
      this.logLevel = level;
    } else {
      this.logWarn(`Invalid log level: ${level}. Using 'info' instead.`);
      this.logLevel = 'info';
    }
  }

  /**
   * Creates a logger instance with custom configuration
   * @param {Object} config - Logger configuration
   * @returns {LoggerPartial} Logger instance
   */
  static createLogger(config = {}) {
    const logger = new LoggerPartial();
    if (config.logLevel) {
      logger.setLogLevel(config.logLevel);
    }
    return logger;
  }

  /**
   * Formats a log message with additional context
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} context - Additional context
   * @returns {string} Formatted log message
   */
  static formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const contextStr = Object.keys(context).length > 0 
      ? ` | ${JSON.stringify(context)}` 
      : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }
}

module.exports = LoggerPartial;
