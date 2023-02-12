const AppError = require('../utils/AppError');
const DiskStorage  = require('../providers/DiskStorage');

const sqliteConnection = require('../database/sqlite');

const { hash, compare } = require('bcryptjs');
const knex = require('../database/knex');

class MealsControllers {
    async create(request, response) {
        const { title, description, price, category, tags } = request.body;
        const user_id = request.user.id;

        const database = await sqliteConnection();
        const checkIfFoodExists = await database.get('SELECT * FROM meals WHERE title = (?)', [title])


        if(checkIfFoodExists) {
            throw new AppError("Prato já existente, caso queira mudar alguma informação vá em editar")
        }

        if(!title || !price || !category ) {
            throw new AppError("Preencha todos os campos")
        }

        const formatedPrice = parseFloat(price).toFixed(2)

        const meal_id = await knex("meals").insert({
            title,
            description, 
            price: formatedPrice, 
            category,
            user_id
        });

        const tagsInsert = await tags.map(name => {
            return {
                meal_id,
                name,
                user_id,
            }
        })

        await knex("tags").insert(tagsInsert)

        return response.json();
    }

    async update(request, response) {
        const { title, description, price, category} = request.body;
        const { id } = request.params;

        const meal_id = await knex('meals').where({ id }).first()
        console.log(id)

        const tag = await knex('tags')

        const formatedPrice = parseFloat(price).toFixed(2)

        if(!meal_id) {
            throw new AppError('não existe este item no cardápio')
        }

        await knex("meals").where({ id }).update({
            title,
            description, 
            price: formatedPrice, 
            category
        })

        return response.json();
    }

    async show(request, response) {
        const { category } = request.query;

        const meal = await knex('meals').where({ category });
        const tags = await knex('tags').where({ meal_id: meal.id }).orderBy("name")

        if(!meal) {
            throw new AppError("prato não existente")
        }

        return response.json({
            ...meal,
            tags
        });
    }

    async index(request, response) {
        const user_id = request.user.id;

        const meal = await knex('meals').where({ user_id }).orderBy("title");

        return response.json(meal);
    }

    async delete(request, response) {
        const { id } = request.params;

        const diskStorage = new DiskStorage();

        const meal = await knex('meals').where({ id }).first()
        
        if(meal.image) {
            await diskStorage.deleteFile(meal.image);
        }

        await knex('meals').where({ id }).delete();

        return response.json();
    }
}


module.exports = MealsControllers;