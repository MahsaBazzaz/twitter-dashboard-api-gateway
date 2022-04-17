// Update with your config settings.
require('dotenv').config({ path: './.env' });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

    development: {
        client: 'postgresql',
        connection: {
            database: 'twitter',
            user: 'postgres',
            password: 'pa$$w0rd'
        },
        migrations: {
            directory: './db/migrations'
        },
        seeds: {
            directory: './db/seeds'
        }
    }
};