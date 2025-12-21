const Reservation = require('../../src/models/Reservation');
const Property = require('../../src/models/Property');

describe('Reservation Model', () => {
  let propertyId;

  beforeEach((done) => {
    // Criar uma propriedade para testes de reserva
    const propertyData = {
      title: 'Casa para Reserva',
      address: 'Rua Reserva, 123',
      price_per_night: 100.00
    };

    Property.create(propertyData, (err, created) => {
      expect(err).toBeNull();
      propertyId = created.id;
      done();
    });
  });

  describe('create', () => {
    it('deve criar uma reserva com sucesso', (done) => {
      const reservationData = {
        property_id: propertyId,
        guest_name: 'João Silva',
        guest_email: 'joao@example.com',
        check_in_date: '2025-12-01',
        check_out_date: '2025-12-05',
        total_price: 400.00,
        status: 'confirmed'
      };

      Reservation.create(reservationData, (err, result) => {
        expect(err).toBeNull();
        expect(result).toHaveProperty('id');
        expect(result.guest_name).toBe(reservationData.guest_name);
        expect(result.status).toBe(reservationData.status);
        done();
      });
    });

    it('deve usar status padrão "pending" se não fornecido', (done) => {
      const reservationData = {
        property_id: propertyId,
        guest_name: 'Maria Santos',
        guest_email: 'maria@example.com',
        check_in_date: '2025-12-10',
        check_out_date: '2025-12-12',
        total_price: 200.00
      };

      Reservation.create(reservationData, (err, result) => {
        expect(err).toBeNull();
        expect(result.status).toBe('pending');
        done();
      });
    });
  });

  describe('getAll', () => {
    it('deve retornar lista vazia quando não há reservas', (done) => {
      Reservation.getAll((err, rows) => {
        expect(err).toBeNull();
        expect(rows).toEqual([]);
        done();
      });
    });

    it('deve retornar todas as reservas', (done) => {
      const reservationData = {
        property_id: propertyId,
        guest_name: 'Pedro Costa',
        guest_email: 'pedro@example.com',
        check_in_date: '2024-12-15',
        check_out_date: '2024-12-18',
        total_price: 300.00
      };

      Reservation.create(reservationData, (err) => {
        expect(err).toBeNull();

        Reservation.getAll((err, rows) => {
          expect(err).toBeNull();
          expect(rows.length).toBe(1);
          expect(rows[0].guest_name).toBe(reservationData.guest_name);
          done();
        });
      });
    });
  });

  describe('getById', () => {
    it('deve retornar reserva por ID', (done) => {
      const reservationData = {
        property_id: propertyId,
        guest_name: 'Ana Lima',
        guest_email: 'ana@example.com',
        check_in_date: '2024-12-20',
        check_out_date: '2024-12-22',
        total_price: 200.00
      };

      Reservation.create(reservationData, (err, created) => {
        expect(err).toBeNull();

        Reservation.getById(created.id, (err, reservation) => {
          expect(err).toBeNull();
          expect(reservation.id).toBe(created.id);
          expect(reservation.guest_name).toBe(reservationData.guest_name);
          done();
        });
      });
    });
  });

  describe('getByPropertyId', () => {
    it('deve retornar reservas por property_id', (done) => {
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

      Reservation.create(reservationData1, (err1) => {
        expect(err1).toBeNull();
        Reservation.create(reservationData2, (err2) => {
          expect(err2).toBeNull();

          Reservation.getByPropertyId(propertyId, (err, rows) => {
            expect(err).toBeNull();
            expect(rows.length).toBe(2);
            expect(rows[0].property_id).toBe(propertyId);
            expect(rows[1].property_id).toBe(propertyId);
            done();
          });
        });
      });
    });
  });

  describe('update', () => {
    it('deve atualizar reserva com sucesso', (done) => {
      const reservationData = {
        property_id: propertyId,
        guest_name: 'Lucas Pereira',
        guest_email: 'lucas@example.com',
        check_in_date: '2025-01-01',
        check_out_date: '2025-01-03',
        total_price: 200.00,
        status: 'pending'
      };

      Reservation.create(reservationData, (err, created) => {
        expect(err).toBeNull();

        const updateData = {
          guest_name: 'Lucas Pereira Atualizado',
          status: 'confirmed'
        };

        Reservation.update(created.id, updateData, (err, updated) => {
          expect(err).toBeNull();
          expect(updated.id).toBe(created.id);
          expect(updated.guest_name).toBe(updateData.guest_name);
          expect(updated.status).toBe(updateData.status);
          done();
        });
      });
    });
  });

  describe('delete', () => {
    it('deve deletar reserva com sucesso', (done) => {
      const reservationData = {
        property_id: propertyId,
        guest_name: 'Roberto Silva',
        guest_email: 'roberto@example.com',
        check_in_date: '2025-01-05',
        check_out_date: '2025-01-07',
        total_price: 200.00
      };

      Reservation.create(reservationData, (err, created) => {
        expect(err).toBeNull();

        Reservation.delete(created.id, (err, result) => {
          expect(err).toBeNull();
          expect(result.message).toBe('Reservation deleted successfully');
          expect(result.affectedRows).toBe(1);
          done();
        });
      });
    });
  });
});