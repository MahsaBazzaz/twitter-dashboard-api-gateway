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
        { word: 'exploit' },
        { word: 'privacy' },
        { word: 'bug' },
        { word: 'hack' },
        { word: 'cybersecurity' },
        { word: 'transparency' },
        { word: 'safety' },
        { word: 'harassment' },
        { word: 'illegal' },
        { word: 'malicious' },
        { word: 'spam' },
        { word: 'cybercriminal' },
        { word: 'anauthorized' },
        { word: 'theft' },
    ]);
};