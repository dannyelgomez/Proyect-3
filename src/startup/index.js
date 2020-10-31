const express = require('express');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

const routerUser = require('../components/usersComponent');
const routerOrders = require('../components/ordersComponent');
const routerProducts = require('../components/productsComponent');

const app = express();
app.use(helmet());
app.use(express.json());

const router = express.Router();

app.use(router);

/* Routes */
router.use('/users', routerUser); //User
router.use('/orders', routerOrders); //Orders
router.use('/products', routerProducts); //Products

//Server
const runServer = () => {

    app.listen(3000, () => {
        console.log(`Servidor iniciado en http://localhost:3000`);
    });
}

module.exports = runServer;