const jwt = require('jsonwebtoken')

const createAccessToken = (payload) => {
    return jwt.sign({...payload}, process.env.JWT_ACCESS_KEY)
}
const createRefreshToken = (payload) => {
    return jwt.sign({...payload}, process.env.JWT_REFRESH_KEY)
}
module.exports = {
    createAccessToken,
    createRefreshToken
}