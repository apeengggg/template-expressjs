const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

const verifyJwt = (req, token) => {
    try {
        var decoded = jwt.verify(token, secret);
        // set userId into request
        req.app.locals.userId = decoded.data
        req.app.locals.roleId = decoded.roleId
        return true
    } catch(err) {
        return false
    }
}

const createJwtToken = (userId, roleId) => {
    let expires = process.env.JWT_EXPIRED
    return jwt.sign({
        roleId,
        data: userId,
    }, secret, { expiresIn: expires });
}

const createJwtTokenMobile = (userId, roleId) => {
    let expires = process.env.JWT_MOBILE_EXPIRED
    return jwt.sign({
        roleId,
        data: userId,
    }, secret, { expiresIn: expires });
}

module.exports = { verifyJwt, createJwtToken, createJwtTokenMobile }