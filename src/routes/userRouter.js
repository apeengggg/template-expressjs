const express = require('express')
const router = express.Router()

const { celebrate } = require('celebrate');

const UserController = require('../controllers/UserController')
const { searchUserParamsSchema } = require('../schemas/UserSchema')

// base route /users
const ctrl = new UserController()

router.route('/')
    .get( celebrate({ query: searchUserParamsSchema }), ctrl.doSearch)
module.exports = router