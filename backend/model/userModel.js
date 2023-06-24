const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please Enter username"],
        maxLength: [30, "Name should be less than 30 characters"],
        minLength: [4, "Name should be greator than 4 characters"]
    },
    email:{
        type: String,
        required: [true, "Please Enter username"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password:{
        type: String,
        required: [true, "Please Enter Password"],
        minLength:[8, "Password length should be more than 8 characters"],
        select: false,
    },
    avatar:{
        public_id:{
            type: String,
            required: true,
        },
        url:{
            type: String,
            required: true
        }
    },
    role:{
        type:String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

//CREATE PASSWORD HASH
userSchema.pre("save", async function(next){
    if(!this.isModified("password"))
    {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

//JWT TOKENs
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}   

//VERIFYING THE PASSWORD
userSchema.methods.comparePassword = async function(enteredPassword){

    return await bcrypt.compare(enteredPassword, this.password);
    
}


//RESET PASSWORD USING CRYPTO
userSchema.methods.getResetPasswordToken = function(){

    //generating token
    resetToken = crypto.randomBytes(20).toString("hex")

    //hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
                                .createHash("sha256") //sha256 this an algorithm used to convert the resetToken to hash
                                .update(resetToken) //updating the hash to resetToken
                                .digest("hex")

    //taking resetPasswordExpire as 15 minutes
    this.resetPasswordExpire = Date.now() + 15*60*1000

    return resetToken
}

module.exports = mongoose.model("User", userSchema)