const Message = require('../DB/models/Messages')
const joi = require('joi')
const { verifyAccessToken, verifyRefreshToken } = require('../helperFunctions/jwt')
const sendMessage = async (data) => {
    this.validateData = function(){
        const joiObject = joi.object({
            chatId: joi.string().required(),
            accessToken: joi.string().required(),
            msg: joi.string().min(1).required()
        })
        const {error, value} =  joiObject.validate(data)
        if(error) throw new Error("Validation Error")
        return value
    }
    try{
        const {chatId, accessToken, msg} = this.validateData()
        const { userId, email } = verifyAccessToken(accessToken)
        if(!userId || !email) throw new Error("Invalid token")
        const message = await Message.create({chatId, senderId: userId, senderName: email, content: msg})
        if(!message) throw new Error("Error")
        return message
    }catch(err){
        console.log(err)
        return false 
    }
}


module.exports = {
    sendMessage
}