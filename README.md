# NC-News API database

Full API back-end setup for my NC-News website, including seeding, migrations, routing, data formatting, error handling and various API endpoints. Created by TDD.

For all available enpoints and to interact with the database, please see https://nc-news-hosting-app.herokuapp.com/api .

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
Firstly, you will need to fork this repository, clone it to your machine and then open it up in your chosen code editor.

In your terminal:

```
git clone <link>

cd <name of folder>
```

### Prerequisites

In order to get started, you will need Node.js and NPM installed on your machine.

If you are unsure about whether you have these installed, type the following command into your terminal:

```
node -v
npm -v
```

If both of these commands show a version number, then you have them installed, if not then go into your terminal and type:

```
sudo apt install nodejs
sudo apt install npm
```

Once all you have installed Node.js and NPM, type in the following command in your terminal:

- This will create a package.json file for this project

```
npm init -y
```

After this has been installed, type in the following command in your terminal:

```
npm i
```

The above command will install the following Node modules that are required for this project:

```
cors v2.8.5
express v4.17.1
knex v0.20.4
pg v7.14.0
chai v4.2.0
chai-sorted v0.2.0
mocha v6.2.2
nodemon v2.0.1
supertest v4.0.2
```

### Running the tests:

Run the following command in your terminal to test all of the endpoints:

npm test

### Built With:

- JavaScript
- PostgreSQL database - Used to create the database
- Knex - Used for migrations and query building
- Heroku

### Deployment:

I used Heroku because it has allowed for easy database integration and a service that I could push my code to, build it, and host my API.

### RESTful API:

Please see all available endpoints below, when interacting with the database:

```
GET /api/topics
POST /api/topics

GET /api/users
POST /api/users
GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

GET /api/articles
POST /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api
```

## Acknowledgements:

Thank you to Northcoders for helping me build my first API.
