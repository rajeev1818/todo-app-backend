const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const asyncHandler=require('express-async-handler')
const User=require('../models/userModel')



const registerUser=asyncHandler(async(req,res)=>{
    const {email,password,name}=req.body
    const user= await User.findOne({email})
    if(user){
        res.status(500)
        throw new Error('Email already registered')
    }
    const hashedPassword= await bcrypt.hash(password,10)
    const newUser= await User.create({
        name,
        password:hashedPassword,
        email
    })

    res.json({
        _id:newUser._id,
        name:newUser.name,
        email:newUser.email,
        token:jwt.sign({_id:newUser._id},process.env.JWT_SECRET)
    })
    
})

const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body
    
    const user= await User.findOne({email})
    if(!user){
        res.status(404)
        throw new Error('No User Registered With This Email, Try Signing Up!')
    }

    if(!(await bcrypt.compare(password,user.password))){
        res.status(401)
        throw new Error('Invalid Password')
    }

    res.json({
        _id:user._id,
        name:user.name,
        email:user.email,
        token:jwt.sign({_id:user._id},process.env.JWT_SECRET)
    })
    
})

module.exports={
    registerUser,
    loginUser
}