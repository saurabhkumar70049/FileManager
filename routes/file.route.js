import express from 'express';

const fileRoute = express.Router();

import uploadFile from '../middlewares/uploadfile.js';
import pathFinder from '../middlewares/pathFinder.js';

import {createFolder, fileUpload} from '../controllers/file.controller.js';

fileRoute.post('/createFolder', createFolder);

fileRoute.post('/uploadFile', uploadFile().single('image'), fileUpload);

export default fileRoute;