const db = require('../../database/connection.js');

module.exports = {
  add,
  find,
  findBy,
  findById
};

function find() {
  return db('users').select('id', 'username').orderBy('id');
}

function findBy(filter) {
  return db('users as u')
    .select('u.id', 'u.username', 'u.password')
    .where(filter);
}

async function add(user) {
  const [id] = await db('users').insert(user, 'id');
  return findById(id);
}

function findById(id) {
  return db('users as u')
    .select('u.id', 'u.username', 'u.department')
    .where('u.id', id)
    .first();
}
