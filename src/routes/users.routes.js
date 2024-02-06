const { Router } = require('express');

const userRoutes = Router();

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const roleAuthentication = require('../middlewares/roleAuthentication');

const UsersController = require('../controllers/UsersController.js');

const usersController = new UsersController();

userRoutes.post("/", usersController.create)
userRoutes.put("/", ensureAuthenticated, usersController.update)
userRoutes.get("/", roleAuthentication(["admin"]), usersController.show)

module.exports = userRoutes;