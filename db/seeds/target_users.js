/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('target_users').del()
    await knex('target_users').insert([
        { id: 1, user_id: 1234 },
        { id: 2, user_id: 4321 },
    ]);
};