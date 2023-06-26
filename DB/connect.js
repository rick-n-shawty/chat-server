const mongoose = require('mongoose')

const connect = (URI) => {
    return mongoose.connect(URI)
}
module.exports = connect