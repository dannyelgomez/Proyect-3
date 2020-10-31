const { response } = require('express');
const sequelize = require('../../commons/database/conexion');
const { validateToken, is_numeric } = require('../securityComponent/security');

const addOrder = async(req, res, next) => {
    validateToken(req, res, next);
    const user_id = req.token_info.user_id;
    console.log(user_id);
    let { payment_method, products } = req.body;
    if (typeof(products) != "object") {
        products = false;
    }
    if (!payment_method || !products) {
        res.status(400).json('Información incompleta o petición mal formulada');
        console.log('Datos incompletos');
        next();
    } else {
        let desiredProducts = [];
        products.forEach((element) => {
            desiredProducts.push(element.product_id)
        });
        await sequelize.query(`SELECT * FROM products WHERE product_id IN (${desiredProducts})`, { //busca los productos a guardar en la orden
                type: sequelize.QueryTypes.SELECT,
            })
            .then(async result => {
                /* Calcula el valor total con los precios de los productos */
                let total = 0;
                let description = "";
                let ord_id;
                result.forEach((product, index) => {
                    total += product.price * products[index].amount;
                    description += `${products[index].amount}x ${product.name}, `;
                });
                description = description.substring(0, description.length - 2);
                /* Inserta las ordenes */
                const order = await sequelize.query(
                    `INSERT INTO orders (status, date, description, payment_method, total, user_id) 
                    VALUES (:status, :date, :description, :payment_method, :total, :user_id)`, {
                        replacements: {
                            status: "new",
                            date: new Date(),
                            description,
                            payment_method: payment_method,
                            total,
                            user_id,
                        },
                    }
                ).then(result => {
                    ord_id = result;
                }).catch(err => {
                    console.error(err)
                });
                /* Inserta la cantidad de productos en cada tabla de ordenes por producto */
                products.forEach(async(product) => {
                    const order_products = await sequelize.query(
                            `INSERT INTO orders_products (order_id, product_id, product_amount) 
                        VALUES (${ord_id[0]}, ${product.product_id}, ${product.amount})`)
                        .then(result => {
                            console.log("Number of rows insert: " + result[1] + " in table Orders_Products");
                        }).catch(err => {
                            console.error(err)
                        });
                })

                res.status(200).json('Orden agregada correctamente');
                console.log('Datos completos');
                next();
            }).catch(err => {
                console.error(err)
            });
    };
}

const updateOrder = async(req, res, next) => {
    await validateToken(req, res, next);
    const user_id = req.token_info.user_id;
    if (is_numeric(user_id) == false) {
        res.status(403).json('El parametro identificación debe ser numero');
    }
    let id = req.query.id ? is_numeric(req.query.id) : console.log('Falta parametro id');
    let { status } = req.body;
    if (!status) {
        res.status(400).json('No se envio identificacion o estatus');
        next();
    } else {

        try {
            const order = await sequelize.query("SELECT * FROM orders WHERE order_id = :order_id;", {
                replacements: { order_id: id },
                type: sequelize.QueryTypes.SELECT,
            });

            if (!!order.length) {
                const update = await sequelize.query("UPDATE orders SET status = :status WHERE order_id = :order_id", {
                    replacements: {
                        order_id: id,
                        status: status,
                    },
                });
                res.status(200).json(`Orden ${id} fue modificada correctamente`);
            } else {
                res.status(404).json("No se encontraron resultados");
            }
        } catch (error) {
            next(new Error(error));
        }

        next();
    }
};

const deleteOrder = async(req, res, next) => {
    let id = req.query.id ? is_numeric(req.query.id) : console.log('Falta parametro id');
    if (!id) {
        res.status(400).json('No se envio identificación o identificación solo númerica');
        next();
    } else {
        if (id != false) {
            await sequelize.query(`DELETE FROM orders_products WHERE order_id =${id}`)
                .then(result => {
                    console.log("Number of rows delete: " + result[0].affectedRows + " de la tabla ordernes_productos");
                    sequelize.query(`DELETE FROM orders WHERE order_id =${id}`)
                        .then(result => {
                            console.log("Number of rows delete: " + result[0].affectedRows + " de la tabla ordernes");

                        }).catch(err => {
                            console.error(err)
                        });
                }).catch(err => {
                    console.error(err)
                });

            res.status(200).json(`Se elimino la orden ${id} correctamente`);
        }
        next();
    }
};

module.exports = {
    addOrder,
    updateOrder,
    deleteOrder,
}