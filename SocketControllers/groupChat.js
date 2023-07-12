const Message = require('../DB/models/Messages')
const joi = require('joi')
const { verifyAccessToken, verifyRefreshToken } = require('../helperFunctions/jwt')
const getGroupMessages = async (limit, groupId) => {
    try{
        
    }catch(err){
        console.log(err)
        return false 
    }
}




const joinGroup = async (data, msgLimit=20) => {
    this.validateData = function(){
        const joiObject = joi.object({
            accessToken: joi.string().min(1).required(),
            groupId: joi.string().min(1).required()
        })
        const { error, value } = joiObject.validate(data)
        if(error) throw new Error("error")
        return value
    }
    try{
        const { accessToken, groupId } = this.validateData()
        if(!accessToken || !groupId) throw new Error('unauthenticated')
        const { userId } = verifyAccessToken(accessToken)
        if(!userId) throw new Error("Unauthenticated")
        const messages = await Message.find({chatId: groupId}).sort({createdBy: -1}).limit(msgLimit)
        return messages
    }catch(err){
        console.log(err)
        return false 
    }
}

module.exports = {
    getGroupMessages,
    joinGroup
}