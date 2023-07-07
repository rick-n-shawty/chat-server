const User = require('../DB/models/User')
const search = async (input, id) => {
    try{
        const searchRegex = new RegExp(input, 'i')
        const users = await User.find({ email: { $regex: searchRegex }, _id: { $ne: id } })
        return users
    }catch(err){
        console.log(err)
        return err  
    }
}
module.exports = {search}