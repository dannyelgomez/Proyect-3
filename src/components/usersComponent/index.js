const routerUser = require('express').Router();
const { validateCreateUser, loginUser } = require('./users')

routerUser.post('/createUser', validateCreateUser);
routerUser.post('/login', loginUser);

module.exports = routerUser;