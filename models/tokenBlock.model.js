import mongoose from "mongoose";

const tokenBlockSchema = new mongoose.Schema({
    uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    token:{
        type:String,
        require:true,
    },
    createAt:{
        type:Date,
        expires:'60m',
        default: Date.now
    }
})


mongoose.model('Token', tokenBlockSchema);