const { Router } = require('express');

const mealsRoutes = Router();

const MealsController = require('../controllers/MealsController.js');

const mealsController = new MealsController();

mealsRoutes.get("/", mealsController.index)
mealsRoutes.post("/:user_id", mealsController.create)
mealsRoutes.put("/:id", mealsController.update)
mealsRoutes.get("/:id", mealsController.show)
mealsRoutes.delete("/:id", mealsController.delete)

module.exports = mealsRoutes;