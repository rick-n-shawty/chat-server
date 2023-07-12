const jwt = require('jsonwebtoken')

const createAccessToken = (payload) => {
    return jwt.sign({...payload}, process.env.JWT_ACCESS_KEY)
}
const createRefreshToken = (payload) => {
    return jwt.sign({...payload}, process.env.JWT_REFRESH_KEY)
}

const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_KEY)
}
const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY)
}
module.exports = {
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}