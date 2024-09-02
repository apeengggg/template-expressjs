const { Router } = require('express');

const routes = Router();
routes.use('/users', require('./userRouter'));

module.exports = routes;
