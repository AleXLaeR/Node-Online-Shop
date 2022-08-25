const Product = require("./product.model");

class Cart {
    constructor(items = [], totalQuantity = 0, totalPrice = 0) {
        this.items = items;
        this.totalQuantity = totalQuantity;
        this.totalPrice = totalPrice;
    }

    addItem(product) {
        const cartItem = {
            product: product,
            quantity: 1,
            totalPrice: product.price,
        };

        for (let i = 0, item = this.items[i]; i < this.items.length; i++) {
            if (item.product.id === product.id) {
                cartItem.quantity = +item.quantity + 1;
                cartItem.totalPrice = item.totalPrice + product.price;

                this.totalQuantity++;
                this.totalPrice += product.price;

                this.items[i] = cartItem;
                return;
            }
        }
        this.items.push(cartItem);

        this.totalQuantity++;
        this.totalPrice += product.price;
    }

    updateItem(productId, newQuantity = 0) {
        for (let i = 0, item = this.items[i]; i < this.items.length; i++) {
            if (item.product.id === productId) {
                if (newQuantity <= 0) {

                    this.items.splice(i, 1);
                    this.totalQuantity -= item.quantity;
                    this.totalPrice -= item.totalPrice;
                    return { itemPrice: 0 };
                }

                const cartItem = { ...item };
                const quantityChange = newQuantity - item.quantity;

                cartItem.quantity = newQuantity;
                cartItem.totalPrice = newQuantity * item.product.price;

                this.totalQuantity += quantityChange;
                this.totalPrice += quantityChange * item.product.price;

                this.items[i] = cartItem;

                return { itemPrice: cartItem.totalPrice };
            }
        }
    }


    async updatePrices() {
        const productIds = this.items.map((item) => {
            return item.product.id;
        });

        const products = await Product.findMultiple(productIds);

        const deletableCartItemProductIds = [];

        for (const cartItem of this.items) {
            const product = products.find((product) => {
                return product.id === cartItem.product.id;
            });

            if (!product) {
                // product was deleted!
                // "schedule" for removal from cart
                deletableCartItemProductIds.push(cartItem.product.id);
                continue;
            }

            // product was not deleted
            // set product data and total price to the latest price from database
            cartItem.product = product;
            cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
        }

        if (deletableCartItemProductIds.length > 0) {
            this.items = this.items.filter((item) => {
                return deletableCartItemProductIds.indexOf(item.product.id) < 0;
            });
        }

        // re-calculate cart totals
        this.totalQuantity = this.totalPrice = 0;
        for (const item of this.items) {
            this.totalQuantity += item.quantity;
            this.totalPrice += item.totalPrice;
        }
    }
}

module.exports = Cart;