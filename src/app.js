require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

const port = process.env.PORT || 8000;

// db.sequelize.sync();
// db.sequelize.drop();

app.listen(port, () => console.log(`server running on port ${port}`));
