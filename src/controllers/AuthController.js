const { Ok, BadRequest, Unauthorized, InternalServerErr } = require('../utils/ResponseUtil')
const logger = require('../utils/LoggerUtil')
const { getUserFromEmail } = require('../models/User')
const { getPermissionById } = require('../models/Permission')
const { createJwtToken } = require('../utils/JwtUtil')
const { createObjectPermission } = require('../utils/PermissionUtil')
// const LogUserHelper = require('../utils/LogUserHelper')

const bcrypt = require('bcrypt')

class AuthController {

    async login(req, res) {
        const param = req.body
        // console.log("🚀 ~ AuthController ~ login ~ param:", param)
        try {
            const user = await getUserFromEmail(param)
            // console.log("🚀 ~ AuthController ~ login ~ user:", user)
            if(user == null) {
                Unauthorized(res, 'Login failed, either your User Id isn\'t registered in our system or your password is incorrect')
            } else {
                // compare password                
                const match = await bcrypt.compare(param.password, user.password)
                if(match) {
                    // get permission based on RoleId
                    let permissions = await getPermissionById({roleId: user.role_id})

                    if(permissions.length == 0) {
                        return Unauthorized(res, `Login failed, your assigned role doesn't have any permission to login yet`)
                    }

                    const object_permission = await createObjectPermission(permissions)
                    console.log("🚀 ~ AuthController ~ login ~ object_permission:", object_permission)

                    Ok(res, 'Login success', { 
                        user_id: user.user_id, 
                        name: user.name,
                        foto_profile: user.photo,
                        role_id: user.role_id,
                        role_name: user.role_name,
                        permission: object_permission,
                        token: createJwtToken(user.user_id, user.role_id) 
                    })

                } else {
                    Unauthorized(res, 
                        'Login failed, either your User Id isn\'t registered in our system or your password is incorrect')
                }
            }
        } catch(err) {
            logger.error('AuthController.login', err)            
            InternalServerErr(res, "Error during authentication")
        }
    }
}

module.exports = AuthController