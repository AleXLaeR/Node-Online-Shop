const express = require('express');
const expressSession = require('express-session');
const path = require('path');

const csrf = require('csurf');
const sessionConfig = require('./config/session');

const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartInitMiddleware = require('./middlewares/cart');
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');

const db = require('./database/database');

const baseRoutes = require('./routes/base');
const authRoutes = require('./routes/auth.routes');
const cartRoutes = require('./routes/cart.routes');
const adminRoutes = require('./routes/admin.routes');
const orderRoutes = require('./routes/orders.routes');
const productRoutes = require('./routes/products.routes');
const errorRoutes = require('./routes/error-handler.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/assets', express.static('product-data'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(expressSession(sessionConfig()));

app.use(csrf({}));
app.use(addCsrfTokenMiddleware);

app.use(cartInitMiddleware);
app.use(updateCartPricesMiddleware);
app.use(checkAuthStatusMiddleware);

app.use('/admin', adminRoutes);
app.use('/cart', cartRoutes);
app.use('/products', protectRoutesMiddleware, productRoutes);
app.use('/orders', protectRoutesMiddleware, orderRoutes);
app.use('/', baseRoutes, authRoutes, errorRoutes);

const PORT = process.env.PORT || 3000;

db.connectToDatabase()
    .then(() => {
        app.listen(PORT);
    })
    .catch((error) => {
        console.log(`Failed to connect to the database!\n${error}`);
    });
