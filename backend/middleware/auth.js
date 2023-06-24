const asyncErrors = require("./asyncErrors");
const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utils/errorHandler");
const User = require('../model/userModel')

exports.isAuthenticatedUser = asyncErrors(async (req, res, next)=>{

    const { token } = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please Login to access this resource", 401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decodedData.id)      
    // console.log(token);  
    next()

})


//FOR AUTHORIZED ROLES OF USER
exports.authorisedRole = (...roles)=>{

    return (req, res, next)=>{

        if(!roles.includes(req.user.role)){
            return next(
                new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403)
            )
        }

        next();

    }

}