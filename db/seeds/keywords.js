/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('keywords').del()
    await knex('keywords').insert([
        { word: 'malware' },
        { word: 'security' },
        { word: 'sploit' }
    ]);
};