const { Router } = require('express');

const userRoutes = Router();

const UsersControllers = require('../controllers/UsersControllers.js');

const usersControllers = new UsersControllers();

userRoutes.post("/", usersControllers.create)
userRoutes.put("/:id", usersControllers.update)

module.exports = userRoutes;