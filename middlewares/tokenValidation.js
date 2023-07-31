import mongoose from "mongoose";
import httpStatus from "http-status";


const Token = mongoose.model("Token");

async function tokenValidation(req, res, next){
    const token = req.headers.authorization;
    const isTokenAvailable = await Token.findOne({token});
    if(isTokenAvailable){
        return (
            res.status(httpStatus.BAD_REQUEST).json({
                error:"this season is already Logout",
            })
        )
    }
    next();
}

export default tokenValidation;