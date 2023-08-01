import mongoose from "mongoose";

const File = mongoose.model("File");

const findPath = async (folderName)=> {
    const pathExist = await File.findOne({path:folderName});
    if(pathExist){
        return ({
            success:true,
            message:"folder already exist",
            data: pathExist
        })
    }
    else {
        return ({
            success:false,
            error: "folder don't exist"
        })
    }
}

const folderCreate = async(newFolder)=>{
    newFolder = new File({
        ...newFolder
    })
    const folderSave = await newFolder.save();
    if(folderSave){
        return {
            success:true,
            data:folderSave
        }
    }
    else {
        return {
            success:false,
            error:"folder data don't save"
        }
    }
}

export {findPath, folderCreate};