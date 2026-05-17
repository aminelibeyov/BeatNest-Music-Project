const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const logsDir = path.join(__dirname, '../../logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const morganMiddleware = morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms');

const logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] ${message}`, meta);
    logToFile('info', message, meta);
  },

  error: (message, meta = {}) => {
    console.error(`[ERROR] ${message}`, meta);
    logToFile('error', message, meta);
  },

  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${message}`, meta);
    logToFile('warn', message, meta);
  },

  debug: (message, meta = {}) => {
    console.log(`[DEBUG] ${message}`, meta);
    logToFile('debug', message, meta);
  }
};

const logToFile = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message} ${JSON.stringify(meta)}\n`;
  const logPath = path.join(logsDir, `${level}.log`);

  fs.appendFileSync(logPath, logMessage);
};

module.exports = { logger, morganMiddleware };
