require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('../src/models/index');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8000;

// db.sequelize.sync({force: true});
// db.sequelize.drop();

app.listen(port, () => console.log(`server running on port ${port}`));
