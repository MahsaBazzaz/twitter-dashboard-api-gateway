/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('users', function(table) {
            table.increments('id');
            table.string('user_id').notNullable().unique();
            table.string('username', 255).notNullable();
            table.text('image_url', 255).nullable();
            table.string('name').nullable();
            table.boolean('verified').nullable();
            table.string('location').nullable();
            table.string('url').nullable();
            table.boolean('protected').nullable();
            table.string('created_at').nullable();
            table.bigInteger('followers_count').nullable();
            table.bigInteger('following_count').nullable();
            table.bigInteger('tweet_count').nullable();
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};