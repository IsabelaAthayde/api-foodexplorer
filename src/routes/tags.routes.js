const { Router } = require('express');

const tagsRoutes = Router();

const TagsController = require('../controllers/TagsController.js');

const tagsController = new TagsController();

tagsRoutes.get("/:meal_id", tagsController.index)

module.exports = tagsRoutes;