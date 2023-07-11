const User = require('../DB/models/User')
const { StatusCodes } = require('http-status-codes')
const addFriend = async(req, res, next) => {
    try{
        const userId = req.userId
        const { id } = req.body
        const user = await User.findByIdAndUpdate(userId, {$push: { friends: id }})
        return res.status(StatusCodes.OK).json({msg: 'friend has been added'})
    }catch(err){
        return next(err)
    }
}


module.exports = addFriend