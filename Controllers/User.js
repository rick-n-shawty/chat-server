const User = require('../DB/models/User')
const joi = require('joi')
const {BadRequest} = require('../Errors/CustomErrors')
const { StatusCodes } = require('http-status-codes')
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
        return res.status(StatusCodes.OK)
    }catch(err){
        return next(err)
    }
}

const Login = async(req, res, next) => {
    try{

    }catch(err){
        return next(err)
    }
}