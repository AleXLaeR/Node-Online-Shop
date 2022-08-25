const order = require('../models/order.model');
const User = require('../models/user.model');
const Order = require("../models/order.model");

const stripe = require('stripe');
const stripeObj = stripe('sk_test_51LaZHWKTwrmcdhTH7spdrfXgHzF3T0exlO0b2mNBMkAv1Pgf4bL95MQmCIoTXTlzM14syFsUd6VxJN7ObVf7L4iB00ouDY85g8');

async function getOrders(req, res, next) {
    try {
        const orders = await Order.findAllForUser(res.locals.uid);
        res.render('customer/orders/all-orders', { orders: orders });
    } catch (error) {
        next(error);
    }
}

async function addOrder(req, res, next) {
    const cart = res.locals.cart;

    let userDocument;
    try {
        userDocument = await User.findById(res.locals.uid);
        const userOrder = new Order(cart, userDocument);
        userOrder.saveToDB();
    } catch (error) {
        return next(error);
    }

    req.session.cart = null;

    const domain = 'http://localhost:3000';
    const session = await stripeObj.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: cart.items.map((item) => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.product.title,
                    },
                    unit_amount:
                        +item.product.price.toFixed(2) * 100,
                },
                quantity: +item.quantity,
            };
        }),
        mode: 'payment',
        success_url: `${domain}/orders/success`,
        cancel_url: `${domain}/orders/cancel`,
    });

    res.redirect(303, session.url);
}

function getSuccess(req, res) {
    res.render('customer/orders/payment-success');
}

function getFailure(req, res) {
    res.render('customer/orders/payment-failure');
}

module.exports = {
    addOrder: addOrder,
    getOrders: getOrders,
    getSuccess: getSuccess,
    getFailure: getFailure,
};
