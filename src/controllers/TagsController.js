const knex = require('../database/knex');

class TagsControllers {
    async index(request, response) {
        const { meal_id } = request.params;

        const tags = await knex('tags').where({ meal_id }).orderBy("name");

        return response.json(tags);
    }
}


module.exports = TagsControllers;