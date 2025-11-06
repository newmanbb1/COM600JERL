const UserModel = require('../models/user.model');

class UserController {
  static async getProfile(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ 
          error: 'Usuario no encontrado' 
        });
      }

      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const users = await UserModel.findAll();
      res.json({ users });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['admin', 'user'].includes(role)) {
        return res.status(400).json({ 
          error: 'Rol inválido. Debe ser "admin" o "user"' 
        });
      }

      const affectedRows = await UserModel.updateRole(id, role);
      
      if (affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Usuario no encontrado' 
        });
      }

      res.json({ 
        message: 'Rol actualizado exitosamente' 
      });
    } catch (error) {
      next(error);
    }
  }

  static async deactivateUser(req, res, next) {
    try {
      const { id } = req.params;

      if (parseInt(id) === req.user.id) {
        return res.status(400).json({ 
          error: 'No puedes desactivar tu propia cuenta' 
        });
      }

      const affectedRows = await UserModel.deactivate(id);
      
      if (affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Usuario no encontrado' 
        });
      }

      res.json({ 
        message: 'Usuario desactivado exitosamente' 
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;