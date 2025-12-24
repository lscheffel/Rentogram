const request = require('supertest');
const app = require('../../src/server');

describe('Reservation Controller', () => {
  let propertyId;

  beforeEach(async () => {
    // Criar uma propriedade para testes de reserva
    const propertyData = {
      title: 'Casa para Reserva',
      address: 'Rua Reserva, 123',
      price_per_night: 100.00
    };

    const response = await request(app)
      .post('/api/properties')
      .send(propertyData)
      .expect(201);

    propertyId = response.body.id;
  });

  describe('POST /api/reservations', () => {
    it('deve criar uma reserva com sucesso', async () => {
      const reservationData = {
        property_id: propertyId,
        guest_name: 'João Silva',
        guest_email: 'joao@example.com',
        check_in_date: '2025-12-01',
        check_out_date: '2025-12-05',
        total_price: 400.00,
        status: 'confirmed'
      };

      const response = await request(app)
        .post('/api/reservations')
        .send(reservationData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.guest_name).toBe(reservationData.guest_name);
      expect(response.body.status).toBe(reservationData.status);
    });

    it('deve usar status padrão "pending" se não fornecido', async () => {
      const reservationData = {
        property_id: propertyId,
        guest_name: 'Maria Santos',
        guest_email: 'maria@example.com',
        check_in_date: '2025-12-10',
        check_out_date: '2025-12-12',
        total_price: 200.00
      };

      const response = await request(app)
        .post('/api/reservations')
        .send(reservationData)
        .expect(201);

      expect(response.body.status).toBe('pending');
    });
  });

  describe('GET /api/reservations', () => {
    it('deve retornar lista de reservas', async () => {
      const reservationData = {
        property_id: propertyId,
        guest_name: 'Pedro Costa',
        guest_email: 'pedro@example.com',
        check_in_date: '2024-12-15',
        check_out_date: '2024-12-18',
        total_price: 300.00
      };

      await request(app)
        .post('/api/reservations')
        .send(reservationData)
        .expect(201);

      const response = await request(app)
        .get('/api/reservations')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('guest_name');
    });
  });

  describe('GET /api/reservations/:id', () => {
    it('deve retornar reserva por ID', async () => {
      const reservationData = {
        property_id: propertyId,
        guest_name: 'Ana Lima',
        guest_email: 'ana@example.com',
        check_in_date: '2024-12-20',
        check_out_date: '2024-12-22',
        total_price: 200.00
      };

      const createResponse = await request(app)
        .post('/api/reservations')
        .send(reservationData)
        .expect(201);

      const response = await request(app)
        .get(`/api/reservations/${createResponse.body.id}`)
        .expect(200);

      expect(response.body.id).toBe(createResponse.body.id);
      expect(response.body.guest_name).toBe(reservationData.guest_name);
    });

    it('deve retornar 404 se ID não existir', async () => {
      const response = await request(app)
        .get('/api/reservations/999')
        .expect(404);

      expect(response.body.message).toBe('Reservation not found');
    });
  });

  describe('GET /api/reservations/property/:property_id', () => {
    it('deve retornar reservas por property_id', async () => {
      const reservationData1 = {
        property_id: propertyId,
        guest_name: 'Carlos Souza',
        guest_email: 'carlos@example.com',
        check_in_date: '2024-12-25',
        check_out_date: '2024-12-27',
        total_price: 200.00
      };

      const reservationData2 = {
        property_id: propertyId,
        guest_name: 'Fernanda Alves',
        guest_email: 'fernanda@example.com',
        check_in_date: '2024-12-28',
        check_out_date: '2024-12-30',
        total_price: 200.00
      };

      await request(app)
        .post('/api/reservations')
        .send(reservationData1)
        .expect(201);

      await request(app)
        .post('/api/reservations')
        .send(reservationData2)
        .expect(201);

      const response = await request(app)
        .get(`/api/reservations/property/${propertyId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].property_id).toBe(propertyId);
      expect(response.body[1].property_id).toBe(propertyId);
    });
  });

  describe('PUT /api/reservations/:id', () => {
    it('deve atualizar reserva com sucesso', async () => {
      const reservationData = {
        property_id: propertyId,
        guest_name: 'Lucas Pereira',
        guest_email: 'lucas@example.com',
        check_in_date: '2025-01-01',
        check_out_date: '2025-01-03',
        total_price: 200.00,
        status: 'pending'
      };

      const createResponse = await request(app)
        .post('/api/reservations')
        .send(reservationData)
        .expect(201);

      const updateData = {
        guest_name: 'Lucas Pereira Atualizado',
        status: 'confirmed'
      };

      const response = await request(app)
        .put(`/api/reservations/${createResponse.body.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(createResponse.body.id);
      expect(response.body.guest_name).toBe(updateData.guest_name);
      expect(response.body.status).toBe(updateData.status);
    });
  });

  describe('DELETE /api/reservations/:id', () => {
    it('deve deletar reserva com sucesso', async () => {
      const reservationData = {
        property_id: propertyId,
        guest_name: 'Roberto Silva',
        guest_email: 'roberto@example.com',
        check_in_date: '2025-01-05',
        check_out_date: '2025-01-07',
        total_price: 200.00
      };

      const createResponse = await request(app)
        .post('/api/reservations')
        .send(reservationData)
        .expect(201);

      const response = await request(app)
        .delete(`/api/reservations/${createResponse.body.id}`)
        .expect(200);

      expect(response.body.message).toBe('Reservation deleted successfully');
      expect(response.body.affectedRows).toBe(1);
    });
  });
});