/**
 * Local simulation of the REST API's route logic.
 *
 * This sandbox has no network access to a real MongoDB instance, so the
 * Express server in server.js can't actually be started and hit with
 * Postman here. This script re-implements the same four operations
 * (GET all, POST create, PUT update by id, DELETE by id) against a
 * plain in-memory array with the same semantics as the Mongoose calls
 * in server.js, purely to verify the expected behavior of the route
 * handlers before running the real server with `npm start` and testing
 * it with Postman against your own MongoDB Atlas URI.
 */

let seq = 1;
function objectId() {
  return 'ObjectId(' + String(seq++).padStart(24, '0') + ')';
}

function log(title, data) {
  console.log('\n=== ' + title + ' ===');
  console.log(JSON.stringify(data, null, 2));
}

let users = [];

// --- GET /users (before any data exists) ---------------------------------
log('GET /users (empty database)', users);

// --- POST /users ------------------------------------------------------
function createUser({ name, email, age }) {
  const newUser = { _id: objectId(), name, email, age };
  users.push(newUser);
  return newUser;
}

const alice = createUser({ name: 'Alice Johnson', email: 'alice@example.com', age: 28 });
log('POST /users -> create Alice', alice);

const bob = createUser({ name: 'Bob Smith', email: 'bob@example.com', age: 34 });
log('POST /users -> create Bob', bob);

const carol = createUser({ name: 'Carol Davis', email: 'carol@example.com', age: 41 });
log('POST /users -> create Carol', carol);

// --- GET /users (after inserts) ---------------------------------------
log('GET /users (after 3 creates)', users);

// --- PUT /users/:id -----------------------------------------------------
function updateUser(id, updates) {
  const index = users.findIndex((u) => u._id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  return users[index];
}

const updatedBob = updateUser(bob._id, { age: 35 });
log(`PUT /users/${bob._id} -> update Bob's age to 35`, updatedBob);

// --- DELETE /users/:id ----------------------------------------------------
function deleteUser(id) {
  const index = users.findIndex((u) => u._id === id);
  if (index === -1) return null;
  const [removed] = users.splice(index, 1);
  return removed;
}

const removedCarol = deleteUser(carol._id);
log(`DELETE /users/${carol._id} -> remove Carol`, removedCarol);

// --- GET /users (final state) ------------------------------------------
log('GET /users (final state)', users);

// --- Error cases ---------------------------------------------------------
const notFoundUpdate = updateUser('ObjectId(does-not-exist)', { age: 99 });
log('PUT /users/:id -> unknown id returns null (404 in real route)', notFoundUpdate);

const notFoundDelete = deleteUser('ObjectId(does-not-exist)');
log('DELETE /users/:id -> unknown id returns null (404 in real route)', notFoundDelete);
