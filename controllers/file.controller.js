import httpStatus from "http-status";
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import {findPath, folderCreate} from "../services/file.service.js";

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
    var {folderName} = req.body;
    if(!folderName){
        return (
            res.status(httpStatus.BAD_REQUEST).json({
                error:"please fill all the field"
            })
        )
    }
    
    const serviceData = await findPath(folderName);
    if(serviceData.success){
        return (
            res.status(httpStatus.BAD_REQUEST).json({
                message:"Folder name must be unique",
                data: serviceData.data
            })
        )
    }
    var params = { 
        Bucket: process.env.AWS_BUCKET_NAME, Key: `${folderName}/`, ACL: 'public-read', Body:'folder creation' 
    };

    const data = await s3Client.upload(params).promise();

        if (data){
            const newFolder = {
                data:data,
                path:folderName
            }
            const serviceData = await folderCreate(newFolder);
            if(serviceData.success){
                return (
                res.status(httpStatus.OK).json({
                    message:"folder created sucessfully",
                    data:serviceData.data
                })
            )}
            
        }
        else {
            console.log("Error creating the folder: ");
            return (
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    error:"got errer when creating folder"
                })
            )
        } 
}


const createSubFolder = async(req, res)=>{
    var {folderName, destination} = req.body;
    if(!folderName && !destination){
        return (
            res.status(httpStatus.BAD_REQUEST).json({
                error:"please fill all the field"
            })
        )
    }
    destination = destination+'/'+folderName;
    
    const serviceData = await findPath(destination);
    if(serviceData.success){
        return (
            res.status(httpStatus.BAD_REQUEST).json({
                message:"Folder name must be unique",
                data: serviceData.data
            })
        )
    }
    var params = { 
        Bucket: process.env.AWS_BUCKET_NAME, Key: `${destination}/`, ACL: 'public-read', Body:'subFolder creation' 
    };

    const data = await s3Client.upload(params).promise();

        if (data){
            const newFolder = {
                data:data,
                path:destination
            }
            const serviceData = await folderCreate(newFolder);
            if(serviceData.success){
                return (
                res.status(httpStatus.OK).json({
                    message:"folder created sucessfully",
                    data:serviceData.data
                })
            )}
            
        }
        else {
            return (
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    error:"got errer when creating folder"
                })
            )
        }
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

export {createFolder, fileUpload, fileDelete, createSubFolder};
