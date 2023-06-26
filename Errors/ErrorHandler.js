const { StatusCodes } = require('http-status-codes')
const { CustomError } = require('./CustomErrors')
const ErrorHandler = (err, req, res, next) => {
    if(err instanceof CustomError){
        return res.status(err.statusCode).json({err: err.message})
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err: 'something went wrong'})
}

module.exports = ErrorHandler 