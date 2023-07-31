import express from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import 'dotenv/config';
import jwt from 'jsonwebtoken';



const authorization = (role) => async (req, res, next)=> {
    let token = req.headers.authorization;

    if(!token){
        return (
            res.status(httpStatus.UNAUTHORIZED).json({
                error:"You must be logged in"
            })
        )
    }
    try {
        const user = await jwt.verify(token, process.env.JWT_LOGIN_SECRET_KEY);
        let checkUser = false;
        for(let i = 0; i < role.length; i++){
            if(role[i] === user.role){
                checkUser = true;
            }
        }
        if(!checkUser){
            return(
                res.status(httpStatus.UNAUTHORIZED).json({
                    message:"user access restricted"
                })
            )
        }
        req._id = user._id;
        req.email = user.email;
        req.role = user.role;
        next();
        
    }
    catch(err){
        return (
            res.status(httpStatus.BAD_REQUEST).json({
                success:false,
                error:err.message
            })
        );
    }
}

export default authorization;