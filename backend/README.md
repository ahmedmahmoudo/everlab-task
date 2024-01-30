# Everlab task backend

## How to run the project

- The project uses SQLite so no need to have any DB connection and the db is included in the project
- Project runs on PORT 3000
- Just run `npm start`

## To create DB again with data

- Copy `.env.example` to the same folder and name `.env`
- Just run `npm run db:generate` and `npm run db:push` to get the DB ready
- Now run `npm run db:seed`
