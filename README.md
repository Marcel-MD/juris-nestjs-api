# Juris API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

Simple RESTful API developed with [Nest](https://github.com/nestjs/nest).

## Docker PostgreSQL Setup

More information about [Docker](https://www.docker.com/).

```bash
$ docker-compose up
```

Use [pgAdmin](https://www.pgadmin.org/) to connect to PostgreSQL and create a new database named `juris`.\
Default connection details can be found in `type-orm-config.service.ts` file in `src` folder.\
For a custom connection create a `.env` file in root directory and add the custom properties you need.

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ npm run start
```

## Swagger UI

To access Swagger UI go to [localhost:3000/api](http://localhost:3000/api).
