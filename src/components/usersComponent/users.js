const { createToken } = require('../securityComponent/security');
const sequelize = require('../../commons/database/conexion');

const validateCreateUser = async(req, res, next) => {
    let { username, password, fullname, email, phone, address } = req.body;
    validateUsername(req, res, username);
    if (!username || !password || !fullname || !email || !phone || !address) {
        res.status(400).json('Información incompleta o petición mal formulada');
        console.log('faltan datos');
        next();
    } else {
        await sequelize.query(`INSERT INTO users ( username, password, full_name, email, phone, delivery_address ) 
        VALUES ('${username}','${password}','${fullname}','${email}',${phone},'${address}')`)
            .then(response => {
                console.log(response);
                console.log("Number of records inserted: " + response[1]);
            }).catch(err => {
                console.error(err)
            });
        res.status(200).json('Usuario creado correctamente');
        next();
    }
}

function validateUsername(req, res, username) {
    sequelize.query(`SELECT username FROM users WHERE username=:user_name`, {
            replacements: { user_name: username },
            type: sequelize.QueryTypes.SELECT,
        })
        .then(result => {
            if (result != "") {
                res.status(200).json('Elija un nombre de usuario diferente');
            }
        }).catch(err => {
            console.error(err)
        });
}

const loginUser = async(req, res, next) => {
    let { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json('Información incompleta o petición mal formulada');
        console.log('faltan datos');
        next();
    } else {
        sequelize.query(`SELECT * FROM users WHERE username='${username}' and password='${password}'`, {
                type: sequelize.QueryTypes.SELECT,
            })
            .then((result) => {
                if (result != "") {
                    //crear token
                    sequelize.query(`SELECT user_id, full_name, email, is_admin FROM users WHERE username='${username}'`, {
                            type: sequelize.QueryTypes.SELECT,
                        })
                        .then(payload => {
                            const sendPayload = {
                                user_id: payload[0].user_id,
                                fullname: payload[0].full_name,
                                email: payload[0].email,
                                is_admin: payload[0].is_admin
                            }
                            console.log(sendPayload);
                            createToken(req, res, sendPayload, next);
                            console.log('siguio');
                        }).catch(err => {
                            console.error(err)
                        });
                } else {
                    console.log('no tiene información');
                    res.status(401).json('Usuario o contraseña no validos');
                }
            }).catch(err => {
                console.error(err)
            });
        console.log('todos los datos');
        next();
    }
}

module.exports = {
    validateCreateUser,
    loginUser
}