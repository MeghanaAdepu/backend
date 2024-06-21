const mongoose = require('mongoose')

const UserSchema = new  mongoose.Schema({
    idno:Number,
    name:String,
    email:String,
    age:Number,
    phno:Number
})

const UserModel = mongoose.model("users",UserSchema)
module.exports = UserModel

