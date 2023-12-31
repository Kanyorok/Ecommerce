const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
   
    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if(process.env.NODE_ENV === 'PRODUCTION'){

        let error = {...err}

        error.message = err.message

        // Wrong Mongoose Object ID Error
        if(err.name === 'CastError'){
            const message = `Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        // Handling Mongoose Validation Error
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(val => val.message)
            error = new ErrorHandler(message, 400)
        }

        // Handling Mongoose duplicate key error
        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message, 400)
        } 

        // Handling wrong JWT error
        if(err.name === 'JsonWebTokenError'){
            const message = 'JSON web Token is invalid. Try Again!!'
            error = new ErrorHandler(message, 400)
        }

        // Handling Expired JWT error
        if(err.name === 'TokenExpiredError'){
            const message = 'JSON web Token is expired. Try Again!!'
            error = new ErrorHandler(message, 400)
        }

        res.status(err.statusCode).json({
            success: false,
            error: error.message || 'internal server error'
        })


    }

    res.status(err.statusCode).json({
        success: false,
        error: err.stack
    })
}