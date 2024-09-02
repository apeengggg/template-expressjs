const express = require('express')
const AuthController = require('../controllers/AuthController')

const { celebrate } = require('celebrate')
const { loginSchema } = require('../schemas/AuthSchema')

const ReqFilter = require('../middleware/RequestFilter')

const ctrl = new AuthController()
const authRouter = express.Router()

// base route /auth
authRouter.post('/login', celebrate({ body: loginSchema}), ctrl.login)
authRouter.post('/logout', ReqFilter.JwtFilter, ctrl.logout)

module.exports = authRouter