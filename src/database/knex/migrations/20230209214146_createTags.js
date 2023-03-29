
exports.up = knex => knex.schema.createTable("tags", table => {
    table.increments('id');
    table.text("name").notNullable();
    table.integer("meal_id").references("id").inTable("meals").onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users");

    table.timestamp("created_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("tags");
