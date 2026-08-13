# Checkpoint: REST API (Postman Certification)

Solution for the "REST API (With Postman Certification)" checkpoint — a
small Express + Mongoose REST API exposing four routes over a `User`
resource, ready to be exercised with Postman.

## What's here

- `server.js` – the actual deliverable: loads `config/.env`, connects to
  MongoDB with Mongoose (`mongoose.connect(process.env.MONGO_URI)`), and
  defines the four required routes:
  - `GET /users` – return all users
  - `POST /users` – add a new user to the database
  - `PUT /users/:id` – edit a user by id
  - `DELETE /users/:id` – remove a user by id

  Every route uses Mongoose methods (`find`, `create`,
  `findByIdAndUpdate`, `findByIdAndDelete`) inside a Node-style
  `(err, data)` callback and returns the result (or an error) in the
  response, as required.
- `models/User.js` – the Mongoose schema/model for the `User` resource
  (`name`, `email`, `age`, plus `timestamps`), exported for use in
  `server.js`.
- `config/.env.example` – template for the required `config/.env` file;
  copy it to `config/.env` and fill in your own `PORT` and `MONGO_URI`.
- `simulate.js` – a local, dependency-free re-implementation of the same
  four operations (GET all / POST / PUT by id / DELETE by id) against a
  plain in-memory array, used to verify the expected behavior of each
  route handler. This sandbox has no network access to a real MongoDB
  instance, so `server.js` can't actually be started and hit with
  Postman here — `simulate.js` exists purely to double-check the logic.
- `output.txt` – captured output of `node simulate.js`, showing the
  result of every step (empty GET, three POSTs, GET after inserts, PUT,
  DELETE, GET final state, and the two "not found" edge cases).
- `package.json` – dependencies (`express`, `mongoose`, `dotenv`).

## Folder structure

```
config/
  .env.example
models/
  User.js
server.js
simulate.js
output.txt
package.json
```

## User schema

```js
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
  },
  { timestamps: true }
);
```

## Running it for real

```bash
npm install
cp config/.env.example config/.env   # then edit config/.env with your real MONGO_URI
npm start
```

Once the server is running, use Postman to exercise the four routes:

- `GET http://localhost:3000/users`
- `POST http://localhost:3000/users` with a JSON body `{ "name": "...", "email": "...", "age": ... }`
- `PUT http://localhost:3000/users/:id` with a JSON body containing the fields to update
- `DELETE http://localhost:3000/users/:id`

## Running the local verification only (no MongoDB needed)

```bash
node simulate.js > output.txt
```
