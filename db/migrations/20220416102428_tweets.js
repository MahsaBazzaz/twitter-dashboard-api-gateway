/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
    .createTable('tweets', function (table) {
      table.increments('id');
      table.string('text', 255).notNullable();
      table.string('username', 255).notNullable();
      table.timestamp('created_at').notNullable();
      table.integer('user_id').notNullable();
      table.bigInteger('tweet_id').notNullable();
      table.integer('likes').notNullable();
      table.integer('retweets').notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('tweets');
};