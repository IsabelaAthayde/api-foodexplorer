const { Router } = require('express');

const mealsRoutes = Router();

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const MealsController = require('../controllers/MealsController.js');
const MealsImageController = require('../controllers/MealsImageController.js');

const mealsController = new MealsController();
const mealsImageController = new MealsImageController();

const multer = require('multer');
const uploadConfig = require("../configs/upload");

const upload = multer(uploadConfig.MULTER);

mealsRoutes.use(ensureAuthenticated)

mealsRoutes.get("/", mealsController.index)
mealsRoutes.post("/", mealsController.create)
mealsRoutes.put("/:id", mealsController.update)
mealsRoutes.get("/", mealsController.show)
mealsRoutes.delete("/:id", mealsController.delete)

mealsRoutes.patch("/image" , ensureAuthenticated, upload.single("image"), mealsImageController.update)

module.exports = mealsRoutes;