const CartModel = require('../models/cart.model');

function initCart(req, res, next) {
    const sessionCart = req.session.cart;
    res.locals.cart = (!sessionCart) ? new CartModel()
        : new CartModel(
            sessionCart.items,
            sessionCart.totalQuantity,
            sessionCart.totalPrice,
        );
    next();
}

module.exports = initCart;
