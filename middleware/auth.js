const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')
const authenticate = (req, res, next) => {
    try{
        const headers = req.headers.authorization   
        if(!headers) return res.status(StatusCodes.UNAUTHORIZED)
        else if(!headers.startsWith('Bearer')) return res.status(StatusCodes.UNAUTHORIZED).json({err: "not authorized"})
        const token = headers.split(' ')[1]
        if(!token) return res.status(StatusCodes.UNAUTHORIZED).json({err: 'not authorized'})
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY)
        if(!decoded) return res.status(StatusCodes.UNAUTHORIZED).json({err: "not authorized"})
        const {userId} = decoded 
        req.userId = userId
        return next()
    }catch(err){
        return res.status(StatusCodes.UNAUTHORIZED)
    }
}
module.exports = authenticate