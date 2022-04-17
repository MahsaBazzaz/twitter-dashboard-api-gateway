/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('keywords').del()
    await knex('keywords').insert([
        { id: 1, word: 'malware' },
        { id: 2, word: 'security' },
        { id: 3, word: 'sploit' }
    ]);
};