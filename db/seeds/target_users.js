/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('target_users').del()
    await knex('target_users').insert([
        { user_id: '6029522' },
        { user_id: '18476766' },
        { user_id: '297856522' },
        { user_id: '14707266' },
        { user_id: '57629490' },
        { user_id: '2585763667' },
    ]);
};