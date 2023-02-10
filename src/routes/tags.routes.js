const { Router } = require('express');

const tagsRoutes = Router();

const TagsControllers = require('../controllers/TagsControllers.js');

const tagsControllers = new TagsControllers();

tagsRoutes.get("/:meal_id", tagsControllers.index)

module.exports = tagsRoutes;