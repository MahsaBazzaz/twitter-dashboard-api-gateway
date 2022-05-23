/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('retweets', function(table) {
            table.increments('id');
            table.string('user_id').notNullable();
            table.string('owner_id').notNullable();
            table.string('tweet_id').nullable();
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('retweets');
};