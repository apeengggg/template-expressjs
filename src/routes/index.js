const { Router } = require('express');

const routes = Router();
routes.use('/users', require('./userRouter'));
routes.use('/auth', require('./authRouter'));

module.exports = routes;
