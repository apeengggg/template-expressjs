const express = require('express')
const router = express.Router()

const { celebrate } = require('celebrate');
const {Forbidden} = require('../utils/ResponseUtil')
const UserController = require('../controllers/UserController')
const { searchUserParamsSchema, createUserParamSchema, updateUserParamSchema, deleteUserParamSchema } = require('../schemas/UserSchema')
const {JwtFilter, checkAccess} = require('../middleware/RequestFilter')

// base route /users
const ctrl = new UserController()
const FUNCTION_ID = 'FM001'

const RoleFilter = async(req, res, next) => {
    if(await checkAccess(req, FUNCTION_ID)) {
        next()
    } else {
        Forbidden(res, 'Forbidden Access')
    }
}

router.all('/*', JwtFilter);

router.route('/')
    .get(RoleFilter, celebrate({ query: searchUserParamsSchema }), ctrl.doSearch)
    .post(RoleFilter, celebrate({ body: createUserParamSchema }), ctrl.doCreate)
    .put(RoleFilter, celebrate({ body: updateUserParamSchema }), ctrl.doUpdate)
    .delete(RoleFilter, celebrate({ body: deleteUserParamSchema }), ctrl.doDelete)
module.exports = router