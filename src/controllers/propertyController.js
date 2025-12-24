const Property = require('../models/Property');
const { DatabaseError, NotFoundError } = require('../errors');

class PropertyController {
  static async createProperty(req, res, next) {
    try {
      const propertyData = req.body;
      const property = await Property.createAsync(propertyData);
      res.status(201).json(property);
    } catch (error) {
      next(new DatabaseError('Erro ao criar propriedade'));
    }
  }

  static async getAllProperties(req, res, next) {
    try {
      const properties = await Property.getAllAsync();
      res.status(200).json(properties);
    } catch (error) {
      next(new DatabaseError('Erro ao buscar propriedades'));
    }
  }

  static async getPropertyById(req, res, next) {
    try {
      const { id } = req.params;
      const property = await Property.getByIdAsync(id);
      if (!property) {
        throw new NotFoundError('Propriedade não encontrada');
      }
      res.status(200).json(property);
    } catch (error) {
      next(error);
    }
  }

  static async updateProperty(req, res, next) {
    try {
      const { id } = req.params;
      const propertyData = req.body;
      const property = await Property.updateAsync(id, propertyData);
      res.status(200).json(property);
    } catch (error) {
      next(new DatabaseError('Erro ao atualizar propriedade'));
    }
  }

  static async deleteProperty(req, res, next) {
    try {
      const { id } = req.params;
      const result = await Property.deleteAsync(id);
      res.status(200).json(result);
    } catch (error) {
      next(new DatabaseError('Erro ao deletar propriedade'));
    }
  }
}

module.exports = PropertyController;