
## Description

Twitter Crawler Backend - This is the backend implementation of the my bachelor project. The [frontend implementation](https://github.com/MahsaBazzaz/twitter-dashboard-application) and the [crwaler implementation](https://github.com/MahsaBazzaz/twitter-crawler-microservice) can be found in my repositories.

## Installation
1. start NATS service. you can find the instructions at [installation documentaion](https://docs.nats.io/running-a-nats-service/introduction/installation)
2. install the project dependensies:
```bash
$ npm install
```
3. set up the database
```bash
$ knex migrate:latest
```
4. set up the intial values for the crawler
```bash
$ knex seed:run
```

## Running the app
to run the app:
```bash
$ npm run start
```

