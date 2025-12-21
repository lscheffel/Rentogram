const AppError = require('./AppError');

class DatabaseError extends AppError {
  constructor(message = 'Erro no banco de dados') {
    super(message, 500);
  }
}

module.exports = DatabaseError;