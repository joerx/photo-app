'use strict';

const PORT = process.env.port || 3000;

let express = require('express');
let morgan = require('morgan');

let app = express();

app.use(morgan('combined'));
app.use(express.static('public'));

app.use((req, res, next) => res.status(404).send('<h1>Document Not Found!</h1>'));

app.listen(PORT, _ => console.log(`Try http://localhost:${PORT}/`));
