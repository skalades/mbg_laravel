const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');

class AdminController {
  async getAllUsers(req, res) {
    try {
      const users = await userRepository.findAll();
      // Don't send passwords
      const safeUsers = users.map(u => ({
        id: u.id,
        username: u.username,
        full_name: u.full_name,
        title: u.title,
        role: u.role,
        kitchen_id: u.kitchen_id,
        kitchen_name: u.kitchen_name
      }));
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const { username, password, role, kitchen_id, full_name, title } = req.body;
      
      const existing = await userRepository.findByUsername(username);
      if (existing) return res.status(400).json({ message: 'Username already exists' });

      // Default password logic
      const finalPassword = password || 'nutrizi123';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(finalPassword, salt);

      const userId = await userRepository.create({
        username,
        full_name,
        title,
        passwordHash,
        role: role || 'NUTRITIONIST',
        kitchen_id: kitchen_id || null
      });

      res.status(201).json({ id: userId, username, role: role || 'NUTRITIONIST', kitchen_id });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const { role, kitchen_id, full_name, title } = req.body;
      await userRepository.update(req.params.id, { role, kitchen_id, full_name, title });
      res.json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await userRepository.delete(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AdminController();
