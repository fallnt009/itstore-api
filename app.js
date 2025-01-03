require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
const morgan = require('morgan');
const db = require('./models/index');

const notFoundMiddleware = require('./middlewares/notfound');
const errorMiddleware = require('./middlewares/error');

const app = express();

const productRoute = require('./modules/product/routes/product.route');
const mockDataRoute = require('./modules/mock-data/routes/mock-data.route');
const authRoute = require('./modules/auth/routes/auth.routes');
const userRoute = require('./modules/user/routes/user.route');
const wishlistRoute = require('./modules/wishlist/routes/wishlist.route');
const addressRoute = require('./modules/address/routes/address.route');
const cartRoute = require('./modules/cart/routes/cart.routes');
const orderRoute = require('./modules/order/routes/order.route');
const checkoutRoute = require('./modules/checkout/routes/checkout.route');
const discountRoute = require('./modules/discount/routes/discount.routes');
const paymentRoute = require('./modules/payment/routes/payment.route');
const categoryRoute = require('./modules/product/routes/category.route');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/static', express.static('public'));

//Routes
app.use('/api/products', productRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/address', addressRoute);
app.use('/api/wishlist', wishlistRoute);
app.use('/api/mock', mockDataRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);
app.use('/api/checkout', checkoutRoute);
app.use('/api/discount', discountRoute);
app.use('/api/payment', paymentRoute);

//Middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 8000;

// db.sequelize.sync();

app.listen(port, () =>
  console.log(chalk.yellowBright.italic.bold(`server running on port ${port}`))
);
