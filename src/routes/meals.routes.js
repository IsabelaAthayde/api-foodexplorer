const { Router } = require('express');

const mealsRoutes = Router();

const MealsControllers = require('../controllers/MealsControllers.js');

const mealsControllers = new MealsControllers();

mealsRoutes.get("/", mealsControllers.index)
mealsRoutes.post("/:user_id", mealsControllers.create)
mealsRoutes.put("/:id", mealsControllers.update)
mealsRoutes.get("/:id", mealsControllers.show)
mealsRoutes.delete("/:id", mealsControllers.delete)

module.exports = mealsRoutes;