import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        require:true
    },
    email: {
        type:String,
        unique:true,
        require:true
    },
    password: {
        type:String,
        require:true
    },
    
    role:{
        type:String,
        enum:["regular", "admin"],
        default:"regular"
    },
    emailVerify:{
        type:Boolean,
        default:false
    }

})

mongoose.model("User", userSchema);