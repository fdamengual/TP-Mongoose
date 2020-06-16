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

<<<<<<< HEAD
userSchema.methods.verifyPassword = function (password, hash)
{
    return bcrypt.compare(password, this.password)
}

=======
>>>>>>> 5e04161... Modelo Usuario agregado
module.exports= mongoose.model('User',userSchema);