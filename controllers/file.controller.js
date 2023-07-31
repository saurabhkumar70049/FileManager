import httpStatus from "http-status";
import AWS from 'aws-sdk';

AWS.config.region = 'ap-south-1';
var s3Client = new AWS.S3();

const createFolder = async(req, res)=>{
    var {folderName, folderPath} = req.body;
    if(!folderName){
        return (
            res.status(httpStatus.BAD_REQUEST).json({
                error:"please fill all the field"
            })
        )
    }
    if(folderPath){
        folderName = folderPath + '/' + folderName;
    }

    var params = { 
        Bucket: "instagram07", Key: `${folderName}/`, ACL: 'public-read', Body:'body does not matter' 
    };

    s3Client.upload(params, function (err, data) {
        if (err) {
            console.log("Error creating the folder: ", err);
            return (
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    error:err
                })
            )
        } 
        else {
            
            return (
                res.status(httpStatus.OK).json({
                    message:"folder created sucessfully",
                    data:data
                })
            )
        }
    });
}

const fileUpload = async (req, res)=>{
    console.log(req.body.location);
    if(req.file){
        
        console.log(req.file);
        return (
            res.status(httpStatus.OK).json({
                message:"input receive",
                data: req.files.location
            })
        )
    }
    else {
        return (
            res.status(httpStatus.OK).json({
                error:"got error",
            })
        )
    }
    
}

export {createFolder, fileUpload};
