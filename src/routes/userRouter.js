const express = require('express')
const router = express.Router()

const { celebrate } = require('celebrate');

const UserController = require('../controllers/UserController')
const { searchUserParamsSchema, createUserParamSchema, updateUserParamSchema, deleteUserParamSchema } = require('../schemas/UserSchema')
const {JwtFilter} = require('../middleware/RequestFilter')

// base route /users
const ctrl = new UserController()

router.all('/*', JwtFilter);

router.route('/')
    .get( celebrate({ query: searchUserParamsSchema }), ctrl.doSearch)
    .post( celebrate({ body: createUserParamSchema }), ctrl.doCreate)
    .put( celebrate({ body: updateUserParamSchema }), ctrl.doUpdate)
    .delete( celebrate({ body: deleteUserParamSchema }), ctrl.doDelete)
module.exports = router