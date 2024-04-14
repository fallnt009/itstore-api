require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('../src/models/index');

const app = express();

const productRoute = require('./routes/product-route');
const productCategoryRoute = require('./routes/product-category-route');
const productBrandRoute = require('./routes/product-brand-route');

const authRoute = require('./routes/auth-route');
const userRoute = require('./routes/user-route');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoute);
app.use('/api/product-category', productCategoryRoute);
app.use('/api/product-brand', productBrandRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

const port = process.env.PORT || 8000;

// db.sequelize.sync({force: true});
// db.sequelize.drop();

app.listen(port, () => console.log(`server running on port ${port}`));
