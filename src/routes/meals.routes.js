const { Router } = require('express');

const mealsRoutes = Router();

const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const roleAuthentication = require('../middlewares/roleAuthentication');

const MealsController = require('../controllers/MealsController.js');
const MealsImageController = require('../controllers/MealsImageController.js');

const mealsController = new MealsController();
const mealsImageController = new MealsImageController();

const multer = require('multer');
const uploadConfig = require("../configs/upload");

const upload = multer(uploadConfig.MULTER);

mealsRoutes.use(ensureAuthenticated)

mealsRoutes.get("/", mealsController.index)
mealsRoutes.post("/", roleAuthentication(["admin"]), mealsController.create)
mealsRoutes.put("/:id", roleAuthentication(["admin"]), mealsController.update)
mealsRoutes.get("/:id", mealsController.show)
mealsRoutes.delete("/:id", roleAuthentication(["admin"]), mealsController.delete)

mealsRoutes.patch("/image/:id" , ensureAuthenticated, roleAuthentication(["admin"]), upload.single("image"), mealsImageController.update)

module.exports = mealsRoutes;