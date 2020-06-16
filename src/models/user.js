const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt= require('bcryptjs')

const userSchema= new Schema({
name: String,
email:String,
password:String
})

userSchema.methods.encryptPassword= async (password)=>{
const sal= await bcrypt.genSalt(10)
const hash=  bcrypt.hash(password,sal)
console.log(hash)
return hash
}

module.exports= mongoose.model('User',userSchema);