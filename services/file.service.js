import mongoose from "mongoose";

const File = mongoose.model("File");

const findPath = async (folderName)=> {
    
    const pathExist = await File.findOne({'detail.Key':folderName});
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

const allFilesService = async()=>{
    const allDetail = await File.find({}).populate('uid', 'email');
    if(allDetail){
        return({
            success:true,
            message:"All File details",
            data:allDetail
        })
    }
    else {
        return ({
            success:false,
            error:"Details doesn't fetch"
        })
    }
}

export {findPath, folderCreate, allFilesService};