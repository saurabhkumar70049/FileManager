import express from 'express';
import multer from 'multer';

const fileRoute = express.Router();

import {createFolder, fileUpload, fileDelete, createSubFolder} from '../controllers/file.controller.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb)=>{
    if(file.mimetype.split('/')[0] === 'image'){
        cb(null, true);
    }
    else{
        cb(new Error("this don't support"));
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
                fileSize: 1024*1024*10,
                files: 4
            }
})

fileRoute.post('/createFolder', createFolder);

fileRoute.post('/createSubFolder', createSubFolder);

fileRoute.post('/uploadFile', upload.single('image'), fileUpload);

fileRoute.delete("/deleteFile", fileDelete);

export default fileRoute;