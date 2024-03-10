<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
</p>

  <p align="center">Nestjs tutorial from Freecodecamp</p>

## Description

Nestjs tutorial that illustrates a web API, which includes concepts such as authentication, authorization, user information management and CRUD of an entity called "Bookmark"

## Installation

Install the project dependencies
```bash
$ npm install
```

Config your .env file
```bash
$ touch .env ; cat .env.test > .env
```

```text
You can edit the default values on [docker compose file](./docker-compose.yml) and [.env file](./.env) before the next step
```

Run the database docker container
```bash
$ docker-compose up dev-db -d
```

Run the migrations
```bash
$ npx prisma migrate dev
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

Run the test database docker container
```bash
$ docker-compose up test-db -d
```

```bash
# e2e tests
$ npm run test:e2e
```

## Support NestJS

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Me](https://github.com/HelioPC)
- Website - [https://nestjs.com](https://nestjs.com/)

## License

Nest is [MIT licensed](LICENSE).
