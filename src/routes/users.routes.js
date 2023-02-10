const { Router } = require('express');

const userRoutes = Router();

const UsersController = require('../controllers/UsersController.js');

const usersController = new UsersController();

userRoutes.post("/", usersController.create)
userRoutes.put("/:id", usersController.update)

module.exports = userRoutes;