import express from 'express';
import multer from 'multer';

const fileRoute = express.Router();

import tokenValidation from '../middlewares/tokenValidation.js';
import authorization from '../middlewares/authorization.js';


import {createFolder, fileUpload, fileDelete, createSubFolder, allFiles} from '../controllers/file.controller.js';

const storage = multer.memoryStorage();


const upload = multer({
    storage,
    limits: {
                fileSize: 1024*1024*100,
                files: 4
            }
})

fileRoute.post('/createFolder',[tokenValidation, authorization(['regular', 'admin'])] ,createFolder);

fileRoute.post('/createSubFolder',[tokenValidation, authorization(['regular', 'admin'])], createSubFolder);

fileRoute.post('/uploadFile',[tokenValidation, authorization(['regular', 'admin']), upload.single('file')], fileUpload);

fileRoute.delete("/deleteFile",[tokenValidation, authorization(['regular', 'admin'])], fileDelete);

fileRoute.get('/fetchAll', [tokenValidation, authorization(['admin'])] ,allFiles)

export default fileRoute;