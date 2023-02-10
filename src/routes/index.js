const { Router } = require('express');

const userRoutes = require('./users.routes.js');
const mealsRoutes = require('./meals.routes.js');
const tagsRoutes = require('./tags.routes.js');

const routes = Router();

routes.use("/users", userRoutes)
routes.use("/meals", mealsRoutes)
routes.use("/tags", tagsRoutes)

module.exports = routes;