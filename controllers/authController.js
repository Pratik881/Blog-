const bcrypt=require('bcrypt')
const {users,blogs}=require('../model');
const sendMail = require('../services/sendEmail');
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
const showMyBlogs=async (req,res)=>{
    const id=req.user.id;
    //console.log(id)
    const allBlogs=await  blogs.findAll({
        where:{
            userId:id
        }
    })
 
   res.render('myBlogs.ejs',{allBlogs})
}
const forgetMe=(req,res)=>{
    res.render('forget.ejs')
}
const sendOTP=async (req,res)=>{
    const emailFromBody=req.body.email
    const emailExits=await users.findOne({
        where:{
        email:emailFromBody
        }
    })
    if(emailExits){

       await  sendMail({
            email:emailFromBody,
            subject:'forget password',
            otp:1234
        })
        res.send('email sent successfully')
        
    }
    else{
        res.send('no such email found')
    }

}
   
module.exports={sendOTP,forgetMe,showMyBlogs,userRegistration,registerPage,userLoginPage}