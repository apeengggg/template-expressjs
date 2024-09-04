const express = require('express')
const router = express.Router()

const { celebrate } = require('celebrate');

const UserController = require('../controllers/UserController')
const { searchUserParamsSchema, createUserParamSchema } = require('../schemas/UserSchema')

// base route /users
const ctrl = new UserController()

router.route('/')
    .get( celebrate({ query: searchUserParamsSchema }), ctrl.doSearch)
    .post( celebrate({ body: createUserParamSchema }), ctrl.doCreate)
module.exports = router