require('dotenv').config();

const Sequelize = require("sequelize");
const { DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_PORT } = process.env;

/* function connect() { */
const sequelize = new Sequelize(`mysql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

sequelize.authenticate().then(() => {
    console.log('Conectado.');
}).catch(err => {
    console.error('Error de conexion:', err);
});

/* } 
connect();*/
// Async/Await Query Tester
/* (async() => {
    const fetch = await sequelize.query("SELECT user_id FROM users", {
        type: sequelize.QueryTypes.SELECT,
    });
    console.log("---- SELECT * FROM demo -----");
    console.log(fetch);
})(); */


module.exports = sequelize;