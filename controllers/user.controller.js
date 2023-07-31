import express from 'express';
import bcrypt from 'bcrypt'; 
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import emailValidator from 'deep-email-validator';
import 'dotenv/config.js';



import sendEmail from '../utils/email.js';
import {addUserService, fetchAllUserService, fetchOneUserService, updateUserService, deleteUserService, findByEmailService, forgetPasswordService, resetPasswordService, logoutUserService} from '../services/user.service.js';

async function addUserController(req, res){
    const {userName, email, password, role} = req.body;
    if(!userName || !email || !password || !role){
        res.status(500).json({
            success:false,
            error:"Please fill all the field"
        })
    }

    //email validation 
    const isEmailValid = await emailValidator.validate(email);
    if(!isEmailValid.valid) {
        return (
            res.status(httpStatus.BAD_REQUEST).json({
                error:isEmailValid.validators.smtp
            })
        )
    }


    const newPassword = await bcrypt.hash(password, 10);
    const newUser = {userName, email, role, password:newPassword};
    
    const serviceData = await addUserService(newUser);
    if(serviceData.success){
        //email valification and generate token for email verification 

        const emailToken = jwt.sign({
            _id:serviceData.data._id,
        },process.env.JWT_EMAIL_SECRET_KEY,{expiresIn: '10m'})

        const text = `HEY ${userName} \nYou are partially register to fileManager to complete the registration plese verify your email address \nTo varify it click on below link \n http://localhost:8080/user/verifyEmail/${emailToken}`
        sendEmail(email, "Email Verification", text);
        res.status(200).json({
            message:serviceData.message,
            data:serviceData.data
        })
    }
    else {
        res.status(500).json({
            message:serviceData.message
        })
    }
}

async function emailVarification(req, res){
    const {emailToken} = req.params;
    // console.log(emailToken);
    try{
        const isEmailVarified = await jwt.verify(emailToken, process.env.JWT_EMAIL_SECRET_KEY);
        // console.log("email token id : ",isEmailVarified._id);
        if(isEmailVarified){
            try{
                const serviceData = await updateUserService(isEmailVarified._id, {emailVerify:true});
                if(serviceData.success){
                    return (
                        res.status(httpStatus.OK).json({
                            message:serviceData.message
                        })
                    )
                }
                else {
                    return (
                        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                            error:serviceData.error
                        })
                    )
                }
            }
            catch(err){
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    error:err.message
                })
            }
        }
        
    }
    catch(err){
        return (
            res.status(httpStatus.BAD_REQUEST).json({
                error: err.message
            })
        )
    }

}

async function fetchAllUserController(req, res){
    const serviceData = await fetchAllUserService();
    const authorizationData = {_id: req._id, email: req.email, role: req.role};
    if(serviceData.success){
        res.status(200).json({
            message:serviceData.message,
            data:serviceData.data,
            roleData: authorizationData
        })
    }
    else {
        res.status(500).json({
            error:serviceData.error
        })
    }
}

async function fetchOneUserController(req, res){
    const {id} = req.params;
    if(id !== req._id && req.role !== "admin"){
        return (
            res.status(httpStatus.UNAUTHORIZED).json({
                error:"You couldn't see the other people detail"
            })
        )
    }
    const serviceData = await fetchOneUserService(id);
    if(serviceData.success){
        res.status(200).json({
            message:serviceData.message,
            data:serviceData
        })
    }
    else {
        res.status(500).json({
            error:serviceData.error
        })
    }
}

async function updateUserController(req, res){
    const id = req._id;
    const inputData = req.body;
    const serviceData = await updateUserService(id, inputData);
    if(serviceData.success){
        res.status(200).json({
            message:serviceData.message,
            data:serviceData
        })
    }
    else {
        res.status(500).json({
            error:serviceData.error
        })
    }
    
}

async function deleteUserController(req, res){
    const id = req._id;
    const serviceData = await deleteUserService(id);
    if(serviceData.success){
        res.status(200).json({
            message:serviceData.message,
            data:serviceData
        })
    }
    else {
        res.status(500).json({
            error:serviceData.error
        })
    }
}

async function loginUserController(req, res){
    const {email, password} = req.body;
    if(!email || !password){
        return(
            res.status(httpStatus.BAD_REQUEST).json({
                message:"fill all the field"
            })
        )
    }
    const serviceData = await findByEmailService(email);

    if(!serviceData.success || !serviceData.data.emailVerify){
        return(
            res.status(httpStatus.UNAUTHORIZED).json({
                message:"User not found or email not verify"
            })
        )
    }
    const isPasswordMatch = await bcrypt.compare(password, serviceData.data.password);
    if(!isPasswordMatch){
        return(
            res.status(httpStatus.UNAUTHORIZED).json({
                message:"password doesn't match"
            })
        )
    }
    const jwtToken = jwt.sign({
        _id:serviceData.data._id,
        role: serviceData.data.role,
        email: serviceData.data.email
    }, process.env.JWT_LOGIN_SECRET_KEY, {expiresIn: '1h'})
    return (
        res.status(httpStatus.OK).json({
            token:jwtToken,
            message:"User authenticated successfully"
        })
    )
}

async function forgetPasswordController(req, res){
    const {email} = req.body;
    if(!email){
        return(
            res.status(httpStatus.BAD_REQUEST).json({
                message:"fill all the field"
            })
        )
    }
    const serviceData = await findByEmailService(email);
    if(!serviceData.success){
        return(
            res.status(httpStatus.UNAUTHORIZED).json({
                message:"User not found"
            })
        )
    }
    const otp = Math.floor(100000+Math.random()*99999);
    const otpExpire = new Date(Date.now() + (15 * 60 * 1000));
    const forgetServiceData = await forgetPasswordService(email, otp, otpExpire);
    if(forgetServiceData.success){
        const txt = `Your password reset OTP is ${otp} \nand it is expire at ${(otpExpire)}`
        sendEmail(email, "OTP for Password Reset", txt);
        res.status(200).json({
            message:forgetServiceData.message,
            data:forgetServiceData.data
        })
    }
    else {
        res.status(404).json({
            error:forgetServiceData.error
        })
    }

    
}

async function resetPasswordController(req, res){
    const {email, otp, password} = req.body;
    if(!email || !otp || !password){
        return(
            res.status(httpStatus.BAD_REQUEST).json({
                message:"fill all the field"
            })
        )
    }
    
    const newPassword = await bcrypt.hash(password, 10);
    const resetServiceData = await resetPasswordService(email, otp, newPassword);
    if(resetServiceData.success){
        const txt = `Your password have reseted if you did not do this then Immidiatly contact us`
        sendEmail(email, "Password Update", txt);
        res.status(200).json({
            message:resetServiceData.message,
            data:resetServiceData.data
        })
    }
    else {
        res.status(404).json({
            error:resetServiceData.error
        })
    }
}

async function logoutUserController(req, res){
    const token = req.headers.authorization;
    const uid = req._id;
    const serviceData = await logoutUserService(token, uid);
    
    if(serviceData.success){
        return (
            res.status(httpStatus.OK).json({
                message:serviceData.message,
                data:serviceData.data
            })
        )
    }
    else {
        return (
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                error:serviceData.error
            })
        )
    }
}


export {addUserController, emailVarification ,fetchAllUserController, fetchOneUserController, updateUserController, deleteUserController, loginUserController, forgetPasswordController, resetPasswordController, logoutUserController};