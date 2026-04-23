import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), '..', 'logs', 'backend');

class Logger {
  static logLogin(email, userId, firstName, success = true) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      event: 'login',
      email,
      userId,
      firstName,
      success,
      ip: null // Could be added later with req.ip
    };

    const logFile = path.join(LOG_DIR, 'login.log');
    const logLine = JSON.stringify(logEntry) + '\n';

    fs.appendFile(logFile, logLine, (err) => {
      if (err) {
        console.error('Failed to write login log:', err);
      }
    });
  }

  static logError(message, error) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: 'error',
      message,
      error: error.message || error
    };

    const logFile = path.join(LOG_DIR, 'error.log');
    const logLine = JSON.stringify(logEntry) + '\n';

    fs.appendFile(logFile, logLine, (err) => {
      if (err) {
        console.error('Failed to write error log:', err);
      }
    });
  }
}

export default Logger;