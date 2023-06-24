const User = require('../model/userModel')
const ErrorHandler = require("../utils/errorHandler")
const asyncErrors = require("../middleware/asyncErrors");
const sendToken = require('../utils/getJWTToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

exports.registerUser = asyncErrors(async(req, res, next)=>{
    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "This is public_id",
            url: "This is the image url"
        }
    })
    sendToken(user, 201, res)

})

exports.loginUser = asyncErrors(async(req, res, next)=>{
    const {email, password} = req.body;
    
    //checking if user hs given password and email both
    if(!email || !password){
        return next(new ErrorHandler("Please Enter a valid username and password", 404));
    }
    
    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password);
    
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password"))
    }

    sendToken(user, 200, res)
})

exports.logout = asyncErrors(async (req, res, next)=>{

    res.cookie("token", null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})



//FORGOT PASSWORD
exports.forgotPassword = asyncErrors(async (req, res, next)=>{

    // console.log(req.body);

    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next(new ErrorHandler("User Not Found", 404))
    }
    
    const resetToken = user.getResetPasswordToken()
    
    await user.save({ validateBeforeSave: false });
    
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    
    const message = `Your password reset token :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email, then please ignore it.`
    
    
    try {
        
        //it is a function called to send email with 3 parametres :- email, subject, message having the token url
        await sendEmail({
            email: user.email,
            subject: `Ecommerce website under development`,
            message, 
        })
        
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
        
    } catch (error) {
        
        //if there is an issue then we have to undefine the userPassword feilds in DB immidiatly and then save it and then return the error
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })

        // console.log(error.message);
        
        return next(error.message, 500)
    }
    
})

// RESET PASSWORD
exports.resetPassword = asyncErrors(async (req, res, next)=>{

    resetPasswordToken = crypto
                            .createHash("sha256") //sha256 this an algorithm used to convert the resetToken to hash
                            .update(req.params.token) //updating the hash to resetToken
                            .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })

    if(!user){
        return next(new ErrorHandler("Invalid Token or has been expired", 400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save();

    sendToken(user, 200, res)

})
 

//GET USER DETAILS
exports.userDetails = asyncErrors(async (req, res, next)=>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })

})

//UPDATE PASSWORD
exports.updatePassword = asyncErrors(async (req, res, next)=>{

    const user = await User.findById(req.user.id).select("+password")

    //check if the input old password is matched with the password in the DB
    isMatchedPass = await user.comparePassword(req.body.oldPassword)

    if(!isMatchedPass){
        return next(new ErrorHandler("Old Password is not correct", 400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("The passwords do not match", 400))
    }

    user.password = req.body.newPassword

    await user.save()

    sendToken(user, 200, res)

})


//UPDATE USER PROFILE
exports.updateProfile = asyncErrors(async (req, res, next)=>{

    //details that are fetched from the input feilds
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    
    res.status(200).json({
        success: true
    })


})


//get all users
exports.getAllUsers = asyncErrors(async (req, res, next)=>{

    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })

})


//get single user --Admin
exports.getSingleUser = asyncErrors(async (req, res, next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 400))
    }

    res.status(200).json({
        success: true,
        user
    })

})


//update user Role --Admin
exports.updateUserRole = asyncErrors(async (req, res, next)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    // if(!user)
    // {
    //     return
    // }

    res.status(200).json({
        success: true,
        user
    })

})


//delete user -- Admin
exports.deleteUser = asyncErrors(async (req, res, next)=>{

    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 400))
    }

    await user.remove()

    res.status(200).json({
        success: true,
        message: "User removed successfully"
    })
})


