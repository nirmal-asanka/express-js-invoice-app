import moment from 'moment';
import logger from 'logger';
/**
 * Log class - has imported in the server.js and instanticated. This will write a line into express-js-invoice-app log file
 * You can pass a string or an object into the "message"
 */
class Log {
  constructor() {
    const logPath = process.env.LOG_PATH || './logs/express-js-invoice-app.log';
    this.log = logger.createLogger(logPath);
    const setLevel = process.env.LOG_LEVEL || 'PROD';
    this.log.setLevel(setLevel.toLowerCase());
  }

  /**
   * @param {*} message object | string
   */
  debug(message) {
    this.log.debug(this.formatLogMessage('DEBUG', message));
  }

  /**
   * @param {*} message object | string
   */
  info(message) {
    this.log.info(this.formatLogMessage('INFO', message));
  }

  /**
   * @param {*} message object | string
   */
  warn(message) {
    this.log.warn(this.formatLogMessage('WARN', message));
  }

  /**
   * @param {*} message object | string
   */
  error(message) {
    this.log.error(this.formatLogMessage('ERROR', message));
  }

  /**
   * @param {*} level string
   * @param {*} message object | string - this will JSON.stringify
   * @return - formatted log record
   */
  formatLogMessage(level, message) {
    const stringifiedMessage = JSON.stringify(message);
    return this.log.format(level, moment().format(), stringifiedMessage);
  }
}

export default Log;
