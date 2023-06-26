const User = require('../DB/models/User')
const joi = require('joi')
const {BadRequest, NotFound} = require('../Errors/CustomErrors')
const { StatusCodes } = require('http-status-codes')
const {createAccessToken, createRefreshToken} = require('../helperFunctions/jwt')
const verifyRegisterBody = (body) =>{
    try{
        const joiSchema = joi.object({
            email: joi.string().email().required(),
            name: joi.string().required(),
            password: joi.string().required()
        })
        const {error, value} = joiSchema.validate(body)
        if(error) throw new BadRequest("Validation error")
        return value 
    }catch(err){
        throw err 
    }
}
const Register = async(req, res, next) => {
    try{
        const {email, name, password} = verifyRegisterBody(req.body) 
        const user = await User.create({email, name, password})
        if(!user) throw new BadRequest('Something went wrong')
        const accessToken = createAccessToken({userId: user._id})
        const refreshToken = createRefreshToken({userId: user._id})
        return res.status(StatusCodes.OK).json({msg: "Registered successfuly", accessToken, refreshToken})
    }catch(err){
        return next(err)
    }
}

const verifyLoginBody = (body) => {
    try{
        const joiSchema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().required()
        })
        const {error, value} = joiSchema.validate(body)
        if(error) throw new BadRequest("Invalid Body")
        return value 
    }catch(err){
        throw err 
    }
}
const Login = async(req, res, next) => {
    try{
        const {email, password} = verifyLoginBody(req.body)
        const user = await User.findOne({email: email})
        if(!user) throw new NotFound("user not found")
        const isPasswordValid = await user.CheckPassword(password)
        if(isPasswordValid === false) throw new BadRequest("Password is incorrect")
        const accessToken = createAccessToken({userId: user._id})
        const refreshToken = createRefreshToken({userId: user._id})
        return res.status(StatusCodes.OK).json({msg: 'Logged in', accessToken, refreshToken})
    }catch(err){
        return next(err)
    }
}

module.exports = {
    Register,
    Login
}
