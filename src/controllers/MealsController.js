const AppError = require('../utils/AppError');
const DiskStorage  = require('../providers/DiskStorage');

const sqliteConnection = require('../database/sqlite');

const { hash, compare } = require('bcryptjs');
const knex = require('../database/knex');

class MealsControllers {
    async create(request, response) {
        const { title, category, price, tags, description } = request.body.mealUpdated;

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

        // const diskStorage = new DiskStorage();
        // const file = fileUploadForm.filename;
        // console.log(file)

        // const filename = await diskStorage.saveFile(file);

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
        const { title, description, price, category } = request.body;
        const { id } = request.params;

        const meal_id = await knex('meals').where({ id }).first()

        const tag = await knex('tags')

        const formatedPrice = parseFloat(Number(price)).toFixed(2)

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
        const { id } = request.params;

        const meals = await knex("meals").where({ id }).first();
        const tags = await knex("tags").where({meal_id: id}).orderBy("name");
        return response.json({
            ...meals, 
            tags})
    }

    async index(request, response) {
        const user_id = request.user.id;
        const { category , title } = request.query;

        let meal;
        if(category != undefined) {
            console.log("entrou em category", category)
                meal = await knex('meals')
                .where({ category })
        } else {
            if(title == undefined) {
                meal = await knex('meals')
                .where({ user_id })

            } else {
                meal = await knex('meals')
                .where({ user_id })
                .whereLike("meals.title", `%${title}%`)
                .orderBy("title");
            }
        }
        

        if(!meal) {
            throw new AppError("prato não existente")
        }
        console.log(meal)
       
        return response.json([
            ...meal
        ]);
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