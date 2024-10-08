const { Unauthorized } = require('../utils/ResponseUtil')
const { verifyJwt } = require('../utils/JwtUtil')
const logger = require('../utils/LoggerUtil')
const { getOneUserByUserId } = require('../models/User')
const { getPermissionByRoleIdAndFunctionId } = require('../models/Permission')

const InfoFilter = (req, res, next) => {
    logger.info(`hostname: ${req.hostname}, ip: ${req.ip}`)
    logger.info(`${req.method} ${req.url}`)
    if(JSON.stringify(req.query) != "{}") {
        logger.info(`query param: ${JSON.stringify(req.query)}`)
    }
    if(req.method == 'POST' || req.method == 'PUT' || req.method == 'DELETE') {
        let bd
        if(req.body.password) {
            bd = JSON.parse(JSON.stringify(req.body))
            bd.password = ""            
        } else if(req.body.oldPassword || req.body.newPassword) {
            bd = JSON.parse(JSON.stringify(req.body))
            bd.oldPassword = ""
            bd.newPassword = ""            
        } else {
            bd = req.body            
        }
        // logger.info(`body param: ${JSON.stringify(bd)}`)
    }
    next()
}

const getToken = (bearer) => {
    return bearer.slice(7, bearer.length)
}

/* validating jwt on header or query */
const JwtFilter = async (req, res, next) => {
    let token
    if(req.headers.authorization) {
        token = getToken(req.headers.authorization)
    } else if(req.query.token) {
        token = req.query.token        
    }
    
    if(token) {
        if(verifyJwt(req, token)) {
            const { userId, roleId } = req.app.locals
            const userObj = await getOneUserByUserId({userId: userId})
            if(userObj == null) {
                logger.info(`User Id: ${userId} is not exists, probably deleted.`)
                Unauthorized(res, 'User does not exist anymore')
            } else if(userObj.role_id != roleId) {
                logger.info('Token is not valid because role has been changed')
                Unauthorized(res, 'Token is not valid because role has been changed')
            } else {
                if(userObj != null) {
                    req.app.locals.name = userObj.name
                }
                next()
            }
        } else {
            logger.info('Token is not valid')
            Unauthorized(res, 'Token is not valid')
        }
    } else {
        logger.info('Token is missing')
        Unauthorized(res, 'Token is missing')
    }
}

const checkAccess = async (req) => {
    const functionId = req.headers.FUNCTION_ID
    const { userId, roleId } = req.app.locals

    if(userId && roleId && userId != "" && roleId != "") {
        logger.info(`who: ${userId}, role: ${roleId}`)
        
        const permission = await getPermissionByRoleIdAndFunctionId(roleId, functionId)

        logger.info(`function id: [${functionId}], permission: ${JSON.stringify(permission)}`)

        if(permission != null) {
            const { allowread, allowcreate, allowupdate, allowdelete, function_name } = permission

            let hasAccess = false
            if(req.method == 'GET' && allowread == 1) {
                hasAccess = true
            } else if(req.method == 'POST' && allowcreate == 1) {
                hasAccess = true
            } else if(req.method == 'PUT' && allowupdate == 1) {
                hasAccess = true
            } else if(req.method == 'DELETE' && allowdelete == 1) {
                hasAccess = true
            }

            return hasAccess
        }
    }
    return false
}

module.exports = { InfoFilter, JwtFilter, checkAccess }