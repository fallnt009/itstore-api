require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`server running on port ${port}`));
