const AppError = require('./AppError');

class ValidationError extends AppError {
  constructor(message = 'Dados de entrada inválidos') {
    super(message, 400);
  }
}

module.exports = ValidationError;