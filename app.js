import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config.js';


import "./models/user.model.js";
import './models/tokenBlock.model.js';


import userRoute from './routes/user.route.js';
import fileRoute from './routes/file.route.js';


const PORT = 8080;
const mongodbURL = process.env.DATABASE_URL;


const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

//connect to database
mongoose.connect(mongodbURL, {useUnifiedTopology: true, useNewUrlParser: true, autoIndex: true})
    .then(()=> {
        console.log("Server Connected to Database....");
    })
    .catch((err)=> {
        console.log("Fail to connect with Database ", err);
    })


app.use('/user', userRoute);

app.use('/file', fileRoute);


app.listen(PORT, ()=> {
    console.log(`Server is running on PORT ${PORT}`);
})