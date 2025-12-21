const mockSqlite3 = require('sqlite3').verbose();

// Mock do módulo de database para usar DB em memória
jest.mock('../src/database/database', () => {
  const db = new mockSqlite3.Database(':memory:');

  // Inicializar tabelas
  db.serialize(() => {
    db.run(`
      CREATE TABLE properties (
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

    db.run(`
      CREATE TABLE reservations (
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

  return db;
});

// Limpar dados entre testes
beforeEach((done) => {
  const db = require('../src/database/database');
  db.exec('DELETE FROM reservations; DELETE FROM properties;', done);
});