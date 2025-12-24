const winston = require('winston');

// Formato personalizado
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Transports
const transports = [
  // Console para desenvolvimento
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  // Arquivo para produção
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: customFormat,
  }),
  new winston.transports.File({
    filename: 'logs/combined.log',
    format: customFormat,
  }),
];

// Logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  transports,
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

module.exports = logger;