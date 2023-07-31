import mongoose from 'mongoose';


const User = mongoose.model("User");
const Token = mongoose.model("Token");


async function addUserService(userData){
    const modelData = await User.findOne({email: userData.email})
    if(modelData){
        return {
            success:false,
            message:"User Already exist",
            data:modelData
        }
    }
    else {
        userData = new User({
            ...userData
        })
        const saveData = await userData.save(); 
        if(saveData){
            return {
                success:true,
                message:"User is registered",
                data:saveData
            }
        }
        else {
            return {
                success:false,
                message:"error occure to register user"
            }
        }
    }
}

async function fetchAllUserService(){
    const usersData = await User.find({});
    if(usersData){
        return {
            success:true,
            message:"All User Detail",
            data: usersData
        }
    }
    else {
        return {
            success:false,
            error:"Error Occure"
        }
    }
}

async function fetchOneUserService(_id){
    const userData = await User.findOne({_id});
    if(userData){
        return {
            success:true,
            message:"User detail",
            data: userData
        }
    }
    else {
        return {
            success:false,
            error:"user not found"
        }
    }
}

async function updateUserService(_id, inputData){
    const userData = await User.findByIdAndUpdate(_id, inputData, {new:true});
    if(userData){
        return {
            success:true,
            message:"User Updated",
            data: userData
        }
    }
    else {
        return {
            success:false,
            error:"user not found"
        }
    }
}

async function deleteUserService(_id){
    const userData = await User.deleteOne({_id});
    if(userData){
        return {
            success:true,
            message:"User deleted",
            data: userData
        }
    }
    else {
        return {
            success:false,
            error:"Error Occure in deletion"
        }
    }

}

async function findByEmailService(email){
    const userData = await User.findOne({email});
    if(userData){
        return {
            success:true,
            message:"User found",
            data:userData
        }
    }
    else {
        return {
            success:false,
            error:"User not found"
            
        }
    }
}

async function forgetPasswordService(email, otp, otpExpire){
    const user = await User.findOne({email});

    console.log(user)

    const updatedUserData = {
        otp,
        otpExpire
    }

    const newUser = await User.findByIdAndUpdate(user._id,updatedUserData,{new:true})
    if(newUser){
        return {
            success:true,
            message:"Opt sent to register email Id",
            data:newUser
        }
    }
    else {
        return {
            success:false,
            error:"Something Wrong in updation"
            
        }
    }

}

async function resetPasswordService(email, otp, password){
    const user = await User.findOne({email, otp});
    if(user){
        const expiryCheck = Date.now() < new Date(user.otpExpire).getTime();
        if(!expiryCheck){
            return {
                success:false,
                error:"OTP expire", 
                data:expiryCheck
            }
        }
    }
    else {
        return {
            success:false,
            error:"Invalid OTP",
            data:user
        }
    }

    const updateData = {
        password,
        otp:null,
        otpExpire:null,
    }
    const updateSave = await User.findByIdAndUpdate(user._id,updateData,{new:true})
    if(updateSave){
        return {
            success:true,
            message:"Password reset successfully",
            data:updateSave
        }
    }
    else {
        return {
            success:false,
            error:"there is some problem in data updating"
        }
        
    }
}

async function logoutUserService(token, uid){
  
    const tokenData = new Token({
        uid,
        token
    })
    try{
        const saveData = await tokenData.save();
        if(saveData){
            return ({
                success:true,
                message:"User Logout Successfully",
                data:saveData
            })
        }
    }
    catch(err){
        return ({
            success:false,
            error:err.message
        })
    }
}

export {addUserService, fetchAllUserService, fetchOneUserService, updateUserService, deleteUserService, findByEmailService, forgetPasswordService, resetPasswordService, logoutUserService};