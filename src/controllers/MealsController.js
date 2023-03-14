const AppError = require('../utils/AppError');
const DiskStorage  = require('../providers/DiskStorage');

const sqliteConnection = require('../database/sqlite');

const { hash, compare } = require('bcryptjs');
const knex = require('../database/knex');

class MealsControllers {
    async create(request, response) {
        const { title, category, price, tags, description } = request.body;
        const user_id = request.user.id;

        const database = await sqliteConnection();
        const checkIfFoodExists = await database.get('SELECT * FROM meals WHERE title = (?)', [title])


        if(checkIfFoodExists) {
            throw new AppError("Prato já existente, caso queira mudar alguma informação vá em editar")
        }

        if(!title || !price || !category || category == "default" || !tags ) {
            throw new AppError("Preencha todos os campos")
        }

        const formatedPrice = Number(parseFloat(price).toFixed(2));
        
        if(formatedPrice === NaN) {
            throw new AppError("Preencha o preço corretamente")
        }

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
        const { title, description, price, category, tags } = request.body;
        const { id } = request.params;

        const meal = await knex('meals').where({ id }).first()
        
        if(!meal) {
            throw new AppError('não existe este item no cardápio')
        }
        let newPrice;
        if(price === NaN || price === undefined) {
            newPrice = meal.price
        } else {
            newPrice = Number(price)
        }

        await knex("meals").where({ id }).update({
            title,
            description, 
            price: newPrice, 
            category
        })

        const tagsUpdates = await tags.map(tag => {
            let name = tag.name ?? tag;
            return {
                meal_id: id,
                name: name,
                user_id: 9
            }
        })
        
        await knex('tags')
        .whereNotIn('name', tagsUpdates.map(tag => tag.name))
        .where('meal_id', id)
        .del()
        .then(async () => {
            console.log('missing tags')

            let newTag = [];
            for(const tag of tagsUpdates) {
                const rows = await knex('tags').where('name', tag.name).select('id');
                console.log(rows, tag.name)

                if(rows === [] || rows.length === 0) {
                console.log(tag.name)

                    newTag.push(tag)
                }
            }
   
            return knex('tags').insert(newTag)
        })
        .catch((err) => {
            console.error(err)
        })

        // const newTags = tagsUpdates.filter((tag) => {
        //     const tagsf = await knex('tags').where('name', tag.name).select('id').then((rows) => {
        //         return rows.lenght === 0;
        //     })
        // })
        // const Tags = await knex('tags').where('meal_id', id).whereIn('name', tagsUpdates.map(tag => tag.name))

        //     const newtags = tagsUpdates.filter(tag => {
        //         Tags.includes(tag.name)
        //     })
            
        // console.log(tagsUpdates)

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
        const { category , title } = request.query;

        let meal;
        if(category != undefined) {
            if(title == undefined) {
                meal = await knex('meals')
                .where({ category })
            } else {
                meal = await knex('meals')
                .where({ category })
                .whereLike('meals.title', `%${title}%`)
                .groupBy('title');

                const filterTags = title.split(",").map(tag => tag.trim());

                const mealByTags = await knex("tags")
                .select([
                    "meals.id",
                    "meals.title",
                    "meals.image",
                    "meals.price",
                ])
                .where("meals.category", category)
                .whereIn("name", filterTags)
                .innerJoin("meals", "meals.id", "tags.meal_id")
                .groupBy("meals.title");

                return response.json([
                    ...mealByTags,
                    ...meal
                ]);
            }
        } else {
            if(title == undefined) {
                meal = await knex('meals')
                .where({ user_id: 9 })

            } else {
                meal = await knex('meals')
                .where({ user_id: 9 })
                .whereLike('meals.title', `%${title}%`)
                .groupBy('title');

                const filterTags = title.split(",").map(tag => tag.trim());

                const mealByTags = await knex("tags")
                .select([
                    "meals.id",
                    "meals.title",
                    "meals.image",
                    "meals.price",
                ])
                .where("meals.user_id", 9)
                .whereIn("name", filterTags)
                .innerJoin("meals", "meals.id", "tags.meal_id")
                .groupBy("meals.title");

                return response.json([
                    ...mealByTags,
                    ...meal
                ]);
            }
        }
        

        if(!meal) {
            throw new AppError("prato não existente")
        }
       
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