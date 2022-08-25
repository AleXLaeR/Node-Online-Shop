const ProductModel = require('../models/product.model');

async function getAllProducts(req, res, next) {
    try {
        const products = await ProductModel.fetchAll();
        res.render('customer/products/all-products', { products: products });
    } catch (error) {
        next(error);
    }
}

async function getProductDetails(req, res, next) {
    try {
        const product = await ProductModel.findById(req.params.id);
        res.render('customer/products/product-details', { product: product });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllProducts: getAllProducts,
    getProductDetails: getProductDetails,
}


