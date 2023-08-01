import httpStatus from "http-status";
import AWS from 'aws-sdk';


AWS.config.region = 'ap-south-1';
var s3Client = new AWS.S3();

const uploadToS3 = (fileData, destination)=>{
    if(destination){
        destination = `${destination}/${fileData.originalname}`;
    }
    else {
        destination = fileData.originalname;
    }
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key : destination,
            Body: fileData.buffer
        }
        s3Client.upload(params, (err, data)=>{
            if(err){
                console.log(err)
                reject(err)
            }
            console.log(data);
            return resolve(data);
        })
    })
}

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
    const {destination} = req.body;
    console.log(destination)
    if(req.file){
        const s3Confirmation = await uploadToS3(req.file, destination);
        if(s3Confirmation){
            return (
                res.status(httpStatus.OK).json({
                    message:"file uploaded successfully",
                    data:s3Confirmation
                })
            )
        }
        else {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                error: "error got"
            })
        }
    }
    else {
        return (
            res.status(httpStatus.OK).json({
                error:"got error",
            })
        )
    }
    
}

const fileDelete = async (req, res)=>{
    const {filename} = req.body;
    const s3Confirmation = await s3Client.deleteObject({
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:filename
    }).promise();
    if(s3Confirmation){
        return (
            res.status(httpStatus.OK).json({
                message:"file deleted sucessfully",
                data:s3Confirmation
            })
        )
    }
    else {
        return (
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                error:"got error in deletion"
            })
        )
    }
}

export {createFolder, fileUpload, fileDelete};
