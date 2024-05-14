require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
const morgan = require('morgan');
const db = require('../src/models/index');

const app = express();

const productRoute = require('./routes/product-route');
const mockDataRoute = require('./routes/mock-data-route');
const categoryRoute = require('./routes/category-route');
const authRoute = require('./routes/auth-route');
const userRoute = require('./routes/user-route');
const wishlistRoute = require('./routes/wishlist-route');
const addressRoute = require('./routes/address-route');
const cartRoute = require('./routes/cart-route');
const orderRoute = require('./routes/order-route');

const notFoundMiddleware = require('./middlewares/not-found');
const errorMiddleware = require('./middlewares/error');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/address', addressRoute);
app.use('/api/wish', wishlistRoute);
app.use('/api/mock', mockDataRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 8000;

// db.sequelize.sync();
// db.sequelize.drop();

app.listen(port, () =>
  console.log(chalk.yellowBright.italic.bold(`server running on port ${port}`))
);
