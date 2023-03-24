const { Router } = require('express');

const userRoutes = require('./users.routes.js');
const mealsRoutes = require('./meals.routes.js');
const tagsRoutes = require('./tags.routes.js');
const sessionsRoutes = require('./sessions.routes.js');
const paymentsRoutes = require('./payment.routes.js');

const routes = Router();

routes.use("/users", userRoutes)
routes.use("/meals", mealsRoutes)
routes.use("/tags", tagsRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/pay", paymentsRoutes)

module.exports = routes;