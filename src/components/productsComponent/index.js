const routerProducts = require('express').Router();
const { addProducts, getProducts, updateProducts, deleteProducts } = require('./products');
const { validateToken, validateUser } = require('../securityComponent/security');

routerProducts.put('/updateProducts', validateToken, validateUser, updateProducts);
routerProducts.post('/addProducts', validateToken, validateUser, addProducts);
routerProducts.delete('/deleteProducts', validateToken, validateUser, deleteProducts);
routerProducts.get('/getProducts', validateToken, getProducts);

module.exports = routerProducts;