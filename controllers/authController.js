const bcrypt=require('bcrypt')
const {users}=require('../model')
const userRegistration=async(req,res)=>{
    const {userName,email,password}=req.body;
    const previousEmail=await users.findOne({
        where:{
            email
        }
    })
    if(!previousEmail){
    await users.create({
        userName,
        password:bcrypt.hashSync(password,10),
        email
    })
    res.redirect('/login')
    }
    else{
        res.send("email already in use")
    }
    }
const registerPage=(req,res)=>{
        res.render('register.ejs')
    }
const userLoginPage=(req,res)=>{
    res.render('loginForm.ejs')
}    
   
module.exports={userRegistration,registerPage,userLoginPage}