const db = require('../database/dbConfig.js');

module.exports = {
    add,
    findBy
};

function findBy(filter) {
    return db('users').select('username', 'password').where(filter);
};

async function add(user) {
    const [id] = await db('users').insert(user);
    return findBy({id});
};
