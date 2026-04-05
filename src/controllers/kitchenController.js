const kitchenRepository = require('../repositories/kitchenRepository');

class KitchenController {
  async getAllKitchens(req, res) {
    try {
      const kitchens = await kitchenRepository.findAll();
      res.json(kitchens);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getKitchenById(req, res) {
    try {
      const kitchen = await kitchenRepository.findById(req.params.id);
      if (!kitchen) return res.status(404).json({ message: 'Kitchen not found' });
      res.json(kitchen);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createKitchen(req, res) {
    try {
      const { kitchen_name, address } = req.body;
      if (!kitchen_name) return res.status(400).json({ message: 'Kitchen name is required' });
      const kitchenId = await kitchenRepository.create({ kitchen_name, address });
      res.status(201).json({ id: kitchenId, kitchen_name, address });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateKitchen(req, res) {
    try {
      const { kitchen_name, address } = req.body;
      const id = req.params.id;
      await kitchenRepository.update(id, { kitchen_name, address });
      res.json({ message: 'Kitchen updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteKitchen(req, res) {
    try {
      await kitchenRepository.delete(req.params.id);
      res.json({ message: 'Kitchen deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new KitchenController();
