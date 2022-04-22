/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('target_users', function(table) {
            table.increments('id');
            table.bigint('user_id').notNullable();
            table.string('username', 255).nullable();
            table.text('image_url', 255).nullable();
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('target_users');
};