/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('users').del()
    await knex('target_users').insert([
        { user_id: '14181505', username: 'jeremiahg', image_url: 'https://pbs.twimg.com/profile_images/1457734170197716994/DSUKtpID_normal.jpg', name: 'Jeremiah Grossman', verified: 't', location: 'Boise\, ID & Maui\, Hi', url: 'https://t.co/CiqKPDIKjn', protected: 'f', created_at: '2008-03-20T01:54:13.000Z', followers_count: 67093, following_count: 564 },
        { user_id: '15474914', username: 'marcusjcarey', image_url: 'https://pbs.twimg.com/profile_images/1466413893492875265/IM4rNtGa_normal.jpg', name: 'Marcus J. Carey', verified: 't', location: 'Austin\, Texas', url: 'https://t.co/6RJep7Cudc', protected: 'f', created_at: '2008-07-17T22:31:22.000Z', followers_count: 52954, following_count: 6138 },
    ]);
};