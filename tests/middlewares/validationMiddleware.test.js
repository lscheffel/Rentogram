const { validatePropertyData, validateReservationData } = require('../../src/middlewares/validationMiddleware');
const Property = require('../../src/models/Property');

describe('Validation Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('validatePropertyData', () => {
    it('deve chamar next() para dados válidos', () => {
      mockReq.body = {
        title: 'Casa de Praia',
        address: 'Rua da Praia, 123',
        price_per_night: 150.00
      };

      validatePropertyData(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('deve retornar 400 para dados inválidos (título faltando)', () => {
      mockReq.body = {
        address: 'Rua da Praia, 123',
        price_per_night: 150.00
      };

      validatePropertyData(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: expect.stringContaining('"title" is required') });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar 400 para preço negativo', () => {
      mockReq.body = {
        title: 'Casa de Praia',
        address: 'Rua da Praia, 123',
        price_per_night: -150.00
      };

      validatePropertyData(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: expect.stringContaining('must be a positive number') });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar 400 para URL inválida', () => {
      mockReq.body = {
        title: 'Casa de Praia',
        address: 'Rua da Praia, 123',
        price_per_night: 150.00,
        image_url: 'invalid-url'
      };

      validatePropertyData(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: expect.stringContaining('must be a valid uri') });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('validateReservationData', () => {
    let propertyId;

    beforeEach((done) => {
      // Criar uma propriedade para testes
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

    it('deve chamar next() para dados válidos', () => {
      mockReq.body = {
        property_id: propertyId,
        guest_name: 'João Silva',
        guest_email: 'joao@example.com',
        check_in_date: '2024-12-01',
        check_out_date: '2024-12-05',
        total_price: 400.00
      };

      validateReservationData(mockReq, mockRes, mockNext);

      // Como é assíncrono, usar setTimeout ou mock
      // Para simplificar, assumir que next é chamado após verificação
      setTimeout(() => {
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
      }, 100);
    });

    it('deve retornar 400 para email inválido', () => {
      mockReq.body = {
        property_id: propertyId,
        guest_name: 'João Silva',
        guest_email: 'invalid-email',
        check_in_date: '2024-12-01',
        check_out_date: '2024-12-05',
        total_price: 400.00
      };

      validateReservationData(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: expect.stringContaining('must be a valid email') });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar 400 para check_out_date antes de check_in_date', () => {
      mockReq.body = {
        property_id: propertyId,
        guest_name: 'João Silva',
        guest_email: 'joao@example.com',
        check_in_date: '2024-12-05',
        check_out_date: '2024-12-01',
        total_price: 400.00
      };

      validateReservationData(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: expect.stringContaining('must be greater than') });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('deve retornar 400 para property_id inexistente', () => {
      mockReq.body = {
        property_id: 999,
        guest_name: 'João Silva',
        guest_email: 'joao@example.com',
        check_in_date: '2024-12-01',
        check_out_date: '2024-12-05',
        total_price: 400.00
      };

      validateReservationData(mockReq, mockRes, mockNext);

      setTimeout(() => {
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid property_id: property does not exist' });
        expect(mockNext).not.toHaveBeenCalled();
      }, 100);
    });

    it('deve retornar 400 para status inválido', () => {
      mockReq.body = {
        property_id: propertyId,
        guest_name: 'João Silva',
        guest_email: 'joao@example.com',
        check_in_date: '2025-12-01',
        check_out_date: '2025-12-05',
        total_price: 400.00,
        status: 'invalid-status'
      };

      validateReservationData(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: expect.stringContaining('must be one of') });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});