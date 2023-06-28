const { StatusCodes } = require('http-status-codes')

class CustomError extends Error{
    constructor(message){
        super(message)
    }
}

class NotFound extends CustomError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND
    }
}

class BadRequest extends CustomError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}
class Unauthorized extends CustomError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}
module.exports = {
    BadRequest,
    NotFound,
    CustomError,
    Unauthorized
}