const User = require('../DB/models/User')
const joi = require('joi')
const {BadRequest, NotFound, Unauthorized} = require('../Errors/CustomErrors')
const { StatusCodes } = require('http-status-codes')
const {createAccessToken, createRefreshToken} = require('../helperFunctions/jwt')
const jwt = require('jsonwebtoken')

const Register = async(req, res, next) => {
    this.validateBody = function(){
        try{
            const joiSchema = joi.object({
                email: joi.string().email().required(),
                name: joi.string().required(),
                password: joi.string().required()
            })
            const {error, value} = joiSchema.validate(req.body)
            if(error) throw new BadRequest("Validation error")
            return value 
        }catch(err){
            throw err 
        }
    }
    try{
        const {email, name, password} = this.validateBody()
        const user = await User.create({email, name, password})
        if(!user) throw new BadRequest('Something went wrong')
        const accessToken = createAccessToken({userId: user._id, email: user.email})
        const refreshToken = createRefreshToken({userId: user._id, email: user.email})
        return res.status(StatusCodes.OK).json({msg: "Registered successfuly", accessToken, refreshToken, email: user.email})
    }catch(err){
        return next(err)
    }
}


const Login = async(req, res, next) => {
    this.validateBody = function(){
        try{
            const joiSchema = joi.object({
                email: joi.string().email().required(),
                password: joi.string().required()
            })
            const {error, value} = joiSchema.validate(req.body)
            if(error) throw new BadRequest("Invalid Body")
            return value 
        }catch(err){
            throw err 
        }
    }
    try{
        const {email, password} = this.validateBody()
        const user = await User.findOne({email: email})
        if(!user) throw new NotFound("user not found")
        const isPasswordValid = await user.CheckPassword(password)
        if(isPasswordValid === false) throw new BadRequest("Password is incorrect")
        const accessToken = createAccessToken({userId: user._id, email: user.email})
        const refreshToken = createRefreshToken({userId: user._id, email: user.email})
        return res.status(StatusCodes.OK).json({msg: 'Logged in', accessToken, refreshToken, email: user.email})
    }catch(err){
        return next(err)
    }
}

const refreshToken = async (req, res, next) => {
    try{
        const headers = req.headers.authorization 
        if(!headers || !headers.startsWith("Bearer")) throw new BadRequest("bad request")
        const token = headers.split(' ')[1]
        if(!token) throw new BadRequest("Token is missing")
        const payload = jwt.verify(token, process.env.JWT_REFRESH_KEY)
        if(!payload || !payload.userId || !payload.email) throw new Unauthorized("You are not authorized to get this resource")
        const accessToken = createAccessToken(payload)
        const refreshToken = createRefreshToken(payload)
        return res.status(StatusCodes.OK).json({accessToken, refreshToken, email: payload.email})
    }catch(err){
        return next(err)
    }
}

const getAllUsers = async (req, res, next) => {
    try{
        const users = await User.find()
        return res.status(StatusCodes.OK).json({users})
    }catch(err){
        return next(err)
    }
}

module.exports = {
    Register,
    Login,
    refreshToken,
    getAllUsers
}
