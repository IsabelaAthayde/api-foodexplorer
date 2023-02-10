const { Router } = require('express');

const userRoutes = Router();

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const UsersController = require('../controllers/UsersController.js');

const usersController = new UsersController();

userRoutes.post("/", usersController.create)
userRoutes.put("/", ensureAuthenticated, usersController.update)

module.exports = userRoutes;