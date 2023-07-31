import mongoose from "mongoose";



const fileSchema = mongoose.Schema({
    uid:{
        type: mongoose.Schema.Types.ObjectId,
        require:true
    },
    path:{
        type:String,
        require:true
    }
})