import mongoose from "mongoose";


const fileSchema = mongoose.Schema({
    uid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true,
    },
    path:{
        type:String,
        require:true
    },
    Type:{
        type:String,
        enum:["Folder", "File"],
        default:"Folder"
    },
    detail:{
        type:Object,
        require:true
    }
})

mongoose.model("File", fileSchema);