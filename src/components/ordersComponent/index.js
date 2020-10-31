const routerOrders = require('express').Router();
const { addOrder, updateOrder, deleteOrder } = require('./orders');
const { validateToken, validateUser } = require('../securityComponent/security');

routerOrders.post('/addOrder', validateToken, addOrder);
routerOrders.put('/updateOrder', validateToken, validateUser, updateOrder);
routerOrders.delete('/deleteOrder', validateToken, validateUser, deleteOrder);

module.exports = routerOrders;