import mongoose from 'mongoose';
import User from '../models/User.js'


export const updateUser = async (req, res, next) => {
     const {fisrtName,lastName,email,contact,location,profileUrl,jobTitle,about} = req.body;

     try {
        if(!fisrtName || !lastName || !email || !location ||
            !profileUrl || !jobTitle || !about){
                next("Please provide all details..")
            }

            const id = req.body.user.userId
            if(!mongoose.Types.ObjectId.isValid(id)){
                return res.status(404).send(`No user found with ${id}`)
            }
            const updateuser = {
                fisrtName,lastName,email,contact,location,profileUrl,jobTitle,about, _id:id
            }
            const user = await User.findByIdAndUpdate(id, updateuser, {new: true})
            const token = user.createJWT()
            user.password = undefined
            res.status(202).json({
                success : true,
                message: "User updated successfully",
                user ,
                token
            })  


        
     } catch (error) {
        res.status(404).json({message: error.message})  
     }





}


export const getUser = async (req, res, next) => {
  try {
    const id = req.body.user.userId
    const user =await User.findById({_id: id})
    user.password = undefined
    res.status(202).json({
        success : true,
        user : user
    })  

    
  } catch (error) {
    res.status(202).json({
        success : false,
        message: "Auth error",
        error :error.message
    })
  }
}