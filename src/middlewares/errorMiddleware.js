const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro
  logger.error(err.message, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Erros do Mongoose (se aplicável)
  if (err.name === 'CastError') {
    const message = 'Recurso não encontrado';
    error = { message, statusCode: 404 };
  }

  // Erros de validação do Joi
  if (err.isJoi) {
    const message = err.details[0].message;
    error = { message, statusCode: 400 };
  }

  // Erros do SQLite
  if (err.code && err.code.startsWith('SQLITE_')) {
    const message = 'Erro interno do servidor';
    error = { message, statusCode: 500 };
  }

  // Resposta padrão
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;