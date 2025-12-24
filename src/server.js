const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração de rotas
const propertyRoutes = require('./routes/propertyRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

app.use('/api/properties', propertyRoutes);
app.use('/api/reservations', reservationRoutes);

// Middleware de erro global
const errorHandler = require('./middlewares/errorMiddleware');
app.use(errorHandler);

// Configuração do banco de dados
const db = require('./database/database');

// Inicialização do servidor
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;