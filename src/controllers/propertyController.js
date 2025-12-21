const Property = require('../models/Property');

class PropertyController {
  static createProperty(req, res) {
    const propertyData = req.body;
    
    Property.create(propertyData, (err, property) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(property);
    });
  }

  static getAllProperties(req, res) {
    Property.getAll((err, properties) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(properties);
    });
  }

  static getPropertyById(req, res) {
    const { id } = req.params;
    
    Property.getById(id, (err, property) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      res.status(200).json(property);
    });
  }

  static updateProperty(req, res) {
    const { id } = req.params;
    const propertyData = req.body;
    
    Property.update(id, propertyData, (err, property) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(property);
    });
  }

  static deleteProperty(req, res) {
    const { id } = req.params;
    
    Property.delete(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(result);
    });
  }
}

module.exports = PropertyController;