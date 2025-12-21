const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o arquivo do banco de dados
const dbPath = path.resolve(__dirname, '../../database.sqlite');

// Conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite');
    initializeDatabase();
  }
});

// Função para inicializar o banco de dados
function initializeDatabase() {
  db.serialize(() => {
    // Criação da tabela de propriedades
    db.run(`
      CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        address TEXT NOT NULL,
        price_per_night REAL NOT NULL,
        bedrooms INTEGER,
        bathrooms INTEGER,
        max_guests INTEGER,
        amenities TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criação da tabela de reservas
    db.run(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        property_id INTEGER NOT NULL,
        guest_name TEXT NOT NULL,
        guest_email TEXT NOT NULL,
        check_in_date TEXT NOT NULL,
        check_out_date TEXT NOT NULL,
        total_price REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id)
      )
    `);
  });
}

module.exports = db;