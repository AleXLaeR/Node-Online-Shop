const ProductModel = require('../models/product.model');
const OrderModel = require("../models/order.model");

async function getProducts(req, res, next) {
    try {
        const products = await ProductModel.fetchAll();
        res.render('admin/products/all-products', { products: products });
    } catch (error) {
        return next(error);
    }
}

function getNewProduct(req, res) {
    res.render('admin/products/new-product');
}

async function createNewProduct(req, res, next) {
    const product = new ProductModel({
        ...req.body,
        image: req.file.filename,
    });

    try {
        await product.saveToDB();
    } catch (error) {
        return next(error);
    }
    res.redirect('/admin/products');
}

async function getUpdateProduct(req, res, next) {
    try {
        const product = await ProductModel.findById(req.params.id);
        res.render('admin/products/update-product', { product: product });
    } catch (error) {
        return next(error);
    }
}

async function updateProduct(req, res, next) {
    const product = new ProductModel({
        ...req.body,
        _id: req.params.id
    });

    if (req.file) {
        product.setImageData(req.file.filename);
    }

    try {
        await product.saveToDB();
    } catch (error) {
        return next(error);
    }
    res.redirect('/admin/products');
}

async function deleteProduct(req, res, next) {
    try {
        const product = await ProductModel.findById(req.params.id);
        await product.removeFromDB();
    } catch (error) {
        return next(error);
    }
    res.json({ message: 'Product Successfully Deleted!' });
}

async function getOrders(req, res, next) {
    try {
        const orders = await OrderModel.findAll();
        res.render('admin/orders/admin-orders', {
            orders: orders
        });
    } catch (error) {
        next(error);
    }
}

async function updateOrder(req, res, next) {
    const orderId = req.params.id;
    const newStatus = req.body.newStatus;

    try {
        const order = await OrderModel.findById(orderId);

        order.status = newStatus;

        await order.saveToDB();

        res.json({ message: 'Order updated', newStatus: newStatus });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getProducts: getProducts,
    getNewProduct: getNewProduct,
    createNewProduct: createNewProduct,
    getUpdateProduct: getUpdateProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    getOrders: getOrders,
    updateOrder: updateOrder,
}
