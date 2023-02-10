const { Router } = require('express');

const mealsRoutes = Router();

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const MealsController = require('../controllers/MealsController.js');

const mealsController = new MealsController();

mealsRoutes.use(ensureAuthenticated)

mealsRoutes.get("/", mealsController.index)
mealsRoutes.post("/", mealsController.create)
mealsRoutes.put("/:id", mealsController.update)
mealsRoutes.get("/", mealsController.show)
mealsRoutes.delete("/:id", mealsController.delete)

module.exports = mealsRoutes;