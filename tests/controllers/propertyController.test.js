const request = require('supertest');
const app = require('../../src/server');

describe('Property Controller', () => {
  describe('POST /api/properties', () => {
    it('deve criar uma propriedade com sucesso', async () => {
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

      const response = await request(app)
        .post('/api/properties')
        .send(propertyData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(propertyData.title);
      expect(response.body.price_per_night).toBe(propertyData.price_per_night);
    });

    it('deve retornar erro 400 se dados inválidos', async () => {
      const invalidData = {
        description: 'Descrição sem título'
      };

      const response = await request(app)
        .post('/api/properties')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/properties', () => {
    it('deve retornar lista de propriedades', async () => {
      // Criar uma propriedade primeiro
      const propertyData = {
        title: 'Apartamento Centro',
        address: 'Rua Central, 456',
        price_per_night: 100.00
      };

      await request(app)
        .post('/api/properties')
        .send(propertyData)
        .expect(201);

      const response = await request(app)
        .get('/api/properties')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title');
    });
  });

  describe('GET /api/properties/:id', () => {
    it('deve retornar propriedade por ID', async () => {
      const propertyData = {
        title: 'Chalé na Montanha',
        address: 'Estrada da Montanha, 789',
        price_per_night: 200.00
      };

      const createResponse = await request(app)
        .post('/api/properties')
        .send(propertyData)
        .expect(201);

      const response = await request(app)
        .get(`/api/properties/${createResponse.body.id}`)
        .expect(200);

      expect(response.body.id).toBe(createResponse.body.id);
      expect(response.body.title).toBe(propertyData.title);
    });

    it('deve retornar 404 se ID não existir', async () => {
      const response = await request(app)
        .get('/api/properties/999')
        .expect(404);

      expect(response.body.message).toBe('Property not found');
    });
  });

  describe('PUT /api/properties/:id', () => {
    it('deve atualizar propriedade com sucesso', async () => {
      const propertyData = {
        title: 'Casa Velha',
        address: 'Rua Antiga, 111',
        price_per_night: 80.00
      };

      const createResponse = await request(app)
        .post('/api/properties')
        .send(propertyData)
        .expect(201);

      const updateData = {
        title: 'Casa Renovada',
        address: 'Rua Renovada, 222',
        price_per_night: 120.00
      };

      const response = await request(app)
        .put(`/api/properties/${createResponse.body.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(createResponse.body.id);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.price_per_night).toBe(updateData.price_per_night);
    });
  });

  describe('DELETE /api/properties/:id', () => {
    it('deve deletar propriedade com sucesso', async () => {
      const propertyData = {
        title: 'Casa para Deletar',
        address: 'Rua Deletar, 000',
        price_per_night: 50.00
      };

      const createResponse = await request(app)
        .post('/api/properties')
        .send(propertyData)
        .expect(201);

      const response = await request(app)
        .delete(`/api/properties/${createResponse.body.id}`)
        .expect(200);

      expect(response.body.message).toBe('Property deleted successfully');
      expect(response.body.affectedRows).toBe(1);
    });
  });
});