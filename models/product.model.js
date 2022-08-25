const mongodb = require('mongodb');
const fs = require('fs');
const db = require('../database/database');


class MongoDBItemFetchError extends Error {
    constructor(message, init = {}) {
        super(message);
        this.name = 'MongoDBItemFetchError';
        if (init) {
            this.other = { ...init };
        }
    }
}

class Product {
    constructor(productInfo) {
        this.title = productInfo.title;
        this.summary = productInfo.summary;
        this.price = +productInfo.price;
        this.description = productInfo.description;
        this.setImageData(productInfo.image);
        if (productInfo._id) {
            this.id = productInfo._id.toString();
        }
    }

    setImageData(imageName) {
        this.imageData = {
            name: imageName,
            path: `product-data/images/${imageName}`,
            dbUrl: `/products/assets/images/${imageName}`,
        };
    }

    async saveToDB() {
        const productData = {
            title: this.title,
            summary: this.summary,
            price: this.price,
            description: this.description,
            image: this.imageData.name,
        };
        if (this.id) {
            const prodIdObject = new mongodb.ObjectId(this.id);

            if (!this.imageData.name) {
                delete productData.image;
            }

            await db.getDB()
                .collection('products')
                .updateOne({ _id: prodIdObject }, {
                    $set: productData
                });
        } else {
            await db.getDB()
                .collection('products')
                .insertOne(productData);
        }
    }

    removeFromDB() {
        fs.rm(`../product-data/images/${this.id}`, () => {
            const prodIdObject = new mongodb.ObjectId(this.id);
            db.getDB()
                .collection('products')
                .deleteOne({ _id: prodIdObject });
        });
    }

    static async fetchAll() {
        const products = await db.getDB()
            .collection('products')
            .find()
            .toArray();
        return products.map((productDoc) => {
            return new Product(productDoc);
        });
    }

    static async findById(productId) {
        const prodIdObject = new mongodb.ObjectId(productId);
        const product = await db.getDB()
            .collection('products')
            .findOne({ _id: prodIdObject });

        if (!product) {
            throw new MongoDBItemFetchError(
                'Could not find an object with provided data.',
                { code: 404 },
            );
        }
        return new Product(product);
    }

    static async findMultiple(ids) {
        const productIds = ids.map((id) => {
            return new mongodb.ObjectId(id);
        })

        const products = await db.getDB()
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray();

        return products.map((productDoc) => {
            return new Product(productDoc);
        });
    }
}

module.exports = Product;
