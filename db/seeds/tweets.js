/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('tweets').del()
    await knex('tweets').insert([
        { id: 1, text: 'hello malware', username: 'mahsbzz', created_at: '2016-06-22 19:10:25-07', user_id: 1234, tweet_id: 4305034859394798, likes: 3, retweets: 1 },
        { id: 2, text: 'this is a tweet with security', username: 'mhnaderi', created_at: '2016-06-22 19:10:25-07', user_id: 4321, tweet_id: 12430509394797, likes: 5, retweets: 4 },

    ]);
}