const Product = require('../models/product.model');

function getCart(req, res) {
    res.render('customer/cart/cart');
}

async function addCartItem(req, res, next) {
    let product;
    try {
        product = await Product
            .findById(req.body.productId);
    } catch (error) {
        return next(error);
    }

    const cart = res.locals.cart;
    cart.addItem(product);
    req.session.cart = cart;

    res.status(201).json({
        message: 'Cart Updated!',
        newItemTotal: cart.totalQuantity,
    });
}

function updateCartItem(req, res) {
    const cart = res.locals.cart;
    const updatedItemData = cart.updateItem(
        req.body.productId,
        +req.body.quantity
    );
    req.session.cart = cart;

    res.json({
        message: 'Item Updated!',
        updatedCartData: {
            newTotalQuantity: cart.totalQuantity,
            newTotalPrice: cart.totalPrice,
            updatedItemPrice: updatedItemData.itemPrice,
        }
    })
}

module.exports = {
    getCart: getCart,
    addCartItem: addCartItem,
    updateCartItem: updateCartItem,
};
