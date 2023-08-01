import mongoose from "mongoose";



const fileSchema = mongoose.Schema({
    uid:{
        type: mongoose.Schema.Types.ObjectId,
        require:false
    },
    path:{
        type:String,
        require:true
    },
    data:{
        type:Object,
        require:true
    }
})

mongoose.model("File", fileSchema);