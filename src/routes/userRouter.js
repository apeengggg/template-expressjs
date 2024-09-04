const express = require('express')
const router = express.Router()

const { celebrate } = require('celebrate');

const UserController = require('../controllers/UserController')
const { searchUserParamsSchema, createUserParamSchema, updateUserParamSchema, deleteUserParamSchema } = require('../schemas/UserSchema')

// base route /users
const ctrl = new UserController()

router.route('/')
    .get( celebrate({ query: searchUserParamsSchema }), ctrl.doSearch)
    .post( celebrate({ body: createUserParamSchema }), ctrl.doCreate)
    .put( celebrate({ body: updateUserParamSchema }), ctrl.doUpdate)
    .delete( celebrate({ body: deleteUserParamSchema }), ctrl.doDelete)
module.exports = router