const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.set('views', path.join(__dirname, 'resources', 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

module.exports = app;