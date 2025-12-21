const Property = require('../../src/models/Property');

describe('Property Model', () => {
  describe('create', () => {
    it('deve criar uma propriedade com sucesso', (done) => {
      const propertyData = {
        title: 'Casa de Praia',
        description: 'Linda casa na praia',
        address: 'Rua da Praia, 123',
        price_per_night: 150.00,
        bedrooms: 3,
        bathrooms: 2,
        max_guests: 6,
        amenities: 'WiFi, Piscina',
        image_url: 'http://example.com/image.jpg'
      };

      Property.create(propertyData, (err, result) => {
        expect(err).toBeNull();
        expect(result).toHaveProperty('id');
        expect(result.title).toBe(propertyData.title);
        expect(result.price_per_night).toBe(propertyData.price_per_night);
        done();
      });
    });

    it('deve retornar erro se dados obrigatórios estiverem faltando', (done) => {
      const invalidData = {
        description: 'Descrição sem título'
      };

      Property.create(invalidData, (err, result) => {
        expect(err).not.toBeNull();
        expect(result).toBeNull();
        done();
      });
    });
  });

  describe('getAll', () => {
    it('deve retornar lista vazia quando não há propriedades', (done) => {
      Property.getAll((err, rows) => {
        expect(err).toBeNull();
        expect(rows).toEqual([]);
        done();
      });
    });

    it('deve retornar todas as propriedades', (done) => {
      const propertyData = {
        title: 'Apartamento Centro',
        address: 'Rua Central, 456',
        price_per_night: 100.00
      };

      Property.create(propertyData, (err) => {
        expect(err).toBeNull();

        Property.getAll((err, rows) => {
          expect(err).toBeNull();
          expect(rows.length).toBe(1);
          expect(rows[0].title).toBe(propertyData.title);
          done();
        });
      });
    });
  });

  describe('getById', () => {
    it('deve retornar propriedade por ID', (done) => {
      const propertyData = {
        title: 'Chalé na Montanha',
        address: 'Estrada da Montanha, 789',
        price_per_night: 200.00
      };

      Property.create(propertyData, (err, created) => {
        expect(err).toBeNull();

        Property.getById(created.id, (err, property) => {
          expect(err).toBeNull();
          expect(property.id).toBe(created.id);
          expect(property.title).toBe(propertyData.title);
          done();
        });
      });
    });

    it('deve retornar null se ID não existir', (done) => {
      Property.getById(999, (err, property) => {
        expect(err).toBeNull();
        expect(property).toBeUndefined();
        done();
      });
    });
  });

  describe('update', () => {
    it('deve atualizar propriedade com sucesso', (done) => {
      const propertyData = {
        title: 'Casa Velha',
        address: 'Rua Antiga, 111',
        price_per_night: 80.00
      };

      Property.create(propertyData, (err, created) => {
        expect(err).toBeNull();

        const updateData = {
          title: 'Casa Renovada',
          address: 'Rua Renovada, 222',
          price_per_night: 120.00
        };

        Property.update(created.id, updateData, (err, updated) => {
          expect(err).toBeNull();
          expect(updated.id).toBe(created.id);
          expect(updated.title).toBe(updateData.title);
          expect(updated.price_per_night).toBe(updateData.price_per_night);
          done();
        });
      });
    });
  });

  describe('delete', () => {
    it('deve deletar propriedade com sucesso', (done) => {
      const propertyData = {
        title: 'Casa para Deletar',
        address: 'Rua Deletar, 000',
        price_per_night: 50.00
      };

      Property.create(propertyData, (err, created) => {
        expect(err).toBeNull();

        Property.delete(created.id, (err, result) => {
          expect(err).toBeNull();
          expect(result.message).toBe('Property deleted successfully');
          expect(result.affectedRows).toBe(1);
          done();
        });
      });
    });
  });
});